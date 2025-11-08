/**
 * Centralized Color Management
 * 
 * Coffeehouse / latte theme:
 * - Background: warm paper / milk foam
 * - Text: espresso
 * - Accents: coffee beans + latte
 * 
 * This file contains all color definitions for the application.
 * DO NOT use hardcoded colors elsewhere - always import from here.
 * 
 * Usage:
 *   import { colors } from '@/theme/colors'
 *   // Use colors.background.base, colors.text.primary, etc.
 */

export const colors = {
  // Base Colors
  background: {
    base: '#F0ECDA',        // Latte foam - Main background
    surface: '#E5E0CC',     // Slightly darker beige - Card surfaces
  },

  // Text Colors
  text: {
    primary: '#171512',     // Espresso black - Headlines, body text
    secondary: '#4B463F',   // Muted mocha - Subheadings, metadata
  },

  // Accent Colors (coffee vibes)
  accent: {
    primary: '#7F5539',     // Coffee bean - Primary buttons, key highlights
    secondary: '#B08968',   // Latte - Secondary buttons, chips, hovers
    // Optional: keep a subtle blue for links/info if you want
    info: '#2E5B9A',        // Muted royal blue - Links, subtle info accents
  },

  // Status Colors
  status: {
    success: '#2E7D32',     // Deep green - "Passed" tests, progress bars
    warning: '#F4A300',     // Golden orange - Alerts, hints
    error:   '#B91C1C',     // Warm red - Test failures, error badges
  },

  // UI Elements
  border: {
    divider: '#D3CDBB',     // Light taupe - Card borders, subtle dividers
  },
} as const

/**
 * Tailwind-compatible HSL values for CSS variables
 * These are used in index.css for the theme system
 */
export const colorsHSL = {
  background: {
    base: '49 42% 90%',     // #F0ECDA
    surface: '48 32% 85%',  // #E5E0CC
  },
  text: {
    primary: '36 12% 8%',    // #171512
    secondary: '35 9% 27%',  // #4B463F
  },
  accent: {
    primary: '24 38% 36%',   // #7F5539 - coffee bean
    secondary: '28 31% 55%', // #B08968 - latte
    info: '215 54% 39%',     // #2E5B9A - subtle blue for links
  },
  status: {
    success: '123 46% 34%',  // #2E7D32
    warning: '40 100% 48%',  // #F4A300
    error:   '0 74% 42%',    // #B91C1C
  },
  border: {
    divider: '45 21% 78%',   // #D3CDBB
  },
} as const

/**
 * Helper function to get color with opacity
 * Usage: withOpacity(colors.accent.primary, 0.1) => 'rgba(127, 85, 57, 0.1)'
 */
export function withOpacity(hex: string, opacity: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

/**
 * Helper function to convert hex to RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return { r, g, b }
}
