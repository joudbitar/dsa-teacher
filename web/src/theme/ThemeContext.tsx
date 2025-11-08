import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface ThemeContextType {
  isDarkMode: boolean
  toggleDarkMode: () => void
  backgroundColor: string
  textColor: string
  borderColor: string
  secondaryTextColor: string
  sectionBackgroundColor: string
  accentBlue: string
  accentGreen: string
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage first
    const saved = localStorage.getItem('darkMode')
    if (saved !== null) {
      return saved === 'true'
    }
    // Default to light mode
    return false
  })

  useEffect(() => {
    // Save to localStorage whenever it changes
    localStorage.setItem('darkMode', String(isDarkMode))
    
    // Apply dark mode class to document
    if (isDarkMode) {
      document.documentElement.classList.add('dark-mode')
    } else {
      document.documentElement.classList.remove('dark-mode')
    }
  }, [isDarkMode])

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev)
  }

  // Theme colors based on mode
  const backgroundColor = isDarkMode ? '#171512' : '#F0ECDA'
  const textColor = isDarkMode ? '#F0ECDA' : '#171512'
  const borderColor = isDarkMode ? '#F0ECDA' : '#171512'
  const secondaryTextColor = isDarkMode ? '#B8B3A8' : '#4B463F' // Lighter in dark mode for readability
  const sectionBackgroundColor = isDarkMode ? '#1F1B16' : '#E8E0C8' // Slightly different shade for sections
  
  // Accent colors stay the same in both modes
  const accentBlue = '#96BFBD'
  const accentGreen = '#66A056'

  const value: ThemeContextType = {
    isDarkMode,
    toggleDarkMode,
    backgroundColor,
    textColor,
    borderColor,
    secondaryTextColor,
    sectionBackgroundColor,
    accentBlue,
    accentGreen,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

