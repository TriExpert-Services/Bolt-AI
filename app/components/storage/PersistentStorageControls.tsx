import { useState, useEffect } from 'react';
import type { Message } from 'ai';
import { usePersistentChat } from '~/lib/storage/usePersistentChat';

interface PersistentStorageControlsProps {
  messages: Message[];
  currentChatId?: string;
  className?: string;
}

export function PersistentStorageControls({ 
  messages, 
  currentChatId, 
  className = '' 
}: PersistentStorageControlsProps) {
  const {
    saveCurrentChat,
    loadChat,
    deleteChat,
    getAllChats,
    autoSaveEnabled,
    setAutoSaveEnabled,
    saving,
    error
  } = usePersistentChat(messages, currentChatId);

  const [savedChats, setSavedChats] = useState<any[]>([]);
  const [showChatList, setShowChatList] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  // Load saved chats on component mount
  useEffect(() => {
    loadSavedChats();
  }, []);

  const loadSavedChats = async () => {
    try {
      const chats = await getAllChats();
      setSavedChats(chats);
    } catch (err) {
      console.error('Failed to load saved chats:', err);
    }
  };

  const handleSaveChat = async () => {
    try {
      const title = customTitle.trim() || undefined;
      await saveCurrentChat(title);
      setCustomTitle('');
      setShowSaveDialog(false);
      await loadSavedChats(); // Refresh the list
    } catch (err) {
      console.error('Failed to save chat:', err);
    }
  };

  const handleLoadChat = async (chatId: string) => {
    try {
      await loadChat(chatId);
      setShowChatList(false);
    } catch (err) {
      console.error('Failed to load chat:', err);
    }
  };

  const handleDeleteChat = async (chatId: string) => {
    if (confirm('Are you sure you want to delete this chat and all its files?')) {
      try {
        await deleteChat(chatId);
        await loadSavedChats(); // Refresh the list
      } catch (err) {
        console.error('Failed to delete chat:', err);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`persistent-storage-controls ${className}`}>
      {/* Auto-save toggle */}
      <div className="flex items-center gap-2 mb-4">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={autoSaveEnabled}
            onChange={(e) => setAutoSaveEnabled(e.target.checked)}
            className="rounded"
          />
          Auto-save chats & files
        </label>
        {saving && (
          <span className="text-xs text-blue-600">Saving...</span>
        )}
        {error && (
          <span className="text-xs text-red-600">{error}</span>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setShowSaveDialog(true)}
          disabled={messages.length === 0 || saving}
          className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
        >
          Save Chat
        </button>
        
        <button
          onClick={() => {
            setShowChatList(!showChatList);
            if (!showChatList) loadSavedChats();
          }}
          className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
        >
          {showChatList ? 'Hide' : 'Load'} Chats
        </button>
      </div>

      {/* Save dialog */}
      {showSaveDialog && (
        <div className="mb-4 p-3 border rounded bg-gray-50">
          <h4 className="text-sm font-medium mb-2">Save Chat</h4>
          <input
            type="text"
            value={customTitle}
            onChange={(e) => setCustomTitle(e.target.value)}
            placeholder="Enter custom title (optional)"
            className="w-full p-2 border rounded text-sm mb-2"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSaveChat}
              disabled={saving}
              className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50"
            >
              Save
            </button>
            <button
              onClick={() => {
                setShowSaveDialog(false);
                setCustomTitle('');
              }}
              className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Chat list */}
      {showChatList && (
        <div className="border rounded bg-white max-h-60 overflow-y-auto">
          <div className="p-2 border-b bg-gray-50">
            <h4 className="text-sm font-medium">Saved Chats ({savedChats.length})</h4>
          </div>
          {savedChats.length === 0 ? (
            <div className="p-3 text-sm text-gray-500">No saved chats</div>
          ) : (
            <div className="divide-y">
              {savedChats.map((chat) => (
                <div key={chat.id} className="p-2 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">
                        {chat.title}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDate(chat.updated_at)} • {chat.messages.length} messages
                      </div>
                    </div>
                    <div className="flex gap-1 ml-2">
                      <button
                        onClick={() => handleLoadChat(chat.id)}
                        className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                      >
                        Load
                      </button>
                      <button
                        onClick={() => handleDeleteChat(chat.id)}
                        className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
