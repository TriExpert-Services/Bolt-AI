import Database from 'better-sqlite3';
import { v4 as uuidv4 } from 'uuid';
import type { Message } from 'ai';
import path from 'path';
import fs from 'fs';

// Create data directory for persistent storage
const DATA_DIR = process.env.BOLT_DATA_DIR || path.join(process.cwd(), 'data');

interface ChatRecord {
  id: string;
  title: string;
  messages: string; // JSON string of messages
  created_at: string;
  updated_at: string;
  project_path?: string; // Path to saved project files
}

interface ProjectFile {
  id: string;
  chat_id: string;
  file_path: string;
  content: string;
  created_at: string;
  updated_at: string;
}

class ChatDatabase {
  private db: Database.Database;

  constructor() {
    // Ensure data directory exists
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    const dbPath = path.join(DATA_DIR, 'chats.db');
    this.db = new Database(dbPath);
    this.initializeTables();
  }

  private initializeTables() {
    // Create chats table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS chats (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        messages TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        project_path TEXT
      )
    `);

    // Create project_files table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS project_files (
        id TEXT PRIMARY KEY,
        chat_id TEXT NOT NULL,
        file_path TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (chat_id) REFERENCES chats (id) ON DELETE CASCADE
      )
    `);

    // Create indexes
    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_chats_created_at ON chats (created_at);
      CREATE INDEX IF NOT EXISTS idx_project_files_chat_id ON project_files (chat_id);
      CREATE INDEX IF NOT EXISTS idx_project_files_file_path ON project_files (file_path);
    `);
  }

  // Save or update a chat
  saveChat(id: string | null, title: string, messages: Message[], projectPath?: string): string {
    const chatId = id || uuidv4();
    const now = new Date().toISOString();
    const messagesJson = JSON.stringify(messages);

    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO chats (id, title, messages, created_at, updated_at, project_path)
      VALUES (?, ?, ?, 
        COALESCE((SELECT created_at FROM chats WHERE id = ?), ?),
        ?, 
        ?)
    `);

    stmt.run(chatId, title, messagesJson, chatId, now, now, projectPath);
    return chatId;
  }

  // Get a chat by ID
  getChat(id: string): ChatRecord | null {
    const stmt = this.db.prepare('SELECT * FROM chats WHERE id = ?');
    return stmt.get(id) as ChatRecord | null;
  }

  // Get all chats
  getAllChats(): ChatRecord[] {
    const stmt = this.db.prepare('SELECT * FROM chats ORDER BY updated_at DESC');
    return stmt.all() as ChatRecord[];
  }

  // Delete a chat
  deleteChat(id: string): void {
    const stmt = this.db.prepare('DELETE FROM chats WHERE id = ?');
    stmt.run(id);
  }

  // Save project file
  saveProjectFile(chatId: string, filePath: string, content: string): string {
    const fileId = uuidv4();
    const now = new Date().toISOString();

    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO project_files (id, chat_id, file_path, content, created_at, updated_at)
      VALUES (
        COALESCE((SELECT id FROM project_files WHERE chat_id = ? AND file_path = ?), ?),
        ?, ?, ?, 
        COALESCE((SELECT created_at FROM project_files WHERE chat_id = ? AND file_path = ?), ?),
        ?
      )
    `);

    stmt.run(chatId, filePath, fileId, chatId, filePath, content, chatId, filePath, now, now);
    return fileId;
  }

  // Get all files for a chat
  getChatFiles(chatId: string): ProjectFile[] {
    const stmt = this.db.prepare('SELECT * FROM project_files WHERE chat_id = ? ORDER BY file_path');
    return stmt.all(chatId) as ProjectFile[];
  }

  // Get specific file
  getFile(chatId: string, filePath: string): ProjectFile | null {
    const stmt = this.db.prepare('SELECT * FROM project_files WHERE chat_id = ? AND file_path = ?');
    return stmt.get(chatId, filePath) as ProjectFile | null;
  }

  // Delete all files for a chat
  deleteChatFiles(chatId: string): void {
    const stmt = this.db.prepare('DELETE FROM project_files WHERE chat_id = ?');
    stmt.run(chatId);
  }

  // Close database connection
  close(): void {
    this.db.close();
  }
}

// Singleton instance
let chatDatabase: ChatDatabase | null = null;

export function getChatDatabase(): ChatDatabase {
  if (!chatDatabase) {
    chatDatabase = new ChatDatabase();
  }
  return chatDatabase;
}

export type { ChatRecord, ProjectFile };
