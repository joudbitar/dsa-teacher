import { Navbar } from '@/components/Navbar'
import { Link, useNavigate } from 'react-router-dom'
import { LoginForm } from '@/components/auth/LoginForm'
import { useAuth } from '@/auth/useAuth'
import { useTheme } from '@/theme/ThemeContext'
import { useEffect } from 'react'

export function Login() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { backgroundColor, textColor, borderColor, secondaryTextColor } = useTheme()

  useEffect(() => {
    if (user) {
      navigate('/challenges')
    }
  }, [user, navigate])

  const themeStyle = {
    backgroundColor,
    color: textColor,
    fontFamily: 'JetBrains Mono, monospace',
  }

  return (
    <div className="min-h-screen flex flex-col" style={themeStyle}>
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
        <div className="w-full max-w-md">
          <div className="rounded-lg border-2 p-8" style={{ borderColor: borderColor }}>
            <h1 className="text-3xl font-bold mb-2" style={themeStyle}>
              Log in
            </h1>
            <p className="mb-6" style={{ color: secondaryTextColor, fontFamily: themeStyle.fontFamily }}>
              Welcome back! Sign in to continue learning.
            </p>
            <LoginForm
              onSuccess={() => navigate('/challenges')}
              onSwitchToSignup={() => navigate('/signup')}
            />
            <div className="mt-4 text-center">
              <Link
                to="/"
                className="text-sm underline"
                style={{ color: textColor }}
              >
                Back to home
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

