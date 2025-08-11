# Google Drive MCP Configuration

This directory contains configuration files for Google Drive MCP integration.

## Setup Instructions

1. **Create Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one

2. **Enable Required APIs**
   - Enable Google Drive API
   - Enable Google Sheets API  
   - Enable Google Docs API

3. **Configure OAuth Consent Screen**
   - Go to APIs & Services > OAuth consent screen
   - Configure the consent screen with your app details

4. **Create OAuth 2.0 Credentials**
   - Go to APIs & Services > Credentials
   - Click "Create Credentials" > "OAuth client ID"
   - Select "Desktop application" as application type
   - Download the JSON file and rename it to `oauth_keys.json`
   - Place it in this `config/` directory

5. **Set Environment Variables**
   - Copy `.env.example` to `.env`
   - Update with your CLIENT_ID and CLIENT_SECRET from the downloaded JSON

6. **Authentication**
   - Run the MCP server: `npx @isaicphi/mcp-gdrive`
   - Follow the browser authentication flow
   - Use an account from the same organization as your Google Cloud project

## File Structure
```
config/
├── oauth_keys.json    # OAuth credentials (create this)
├── tokens.json        # Generated after authentication
└── README.md          # This file
```

**Note**: Never commit `oauth_keys.json` or `tokens.json` to version control.