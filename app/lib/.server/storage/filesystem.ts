import fs from 'fs-extra';
import path from 'path';
import { getChatDatabase } from './database';

// Configuration
const PROJECTS_DIR = process.env.BOLT_PROJECTS_DIR || path.join(process.cwd(), 'data', 'projects');

export interface FileSystemEntry {
  path: string;
  content: string;
  type: 'file' | 'folder';
}

class FileSystemPersistence {
  private projectsDir: string;

  constructor() {
    this.projectsDir = PROJECTS_DIR;
    this.ensureProjectsDirectory();
  }

  private ensureProjectsDirectory(): void {
    fs.ensureDirSync(this.projectsDir);
  }

  // Get project directory path for a chat
  private getProjectPath(chatId: string): string {
    return path.join(this.projectsDir, chatId);
  }

  // Save files from WebContainer to real filesystem
  async saveProjectFiles(chatId: string, files: Record<string, any>): Promise<void> {
    const projectPath = this.getProjectPath(chatId);
    const db = getChatDatabase();

    // Ensure project directory exists
    await fs.ensureDir(projectPath);

    for (const [filePath, fileData] of Object.entries(files)) {
      if (fileData && fileData.type === 'file' && !fileData.isBinary) {
        const fullPath = path.join(projectPath, filePath);
        
        // Ensure directory exists for the file
        await fs.ensureDir(path.dirname(fullPath));
        
        // Write file to filesystem
        await fs.writeFile(fullPath, fileData.content, 'utf8');
        
        // Save file info to database
        db.saveProjectFile(chatId, filePath, fileData.content);
        
        console.log(`Saved file: ${filePath}`);
      }
    }
  }

  // Load project files from filesystem
  async loadProjectFiles(chatId: string): Promise<Record<string, FileSystemEntry>> {
    const projectPath = this.getProjectPath(chatId);
    const files: Record<string, FileSystemEntry> = {};

    if (!(await fs.pathExists(projectPath))) {
      return files;
    }

    const walkDirectory = async (dirPath: string, relativePath: string = '') => {
      const entries = await fs.readdir(dirPath);

      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry);
        const relativeFilePath = path.join(relativePath, entry).replace(/\\/g, '/');
        const stat = await fs.stat(fullPath);

        if (stat.isDirectory()) {
          files[relativeFilePath] = {
            path: relativeFilePath,
            content: '',
            type: 'folder'
          };
          await walkDirectory(fullPath, relativeFilePath);
        } else if (stat.isFile()) {
          try {
            const content = await fs.readFile(fullPath, 'utf8');
            files[relativeFilePath] = {
              path: relativeFilePath,
              content,
              type: 'file'
            };
          } catch (error) {
            console.warn(`Could not read file ${relativeFilePath}:`, error);
          }
        }
      }
    };

    await walkDirectory(projectPath);
    return files;
  }

  // Save individual file
  async saveFile(chatId: string, filePath: string, content: string): Promise<void> {
    const projectPath = this.getProjectPath(chatId);
    const fullPath = path.join(projectPath, filePath);
    
    // Ensure directory exists
    await fs.ensureDir(path.dirname(fullPath));
    
    // Write file
    await fs.writeFile(fullPath, content, 'utf8');
    
    // Save to database
    const db = getChatDatabase();
    db.saveProjectFile(chatId, filePath, content);
    
    console.log(`Saved file: ${filePath} for chat: ${chatId}`);
  }

  // Delete project files
  async deleteProject(chatId: string): Promise<void> {
    const projectPath = this.getProjectPath(chatId);
    
    if (await fs.pathExists(projectPath)) {
      await fs.remove(projectPath);
    }
    
    const db = getChatDatabase();
    db.deleteChatFiles(chatId);
  }

  // Get project statistics
  async getProjectStats(chatId: string): Promise<{ fileCount: number; totalSize: number }> {
    const projectPath = this.getProjectPath(chatId);
    
    if (!(await fs.pathExists(projectPath))) {
      return { fileCount: 0, totalSize: 0 };
    }

    let fileCount = 0;
    let totalSize = 0;

    const walkDirectory = async (dirPath: string) => {
      const entries = await fs.readdir(dirPath);

      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry);
        const stat = await fs.stat(fullPath);

        if (stat.isDirectory()) {
          await walkDirectory(fullPath);
        } else if (stat.isFile()) {
          fileCount++;
          totalSize += stat.size;
        }
      }
    };

    await walkDirectory(projectPath);
    return { fileCount, totalSize };
  }

  // List all saved projects
  async listProjects(): Promise<string[]> {
    if (!(await fs.pathExists(this.projectsDir))) {
      return [];
    }

    const entries = await fs.readdir(this.projectsDir);
    const projects = [];

    for (const entry of entries) {
      const entryPath = path.join(this.projectsDir, entry);
      const stat = await fs.stat(entryPath);
      if (stat.isDirectory()) {
        projects.push(entry);
      }
    }

    return projects;
  }
}

// Singleton instance
let fileSystemPersistence: FileSystemPersistence | null = null;

export function getFileSystemPersistence(): FileSystemPersistence {
  if (!fileSystemPersistence) {
    fileSystemPersistence = new FileSystemPersistence();
  }
  return fileSystemPersistence;
}
