# Frontend Integration Plan: Connecting CLI, API, and UI

## Executive Summary

This document provides a comprehensive plan to fully integrate the DSA Lab frontend with the backend API, CLI tools, and GitHub repository generation system. The goal is to create a seamless user experience where:

1. **User authenticates** via Supabase Auth (email/password)
2. **Challenges page** displays language-agnostic challenge cards with real progress from database
3. **Challenge detail page** allows language selection
4. **"Start with [Language]" button** triggers API to create GitHub repo
5. **Modal displays** the clone command with copy functionality
6. **"Continue to Challenge" button** advances to step-by-step subchallenges
7. **Project timeline** shows actual subchallenges from module data (not hardcoded steps)
8. **Real-time progress tracking** syncs between CLI submissions and frontend

---

## Current State Analysis (Updated Nov 2025)

### ✅ What's Working

#### Frontend - Authentication & User Management

- **Supabase Auth Integration** (`auth/AuthProvider.tsx`): Complete authentication system with JWT tokens
  - Email/password sign in and sign up
  - Session persistence in localStorage
  - Auto-refresh tokens
  - Auth state management via React Context
- **Protected Routes** (`components/auth/ProtectedRoute.tsx`): Routes redirect to `/login` if not authenticated
- **Auth Pages**:
  - `/login` - Dedicated login page
  - `/signup` - Dedicated signup page
  - `/auth` - Combined auth page with mode toggle
- **Navbar Integration**: Shows user email, dropdown with sign out and dark/light mode toggle
- **Auth Forms** (`components/auth/`):
  - `LoginForm.tsx` - Email/password login
  - `SignupForm.tsx` - Email/password signup with validation
  - `AuthModal.tsx` - Modal wrapper (currently unused, using dedicated pages)
- **Supabase Client** (`lib/supabase.ts`): Configured with environment variables
  - Uses `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
  - Auto-refresh tokens and session detection
- **Theme System** (`theme/ThemeContext.tsx`): Dark/light mode support integrated with auth

#### Frontend - Challenge System

- **Challenge Grid** (`ChallengesGrid.tsx`): Displays all 12 modules with progress tracking via localStorage
- **Challenge Detail Page** (`ChallengeDetail.tsx`): Language picker, step navigation, progress tracking
- **Language Picker** (`LanguagePicker.tsx`): 6 languages (TypeScript, Python, JavaScript, Go, Java, C++)
- **Challenge Data** (`/data/challenges/`): Rich content for each module (description, steps, benefits)
- **Progress Tracking** (`challengeProgress.ts`): localStorage-based progress with custom events
- **Modal UX**: Repository creation modal with copy command
- **Legacy User ID System** (`lib/user.ts`): Anonymous user ID generation (needs migration to Supabase Auth)

#### Backend

- **`POST /projects`** (`supabase/functions/projects/post.ts`): Creates GitHub repo from template, commits `dsa.config.json`
  - Currently uses `x-user-id` header (needs migration to JWT auth)
  - Generates project tokens for CLI authentication
  - Creates repos via GitHub App with Octokit
  - Validates language/module combinations
- **`GET /projects`** (`supabase/functions/projects/get.ts`): Fetches user projects
  - Currently uses `x-user-id` header (needs migration)
  - Supports filtering by `moduleId` query param
  - Returns all projects sorted by creation date
- **`POST /submissions`** (`supabase/functions/submissions/index.ts`): Receives test results, updates project progress
- **`GET /modules`** (`supabase/functions/modules/index.ts`): Returns available modules
- **GitHub App Integration**: Authenticated repo creation via Octokit
- **Database Schema**: `projects` and `submissions` tables with proper indexing

#### CLI

- **`dsa test`** (`cli/src/commands/test.ts`): Runs tests, auto-unlocks next challenge
- **`dsa submit`** (`cli/src/commands/submit.ts`): Submits results to API
- **Auto-unlock Logic**: Test runners (Java, Python, Go, JS) automatically increment `currentChallengeIndex` in `dsa.config.json`

### ❌ What's Missing / Broken

#### Critical Integration Gaps

1. **No API calls from frontend** - Frontend still uses mock data and localStorage only
   - `ChallengesGrid.tsx` doesn't fetch from `/projects` API
   - `ChallengeDetail.tsx` doesn't call `POST /projects` or `GET /projects`
   - No progress syncing with database
2. **Auth/API mismatch** - Backend expects `x-user-id` header, but frontend has Supabase Auth

   - Backend functions use `req.headers.get('x-user-id')` instead of JWT tokens
   - Need to migrate backend to use `supabase.auth.getUser()` from JWT
   - Frontend needs to send `Authorization: Bearer <token>` header
   - Legacy `lib/user.ts` generates anonymous IDs (should use `user.id` from Supabase Auth)

3. **User ID confusion** - Two separate user identification systems:

   - Old: `lib/user.ts` generates `user_<timestamp>_<random>` strings stored in localStorage
   - New: Supabase Auth provides UUID from `user.id`
   - Frontend still uses old system, backend expects old system
   - Need unified approach using Supabase Auth UUIDs

4. **Database schema mismatch** - `projects.userId` column type unclear

   - Current backend uses TEXT userId (from `x-user-id` header)
   - Should use UUID referencing `auth.users(id)`
   - Need migration to enforce foreign key constraint

5. **No API client library** - Frontend lacks structured API client
   - No centralized API URL configuration
   - No request/response type definitions
   - No error handling utilities
   - Each component would need to duplicate fetch logic

#### Missing Features

6. **Hardcoded subchallenges** - `ChallengesGrid.tsx` has static module array instead of API data
7. **Progress sync gap** - Frontend progress (localStorage) doesn't sync with backend (database)
8. **No project status checking** - Can't detect if user already has a project for a module
9. **Timeline mismatch** - Challenge detail sidebar shows wrong subchallenges (from `steps` not `subchallenges`)
10. **No error handling** - Missing feedback for API failures, rate limits, GitHub errors
11. **No loading states** - Button clicks have no loading indicators
12. **Missing project association** - Created repos aren't linked back to frontend state
13. **No realtime updates** - Frontend doesn't poll or use Supabase Realtime for progress updates

---

## Integration Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER JOURNEY                              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
        ┌──────────────────────────────────────────┐
        │  1. Challenges Page (/challenges)         │
        │  - Display all modules from API           │
        │  - Show progress from database            │
        │  - Language-agnostic cards                │
        └──────────────────────────────────────────┘
                              │
                              ▼
        ┌──────────────────────────────────────────┐
        │  2. Challenge Detail (/challenges/:id)    │
        │  - Language picker (6 options)            │
        │  - Check existing projects via API        │
        │  - Show repo link if exists               │
        └──────────────────────────────────────────┘
                              │
                              ▼
        ┌──────────────────────────────────────────┐
        │  3. Start Button Click                    │
        │  - POST /projects with moduleId+language  │
        │  - Create GitHub repo from template       │
        │  - Commit dsa.config.json                 │
        └──────────────────────────────────────────┘
                              │
                              ▼
        ┌──────────────────────────────────────────┐
        │  4. Modal Display                         │
        │  - Show git clone command                 │
        │  - Copy to clipboard button               │
        │  - "Continue to Challenge" button         │
        └──────────────────────────────────────────┘
                              │
                              ▼
        ┌──────────────────────────────────────────┐
        │  5. Challenge Steps (Timeline)            │
        │  - Replace hardcoded steps                │
        │  - Use module's subchallenges array       │
        │  - Sync progress from database            │
        └──────────────────────────────────────────┘
                              │
                              ▼
        ┌──────────────────────────────────────────┐
        │  6. CLI Workflow                          │
        │  - User writes code locally               │
        │  - Runs `dsa test` (auto-unlocks)         │
        │  - Runs `dsa submit` (sends to API)       │
        └──────────────────────────────────────────┘
                              │
                              ▼
        ┌──────────────────────────────────────────┐
        │  7. Real-time Sync                        │
        │  - Frontend polls or uses webhooks        │
        │  - Updates progress bar                   │
        │  - Unlocks next subchallenge              │
        └──────────────────────────────────────────┘
```

