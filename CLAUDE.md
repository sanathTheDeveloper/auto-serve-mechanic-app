# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 application called "auto_serve_mechanic_app" built for managing automotive service operations. The project uses the App Router with TypeScript and is configured with shadcn/ui components and Tailwind CSS.

## Development Commands

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the production application
- `npm start` - Start production server
- `npm run lint` - Run ESLint checks

## Architecture & Structure

### Framework Stack
- **Next.js 15** with App Router architecture
- **React 19** with TypeScript
- **Tailwind CSS v4** for styling with shadcn/ui component system
- **Radix UI** components for accessible UI primitives

### Project Structure
```
src/
├── app/              # Next.js App Router pages
│   ├── layout.tsx    # Root layout with font configuration
│   ├── page.tsx      # Home page
│   └── globals.css   # Global styles with Tailwind
└── lib/
    └── utils.ts      # Utility functions (cn helper for Tailwind)
```

### UI Component System
The project is configured with shadcn/ui using the "new-york" style:
- Components path: `@/components`
- UI components path: `@/components/ui`
- Utils path: `@/lib/utils`
- CSS variables enabled for theming
- Lucide React for icons

### Key Dependencies
- **UI Components**: Radix UI primitives (Dialog, Dropdown Menu, Navigation Menu, Select, Tabs, Toast)
- **Styling**: Tailwind CSS, class-variance-authority, clsx, tailwind-merge
- **Icons**: Lucide React
- **MCP Integration**: @isaacphi/mcp-gdrive for Google Drive/Sheets access

## Development Notes

### Font Configuration
The app uses Geist Sans and Geist Mono fonts from Google Fonts, configured as CSS variables in the root layout.

### TypeScript Configuration
- Strict mode enabled
- Path mapping configured for `@/*` to `./src/*`
- Next.js plugin integrated for optimal TypeScript support

### ESLint Configuration
Uses Next.js recommended ESLint rules with TypeScript support via `next/core-web-vitals` and `next/typescript` configs.

### shadcn/ui Integration
Components are configured to use:
- New York style variant
- RSC (React Server Components) support
- CSS variables for theming with neutral base color
- TypeScript support enabled

## Google Drive MCP Integration

### Setup Requirements
1. **Google Cloud Console Setup**:
   - Create Google Cloud project
   - Enable Google Drive, Sheets, and Docs APIs
   - Configure OAuth consent screen
   - Create OAuth 2.0 credentials for Desktop application

2. **Configuration Files**:
   - `mcp-config.json` - MCP server configuration
   - `.env` - Environment variables (copy from `.env.example`)
   - `config/oauth_keys.json` - OAuth credentials (download from Google Cloud Console)

### Environment Variables
```
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GDRIVE_CREDS_DIR=./config
```

### MCP Server Commands
- `npx @isaacphi/mcp-gdrive` - Start Google Drive MCP server
- Requires browser authentication on first run
- Provides tools: `gdrive_search`, `gdrive_read_file`, `gsheets_read`, `gsheets_update_cell`

### Security Notes
- OAuth credentials are gitignored (`config/oauth_keys.json`, `config/tokens.json`)
- Environment variables are not committed (`.env*` ignored)
- Use accounts from same organization as Google Cloud project