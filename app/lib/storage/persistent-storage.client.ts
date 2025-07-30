import type { Message } from 'ai';

interface StorageResponse {
  success?: boolean;
  error?: string;
  chatId?: string;
  chat?: any;
  chats?: any[];
  files?: Record<string, any>;
}

export class PersistentStorage {
  private static instance: PersistentStorage;
  private baseUrl: string;

  private constructor() {
    this.baseUrl = '/api/storage';
  }

  static getInstance(): PersistentStorage {
    if (!PersistentStorage.instance) {
      PersistentStorage.instance = new PersistentStorage();
    }
    return PersistentStorage.instance;
  }

  private async request(action: string, data: any = {}): Promise<StorageResponse> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action, ...data }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Storage request failed:', error);
      throw error;
    }
  }

  // Save chat with messages and optionally files
  async saveChat(
    id: string | null,
    title: string,
    messages: Message[],
    files?: Record<string, any>
  ): Promise<string> {
    const response = await this.request('saveChat', {
      id,
      title,
      messages,
      files,
    });

    if (!response.success || !response.chatId) {
      throw new Error(response.error || 'Failed to save chat');
    }

    return response.chatId;
  }

  // Load chat by ID
  async loadChat(id: string): Promise<{ chat: any; files: Record<string, any> }> {
    const response = await this.request('loadChat', { id });

    if (response.error) {
      throw new Error(response.error);
    }

    return {
      chat: response.chat!,
      files: response.files || {},
    };
  }

  // Delete chat and its files
  async deleteChat(id: string): Promise<void> {
    const response = await this.request('deleteChat', { id });

    if (!response.success) {
      throw new Error(response.error || 'Failed to delete chat');
    }
  }

  // Get all chats
  async getAllChats(): Promise<any[]> {
    const response = await this.request('getAllChats');

    if (response.error) {
      throw new Error(response.error);
    }

    return response.chats || [];
  }

  // Save files for a specific chat
  async saveFiles(chatId: string, files: Record<string, any>): Promise<void> {
    const response = await this.request('saveFiles', {
      chatId,
      files,
    });

    if (!response.success) {
      throw new Error(response.error || 'Failed to save files');
    }
  }

  // Load files for a specific chat
  async loadFiles(chatId: string): Promise<Record<string, any>> {
    const response = await this.request('loadFiles', { chatId });

    if (response.error) {
      throw new Error(response.error);
    }

    return response.files || {};
  }

  // Generate a title from the first user message
  generateChatTitle(messages: Message[]): string {
    const firstUserMessage = messages.find(m => m.role === 'user');
    if (firstUserMessage) {
      const content = firstUserMessage.content.slice(0, 50);
      return content.length < firstUserMessage.content.length ? content + '...' : content;
    }
    return 'New Chat';
  }
}

// Export singleton instance
export const persistentStorage = PersistentStorage.getInstance();
