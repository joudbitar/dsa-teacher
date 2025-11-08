# useRealtime Hook

## Purpose

Manages Supabase Realtime channel subscriptions with automatic cleanup.

## Parameters

```typescript
{
  channel: string;
  table: string;
  filter?: string;
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  onUpdate: (payload: any) => void;
}
```

## Returns

```typescript
{
  connected: boolean;
  error: Error | null;
  unsubscribe: () => void;
}
```

## Implementation Notes

- Initializes subscription on mount
- Calls onUpdate callback when events arrive
- Automatically unsubscribes on unmount
- Handles reconnection on network interruption

