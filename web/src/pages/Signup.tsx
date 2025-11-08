import { Navbar } from '@/components/Navbar'
import { Link, useNavigate } from 'react-router-dom'
import { SignupForm } from '@/components/auth/SignupForm'
import { useAuth } from '@/auth/useAuth'
import { useEffect } from 'react'

export function Signup() {
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      navigate('/challenges')
    }
  }, [user, navigate])

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
              Sign up
            </h1>
            <p className="text-[#4B463F] mb-6" style={{ fontFamily: themeStyle.fontFamily }}>
              Create an account to start learning data structures and algorithms.
            </p>
            <SignupForm
              onSuccess={() => navigate('/challenges')}
              onSwitchToLogin={() => navigate('/login')}
            />
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

