import { Link } from 'react-router-dom'
import { Code2, User, LogOut, ChevronDown, ArrowRight, Moon, Sun } from 'lucide-react'
import { useAuth } from '../auth/useAuth'
import { useTheme } from '../theme/ThemeContext'
import { useState, useRef, useEffect } from 'react'

export function Navbar({ className }: { className?: string }) {
  const { user, signOut } = useAuth()
  const { isDarkMode, toggleDarkMode, backgroundColor, textColor, borderColor } = useTheme()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleSignOut = async () => {
    await signOut()
    setIsDropdownOpen(false)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDropdownOpen])

  return (
    <nav 
      className={`sticky top-0 z-50 border-b backdrop-blur-sm ${className || ''}`}
      style={{ 
        backgroundColor: backgroundColor,
        borderColor: '#D4CFC0'
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          {/* Left: Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div 
              className="flex h-9 w-9 items-center justify-center rounded-lg border-2 transition-all group-hover:scale-105"
              style={{ 
                borderColor: '#7F5539',
                backgroundColor: 'rgba(127, 85, 57, 0.1)'
              }}
            >
              <Code2 className="h-5 w-5" style={{ color: '#7F5539' }} />
            </div>
            <span 
              className="text-xl font-bold tracking-tight"
              style={{ 
                color: textColor,
                fontFamily: 'JetBrains Mono, monospace'
              }}
            >
              DSA Lab
            </span>
          </Link>
          
          {/* Center: Navigation Links */}
          <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-2">
            <Link
              to="/"
              className="text-sm font-semibold px-4 py-2 rounded-lg transition-all hover:bg-[rgba(127,85,57,0.1)]"
              style={{ 
                color: textColor,
                fontFamily: 'JetBrains Mono, monospace'
              }}
            >
              Home
            </Link>
            <Link
              to="/challenges"
              className="text-sm font-semibold px-4 py-2 rounded-lg transition-all hover:bg-[rgba(127,85,57,0.1)]"
              style={{ 
                color: textColor,
                fontFamily: 'JetBrains Mono, monospace'
              }}
            >
              Challenges
            </Link>
            <Link
              to="/docs"
              className="text-sm font-semibold px-4 py-2 rounded-lg transition-all hover:bg-[rgba(127,85,57,0.1)]"
              style={{ 
                color: textColor,
                fontFamily: 'JetBrains Mono, monospace'
              }}
            >
              Docs
            </Link>
          </div>
          
          {/* Right: Auth Buttons */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-all hover:bg-[rgba(127,85,57,0.05)]"
                  style={{ 
                    color: textColor,
                    borderColor: '#D4CFC0'
                  }}
                >
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                    {user.email}
                  </span>
                  <ChevronDown 
                    className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                
                {isDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-56 rounded-lg border shadow-lg z-50"
                    style={{ 
                      backgroundColor: backgroundColor,
                      borderColor: '#D4CFC0'
                    }}
                  >
                    <button
                      onClick={toggleDarkMode}
                      className="w-full flex items-center justify-between gap-2 px-4 py-3 text-sm font-semibold transition-all hover:bg-[rgba(127,85,57,0.05)] rounded-t-lg border-b"
                      style={{ 
                        color: textColor,
                        borderColor: '#D4CFC0',
                        fontFamily: 'JetBrains Mono, monospace'
                      }}
                    >
                      <div className="flex items-center gap-2">
                        {isDarkMode ? (
                          <Sun className="h-4 w-4" />
                        ) : (
                          <Moon className="h-4 w-4" />
                        )}
                        <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
                      </div>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center justify-between gap-2 px-4 py-3 text-sm font-semibold transition-all hover:bg-red-50 dark:hover:bg-red-950/20 rounded-b-lg"
                      style={{ 
                        color: '#dc2626',
                        fontFamily: 'JetBrains Mono, monospace'
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <LogOut className="h-4 w-4" />
                        <span>Sign out</span>
                      </div>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center rounded-lg border-2 bg-transparent px-5 py-2 text-sm font-semibold transition-all hover:bg-[rgba(127,85,57,0.05)]"
                  style={{ 
                    borderColor: '#7F5539', 
                    color: '#7F5539',
                    fontFamily: 'JetBrains Mono, monospace'
                  }}
                >
                  Log in
                </Link>
                <Link
                  to="/auth?mode=signup"
                  className="inline-flex items-center justify-center rounded-lg px-5 py-2 text-sm font-bold transition-all hover:opacity-90 shadow-sm"
                  style={{ 
                    backgroundColor: '#7F5539', 
                    color: '#FFFEF9',
                    fontFamily: 'JetBrains Mono, monospace'
                  }}
                >
                  Start Learning
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

