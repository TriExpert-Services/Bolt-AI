import { useCallback, useEffect, useState } from 'react';
import type { Message } from 'ai';
import { persistentStorage } from './persistent-storage.client';
import { workbenchStore } from '~/lib/stores/workbench';

interface UsePersistentChatReturn {
  saveCurrentChat: (title?: string) => Promise<string>;
  loadChat: (id: string) => Promise<void>;
  deleteChat: (id: string) => Promise<void>;
  getAllChats: () => Promise<any[]>;
  autoSaveEnabled: boolean;
  setAutoSaveEnabled: (enabled: boolean) => void;
  saving: boolean;
  error: string | null;
}

export function usePersistentChat(
  messages: Message[],
  currentChatId?: string
): UsePersistentChatReturn {
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-save when messages change
  useEffect(() => {
    if (autoSaveEnabled && messages.length > 0) {
      const timeoutId = setTimeout(() => {
        autoSaveChat();
      }, 2000); // Auto-save after 2 seconds of inactivity

      return () => clearTimeout(timeoutId);
    }
  }, [messages, autoSaveEnabled]);

  const autoSaveChat = useCallback(async () => {
    if (messages.length === 0) return;

    try {
      setSaving(true);
      setError(null);

      const title = persistentStorage.generateChatTitle(messages);
      const files = workbenchStore.files.get();
      
      await persistentStorage.saveChat(currentChatId || null, title, messages, files);
      console.log('Auto-saved chat successfully');
    } catch (err) {
      console.error('Auto-save failed:', err);
      setError(err instanceof Error ? err.message : 'Auto-save failed');
    } finally {
      setSaving(false);
    }
  }, [messages, currentChatId]);

  const saveCurrentChat = useCallback(async (title?: string): Promise<string> => {
    try {
      setSaving(true);
      setError(null);

      const chatTitle = title || persistentStorage.generateChatTitle(messages);
      const files = workbenchStore.files.get();
      
      const chatId = await persistentStorage.saveChat(
        currentChatId || null,
        chatTitle,
        messages,
        files
      );

      console.log('Chat saved successfully:', chatId);
      return chatId;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save chat';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setSaving(false);
    }
  }, [messages, currentChatId]);

  const loadChat = useCallback(async (id: string): Promise<void> => {
    try {
      setSaving(true);
      setError(null);

      const { chat, files } = await persistentStorage.loadChat(id);
      
      // You would need to implement these methods in your chat store
      // to actually load the messages and files into the UI
      console.log('Chat loaded successfully:', chat);
      console.log('Files loaded:', Object.keys(files).length);
      
      // Update workbench with loaded files
      if (files && Object.keys(files).length > 0) {
        // This would need to be implemented based on your file store structure
        workbenchStore.files.set(files);
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load chat';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setSaving(false);
    }
  }, []);

  const deleteChat = useCallback(async (id: string): Promise<void> => {
    try {
      setSaving(true);
      setError(null);

      await persistentStorage.deleteChat(id);
      console.log('Chat deleted successfully:', id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete chat';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setSaving(false);
    }
  }, []);

  const getAllChats = useCallback(async (): Promise<any[]> => {
    try {
      setError(null);
      return await persistentStorage.getAllChats();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load chats';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  return {
    saveCurrentChat,
    loadChat,
    deleteChat,
    getAllChats,
    autoSaveEnabled,
    setAutoSaveEnabled,
    saving,
    error,
  };
}
