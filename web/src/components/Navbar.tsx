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
      className={`sticky top-0 z-50 ${className || ''}`}
      style={{ 
        backgroundColor: backgroundColor
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          {/* Left: Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div 
              className="flex h-8 w-8 items-center justify-center rounded-lg border"
              style={{ 
                borderColor: borderColor,
                backgroundColor: 'transparent'
              }}
            >
              <Code2 className="h-5 w-5" style={{ color: textColor }} />
            </div>
            <span 
              className="text-xl font-bold"
              style={{ 
                color: textColor,
                fontFamily: 'JetBrains Mono, monospace'
              }}
            >
              DSA Lab
            </span>
          </Link>
          
          {/* Center: Navigation Links */}
          <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-6">
            <Link
              to="/about"
              className="text-sm font-medium transition-colors hover:opacity-70"
              style={{ 
                color: textColor,
                fontFamily: 'JetBrains Mono, monospace'
              }}
            >
              About
            </Link>
            <Link
              to="/challenges"
              className="text-sm font-medium transition-colors hover:opacity-70"
              style={{ 
                color: textColor,
                fontFamily: 'JetBrains Mono, monospace'
              }}
            >
              Challenges
            </Link>
            <Link
              to="/docs"
              className="text-sm font-medium transition-colors hover:opacity-70"
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
                  className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors hover:opacity-80"
                  style={{ color: textColor }}
                >
                  <User className="h-4 w-4" />
                  <span className="text-sm" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                    {user.email}
                  </span>
                  <ChevronDown 
                    className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                
                {isDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-48 rounded-lg border-2 shadow-lg z-50"
                    style={{ 
                      backgroundColor: backgroundColor,
                      borderColor: borderColor
                    }}
                  >
                    <button
                      onClick={toggleDarkMode}
                      className="w-full flex items-center justify-between gap-2 px-4 py-3 text-sm font-semibold transition-colors hover:opacity-90 rounded-t-lg border-b"
                      style={{ 
                        color: textColor,
                        borderColor: borderColor,
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
                      className="w-full flex items-center justify-between gap-2 px-4 py-3 text-sm font-semibold transition-colors hover:opacity-90 rounded-b-lg"
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
                  className="inline-flex items-center justify-center rounded-lg border-2 bg-transparent px-4 py-2 text-sm font-semibold transition-colors hover:opacity-80"
                  style={{ 
                    borderColor: borderColor, 
                    color: textColor,
                    fontFamily: 'JetBrains Mono, monospace'
                  }}
                >
                  Log in
                </Link>
                <Link
                  to="/auth?mode=signup"
                  className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-bold transition-colors hover:opacity-90"
                  style={{ 
                    backgroundColor: textColor, 
                    color: backgroundColor,
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

