# Installation Guide for bolt.new

This guide walks you through setting up and running the bolt.new project locally.

## Prerequisites

- **Node.js**: Version 18.18.0 or higher (tested with v22.17.1)
- **pnpm**: Package manager (will be installed if not present)

## Installation Steps

### 1. Install pnpm Package Manager

If you don't have pnpm installed, run:

```bash
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

Then reload your shell configuration:

```bash
source ~/.bashrc
```

Verify pnpm installation:

```bash
pnpm --version
```

### 2. Install Project Dependencies

Navigate to the project directory and install dependencies:

```bash
cd /path/to/bolt.new
pnpm install
```

This will install over 1000 packages including:
- Remix framework for full-stack React development
- Vite for build tooling
- OpenAI SDK for GPT-4o integration
- WebContainer API for in-browser development environment
- CodeMirror for code editing
- And many other development tools

### 3. Environment Configuration

Create a `.env.local` file in the project root:

```bash
# Environment variables for bolt.new development
# You need to add your OpenAI API key here to use the AI features
OPENAI_API_KEY=your_openai_api_key_here

# Legacy Anthropic support (optional)
# ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Optional: Set log level for development
VITE_LOG_LEVEL=debug

# Optional: Disable persistence if needed
# VITE_DISABLE_PERSISTENCE=true

# Persistent storage configuration (NEW!)
BOLT_DATA_DIR=./data
BOLT_PROJECTS_DIR=./data/projects
```

**Important**: To use bolt.new's AI features, you'll need an OpenAI API key:
1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Create an account and get your API key
3. Replace `your_openai_api_key_here` with your actual API key

### 4. Start the Development Server

Run the development server:

```bash
pnpm dev
```

The application will be available at: **http://localhost:5173/**

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server with Wrangler
- `pnpm test` - Run tests
- `pnpm test:watch` - Run tests in watch mode
- `pnpm lint` - Run linting
- `pnpm lint:fix` - Fix linting issues
- `pnpm typecheck` - Run TypeScript type checking
- `pnpm preview` - Build and start production preview

## Project Structure

```
bolt.new/
├── app/                    # Main application code
│   ├── components/         # React components
│   ├── lib/               # Utility libraries
│   ├── routes/            # Remix routes
│   └── styles/            # Stylesheets
├── functions/             # Cloudflare functions
├── public/                # Static assets
├── package.json           # Project dependencies
├── vite.config.ts         # Vite configuration
├── wrangler.toml          # Cloudflare Workers configuration
└── .env.local             # Environment variables (create this)
```

## Key Features

- **AI-Powered Development**: Integrates with OpenAI's GPT-4o for intelligent code assistance
- **In-Browser Environment**: Uses WebContainers for full development environment in the browser
- **Full-Stack Support**: Build and run Node.js applications directly in the browser
- **Real-time Collaboration**: Share and collaborate on projects via URLs
- **Deploy Ready**: Built-in deployment capabilities
- **Persistent Storage**: Save chats and project files to real database and filesystem (see [PERSISTENT_STORAGE.md](./PERSISTENT_STORAGE.md))

## Troubleshooting

### Permission Issues with pnpm Installation
If you get permission errors when installing pnpm globally with npm, use the installer script instead:
```bash
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

### Missing Dependencies
If you encounter missing dependencies, try:
```bash
pnpm install --frozen-lockfile
```

### Chrome 129 Issue
The project includes a workaround for Chrome 129 issues with JavaScript modules. If you encounter problems with Chrome 129, use Chrome Canary for development.

### API Key Issues
Make sure your OpenAI API key is correctly set in `.env.local`. The AI features won't work without a valid API key.

## Development Notes

- The development server runs on port 5173 by default
- Hot module replacement is enabled for fast development
- TypeScript is configured for strict type checking
- ESLint is set up for code quality
- The project uses UnoCSS for styling

## Deployment

For production deployment:

1. Build the project:
   ```bash
   pnpm build
   ```

2. Deploy to Cloudflare Pages:
   ```bash
   pnpm deploy
   ```

## Support

For issues and feature requests, check the [Issues section](https://github.com/stackblitz/bolt.new/issues) of the repository.
