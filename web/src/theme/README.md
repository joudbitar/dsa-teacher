# Color Management System

This folder contains the centralized color management system for the application.

## 🎨 Color Palette

All colors are defined in `colors.ts`. **DO NOT** use hardcoded colors elsewhere in the codebase.

### Color Roles

| Role | HEX | Description | Usage |
|------|-----|-------------|-------|
| Background (Base) | `#F0ECDA` | Warm neutral | Main background, cards |
| Background (Surface) | `#E5E0CC` | Slightly darker beige | Card contrast zones |
| Primary Text | `#171512` | Espresso black | Headlines, body text |
| Secondary Text | `#4B463F` | Muted brown-gray | Subheadings, metadata |
| Primary Accent | `#2E5B9A` | Muted royal blue | Buttons, links, CTAs |
| Secondary Accent | `#C47A38` | Burnt amber | Highlights, hover states |
| Success | `#2E7D32` | Deep green | "Passed" tests, progress bars |
| Warning | `#F4A300` | Golden orange | Alerts, hints |
| Error | `#B91C1C` | Warm red | Test failures, error badges |
| Border | `#D3CDBB` | Light taupe | Card borders, subtle dividers |

## 📖 Usage

### In TypeScript/React Components

```typescript
import { colors } from '@/theme/colors'

// Use directly
<div style={{ backgroundColor: colors.background.base }}>
  <p style={{ color: colors.text.primary }}>Hello</p>
</div>

// With opacity helper
import { withOpacity } from '@/theme/colors'
<div style={{ backgroundColor: withOpacity(colors.accent.primary, 0.1) }}>
  Hover state
</div>
```

### In Tailwind CSS (via CSS variables)

The colors are automatically available as CSS variables in `index.css`. Use Tailwind classes:

```tsx
// Background
<div className="bg-background">        // #F0ECDA
<div className="bg-card">              // #F0ECDA
<div className="bg-muted">             // #E5E0CC

// Text
<p className="text-foreground">       // #171512
<p className="text-muted-foreground"> // #4B463F

// Accents
<button className="bg-primary">        // #2E5B9A
<span className="text-accent">        // #C47A38

// Status
<div className="bg-success">          // #2E7D32
<div className="bg-warning">          // #F4A300
<div className="bg-destructive">      // #B91C1C

// Borders
<div className="border-border">       // #D3CDBB
```

### Inline Styles (when needed)

```typescript
import { colors } from '@/theme/colors'

<div style={{ 
  backgroundColor: colors.background.surface,
  color: colors.text.primary,
  borderColor: colors.border.divider
}}>
  Custom styled element
</div>
```

## 🚫 What NOT to Do

❌ **DON'T** hardcode colors:
```tsx
// BAD
<div style={{ color: '#171512' }}>
<div className="text-[#171512]">
```

✅ **DO** use the color system:
```tsx
// GOOD
import { colors } from '@/theme/colors'
<div style={{ color: colors.text.primary }}>
<div className="text-foreground">
```

## 🔄 Adding New Colors

1. Add the color to `colors.ts` in the appropriate category
2. Add the HSL value to `colorsHSL.ts` if needed for CSS variables
3. Update `index.css` if it needs to be a CSS variable
4. Update this README with the new color

## 📝 Notes

- All colors are defined as `const` to prevent accidental mutations
- The `withOpacity` helper is available for creating transparent versions
- CSS variables are automatically generated from `colorsHSL` in `index.css`
- Always use semantic names (e.g., `text-primary` not `text-black`)