---

## Detailed Implementation Plan

### Phase 0: Backend Authentication Migration (PREREQUISITE)

**CRITICAL**: Before implementing frontend integration, the backend must be updated to use Supabase Auth instead of `x-user-id` headers.

#### 0.1 Update Backend Functions to Use JWT Auth

**Files to modify**:

- `supabase/functions/projects/post.ts`
- `supabase/functions/projects/get.ts`
- `supabase/functions/submissions/index.ts`

**Changes needed**:

```typescript
// OLD (current):
export async function handlePost(req: Request): Promise<Response> {
  const userId = req.headers.get("x-user-id");
  if (!userId) {
    return jsonResponse({ error: "Missing x-user-id header" }, 400);
  }
  // ... use userId
}

// NEW (required):
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export async function handlePost(req: Request): Promise<Response> {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return jsonResponse({ error: "Unauthorized" }, 401);
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    {
      global: {
        headers: { Authorization: authHeader },
      },
    }
  );

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return jsonResponse({ error: "Unauthorized" }, 401);
  }

  const userId = user.id; // UUID from auth.users
  // ... use userId
}
```

#### 0.2 Update Database Schema

**Migration**: `supabase/migrations/004_migrate_to_auth_users.sql`

```sql
-- Ensure projects.userId is UUID and references auth.users
ALTER TABLE projects
  ALTER COLUMN userId TYPE UUID USING userId::UUID,
  ADD CONSTRAINT fk_projects_user
    FOREIGN KEY (userId) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Update submissions if needed
ALTER TABLE submissions
  ALTER COLUMN userId TYPE UUID USING userId::UUID,
  ADD CONSTRAINT fk_submissions_user
    FOREIGN KEY (userId) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Update RLS policies to use auth.uid()
DROP POLICY IF EXISTS "Users can view own projects" ON projects;
DROP POLICY IF EXISTS "Users can create own projects" ON projects;
DROP POLICY IF EXISTS "Users can update own projects" ON projects;

CREATE POLICY "Users can view own projects"
  ON projects FOR SELECT
  USING (auth.uid() = userId);

CREATE POLICY "Users can create own projects"
  ON projects FOR INSERT
  WITH CHECK (auth.uid() = userId);

CREATE POLICY "Users can update own projects"
  ON projects FOR UPDATE
  USING (auth.uid() = userId);
```

---

### Phase 1: Frontend API Client Setup

#### 1.1 Create API Client with Supabase Auth

**File**: `web/src/lib/api.ts` (NEW)

