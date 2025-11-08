# Meaningful Repository Names Update

## ✅ Changes Completed

### 1. Backend Changes (`supabase/functions/projects/post.ts`)

**What Changed:**
- Repository names now use meaningful format: `{username}-{module}-{number}`
- Username is extracted from user's email address
- Projects are numbered sequentially (1, 2, 3...)

**Example Repository Names:**
- **Before:** `63d637d5-43e8-4382-a6ef-f6b5269df7bc-stack-py`
- **After:** `tahamoula-stack-1`, `tahamoula-stack-2`, `tahamoula-queue-1`

**How It Works:**
```typescript
// Extract username from email (e.g., john.doe@example.com -> john-doe)
const emailUsername = user.email.split('@')[0];
const repoUsername = emailUsername.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();

// Count existing projects to create unique names
const projectNumber = (count || 0) + 1;
const newRepoName = `${repoUsername}-${moduleId}-${projectNumber}`;
```

### 2. Frontend Changes

#### A. `web/src/components/ChallengeInfo.tsx`
- Added "**+ New Attempt**" button in the existing repo section
- Button text changes to "**Create New Attempt**" when a repo already exists
- Shows helpful message: "You already have a repository. Click below to create a new attempt with a different repo."

#### B. `web/src/pages/ChallengeDetail.tsx`
- Added `handleNewAttempt()` function to navigate back to language selection
- Improved logic to detect if user has made real progress
- Allows creating multiple projects for the same challenge

### 3. User Experience

**Before:**
- User clicks "Start" → Gets repo with UUID name
- If they try again, nothing happens or shows error
- Confusing repository names

**After:**
- User clicks "Start" → Gets `tahamoula-stack-1`
- User can click "+ New Attempt" → Gets `tahamoula-stack-2`
- Clear, meaningful names that show who, what, and which attempt

---

## 🚀 Deployment Instructions

### Step 1: Deploy Backend (Supabase Functions)

Open a **regular terminal** (outside Cursor) and run:

```bash
# Option A: Login with browser
supabase login

# OR Option B: Use access token
export SUPABASE_ACCESS_TOKEN=your_token_here
# Get token from: https://app.supabase.com/account/tokens
```

Then deploy:

```bash
cd /Users/tahamoula/Desktop/dsa-teacher
supabase functions deploy projects --project-ref mwlhxwbkuumjxpnvldli
```

**Expected Output:**
```
✓ Packaged Edge Function projects successfully
✓ Deployed Edge Function projects successfully
```

### Step 2: Deploy Frontend

```bash
cd /Users/tahamoula/Desktop/dsa-teacher/web
pnpm build
# Then deploy your built frontend to your hosting service
```

---

## 🧪 Testing

After deployment:

1. **Go to a challenge page** (e.g., Stack challenge)
2. **Select a language** (Python, JavaScript, etc.)
3. **Click "Start with {Language}"**
4. **Check the repo name** - should be `tahamoula-{challenge}-1`
5. **Click "+ New Attempt"** button (appears next to "Get Started")
6. **Select language again** and click "Create New Attempt"
7. **Check second repo name** - should be `tahamoula-{challenge}-2`

---

## 📝 What Happens to Existing Repos?

**Old repositories are NOT renamed.** They keep their UUID-based names:
- `63d637d5-43e8-4382-a6ef-f6b5269df7bc-stack-py` (stays as is)

**Only NEW repositories** created after deployment will have meaningful names:
- `tahamoula-stack-1`
- `tahamoula-stack-2`
- etc.

---

## 🔧 Technical Details

### Backend Logic (`post.ts` lines 227-247)

1. Extracts username from user's email
2. Converts to GitHub-friendly format (alphanumeric + hyphens)
3. Counts existing projects for this user + module
4. Generates name: `{username}-{module}-{count+1}`

### Frontend Flow

1. **User has no project:** Shows language picker → "Start with {Language}"
2. **User has project (no progress):** Shows repo + language picker → "Create New Attempt"
3. **User has project (with progress):** Shows repo + progress + "+ New Attempt" button
4. **Clicking "+ New Attempt":** Returns to language selection step

---

## 🐛 Potential Issues & Solutions

### Issue 1: "Repository already exists"
**Cause:** Database count doesn't match actual GitHub repos
**Solution:** The backend will auto-increment and try the next number

### Issue 2: Button doesn't appear
**Cause:** Frontend not deployed
**Solution:** Rebuild and redeploy the web app

### Issue 3: Still seeing UUID names
**Cause:** Backend not deployed
**Solution:** Deploy the Supabase Edge Function

---

## 📞 Support

If something doesn't work:

1. Check Supabase Edge Function logs:
   - https://supabase.com/dashboard/project/mwlhxwbkuumjxpnvldli/logs/edge-functions

2. Check browser console for frontend errors

3. Verify deployment:
   ```bash
   supabase functions list --project-ref mwlhxwbkuumjxpnvldli
   ```

---

## ✨ Benefits

- **User-Friendly:** Clear, readable repository names
- **Organized:** Easy to track multiple attempts
- **Professional:** No more random UUIDs in repo names
- **Flexible:** Users can create unlimited attempts

