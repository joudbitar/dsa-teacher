import { Navbar } from '@/components/Navbar'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { LoginForm } from '@/components/auth/LoginForm'
import { SignupForm } from '@/components/auth/SignupForm'
import { useAuth } from '@/auth/useAuth'
import { useEffect, useState } from 'react'

export function Auth() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const mode = searchParams.get('mode') || 'login'
  const [currentMode, setCurrentMode] = useState<'login' | 'signup'>(mode === 'signup' ? 'signup' : 'login')

  useEffect(() => {
    if (user) {
      navigate('/challenges')
    }
  }, [user, navigate])

  useEffect(() => {
    setCurrentMode(mode === 'signup' ? 'signup' : 'login')
  }, [mode])

  const themeStyle = {
    backgroundColor: '#F0ECDA',
    color: '#171512',
    fontFamily: 'JetBrains Mono, monospace',
  }

  return (
    <div className="min-h-screen flex flex-col" style={themeStyle}>
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
        <div className="w-full max-w-md">
          <div className="rounded-lg border-2 p-8" style={{ borderColor: '#171512' }}>
            <h1 className="text-3xl font-bold mb-2" style={themeStyle}>
              {currentMode === 'login' ? 'Log in' : 'Sign up'}
            </h1>
            <p className="text-[#4B463F] mb-6" style={{ fontFamily: themeStyle.fontFamily }}>
              {currentMode === 'login'
                ? 'Welcome back! Sign in to continue learning.'
                : 'Create an account to start learning data structures and algorithms.'}
            </p>
            {currentMode === 'login' ? (
              <LoginForm
                onSuccess={() => navigate('/challenges')}
                onSwitchToSignup={() => {
                  setCurrentMode('signup')
                  navigate('/auth?mode=signup', { replace: true })
                }}
              />
            ) : (
              <SignupForm
                onSuccess={() => navigate('/challenges')}
                onSwitchToLogin={() => {
                  setCurrentMode('login')
                  navigate('/auth?mode=login', { replace: true })
                }}
              />
            )}
            <div className="mt-4 text-center">
              <Link
                to="/"
                className="text-sm underline"
                style={{ color: '#171512' }}
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

