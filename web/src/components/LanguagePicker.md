# LanguagePicker Component

## Purpose

Allows user to select programming language when starting a new project.

## Props

```typescript
{
  languages: string[]; // e.g., ["TypeScript", "Python", "Go"]
  selected: string;
  onSelect: (lang: string) => void;
}
```

## Interactions

- Click on language option → calls onSelect
- Highlights selected language

## Visual Notes

- Radio button group or pill selector
- Language icons/logos next to labels
- Disabled state if project already exists

