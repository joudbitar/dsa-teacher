import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface ThemeContextType {
  isDarkMode: boolean
  toggleDarkMode: () => void
  backgroundColor: string
  textColor: string
  borderColor: string
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

  const value: ThemeContextType = {
    isDarkMode,
    toggleDarkMode,
    backgroundColor,
    textColor,
    borderColor,
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

