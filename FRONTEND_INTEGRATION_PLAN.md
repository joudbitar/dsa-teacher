# Frontend Integration Plan: Connecting CLI, API, and UI

## Executive Summary

This document provides a comprehensive plan to fully integrate the DSA Lab frontend with the backend API, CLI tools, and GitHub repository generation system. The goal is to create a seamless user experience where:

1. **Challenges page** displays language-agnostic challenge cards
2. **Challenge detail page** allows language selection
3. **"Start with [Language]" button** triggers API to create GitHub repo
4. **Modal displays** the clone command with copy functionality
5. **"Continue to Challenge" button** advances to step-by-step subchallenges
6. **Project timeline** shows actual subchallenges from module data (not hardcoded steps)
7. **Real-time progress tracking** syncs between CLI submissions and frontend

---

## Current State Analysis

### ✅ What's Working

#### Frontend

- **Challenge Grid** (`ChallengesGrid.tsx`): Displays all 12 modules with progress tracking via localStorage
- **Challenge Detail Page** (`ChallengeDetail.tsx`): Language picker, step navigation, progress tracking
- **Language Picker** (`LanguagePicker.tsx`): 6 languages (TypeScript, Python, JavaScript, Go, Java, C++)
- **Challenge Data** (`/data/challenges/`): Rich content for each module (description, steps, benefits)
- **Progress Tracking** (`challengeProgress.ts`): localStorage-based progress with custom events
- **Modal UX**: Repository creation modal with copy command

#### Backend

- **`POST /projects`** (`supabase/functions/projects/post.ts`): Creates GitHub repo from template, commits `dsa.config.json`
- **`POST /submissions`** (`supabase/functions/submissions/index.ts`): Receives test results, updates project progress
- **`GET /modules`** (`supabase/functions/modules/index.ts`): Returns available modules
- **GitHub App Integration**: Authenticated repo creation via Octokit
- **Database Schema**: `projects` and `submissions` tables with proper indexing

#### CLI

- **`dsa test`** (`cli/src/commands/test.ts`): Runs tests, auto-unlocks next challenge
- **`dsa submit`** (`cli/src/commands/submit.ts`): Submits results to API
- **Auto-unlock Logic**: Test runners (Java, Python, Go, JS) automatically increment `currentChallengeIndex` in `dsa.config.json`

### ❌ What's Missing

1. **No API calls from frontend** - Currently uses mock data and localStorage only
2. **No user identification system** - Missing `x-user-id` header generation
3. **Hardcoded subchallenges** - `ChallengesGrid.tsx` has static arrays instead of API data
4. **Progress sync gap** - Frontend progress (localStorage) doesn't sync with backend (database)
5. **No project status checking** - Can't detect if user already has a project for a module
6. **Missing GET /projects call** - Frontend doesn't fetch existing projects
7. **Timeline mismatch** - Challenge detail sidebar shows wrong subchallenges (from `steps` not `subchallenges`)
8. **No error handling** - Missing feedback for API failures, rate limits, GitHub errors
9. **No loading states** - Button clicks have no loading indicators
10. **Missing project association** - Created repos aren't linked back to frontend state

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

### Phase 1: User Identification & API Client Setup

#### 1.1 Create User ID Management

**File**: `web/src/lib/user.ts` (NEW)

```typescript
// Generate or retrieve anonymous user ID
export function getUserId(): string {
  const STORAGE_KEY = "dsa-lab-user-id";
  let userId = localStorage.getItem(STORAGE_KEY);

  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    localStorage.setItem(STORAGE_KEY, userId);
  }

  return userId;
}

// Clear user ID (for debugging/logout)
export function clearUserId(): void {
  localStorage.removeItem("dsa-lab-user-id");
}
```

#### 1.2 Create API Client

**File**: `web/src/lib/api.ts` (NEW)

