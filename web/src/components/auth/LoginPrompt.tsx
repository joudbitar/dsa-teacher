import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '@/theme/ThemeContext'
import { useAuth } from '@/auth/useAuth'

interface LoginPromptProps {
  isOpen: boolean
  onClose: () => void
  intendedPath?: string
}

export function LoginPrompt({ isOpen, onClose, intendedPath }: LoginPromptProps) {
  const navigate = useNavigate()
  const { backgroundColor, textColor, borderColor, secondaryTextColor, accentGreen } = useTheme()
  const { user } = useAuth()

  const themeStyle = {
    backgroundColor,
    color: textColor,
    fontFamily: 'JetBrains Mono, monospace',
  }

  const handleLogin = () => {
    const state = intendedPath ? { from: intendedPath } : undefined
    navigate('/login', { state })
    onClose()
  }

  const handleSignup = () => {
    const state = intendedPath ? { from: intendedPath } : undefined
    navigate('/signup', { state })
    onClose()
  }

  if (user) {
    onClose()
    return null
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="relative w-full max-w-md rounded-lg border-2 p-8 shadow-xl"
              style={{ 
                backgroundColor, 
                borderColor,
                ...themeStyle 
              }}
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-opacity-10 transition-colors"
                style={{ color: secondaryTextColor }}
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Content */}
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-3" style={themeStyle}>
                  Sign in required
                </h2>
                <p 
                  className="mb-6 text-base"
                  style={{ color: secondaryTextColor, fontFamily: themeStyle.fontFamily }}
                >
                  You need to be signed in to access challenges. Sign in to continue learning.
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleLogin}
                    className="flex-1 px-6 py-3 rounded-lg font-semibold transition-all hover:opacity-90 hover:scale-105"
                    style={{
                      backgroundColor: '#7F5539',
                      color: backgroundColor,
                      fontFamily: themeStyle.fontFamily,
                    }}
                  >
                    Log In
                  </button>
                  <button
                    onClick={handleSignup}
                    className="flex-1 px-6 py-3 rounded-lg font-semibold transition-all hover:opacity-90 hover:scale-105"
                    style={{
                      backgroundColor: accentGreen,
                      color: backgroundColor,
                      fontFamily: themeStyle.fontFamily,
                    }}
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

