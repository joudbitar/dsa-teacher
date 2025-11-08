import { useState } from 'react'
import { X } from 'lucide-react'
import { LoginForm } from './LoginForm'
import { SignupForm } from './SignupForm'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialMode?: 'login' | 'signup'
}

export function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className="bg-white rounded-lg p-6 w-full max-w-md relative"
        style={{ backgroundColor: '#F0ECDA' }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4"
          style={{ color: '#171512' }}
        >
          <X className="h-5 w-5" />
        </button>
        <h2 className="text-2xl font-bold mb-4" style={{ color: '#171512' }}>
          {mode === 'login' ? 'Log in' : 'Sign up'}
        </h2>
        {mode === 'login' ? (
          <LoginForm
            onSuccess={onClose}
            onSwitchToSignup={() => setMode('signup')}
          />
        ) : (
          <SignupForm
            onSuccess={onClose}
            onSwitchToLogin={() => setMode('login')}
          />
        )}
      </div>
    </div>
  )
}