```typescript
import { getUserId } from "./user";

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

  private getHeaders(): HeadersInit {
    return {
      "Content-Type": "application/json",
      "x-user-id": getUserId(),
    };
  }

  // GET /modules
  async getModules(): Promise<Module[]> {
    const response = await fetch(`${this.baseUrl}/modules`, {
      method: "GET",
      headers: this.getHeaders(),
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
      headers: this.getHeaders(),
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
      headers: this.getHeaders(),
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
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch project: ${response.statusText}`);
    }

    return response.json();
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
```

#### 1.3 Environment Variables

**File**: `web/.env.local` (NEW)

```bash
VITE_API_URL=https://mwlhxwbkuumjxpnvldli.supabase.co/functions/v1
```

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

## Implementation Timeline

### Week 1: Foundation

- Day 1-2: Implement user ID system, API client
- Day 3-4: Update Challenges page to fetch from API
- Day 5: Update ChallengesGrid to use API data

### Week 2: Core Integration

- Day 6-7: Implement project creation flow
- Day 8-9: Fix timeline/sidebar subchallenges
- Day 10: Add loading states and error handling

### Week 3: Polish & Sync

- Day 11-12: Implement progress polling
- Day 13: Add refresh mechanism
- Day 14: Manual testing and bug fixes

### Week 4: Testing & Deployment

- Day 15-16: End-to-end testing
- Day 17: Performance optimization
- Day 18: Documentation and deployment

---

## Key Files to Modify

| File                                      | Type   | Changes                                 |
| ----------------------------------------- | ------ | --------------------------------------- |
| `web/src/lib/user.ts`                     | NEW    | User ID management                      |
| `web/src/lib/api.ts`                      | NEW    | API client with TypeScript types        |
| `web/.env.local`                          | NEW    | Environment variables                   |
| `web/src/pages/Challenges.tsx`            | MODIFY | Fetch modules from API                  |
| `web/src/components/ChallengesGrid.tsx`   | MODIFY | Accept modules prop, fetch progress     |
| `web/src/pages/ChallengeDetail.tsx`       | MODIFY | Project creation, polling, timeline fix |
| `web/src/components/ChallengeInfo.tsx`    | MODIFY | Loading states, error display           |
| `web/src/components/ChallengeSidebar.tsx` | MODIFY | Display correct subchallenges           |
| `supabase/functions/projects/get.ts`      | NEW    | Implement GET endpoint                  |
| `supabase/functions/modules/index.ts`     | VERIFY | Ensure subchallenges match test files   |

---

## API Endpoints Required

### ✅ Already Implemented

- `POST /projects` - Create project
- `POST /submissions` - Submit test results
- `GET /modules` - List modules

### ⚠️ Missing (Need Implementation)

- `GET /projects` - List user's projects
- `GET /projects/:id` - Get single project details

**Implementation**: Create `supabase/functions/projects/get.ts`

```typescript
import { getSupabaseClient } from "../_shared/supabase.ts";
import { jsonResponse } from "../_shared/cors.ts";

export async function handleGet(req: Request): Promise<Response> {
  const userId = req.headers.get("x-user-id");

  if (!userId) {
    return jsonResponse({ error: "Missing x-user-id header" }, 400);
  }

  const url = new URL(req.url);
  const moduleId = url.searchParams.get("moduleId");

  const supabase = getSupabaseClient();

  let query = supabase
    .from("projects")
    .select("*")
    .eq("userId", userId)
    .order("updatedAt", { ascending: false });

  if (moduleId) {
    query = query.eq("moduleId", moduleId);
  }

  const { data: projects, error } = await query;

  if (error) {
    console.error("Database error:", error);
    return jsonResponse({ error: "Failed to fetch projects" }, 500);
  }

  return jsonResponse(projects, 200);
}
```

---

## Database Schema Updates

### Add `currentChallengeIndex` Column

**Migration**: `supabase/migrations/003_add_current_challenge_index.sql`

```sql
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS currentChallengeIndex INTEGER NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_projects_currentChallengeIndex
ON projects(currentChallengeIndex);
```

### Add `projectToken` Column (Already Exists)

✅ Already added in previous migrations

---

## Security Considerations

1. **Anonymous User IDs**:

   - Currently using localStorage-based IDs
   - Future: Migrate to Supabase Auth for proper authentication

2. **Project Token**:

   - Used by CLI to authenticate submissions
   - Should be kept secret (not exposed in frontend)

3. **Rate Limiting**:

   - Implement rate limiting on `/projects` endpoint
   - Prevent abuse of GitHub API

4. **CORS**:
   - Already configured in `_shared/cors.ts`
   - Verify allowed origins

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

## Future Enhancements

1. **Supabase Realtime**: Replace polling with WebSocket subscriptions
2. **Authentication**: Migrate from anonymous IDs to Supabase Auth
3. **Project History**: Show submission timeline with commit links
4. **Leaderboard**: Track fastest completion times
5. **AI Hints**: Integrate AI to provide debugging hints
6. **Mobile App**: React Native version with offline support
7. **IDE Integration**: VSCode extension for in-editor testing

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

This plan provides a comprehensive roadmap to fully integrate the DSA Lab frontend with the backend API and CLI tools. The phased approach ensures:

1. **Minimal disruption** to existing functionality
2. **Incremental validation** at each step
3. **Rollback capability** if issues arise
4. **Clear success metrics** for measuring progress

Estimated total implementation time: **3-4 weeks** with 1-2 developers.

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
