# CopyBlock Component

## Purpose

Displays code or command text with a one-click copy button.

## Props

```typescript
{
  text: string;
  language?: string; // for syntax highlighting
  label?: string; // e.g., "Clone Command"
}
```

## Interactions

- Click "Copy" button → copies text to clipboard
- Button shows checkmark briefly after copy

## Visual Notes

- Monospace font
- Dark background
- Copy button in top-right corner
- Optional syntax highlighting (if language specified)

