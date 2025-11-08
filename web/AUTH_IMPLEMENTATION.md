# Authentication Implementation Guide

This guide provides the folder structure and step-by-step instructions for implementing authentication in the DSA Lab web application using Supabase Auth.

## 📁 Folder Structure

After implementation, your authentication-related files should be organized as follows:

```
web/src/
├── auth/
│   ├── AuthContext.tsx          # Auth context provider
│   ├── AuthProvider.tsx         # Wrapper component for auth state
│   ├── useAuth.ts               # Custom hook for accessing auth state
│   └── types.ts                 # Auth-related TypeScript types
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx        # Login form component
│   │   ├── SignupForm.tsx       # Signup form component
│   │   ├── AuthModal.tsx        # Modal wrapper for auth forms
│   │   └── ProtectedRoute.tsx   # Route protection component
│   └── Navbar.tsx               # (Update existing - add auth buttons)
├── pages/
│   ├── Login.tsx                # Login page (optional, if not using modal)
│   ├── Signup.tsx               # Signup page (optional, if not using modal)
│   └── Profile.tsx              # User profile page
├── lib/
│   └── supabase.ts              # Supabase client configuration
└── App.tsx                       # (Update - add AuthProvider and protected routes)
```

## 🚀 Implementation Steps

### Step 1: Install Dependencies

```bash
cd web
pnpm add @supabase/supabase-js @supabase/auth-helpers-react
```

### Step 2: Configure Supabase Client

Create `web/src/lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})
```

### Step 3: Create Environment Variables

Create or update `web/.env.local`:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**How to get these values:**
1. Go to your Supabase project dashboard
2. Navigate to Settings → API
3. Copy the "Project URL" and "anon public" key

### Step 4: Create Auth Types

Create `web/src/auth/types.ts`:

```typescript
import { User, Session } from '@supabase/supabase-js'

export interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: any }>
}
```

### Step 5: Create Auth Context

Create `web/src/auth/AuthContext.tsx`:

```typescript
import { createContext, useContext } from 'react'
import { AuthContextType } from './types'

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}
```

### Step 6: Create Auth Provider

Create `web/src/auth/AuthProvider.tsx`:

```typescript
import { useState, useEffect, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { AuthContext } from './AuthContext'
import { AuthContextType } from './types'

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })
    return { error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    return { error }
  }

  const value: AuthContextType = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
```

### Step 7: Create useAuth Hook

Create `web/src/auth/useAuth.ts`:

```typescript
import { useAuthContext } from './AuthContext'

export function useAuth() {
  return useAuthContext()
}
```

### Step 8: Create Auth Components

Create `web/src/components/auth/LoginForm.tsx`:

```typescript
import { useState } from 'react'
import { useAuth } from '../../auth/useAuth'

interface LoginFormProps {
  onSuccess?: () => void
  onSwitchToSignup?: () => void
}

export function LoginForm({ onSuccess, onSwitchToSignup }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error } = await signIn(email, password)

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      onSuccess?.()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded-lg"
          style={{ borderColor: '#171512' }}
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-1">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded-lg"
          style={{ borderColor: '#171512' }}
        />
      </div>
      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 px-4 rounded-lg font-semibold transition-colors"
        style={{
          backgroundColor: '#171512',
          color: '#F0ECDA',
          fontFamily: 'JetBrains Mono, monospace',
        }}
      >
        {loading ? 'Logging in...' : 'Log in'}
      </button>
      {onSwitchToSignup && (
        <button
          type="button"
          onClick={onSwitchToSignup}
          className="w-full text-sm text-center"
          style={{ color: '#171512' }}
        >
          Don't have an account? Sign up
        </button>
      )}
    </form>
  )
}
```

Create `web/src/components/auth/SignupForm.tsx`:

