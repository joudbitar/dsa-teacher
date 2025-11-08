import { useState } from 'react'
import { useAuth } from '../../auth/useAuth'

interface SignupFormProps {
  onSuccess?: () => void
  onSwitchToLogin?: () => void
}

export function SignupForm({ onSuccess, onSwitchToLogin }: SignupFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const { signUp } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    const { error } = await signUp(email, password)

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
      // Don't auto-redirect if email confirmation is required
      // User needs to check their email first
      // onSuccess will be called manually when they click "Go to login"
    }
  }

  if (success) {
    return (
      <div className="text-center space-y-4">
        <div className="text-green-600 mb-2">
          ✓ Account created successfully!
        </div>
        <div className="text-sm text-[#4B463F] mb-4">
          Please check your email to verify your account. Click the confirmation link in the email to activate your account.
        </div>
        {onSwitchToLogin && (
          <button
            onClick={onSwitchToLogin}
            className="text-sm underline"
            style={{ color: '#171512' }}
          >
            Go to login
          </button>
        )}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded-lg"
          style={{ borderColor: '#171512' }}
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-1">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="w-full px-3 py-2 border rounded-lg"
          style={{ borderColor: '#171512' }}
        />
      </div>
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength={6}
          className="w-full px-3 py-2 border rounded-lg"
          style={{ borderColor: '#171512' }}
        />
      </div>
      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 px-4 rounded-lg font-semibold transition-colors"
        style={{
          backgroundColor: '#171512',
          color: '#F0ECDA',
          fontFamily: 'JetBrains Mono, monospace',
        }}
      >
        {loading ? 'Creating account...' : 'Sign up'}
      </button>
      {onSwitchToLogin && (
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="w-full text-sm text-center"
          style={{ color: '#171512' }}
        >
          Already have an account? Log in
        </button>
      )}
    </form>
  )
}

