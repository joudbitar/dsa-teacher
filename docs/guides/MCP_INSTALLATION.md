# MCP (Model Context Protocol) Installation Guide

This guide covers installing and configuring MCP servers for GitHub, PostgreSQL, and UI/UX testing in Cursor IDE.

## Table of Contents

1. [GitHub MCP](#github-mcp)
2. [PostgreSQL MCP](#postgresql-mcp)
3. [UI/UX Testing MCP](#uiux-testing-mcp)
4. [Configuration in Cursor](#configuration-in-cursor)

---

## GitHub MCP

### Prerequisites

- Node.js 18 or higher
- GitHub Personal Access Token with appropriate permissions

### Installation Steps

1. **Install the GitHub MCP Server:**

   ```bash
   npm install -g @modelcontextprotocol/server-github
   ```

   Or use npx (no installation needed):

   ```bash
   npx -y @modelcontextprotocol/server-github
   ```

2. **Create a GitHub Personal Access Token:**

   - Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Generate a new token with the following scopes:
     - `repo` (full control of private repositories)
     - `read:org` (if you need organization access)
     - `read:user` (read user profile data)

3. **Configure in Cursor:**

   Add the following to your Cursor MCP configuration (see [Configuration in Cursor](#configuration-in-cursor) section below):

   ```json
   {
     "github": {
       "command": "npx",
       "args": [
         "-y",
         "@modelcontextprotocol/server-github"
       ],
       "env": {
         "GITHUB_PERSONAL_ACCESS_TOKEN": "your-github-token-here"
       }
     }
   }
   ```

### Features

- Browse repositories and files
- Read and create issues
- Manage pull requests
- Access repository metadata
- Search code and repositories

---

## PostgreSQL MCP

### Prerequisites

- Python 3.10 or higher (or Node.js for Node-based servers)
- PostgreSQL database credentials

### Option 1: Python-based PostgreSQL MCP

1. **Install the PostgreSQL MCP Server:**

   ```bash
   pip install mcp-postgresql
   ```

2. **Configure in Cursor:**

   ```json
   {
     "postgresql": {
       "command": "mcp-postgresql",
       "env": {
         "PG_HOST": "localhost",
         "PG_PORT": "5432",
         "PG_USER": "your-username",
         "PG_PASSWORD": "your-password",
         "PG_DATABASE": "your-database-name"
       }
     }
   }
   ```

### Option 2: Node.js-based PostgreSQL MCP (pg-mcp-server)

1. **Install using npx:**

   ```bash
   npx --yes pg-mcp-server --transport=stdio
   ```

2. **Configure in Cursor:**

   ```json
   {
     "postgres": {
       "command": "npx",
       "args": ["--yes", "pg-mcp-server", "--transport", "stdio"],
       "env": {
         "DATABASE_URL": "postgresql://username:password@localhost:5432/database"
       }
     }
   }
   ```

### Features

- Query PostgreSQL databases
- Analyze database schemas
- Execute SQL queries safely
- Read table structures and metadata

---

## UI/UX Testing MCP

### Option 1: Web Eval Agent (Recommended for Advanced Testing)

The Web Eval Agent provides comprehensive browser-based testing with autonomous debugging.

1. **Install the Web Eval Agent:**

   ```bash
   npm install -g @operative-sh/web-eval-agent
   ```

2. **Configure in Cursor:**

   ```json
   {
     "web_eval_agent": {
       "command": "npx",
       "args": [
         "-y",
         "@operative-sh/web-eval-agent"
       ]
     }
   }
   ```

### Features

- Navigates web applications using BrowserUse
- Captures network traffic and console errors
- Performs autonomous debugging
- Comprehensive UX evaluation

### Option 2: Cursor Built-in Browser MCP (Already Available!)

**Good news:** Cursor already includes browser MCP capabilities! You can use browser automation tools directly without additional installation. The built-in browser MCP supports:

- Navigate to URLs
- Take screenshots
- Capture accessibility snapshots
- Click elements
- Type text
- Interact with forms
- Monitor network requests
- View console messages

These capabilities are available through the Cursor IDE browser MCP tools.

### Option 3: Playwright MCP (If Available)

For Playwright-based testing, check for available Playwright MCP servers:

```bash
npm install -g @modelcontextprotocol/server-playwright
```

---

## Configuration in Cursor

### Finding Your Cursor Configuration

Cursor stores MCP server configurations in its settings. The configuration file location varies by OS:

- **macOS:** `~/Library/Application Support/Cursor/User/globalStorage/mcp.json` or in Cursor Settings
- **Windows:** `%APPDATA%\Cursor\User\globalStorage\mcp.json` or in Cursor Settings
- **Linux:** `~/.config/Cursor/User/globalStorage/mcp.json` or in Cursor Settings

### Accessing Cursor Settings

1. Open Cursor IDE
2. Go to **Settings** (Cmd/Ctrl + ,)
3. Search for "MCP" or "Model Context Protocol"
4. Add your MCP server configurations

### Complete Configuration Example

Here's a complete example configuration with all three MCP servers:

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-github"
      ],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_your_token_here"
      }
    },
    "postgres": {
      "command": "npx",
      "args": ["--yes", "pg-mcp-server", "--transport", "stdio"],
      "env": {
        "DATABASE_URL": "postgresql://user:password@localhost:5432/dbname"
      }
    },
    "web_eval_agent": {
      "command": "npx",
      "args": [
        "-y",
        "@operative-sh/web-eval-agent"
      ]
    }
  }
}
```

### Environment Variables

For security, consider storing sensitive credentials in environment variables:

**macOS/Linux (.zshrc or .bashrc):**
```bash
export GITHUB_PERSONAL_ACCESS_TOKEN="your-token-here"
export DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
```

**Windows (PowerShell):**
```powershell
$env:GITHUB_PERSONAL_ACCESS_TOKEN="your-token-here"
$env:DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
```

Then reference them in your configuration:

```json
{
  "github": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-github"],
    "env": {
      "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_PERSONAL_ACCESS_TOKEN}"
    }
  }
}
```

---

## Verification

After configuring your MCP servers:

1. **Restart Cursor IDE** to load the new MCP configurations
2. Check the MCP status in Cursor's settings or status bar
3. Test the MCP servers by asking Cursor to:
   - List GitHub repositories (for GitHub MCP)
   - Query your database schema (for PostgreSQL MCP)
   - Navigate to a website (for Browser MCP - already available)

---

## Troubleshooting

### GitHub MCP Issues

- **Token not working:** Ensure your token has the correct scopes
- **Rate limiting:** GitHub API has rate limits; wait before retrying
- **Permission denied:** Check token permissions match your repository access

### PostgreSQL MCP Issues

- **Connection failed:** Verify database credentials and that PostgreSQL is running
- **SSL required:** Add `?sslmode=require` to your connection string if needed
- **Permission denied:** Ensure the database user has appropriate permissions

### UI/UX Testing MCP Issues

- **Browser not launching:** Ensure you have Chrome/Chromium installed
- **Timeout errors:** Increase timeout values in configuration
- **Network issues:** Check firewall settings for browser automation

---

## Additional Resources

- [MCP Documentation](https://modelcontextprotocol.io/)
- [GitHub MCP Server](https://github.com/modelcontextprotocol/servers/tree/main/src/github)
- [PostgreSQL MCP Servers](https://github.com/search?q=postgresql+mcp+server&type=repositories)
- [Web Eval Agent](https://www.mcpnow.io/en/server/operative-web-eval-agent-operative-sh-web-eval-agent)

---

## Security Notes

⚠️ **Important Security Considerations:**

1. **Never commit tokens or passwords** to version control
2. Use environment variables for sensitive credentials
3. Use tokens with minimal required permissions
4. Rotate tokens regularly
5. Consider using `.env` files (not committed) for local development

---

## Quick Start Summary

```bash
# 1. Install GitHub MCP
npm install -g @modelcontextprotocol/server-github

# 2. Install PostgreSQL MCP (Node.js version)
npm install -g pg-mcp-server

# 3. Install Web Eval Agent (UI/UX testing)
npm install -g @operative-sh/web-eval-agent

# 4. Configure in Cursor Settings → MCP
# 5. Restart Cursor IDE
```

Note: Cursor already includes browser MCP capabilities, so you may not need additional UI/UX testing MCPs unless you need specific advanced features.

