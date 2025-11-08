# useAuth Hook

## Purpose

Provides authentication state and methods using Supabase Auth.

## Returns

```typescript
{
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}
```

## Implementation Notes

- Wraps Supabase Auth methods
- Listens to auth state changes
- Provides user context via React Context or direct export

