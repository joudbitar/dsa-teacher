# How to Run the DSA Lab App

Complete guide for running all parts of the application locally.

## Application Components

The app has 3 main parts:
1. **Web Frontend** - React dashboard (Vite + React + Tailwind)
2. **CLI Tool** - Command-line interface for testing/submitting
3. **Backend API** - Supabase Edge Functions

## Quick Start

### 1. Install Dependencies

```bash
# From project root
pnpm install
```

This installs dependencies for both `web/` and `cli/` workspaces.

### 2. Run the Web App

```bash
cd web
pnpm dev
```

The web app will start at: **http://localhost:5173** (or another port if 5173 is taken)

You should see:
- Landing page with hero section
- Challenge cards
- Navigation

### 3. Set Up CLI (Optional - for testing)

If you want to test the CLI:

```bash
# Install CLI globally
cd cli
./scripts/install.sh

# Or manually:
pnpm install
pnpm build
pnpm link --global

# Verify
dsa --version
```

## Running Each Component

### Web Frontend

**Start development server:**
```bash
cd web
pnpm dev
```

**Build for production:**
```bash
cd web
pnpm build
```

**Preview production build:**
```bash
cd web
pnpm preview
```

**Access:** http://localhost:5173 (or port shown in terminal)

### CLI Tool

**Install globally:**
```bash
cd cli
./scripts/install.sh
```

**Use in a project:**
```bash
cd your-challenge-repo
dsa test
dsa submit
```

**Build only (without installing):**
```bash
cd cli
pnpm build
```

### Backend API (Supabase Edge Functions)

The backend uses Supabase Edge Functions. You have two options:

#### Option 1: Deploy to Supabase (Recommended for Production)

See `supabase/MANUAL_DEPLOY.md` for detailed instructions.

**Quick deploy:**
```bash
cd supabase
./DEPLOY_NOW.sh
```

#### Option 2: Run Locally with Supabase CLI

**Prerequisites:**
- Install Supabase CLI: `npm install -g supabase`
- Have a Supabase project set up

**Start local Supabase:**
```bash
supabase start
```

**Deploy functions locally:**
```bash
supabase functions serve
```

**Access functions:**
- Local functions run at: `http://localhost:54321/functions/v1/`

## Environment Setup

### Web App Environment

The web app may need environment variables. Check if there's a `.env` file needed:

```bash
# Check for env template
cat .env.example

# Create local env file if needed
cp .env.example .env.local
```

### Supabase Environment

Supabase functions need:
- Supabase project URL
- Supabase service role key
- GitHub App credentials (for repo creation)

See `supabase/MANUAL_DEPLOY.md` for setup.

## Complete Development Setup

### Step-by-Step

1. **Install all dependencies:**
   ```bash
   pnpm install
   ```

2. **Start web app:**
   ```bash
   cd web
   pnpm dev
   ```
   Open http://localhost:5173

3. **Set up Supabase (if using backend):**
   ```bash
   # Follow supabase/MANUAL_DEPLOY.md
   # Or use Supabase CLI for local development
   ```

4. **Install CLI (optional):**
   ```bash
   cd cli
   ./scripts/install.sh
   ```

## Testing the Full Flow

### 1. Start Web App
```bash
cd web
pnpm dev
```

### 2. Create a Project (via Web UI)
- Go to http://localhost:5173
- Click "Start Challenge"
- This should create a GitHub repo (requires Supabase backend)

### 3. Clone the Repo
```bash
git clone <your-repo-url>
cd <repo-name>
```

### 4. Test with CLI
```bash
dsa test
dsa submit
```

### 5. Watch Dashboard Update
- Dashboard should update in real-time via Supabase Realtime

## Troubleshooting

### Web App Won't Start

**Port already in use:**
```bash
# Vite will automatically use next available port
# Or specify port:
cd web
pnpm dev --port 3000
```

**Dependencies not installed:**
```bash
pnpm install
```

### CLI Not Found

**After installation:**
```bash
# Restart terminal
# Or add to PATH:
export PATH="$(pnpm config get prefix)/bin:$PATH"
```

### Supabase Functions Not Working

**Check Supabase setup:**
- Verify Supabase project is running
- Check environment variables
- See `supabase/MANUAL_DEPLOY.md`

**Local development:**
```bash
supabase start
supabase functions serve
```

## Development Workflow

### Frontend Development

```bash
cd web
pnpm dev
# Make changes to React components
# Hot reload will update automatically
```

### CLI Development

```bash
cd cli
pnpm dev  # Watch mode - rebuilds on changes
# Test in another terminal:
dsa test
```

### Backend Development

```bash
# Edit functions in supabase/functions/
supabase functions deploy <function-name>
# Or use local serve for faster iteration
supabase functions serve
```

## Production Build

### Build Everything

```bash
# From project root
pnpm build
```

This builds:
- Web app → `web/dist/`
- CLI → `cli/dist/`

### Deploy Web App

```bash
cd web
pnpm build
# Deploy dist/ folder to Vercel, Netlify, etc.
```

### Deploy CLI

Publish to npm (when ready):
```bash
cd cli
pnpm publish
```

## Quick Reference

| Component | Command | Port/Path |
|-----------|---------|-----------|
| **Web** | `cd web && pnpm dev` | http://localhost:5173 |
| **CLI** | `cd cli && ./scripts/install.sh` | Global `dsa` command |
| **Supabase** | `supabase functions serve` | http://localhost:54321 |

## Next Steps

1. **Start web app:** `cd web && pnpm dev`
2. **Explore the UI** at http://localhost:5173
3. **Set up Supabase** if you need backend functionality
4. **Test CLI** in a challenge repository

For more details:
- Web: See `web/README.md`
- CLI: See `cli/README.md` and `cli/INSTALL.md`
- Backend: See `supabase/MANUAL_DEPLOY.md`

