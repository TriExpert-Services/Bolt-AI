# Persistent Storage System for bolt.new

This system adds persistent storage capabilities to bolt.new, allowing you to save chat conversations and project files to a real database and filesystem.

## Features

- **SQLite Database**: Stores chat conversations with metadata
- **File System Storage**: Saves all project files to real directories
- **Auto-save**: Automatically saves chats and files during conversations
- **Chat Management**: Load, save, and delete complete chat sessions
- **File Persistence**: All generated files are saved to `./data/projects/{chatId}/`

## Storage Locations

```
data/
├── chats.db                    # SQLite database with chat history
└── projects/
    ├── {chatId-1}/             # Project files for chat 1
    │   ├── package.json
    │   ├── src/
    │   └── ...
    └── {chatId-2}/             # Project files for chat 2
        ├── index.html
        └── ...
```

## Configuration

Add these environment variables to your `.env.local`:

```bash
# Persistent storage configuration
BOLT_DATA_DIR=./data
BOLT_PROJECTS_DIR=./data/projects
```

## API Endpoints

### `POST /api/storage`

Handle various storage operations:

**Save Chat:**
```json
{
  "action": "saveChat",
  "id": "optional-existing-chat-id",
  "title": "My Chat Title",
  "messages": [...],
  "files": {...}
}
```

**Load Chat:**
```json
{
  "action": "loadChat",
  "id": "chat-id"
}
```

**Get All Chats:**
```json
{
  "action": "getAllChats"
}
```

**Save Files:**
```json
{
  "action": "saveFiles",
  "chatId": "chat-id",
  "files": {...}
}
```

## Usage Examples

### Auto-saving in Components

```tsx
import { usePersistentChat } from '~/lib/storage/usePersistentChat';

function ChatComponent() {
  const { messages } = useChat();
  const {
    saveCurrentChat,
    autoSaveEnabled,
    setAutoSaveEnabled,
    saving
  } = usePersistentChat(messages);

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={autoSaveEnabled}
          onChange={(e) => setAutoSaveEnabled(e.target.checked)}
        />
        Auto-save enabled
      </label>
      
      <button onClick={() => saveCurrentChat('My Custom Title')}>
        Save Chat {saving && '(Saving...)'}
      </button>
    </div>
  );
}
```

### Manual Storage Operations

```tsx
import { persistentStorage } from '~/lib/storage/persistent-storage.client';

// Save a chat
const chatId = await persistentStorage.saveChat(
  null, // null for new chat, existing ID for update
  'Chat Title',
  messages,
  projectFiles
);

// Load a chat
const { chat, files } = await persistentStorage.loadChat(chatId);

// Get all saved chats
const allChats = await persistentStorage.getAllChats();
```

## Database Schema

### `chats` table
- `id` - Unique chat identifier (UUID)
- `title` - Human-readable chat title
- `messages` - JSON string of chat messages
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp
- `project_path` - Path to associated project files

### `project_files` table
- `id` - Unique file identifier (UUID)
- `chat_id` - Foreign key to chats table
- `file_path` - Relative path of the file
- `content` - File content
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

## File System Structure

Each chat gets its own directory in `./data/projects/{chatId}/` containing all generated project files. This allows you to:

1. **Open projects in your IDE**: Navigate to the project directory and open it
2. **Run projects locally**: Use the saved files to run the project outside of bolt.new
3. **Version control**: Initialize git repos in project directories
4. **Share projects**: Copy or zip entire project directories

## Benefits

1. **True Persistence**: Data survives browser refreshes and computer restarts
2. **Real File Access**: Generated code is saved as real files you can edit
3. **Database Storage**: Chat history stored in SQLite for querying and analysis
4. **Auto-save**: Never lose work due to crashes or mistakes
5. **Export/Import**: Easy to backup and restore entire conversations and projects

## Installation

The system is automatically available once you've installed the dependencies:

```bash
pnpm add better-sqlite3 @types/better-sqlite3 fs-extra @types/fs-extra uuid @types/uuid
```

The database and file storage directories are created automatically when first accessed.