```typescript
import { useState } from 'react'
import { useAuth } from '../../auth/useAuth'

interface SignupFormProps {
  onSuccess?: () => void
  onSwitchToLogin?: () => void
}

export function SignupForm({ onSuccess, onSwitchToLogin }: SignupFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const { signUp } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    const { error } = await signUp(email, password)

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
      // Note: Supabase may require email confirmation
      setTimeout(() => {
        onSuccess?.()
      }, 2000)
    }
  }

  if (success) {
    return (
      <div className="text-center space-y-4">
        <div className="text-green-600">
          Account created! Check your email to confirm your account.
        </div>
        {onSwitchToLogin && (
          <button
            onClick={onSwitchToLogin}
            className="text-sm underline"
            style={{ color: '#171512' }}
          >
            Go to login
          </button>
        )}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded-lg"
          style={{ borderColor: '#171512' }}
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-1">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="w-full px-3 py-2 border rounded-lg"
          style={{ borderColor: '#171512' }}
        />
      </div>
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength={6}
          className="w-full px-3 py-2 border rounded-lg"
          style={{ borderColor: '#171512' }}
        />
      </div>
      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 px-4 rounded-lg font-semibold transition-colors"
        style={{
          backgroundColor: '#171512',
          color: '#F0ECDA',
          fontFamily: 'JetBrains Mono, monospace',
        }}
      >
        {loading ? 'Creating account...' : 'Sign up'}
      </button>
      {onSwitchToLogin && (
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="w-full text-sm text-center"
          style={{ color: '#171512' }}
        >
          Already have an account? Log in
        </button>
      )}
    </form>
  )
}
```

Create `web/src/components/auth/AuthModal.tsx`:

```typescript
import { useState } from 'react'
import { X } from 'lucide-react'
import { LoginForm } from './LoginForm'
import { SignupForm } from './SignupForm'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialMode?: 'login' | 'signup'
}

export function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className="bg-white rounded-lg p-6 w-full max-w-md relative"
        style={{ backgroundColor: '#F0ECDA' }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4"
          style={{ color: '#171512' }}
        >
          <X className="h-5 w-5" />
        </button>
        <h2 className="text-2xl font-bold mb-4" style={{ color: '#171512' }}>
          {mode === 'login' ? 'Log in' : 'Sign up'}
        </h2>
        {mode === 'login' ? (
          <LoginForm
            onSuccess={onClose}
            onSwitchToSignup={() => setMode('signup')}
          />
        ) : (
          <SignupForm
            onSuccess={onClose}
            onSwitchToLogin={() => setMode('login')}
          />
        )}
      </div>
    </div>
  )
}
```

Create `web/src/components/auth/ProtectedRoute.tsx`:

```typescript
import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../auth/useAuth'

interface ProtectedRouteProps {
  children: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading...</div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
```

### Step 9: Update App.tsx

Update `web/src/App.tsx` to wrap routes with AuthProvider:

```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './auth/AuthProvider'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { Landing } from './pages/Landing'
import { Challenges } from './pages/Challenges'
import { Docs } from './pages/Docs'
import { ChallengeDetail } from './pages/ChallengeDetail'
import { About } from './pages/About'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<About />} />
          <Route
            path="/challenges"
            element={
              <ProtectedRoute>
                <Challenges />
              </ProtectedRoute>
            }
          />
          <Route
            path="/challenges/:id"
            element={
              <ProtectedRoute>
                <ChallengeDetail />
              </ProtectedRoute>
            }
          />
          <Route path="/docs" element={<Docs />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
```

### Step 10: Update Navbar Component

Update `web/src/components/Navbar.tsx` to include auth functionality:

```typescript
import { Link } from 'react-router-dom'
import { Code2, User, LogOut } from 'lucide-react'
import { useAuth } from '../auth/useAuth'
import { useState } from 'react'
import { AuthModal } from './auth/AuthModal'

export function Navbar({ className }: { className?: string }) {
  const { user, signOut } = useAuth()
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login')

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <>
      <nav 
        className={`sticky top-0 z-50 ${className || ''}`}
        style={{ 
          backgroundColor: '#F0ECDA'
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            {/* ... existing logo and nav links ... */}
            
            {/* Right: Auth Buttons */}
            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors hover:opacity-80"
                    style={{ color: '#171512' }}
                  >
                    <User className="h-4 w-4" />
                    <span className="text-sm" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                      {user.email}
                    </span>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-colors hover:opacity-80"
                    style={{ 
                      borderColor: '#171512', 
                      color: '#171512',
                      fontFamily: 'JetBrains Mono, monospace'
                    }}
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setAuthMode('login')
                      setAuthModalOpen(true)
                    }}
                    className="inline-flex items-center justify-center rounded-lg border-2 bg-transparent px-4 py-2 text-sm font-semibold transition-colors hover:opacity-80"
                    style={{ 
                      borderColor: '#171512', 
                      color: '#171512',
                      fontFamily: 'JetBrains Mono, monospace'
                    }}
                  >
                    Log in
                  </button>
                  <button
                    onClick={() => {
                      setAuthMode('signup')
                      setAuthModalOpen(true)
                    }}
                    className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-bold transition-colors hover:opacity-90"
                    style={{ 
                      backgroundColor: '#171512', 
                      color: '#F0ECDA',
                      fontFamily: 'JetBrains Mono, monospace'
                    }}
                  >
                    Sign up
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />
    </>
  )
}
```

