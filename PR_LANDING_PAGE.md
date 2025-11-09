# Pull Request: Landing Page Redesign

## Title
`feat: redesign landing page with minimal theme`

## Description

This PR implements a complete redesign of the landing page with a clean, minimal aesthetic.

### Changes

- **Simplified Landing Page**: Removed all extra components, keeping only Navbar and Hero section
- **New Color Scheme**: 
  - Background: `#F0ECDA` (warm beige)
  - Text: `#171512` (dark brown)
- **Typography**: Added JetBrains Mono font throughout for a developer-focused aesthetic
- **Navbar Updates**:
  - Logo placeholder with Code2 icon
  - Navigation links: About, Challenges
  - Action buttons: Log in (outline), Start Learning (filled)
- **Hero Section**: Bold message "Stop memorizing, start learning."
- **Clean Design**: Removed all gradients, borders, and extra visual elements for a minimal look

### Files Changed

- `web/index.html` - Added JetBrains Mono font
- `web/src/components/Navbar.tsx` - Complete navbar redesign
- `web/src/index.css` - Removed gradients, set solid background
- `web/src/pages/Landing.tsx` - Simplified to Navbar + Hero only

### Design Philosophy

The new design focuses on:
- **Minimalism**: Clean, uncluttered interface
- **Developer-focused**: JetBrains Mono font for code-like aesthetic
- **Clear messaging**: Single bold statement in hero
- **Simple navigation**: Easy access to key actions

### Testing

- ✅ Landing page displays correctly
- ✅ Navbar links work properly
- ✅ Responsive design maintained
- ✅ No visual glitches or layout issues

### Screenshots

(Add screenshots of the new landing page here)

---

**Ready for Review** ✅