```typescript
import { supabase } from "./supabase";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://mwlhxwbkuumjxpnvldli.supabase.co/functions/v1";

export interface Module {
  id: string;
  title: string;
  level: string;
  summary: string;
  subchallenges: string[];
  template: string;
  languages: string[];
}

export interface Project {
  id: string;
  userId: string;
  moduleId: string;
  language: string;
  githubRepoUrl: string;
  status: "in_progress" | "completed" | "needs_config";
  progress: number;
  currentChallengeIndex: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectRequest {
  moduleId: string;
  language: string;
}

export interface CreateProjectResponse {
  id: string;
  githubRepoUrl: string;
  status: string;
  progress: number;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async getHeaders(): Promise<HeadersInit> {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      throw new Error("No active session");
    }

    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    };
  }

  // GET /modules
  async getModules(): Promise<Module[]> {
    const response = await fetch(`${this.baseUrl}/modules`, {
      method: "GET",
      headers: await this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch modules: ${response.statusText}`);
    }

    return response.json();
  }

  // GET /projects (optionally filtered by moduleId)
  async getProjects(moduleId?: string): Promise<Project[]> {
    const url = new URL(`${this.baseUrl}/projects`);
    if (moduleId) {
      url.searchParams.set("moduleId", moduleId);
    }

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: await this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }

    return response.json();
  }

  // POST /projects
  async createProject(
    data: CreateProjectRequest
  ): Promise<CreateProjectResponse> {
    const response = await fetch(`${this.baseUrl}/projects`, {
      method: "POST",
      headers: await this.getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ error: response.statusText }));
      throw new Error(error.error || "Failed to create project");
    }

    return response.json();
  }

  // GET /projects/:id (for single project details)
  async getProject(projectId: string): Promise<Project> {
    const response = await fetch(`${this.baseUrl}/projects/${projectId}`, {
      method: "GET",
      headers: await this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch project: ${response.statusText}`);
    }

    return response.json();
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
```

#### 1.2 Remove Legacy User ID System

**File**: `web/src/lib/user.ts` (DEPRECATE OR DELETE)

This file is no longer needed since we're using Supabase Auth. The `user.id` from `useAuth()` hook should be used instead.

**Migration note**: Any existing localStorage data using `dsa-lab-user-id` will be orphaned. Consider adding a one-time migration to associate old IDs with new auth.users if needed.

#### 1.3 Environment Variables

**File**: `web/.env.local` (REQUIRED)

```bash
VITE_SUPABASE_URL=https://mwlhxwbkuumjxpnvldli.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=https://mwlhxwbkuumjxpnvldli.supabase.co/functions/v1
```

**Note**: The Supabase URL and anon key should already be set up from the auth implementation.

---

### Phase 2: Challenges Page - Dynamic Data Loading

#### 2.1 Fetch Modules from API

**File**: `web/src/pages/Challenges.tsx` (MODIFY)

**Current Issue**: Uses hardcoded module data  
**Solution**: Fetch from `/modules` API

```typescript
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ChallengesGrid } from "@/components/ChallengesGrid";
import { apiClient, Module } from "@/lib/api";

export function Challenges() {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadModules() {
      try {
        setLoading(true);
        const data = await apiClient.getModules();
        setModules(data);
      } catch (err) {
        console.error("Failed to load modules:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadModules();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-dev-lab relative challenges-page">
        <Navbar className="relative z-10" />
        <main className="flex-1 relative z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <p className="text-lg font-mono">Loading challenges...</p>
            </div>
          </div>
        </main>
        <Footer className="relative z-10" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-dev-lab relative challenges-page">
        <Navbar className="relative z-10" />
        <main className="flex-1 relative z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <p className="text-lg font-mono text-destructive">
                Error: {error}
              </p>
            </div>
          </div>
        </main>
        <Footer className="relative z-10" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-dev-lab relative challenges-page">
      <Navbar className="relative z-10" />
      <main className="flex-1 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-4 font-mono">
              Data Structures & Algorithms Challenges
            </h1>
            <p className="text-lg text-muted-foreground font-mono">
              Pick a challenge and start building. Each module comes with tests,
              starter code, and clear goals.
            </p>
          </div>

          <ChallengesGrid modules={modules} />
        </div>
      </main>
      <Footer className="relative z-10" />
    </div>
  );
}
```

#### 2.2 Update ChallengesGrid to Accept Props

**File**: `web/src/components/ChallengesGrid.tsx` (MODIFY)

**Current Issue**: Uses hardcoded `allModules` array  
**Solution**: Accept `modules` prop from API

```typescript
import { Module } from "@/lib/api";

interface ChallengesGridProps {
  modules: Module[];
}

export function ChallengesGrid({ modules }: ChallengesGridProps) {
  // ... existing state ...

  // Remove hardcoded allModules array
  // Use modules from props instead

  return (
    <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 challenges-page">
      {modules.map((module) => {
        // ... existing rendering logic ...
      })}
    </div>
  );
}
```

#### 2.3 Fetch Projects for Progress Tracking

**File**: `web/src/components/ChallengesGrid.tsx` (MODIFY)

**Current Issue**: Progress only from localStorage  
**Solution**: Fetch from `/projects` API and sync with localStorage

```typescript
useEffect(() => {
  async function loadProgress() {
    try {
      // Fetch all user projects from API
      const projects = await apiClient.getProjects();

      // Build progress map from projects
      const apiProgress: Record<string, number> = {};
      projects.forEach((project) => {
        apiProgress[project.moduleId] = project.progress;
      });

      // Merge with localStorage progress
      const localProgress = {}; // Load from localStorage
      const mergedProgress = { ...localProgress, ...apiProgress };

      setModuleProgress(mergedProgress);
    } catch (error) {
      console.error("Failed to load progress:", error);
      // Fallback to localStorage only
    }
  }

  loadProgress();
}, [location.pathname]);
```

---

### Phase 3: Challenge Detail Page - Project Creation Flow

#### 3.1 Check for Existing Projects

**File**: `web/src/pages/ChallengeDetail.tsx` (MODIFY)

**Current Issue**: No API integration, always shows "Start" button  
**Solution**: Check if project exists on mount

```typescript
import { apiClient, Project } from "@/lib/api";

export function ChallengeDetail() {
  const { id } = useParams<{ id: string }>();
  const [existingProject, setExistingProject] = useState<Project | null>(null);
  const [loadingProject, setLoadingProject] = useState(true);

  // Check for existing project on mount
  useEffect(() => {
    async function checkExistingProject() {
      if (!id) return;

      try {
        setLoadingProject(true);
        const projects = await apiClient.getProjects(id);

        if (projects.length > 0) {
          // User has already started this module
          const project = projects[0];
          setExistingProject(project);

          // Auto-select the language they chose
          setSelectedLanguage(project.language.toLowerCase());

          // Set progress from project
          setCurrentStepIndex(project.currentChallengeIndex + 1); // +1 for "Choose Language" step

          // Mark completed steps based on currentChallengeIndex
          const completed = Array.from(
            { length: project.currentChallengeIndex + 1 },
            (_, i) => i
          );
          setCompletedSteps(completed);

          // Set saved repo URL
          setSavedRepoUrl(project.githubRepoUrl);
        }
      } catch (error) {
        console.error("Failed to check existing project:", error);
      } finally {
        setLoadingProject(false);
      }
    }

    checkExistingProject();
  }, [id]);

  // ... rest of component
}
```

#### 3.2 Handle Project Creation

**File**: `web/src/pages/ChallengeDetail.tsx` (MODIFY)

**Current Issue**: `handleStartChallenge` doesn't call API  
**Solution**: Call `POST /projects` and handle response

```typescript
const [creatingProject, setCreatingProject] = useState(false);
const [projectError, setProjectError] = useState<string | null>(null);

const handleStartChallenge = async (language: string) => {
  if (!id) return;

  try {
    setCreatingProject(true);
    setProjectError(null);

    // Call API to create project
    const response = await apiClient.createProject({
      moduleId: id,
      language: language.charAt(0).toUpperCase() + language.slice(1), // Capitalize
    });

    // Store the project
    setExistingProject({
      id: response.id,
      userId: getUserId(),
      moduleId: id,
      language,
      githubRepoUrl: response.githubRepoUrl,
      status: response.status,
      progress: response.progress,
      currentChallengeIndex: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Set repo URL and show modal
    setSavedRepoUrl(response.githubRepoUrl);
    setShowRepoCommand(true);

    // Mark language step as completed
    if (!completedSteps.includes(0)) {
      markStepCompleted(id, 0);
      setCompletedSteps((prev) => [...prev, 0]);
    }
  } catch (error) {
    console.error("Failed to create project:", error);
    setProjectError(error.message);
  } finally {
    setCreatingProject(false);
  }
};
```

#### 3.3 Update Button UI with Loading State

**File**: `web/src/components/ChallengeInfo.tsx` (MODIFY)

```typescript
interface ChallengeInfoProps {
  // ... existing props ...
  isCreatingProject?: boolean;
  projectError?: string | null;
}

export function ChallengeInfo({
  // ... existing props ...
  isCreatingProject = false,
  projectError = null,
}: ChallengeInfoProps) {
  return (
    <div className="flex-1 space-y-6">
      {isLanguageStep && (
        <div className="text-center py-8 space-y-4">
          {projectError && (
            <div className="mb-4 p-4 bg-destructive/10 border border-destructive rounded-lg">
              <p className="text-destructive font-mono">{projectError}</p>
            </div>
          )}

          {!selectedLanguage ? (
            <button
              disabled
              className="px-6 py-3 rounded-lg bg-muted text-muted-foreground cursor-not-allowed font-medium"
            >
              Select a language
            </button>
          ) : (
            <button
              onClick={() => onStartChallenge?.(selectedLanguage)}
              disabled={isCreatingProject}
              className="px-6 py-3 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 font-medium transition-colors font-mono disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreatingProject ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⏳</span>
                  Creating repository...
                </span>
              ) : (
                `Start with ${getLanguageDisplayName(selectedLanguage)}`
              )}
            </button>
          )}
        </div>
      )}

      {/* ... rest of component ... */}
    </div>
  );
}
```

---

### Phase 4: Fix Timeline/Sidebar Subchallenges

#### 4.1 Problem Analysis

**Current Issue**: `ChallengeDetail.tsx` builds timeline from `challenge.steps` (6 detailed learning steps) instead of `challenge.subchallenges` (5 simple test names)

**Example - Stack Module**:

```typescript
// WRONG (current):
challenge.steps = [
  { step: 1, focus: "Stack Basics", challenge: "...", conceptGained: "..." },
  { step: 2, focus: "Dynamic Stack", challenge: "...", conceptGained: "..." },
  // ... 6 total steps
];

// CORRECT (should use):
challenge.subchallenges = [
  "Choose Language",
  "Create class",
  "push()",
  "pop()",
  "peek()",
  "size()",
];
```

#### 4.2 Solution - Use Subchallenges in Sidebar

**File**: `web/src/pages/ChallengeDetail.tsx` (MODIFY)

```typescript
// BEFORE (lines 88-99):
const timelineSteps = [
  {
    id: `${id}-0`,
    name: "Choose Language",
    completed: isLanguageStepCompleted,
  },
  ...challenge.steps.map((step, index) => ({
    id: `${id}-${index + 1}`,
    name: step.focus,
    completed: completedSteps.includes(index + 1),
  })),
];

// AFTER:
const timelineSteps = challenge.subchallenges.map((subchallenge, index) => ({
  id: `${id}-${index}`,
  name: subchallenge,
  completed: completedSteps.includes(index),
}));
```

**Explanation**:

- The `subchallenges` array already includes "Choose Language" as the first item
- Test runners use these exact subchallenge names for `subchallengeId` in reports
- This matches what the CLI sends to `/submissions` endpoint

#### 4.3 Update Modules API Data

**File**: `supabase/functions/modules/index.ts` (VERIFY)

Ensure all modules have correct subchallenges:

```typescript
const modules = [
  {
    id: "stack",
    subchallenges: ["Create class", "push()", "pop()", "peek()", "size()"],
    // ✅ Correct - matches test file names
  },
  {
    id: "queue",
    subchallenges: [
      "Create class",
      "enqueue()",
      "dequeue()",
      "front()",
      "size()",
    ],
    // ✅ Correct
  },
  {
    id: "binary-search",
    subchallenges: ["Empty array", "Found index", "Not found = -1", "Bounds"],
    // ⚠️ Check test files - might need adjustment
  },
  {
    id: "min-heap",
    subchallenges: [
      "Insert",
      "Heapify up",
      "Peek",
      "Extract",
      "Heapify down",
      "Size",
    ],
    // ✅ Correct
  },
];
```

#### 4.4 Add "Choose Language" Dynamically

**File**: `web/src/pages/ChallengeDetail.tsx` (MODIFY)

```typescript
// Insert "Choose Language" as first step
const timelineSteps = [
  {
    id: `${id}-0`,
    name: "Choose Language",
    completed: isLanguageStepCompleted,
  },
  ...challenge.subchallenges.map((subchallenge, index) => ({
    id: `${id}-${index + 1}`,
    name: subchallenge,
    completed: completedSteps.includes(index + 1),
  })),
];
```

---

### Phase 5: Real-Time Progress Sync

#### 5.1 Polling Strategy

**File**: `web/src/pages/ChallengeDetail.tsx` (MODIFY)

**Approach**: Poll `/projects/:id` endpoint every 10 seconds when user is on challenge page

```typescript
useEffect(() => {
  if (!existingProject) return;

  const pollInterval = setInterval(async () => {
    try {
      const updatedProject = await apiClient.getProject(existingProject.id);

      // Update local state if progress changed
      if (
        updatedProject.currentChallengeIndex !==
        existingProject.currentChallengeIndex
      ) {
        setExistingProject(updatedProject);

        // Update steps
        const newIndex = updatedProject.currentChallengeIndex + 1; // +1 for "Choose Language"
        setCurrentStepIndex(newIndex);

        // Mark completed steps
        const completed = Array.from({ length: newIndex }, (_, i) => i);
        setCompletedSteps(completed);

        // Save to localStorage
        saveChallengeProgress(id!, {
          completedSteps: completed,
          currentStepIndex: newIndex,
          selectedLanguage,
          lastUpdated: Date.now(),
        });
      }
    } catch (error) {
      console.error("Failed to poll project status:", error);
    }
  }, 10000); // Poll every 10 seconds

  return () => clearInterval(pollInterval);
}, [existingProject, id, selectedLanguage]);
```

#### 5.2 Alternative: Supabase Realtime (Future Enhancement)

**Note**: Requires enabling Realtime subscriptions in Supabase

```typescript
useEffect(() => {
  if (!existingProject) return;

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  const channel = supabase
    .channel("project-updates")
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "projects",
        filter: `id=eq.${existingProject.id}`,
      },
      (payload) => {
        const updatedProject = payload.new as Project;
        setExistingProject(updatedProject);
        // Update UI...
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [existingProject]);
```

---

### Phase 6: Error Handling & Edge Cases

#### 6.1 Handle Project Creation Failures

**Scenarios**:

1. GitHub API rate limit exceeded
2. Template repository not found
3. Network timeout
4. User already has a project for this module

**Solution**: Display user-friendly error messages

```typescript
const handleStartChallenge = async (language: string) => {
  try {
    // ... API call ...
  } catch (error) {
    let errorMessage = "Failed to create project. Please try again.";

    if (error.message.includes("rate limit")) {
      errorMessage =
        "GitHub API rate limit exceeded. Please try again in a few minutes.";
    } else if (error.message.includes("template")) {
      errorMessage = "Template repository not found. Please contact support.";
    } else if (error.message.includes("already exists")) {
      errorMessage = "You already have a project for this module.";
    }

    setProjectError(errorMessage);
  }
};
```

#### 6.2 Handle Network Failures

**Solution**: Retry logic with exponential backoff

```typescript
async function fetchWithRetry<T>(
  fetcher: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fetcher();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise((resolve) =>
        setTimeout(resolve, delay * Math.pow(2, i))
      );
    }
  }
  throw new Error("Max retries exceeded");
}

// Usage:
const projects = await fetchWithRetry(() => apiClient.getProjects());
```

#### 6.3 Handle Stale Data

**Solution**: Add timestamp checks and refresh buttons

```typescript
interface ProjectWithStaleness extends Project {
  isStale: boolean;
}

function checkIfStale(updatedAt: string): boolean {
  const STALE_THRESHOLD = 5 * 60 * 1000; // 5 minutes
  const lastUpdate = new Date(updatedAt).getTime();
  const now = Date.now();
  return now - lastUpdate > STALE_THRESHOLD;
}

// In component:
const projectWithStaleness = {
  ...existingProject,
  isStale: checkIfStale(existingProject.updatedAt),
};

// Show refresh button if stale
{
  projectWithStaleness.isStale && (
    <button onClick={refreshProject}>Refresh Progress</button>
  );
}
```

---

### Phase 7: Testing & Validation

#### 7.1 Manual Test Checklist

1. **Challenges Page**:

   - [ ] Loads modules from API
   - [ ] Displays all 12 modules
   - [ ] Shows correct subchallenges for each module
   - [ ] Progress bars reflect database state
   - [ ] Clicking a card navigates to detail page

2. **Challenge Detail - First Visit**:

   - [ ] Language picker displays 6 options
   - [ ] Selecting language enables "Start" button
   - [ ] Clicking "Start" calls API
   - [ ] Loading state shows during creation
   - [ ] Modal appears with clone command
   - [ ] Copy button works
   - [ ] "Continue to Challenge" advances to step 1

3. **Challenge Detail - Returning Visit**:

   - [ ] Auto-detects existing project
   - [ ] Pre-selects language
   - [ ] Shows current progress
   - [ ] Timeline reflects completed steps
   - [ ] Displays repo link

4. **CLI Integration**:

   - [ ] Running `dsa test` updates `currentChallengeIndex`
   - [ ] Running `dsa submit` calls `/submissions` API
   - [ ] Frontend polls and detects progress update
   - [ ] Timeline unlocks next step
   - [ ] Progress bar updates

5. **Error Handling**:
   - [ ] Network failure shows error message
   - [ ] GitHub API error displays helpful text
   - [ ] Duplicate project creation handled gracefully
   - [ ] Rate limit error suggests retry time

#### 7.2 Automated Tests (Future)

**File**: `web/src/__tests__/api.test.ts` (NEW)

```typescript
import { describe, it, expect, vi } from "vitest";
import { apiClient } from "@/lib/api";

describe("API Client", () => {
  it("should fetch modules", async () => {
    const modules = await apiClient.getModules();
    expect(modules).toBeInstanceOf(Array);
    expect(modules.length).toBeGreaterThan(0);
  });

  it("should create project", async () => {
    const response = await apiClient.createProject({
      moduleId: "stack",
      language: "TypeScript",
    });
    expect(response).toHaveProperty("id");
    expect(response).toHaveProperty("githubRepoUrl");
  });
});
```

---

## Quick Implementation Checklist

### Step 1: Backend Auth Migration (15-30 minutes)

**Critical files to update**:

1. ✅ `supabase/functions/projects/post.ts` - Change lines 14-17
2. ✅ `supabase/functions/projects/get.ts` - Change lines 5-8
3. ✅ `supabase/functions/submissions/index.ts` - Update auth check
4. ✅ Database migration - Run SQL to add foreign keys

**Pattern to apply everywhere**:

```typescript
// DELETE these lines:
const userId = req.headers.get("x-user-id");
if (!userId) return jsonResponse({ error: "Missing x-user-id header" }, 400);

// ADD these lines instead:
const authHeader = req.headers.get("Authorization");
if (!authHeader) return jsonResponse({ error: "Unauthorized" }, 401);

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_ANON_KEY") ?? "",
  { global: { headers: { Authorization: authHeader } } }
);

const {
  data: { user },
  error: authError,
} = await supabase.auth.getUser();
if (authError || !user) return jsonResponse({ error: "Unauthorized" }, 401);

const userId = user.id;
```

### Step 2: Frontend API Client (10 minutes)

1. ✅ Create `web/src/lib/api.ts` - Copy the full implementation from Phase 1
2. ✅ Delete `web/src/lib/user.ts` - No longer needed

### Step 3: Wire Up Frontend (30-45 minutes)

1. ✅ Update `web/src/pages/Challenges.tsx` - Fetch from API
2. ✅ Update `web/src/components/ChallengesGrid.tsx` - Accept props
3. ✅ Update `web/src/pages/ChallengeDetail.tsx` - Add project creation flow
4. ✅ Add loading states and error handling

**Total time: ~1-2 hours of focused work**

---

## Key Files to Modify

### Backend (Phase 0 - CRITICAL)

| File                                                | Type   | Changes                           |
| --------------------------------------------------- | ------ | --------------------------------- |
| `supabase/functions/projects/post.ts`               | MODIFY | Replace `x-user-id` with JWT auth |
| `supabase/functions/projects/get.ts`                | MODIFY | Replace `x-user-id` with JWT auth |
| `supabase/functions/submissions/index.ts`           | MODIFY | Replace `x-user-id` with JWT auth |
| `supabase/migrations/004_migrate_to_auth_users.sql` | NEW    | Foreign keys, RLS policies        |

### Frontend

| File                                      | Type   | Changes                                 |
| ----------------------------------------- | ------ | --------------------------------------- |
| `web/src/lib/api.ts`                      | NEW    | API client using Supabase Auth tokens   |
| `web/src/lib/user.ts`                     | DELETE | Remove legacy anonymous ID system       |
| `web/.env.local`                          | UPDATE | Add `VITE_API_URL` if not present       |
| `web/src/pages/Challenges.tsx`            | MODIFY | Fetch modules and projects from API     |
| `web/src/components/ChallengesGrid.tsx`   | MODIFY | Accept props, sync with database        |
| `web/src/pages/ChallengeDetail.tsx`       | MODIFY | Project creation, polling, timeline fix |
| `web/src/components/ChallengeInfo.tsx`    | MODIFY | Loading states, error display           |
| `web/src/components/ChallengeSidebar.tsx` | MODIFY | Display correct subchallenges           |

### Verification

| File                                  | Type   | Changes                               |
| ------------------------------------- | ------ | ------------------------------------- |
| `supabase/functions/modules/index.ts` | VERIFY | Ensure subchallenges match test files |

---

## API Endpoints Status

### ✅ Already Implemented

- `GET /projects` - List user's projects (needs auth migration)
- `POST /projects` - Create project (needs auth migration)
- `POST /submissions` - Submit test results (needs auth migration)
- `GET /modules` - List modules (may need auth)

### ⚠️ Needs Auth Migration

**All endpoints currently use `x-user-id` header** but need to be updated to use JWT tokens from Supabase Auth.

**Current authentication (OLD)**:

```typescript
const userId = req.headers.get("x-user-id");
if (!userId) {
  return jsonResponse({ error: "Missing x-user-id header" }, 400);
}
```

**Required authentication (NEW)**:

```typescript
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const authHeader = req.headers.get("Authorization");
if (!authHeader) {
  return jsonResponse({ error: "Unauthorized" }, 401);
}

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_ANON_KEY") ?? "",
  {
    global: {
      headers: { Authorization: authHeader },
    },
  }
);

const {
  data: { user },
  error: authError,
} = await supabase.auth.getUser();

if (authError || !user) {
  return jsonResponse({ error: "Unauthorized" }, 401);
}

const userId = user.id; // UUID from auth.users
```

### Frontend Request Changes

**Current (OLD)**:

```typescript
fetch(url, {
  headers: {
    "x-user-id": getUserId(), // localStorage-based ID
  },
});
```

**Required (NEW)**:

```typescript
const {
  data: { session },
} = await supabase.auth.getSession();

fetch(url, {
  headers: {
    Authorization: `Bearer ${session.access_token}`, // JWT token
  },
});
```

---

## Database Schema Updates

### Migration: Link to auth.users

**Migration**: `supabase/migrations/004_migrate_to_auth_users.sql`

```sql
-- Ensure projects.userId is UUID and references auth.users
ALTER TABLE projects
  ALTER COLUMN userId TYPE UUID USING userId::UUID,
  ADD CONSTRAINT fk_projects_user
    FOREIGN KEY (userId) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Update submissions if needed
ALTER TABLE submissions
  ALTER COLUMN userId TYPE UUID USING userId::UUID,
  ADD CONSTRAINT fk_submissions_user
    FOREIGN KEY (userId) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Update RLS policies to use auth.uid()
DROP POLICY IF EXISTS "Users can view own projects" ON projects;
DROP POLICY IF EXISTS "Users can create own projects" ON projects;
DROP POLICY IF EXISTS "Users can update own projects" ON projects;

CREATE POLICY "Users can view own projects"
  ON projects FOR SELECT
  USING (auth.uid() = userId);

CREATE POLICY "Users can create own projects"
  ON projects FOR INSERT
  WITH CHECK (auth.uid() = userId);

CREATE POLICY "Users can update own projects"
  ON projects FOR UPDATE
  USING (auth.uid() = userId);

-- Same for submissions
DROP POLICY IF EXISTS "Users can view own submissions" ON submissions;
DROP POLICY IF EXISTS "Users can create own submissions" ON submissions;

CREATE POLICY "Users can view own submissions"
  ON submissions FOR SELECT
  USING (auth.uid() = (SELECT userId FROM projects WHERE id = projectId));

CREATE POLICY "Users can create own submissions"
  ON submissions FOR INSERT
  WITH CHECK (auth.uid() = (SELECT userId FROM projects WHERE id = projectId));
```

### Existing Columns (Already Present)

✅ `currentChallengeIndex` - Already added in previous migrations
✅ `projectToken` - Already added in previous migrations

---

## Security Considerations

### Authentication & Authorization

1. **Supabase Auth (✅ Implemented)**:

   - Frontend uses email/password authentication via Supabase Auth
   - JWT tokens stored in localStorage with auto-refresh
   - Sessions persist across browser sessions
   - Protected routes redirect unauthenticated users to `/login`

2. **Backend JWT Verification (⚠️ NEEDS IMPLEMENTATION)**:

   - All backend functions must validate JWT tokens
   - Use `supabase.auth.getUser()` to verify tokens
   - Extract `user.id` (UUID) from verified token
   - **CRITICAL**: Do not trust client-provided user IDs

3. **Row Level Security (RLS)**:

   - Enable RLS on all tables (`projects`, `submissions`)
   - Policies must use `auth.uid()` to verify ownership
   - Users can only access their own data
   - Foreign key constraints ensure data integrity

4. **Project Tokens**:
   - Used by CLI to authenticate submissions
   - Stored in `dsa.config.json` (in user's local repo)
   - Should be kept secret and never committed to GitHub
   - Backend validates project token + user ID match

### API Security

5. **Rate Limiting**:

   - Implement rate limiting on all endpoints
   - Prevent abuse of GitHub API (repo creation)
   - Consider user-based limits (e.g., max 5 projects per hour)
   - Use Supabase Edge Functions rate limiting or Cloudflare

6. **CORS**:

   - Already configured in `_shared/cors.ts`
   - Verify allowed origins match deployment URLs
   - Update for production domains

7. **Environment Variables**:
   - Never expose `SUPABASE_SERVICE_ROLE_KEY` in frontend
   - Only use `SUPABASE_ANON_KEY` in client-side code
   - Validate all env vars are set in Edge Functions

### GitHub Integration Security

8. **GitHub App Permissions**:

   - App has access to create repositories
   - Limit installation to specific organization
   - Regularly audit created repositories
   - Consider webhook verification for submissions

9. **Repository Naming**:
   - Use authenticated `user.id` in repo names
   - Prevents collisions and ensures uniqueness
   - Format: `{userId}-{moduleId}-{language-suffix}`

---

## Performance Optimizations

1. **Caching**:

   - Cache module data in localStorage (refresh every 24h)
   - Use SWR or React Query for automatic cache management

2. **Lazy Loading**:

   - Code-split challenge detail pages
   - Lazy load language-specific content

3. **Optimistic Updates**:

   - Show progress updates immediately
   - Sync with backend in background

4. **Debouncing**:
   - Debounce polling requests
   - Implement exponential backoff

---

## Migration Strategy: Anonymous to Authenticated Users

### Current State Problem

**Before authentication was implemented**:

- Frontend generated anonymous IDs: `user_<timestamp>_<random>`
- Stored in localStorage as `dsa-lab-user-id`
- Backend expected these IDs in `x-user-id` header
- No way to recover data if localStorage was cleared

**After authentication implementation**:

- Users now sign up with email/password via Supabase Auth
- Each user gets a UUID from `auth.users` table
- Old anonymous IDs are orphaned in localStorage
- Old projects in database may have TEXT userIds instead of UUIDs

### Migration Options

#### Option 1: Clean Slate (Recommended for Beta/Testing)

**When to use**: If you have minimal users or are in testing phase

1. Clear all existing projects from database
2. Update schema to enforce UUID foreign keys
3. Remove `lib/user.ts` completely
4. Users must sign up and create new projects

**Pros**:

- Clean architecture
- No legacy data issues
- Simpler implementation

**Cons**:

- Existing users lose progress
- Need to communicate change clearly

#### Option 2: Data Migration (For Production)

**When to use**: If you have real users with valuable progress

1. Add a migration UI for existing users:

   - On first login, check localStorage for old `dsa-lab-user-id`
   - Look up projects with that TEXT userId in database
   - Offer to migrate those projects to new authenticated user
   - Update `userId` from TEXT to UUID (their auth.users.id)

2. Implementation:

```typescript
// In AuthProvider or a migration component
useEffect(() => {
  async function migrateOldProjects() {
    const oldUserId = localStorage.getItem("dsa-lab-user-id");
    const { user } = await supabase.auth.getUser();

    if (user && oldUserId && oldUserId !== user.id) {
      // Call migration endpoint
      await fetch("/migrations/migrate-projects", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ oldUserId }),
      });

      // Clear old ID
      localStorage.removeItem("dsa-lab-user-id");
    }
  }

  migrateOldProjects();
}, [user]);
```

**Pros**:

- Users keep their progress
- Better user experience

**Cons**:

- More complex implementation
- Need additional backend endpoint
- Risk of duplicate projects

#### Option 3: Parallel Systems (Not Recommended)

Support both old and new auth simultaneously. **This is not recommended** as it adds significant complexity and security risks.

### Recommended Approach

**For this project**: Use **Option 1 (Clean Slate)**

Reasons:

1. Project appears to be in development/hackathon phase
2. Cleaner architecture without legacy baggage
3. Faster to implement
4. Auth was just added, likely few real users

**Communication to users**:

- Add a banner: "We've upgraded to secure authentication! Please sign up to continue."
- Document in README that this is a breaking change
- Consider exporting project URLs before migration so users can manually track them

## Future Enhancements

1. **Supabase Realtime**: Replace polling with WebSocket subscriptions for live progress updates
2. **OAuth Providers**: Add GitHub, Google OAuth for easier sign up
3. **Email Verification**: Enable email confirmation for new accounts
4. **Password Reset**: Implement forgot password flow
5. **Project History**: Show submission timeline with commit links
6. **Leaderboard**: Track fastest completion times per challenge
7. **AI Hints**: Integrate AI to provide debugging hints based on test failures
8. **Mobile App**: React Native version with offline support
9. **IDE Integration**: VSCode extension for in-editor testing
10. **Social Features**: Share progress, compare solutions with friends

---

## Rollback Plan

If issues arise during deployment:

1. **Frontend Rollback**:

   - Revert to hardcoded module data
   - Disable API calls via feature flag
   - Keep localStorage-only progress tracking

2. **Backend Rollback**:

   - Keep old endpoints running
   - Use Supabase migration rollback
   - Restore database from backup

3. **Gradual Rollout**:
   - Use feature flags to enable for 10% of users
   - Monitor error rates
   - Gradually increase to 100%

---

## Success Metrics

1. **Technical**:

   - API response time < 500ms (p95)
   - Project creation success rate > 95%
   - Frontend error rate < 1%

2. **User Experience**:

   - Time to create first project < 30 seconds
   - Progress sync delay < 15 seconds
   - Zero manual config updates required

3. **Adoption**:
   - 50% of users complete at least one challenge
   - Average of 3 challenges attempted per user
   - 80% return rate for second challenge

---

## Support & Troubleshooting

### Common Issues

1. **"Failed to fetch modules"**:

   - Check API URL in `.env.local`
   - Verify CORS headers
   - Check Supabase function deployment

2. **"Invalid project token"**:

   - Ensure `dsa.config.json` has correct token
   - Verify token matches database entry
   - Check if project was deleted

3. **Progress not syncing**:

   - Check polling interval
   - Verify `/submissions` endpoint receives data
   - Inspect browser network tab for failed requests

4. **GitHub repo creation fails**:
   - Check GitHub App installation
   - Verify template repository exists
   - Ensure GitHub API rate limit not exceeded

### Debug Tools

```typescript
// Enable debug logging
localStorage.setItem("dsa-lab-debug", "true");

// View all user data
console.log("User ID:", getUserId());
console.log("Progress:", getAllChallengeProgress());

// Test API connection
apiClient.getModules().then(console.log).catch(console.error);
```

---

## Conclusion

This updated plan provides a comprehensive roadmap to fully integrate the DSA Lab frontend with the backend API and CLI tools, **accounting for the new Supabase Auth implementation**.

### Key Takeaways

1. **Authentication is already implemented** ✅

   - Supabase Auth with email/password
   - Protected routes with JWT tokens
   - Session management and persistence

2. **Critical missing piece**: Backend auth migration 🚨

   - **Phase 0 is mandatory** before frontend integration
   - Backend must migrate from `x-user-id` headers to JWT verification
   - Database schema needs foreign key constraints to `auth.users`

3. **Frontend needs API client**:

   - Create `lib/api.ts` with JWT token headers
   - Remove legacy `lib/user.ts` anonymous ID system
   - Integrate with existing Supabase client

4. **Migration strategy**: Clean slate approach recommended
   - Clear existing test data
   - Enforce proper authentication from day 1
   - Communicate breaking change to users

### What's Actually Needed (Quick Action Plan)

This is **NOT a multi-week project**. It's 3 straightforward steps that can be done in ~1-2 hours:

**Step 1: Backend Auth (15-30 min)** - Update 3 files with same pattern:

- `supabase/functions/projects/post.ts`
- `supabase/functions/projects/get.ts`
- `supabase/functions/submissions/index.ts`

Replace: `req.headers.get('x-user-id')` → JWT verification with `supabase.auth.getUser()`

**Step 2: Frontend API Client (10 min)** - Create 1 file, delete 1 file:

- Create: `web/src/lib/api.ts` (copy from Phase 1 section above)
- Delete: `web/src/lib/user.ts` (legacy anonymous ID system)

**Step 3: Connect Frontend (30-45 min)** - Update 3 components:

- `Challenges.tsx` - Fetch modules from API
- `ChallengesGrid.tsx` - Accept props, fetch projects
- `ChallengeDetail.tsx` - Call create project API

**Total time: ~1-2 hours of find-and-replace + copy-paste**

### Why This Is Quick

- ✅ Auth system already fully implemented
- ✅ Backend endpoints already exist
- ✅ Frontend UI already built
- ✅ Just connecting existing pieces with JWT tokens
- ✅ Most changes follow the same pattern

---

## Updated Architecture Summary

```
┌─────────────────────────────────────────────────────────┐
│                    Authentication Flow                   │
└─────────────────────────────────────────────────────────┘
                           │
    User → Login/Signup → Supabase Auth → JWT Token
                           │
                    Frontend (React)
                           │
            ┌──────────────┼──────────────┐
            │              │              │
     localStorage    Auth Context    Protected Routes
     (JWT token)    (user state)    (/challenges, etc)
                           │
                    API Client (lib/api.ts)
                           │
          Authorization: Bearer <JWT token>
                           │
              ┌────────────┼────────────┐
              │            │            │
       Supabase Edge Functions (Backend)
       │            │                  │
    Projects    Submissions        Modules
       │            │                  │
    JWT Auth → supabase.auth.getUser()
       │            │                  │
    user.id (UUID from auth.users)
       │            │                  │
       └────────────┼──────────────────┘
                    │
              Database (PostgreSQL)
                    │
        projects (userId → auth.users.id)
        submissions (via project FK)
                    │
              RLS Policies (auth.uid())
```

---

## Appendix: API Response Examples

### GET /modules

```json
[
  {
    "id": "stack",
    "title": "Build a Stack",
    "level": "Beginner",
    "summary": "Implement push, pop, peek, size.",
    "subchallenges": ["Create class", "push()", "pop()", "peek()", "size()"],
    "template": "template-dsa-stack",
    "languages": ["TypeScript", "JavaScript", "Python", "Java", "C++", "Go"]
  }
]
```

### POST /projects

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "githubRepoUrl": "https://github.com/dsa-lab/user123-stack-java",
  "status": "in_progress",
  "progress": 0
}
```

### GET /projects

```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "userId": "user_1234567890_abc123",
    "moduleId": "stack",
    "language": "Java",
    "githubRepoUrl": "https://github.com/dsa-lab/user123-stack-java",
    "status": "in_progress",
    "progress": 40,
    "currentChallengeIndex": 2,
    "createdAt": "2025-11-08T12:00:00Z",
    "updatedAt": "2025-11-08T12:30:00Z"
  }
]
```

### POST /submissions

```json
{
  "id": "456e7890-e89b-12d3-a456-426614174001",
  "createdAt": "2025-11-08T12:35:00Z",
  "projectUpdated": true,
  "progress": 60,
  "status": "in_progress",
  "currentChallengeIndex": 3,
  "challengeUnlocked": true,
  "allCompleted": false
}
```