### Step 11: Update Database Schema

Update your database to use Supabase Auth UUIDs instead of TEXT userIds.

**Important:** You'll need to migrate the `userId` column from `TEXT` to `UUID` and link it to `auth.users`:

```sql
-- Migration: Update projects table to use auth.users
-- Run this in Supabase SQL Editor

-- Step 1: Add new UUID column
ALTER TABLE projects ADD COLUMN userId_uuid UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Step 2: Migrate existing data (if any)
-- Note: This assumes existing userId TEXT values are UUIDs
UPDATE projects SET userId_uuid = userId::UUID WHERE userId ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

-- Step 3: Drop old column and rename new one
ALTER TABLE projects DROP COLUMN userId;
ALTER TABLE projects RENAME COLUMN userId_uuid TO userId;
ALTER TABLE projects ALTER COLUMN userId SET NOT NULL;

-- Step 4: Update RLS policies (they should already reference auth.uid())
-- Verify these policies exist:
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- If policies don't exist, create them:
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

### Step 12: Update API Functions

Update your Supabase Edge Functions to use authenticated user IDs:

In `supabase/functions/projects/post.ts` and other functions, ensure you're getting the user from the JWT:

```typescript
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

export async function handlePost(req: Request): Promise<Response> {
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
    })
  }

  const token = authHeader.replace('Bearer ', '')
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    {
      global: {
        headers: { Authorization: authHeader },
      },
    }
  )

  const { data: { user }, error: authError } = await supabase.auth.getUser(token)
  
  if (authError || !user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
    })
  }

  // Use user.id instead of userId from request body
  // ... rest of your logic
}
```

### Step 13: Update CLI to Use Auth Tokens

Update the CLI to send authentication tokens with requests. You'll need to:

1. Store the auth token after login
2. Include it in API requests
3. Update `cli/src/lib/http.ts` to add Authorization header

## 🔐 Supabase Dashboard Configuration

1. **Enable Email Auth:**
   - Go to Authentication → Providers
   - Enable "Email" provider
   - Configure email templates if needed

2. **Configure Email Settings:**
   - Go to Authentication → Settings
   - Set up SMTP or use Supabase's default email service
   - Configure redirect URLs (add your app URL)

3. **Set up RLS Policies:**
   - Ensure Row Level Security is enabled on `projects` and `submissions` tables
   - Verify policies match the ones in Step 11

## ✅ Testing Checklist

- [ ] User can sign up with email/password
- [ ] User receives confirmation email (if enabled)
- [ ] User can log in
- [ ] User can log out
- [ ] Protected routes redirect to home if not authenticated
- [ ] Authenticated user can access protected routes
- [ ] User data is correctly associated with auth.uid()
- [ ] RLS policies prevent users from accessing other users' data
- [ ] Navbar shows user email when logged in
- [ ] Auth modal opens/closes correctly

## 🚨 Important Notes

1. **Email Confirmation:** By default, Supabase requires email confirmation. You can disable this in Authentication → Settings → Email Auth → "Confirm email" toggle.

2. **Password Reset:** The reset password flow requires setting up email templates and redirect URLs in Supabase dashboard.

3. **Session Persistence:** Sessions are automatically persisted in localStorage. Users will remain logged in across browser sessions.

4. **Security:** Never expose your Supabase service role key in the frontend. Only use the anon key.

5. **Migration:** If you have existing data with TEXT userIds, you'll need to carefully migrate it to UUID format linked to auth.users.

## 📚 Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Supabase React Auth Helpers](https://supabase.com/docs/guides/auth/auth-helpers/react)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

