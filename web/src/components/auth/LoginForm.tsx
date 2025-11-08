import { useState } from 'react'
import { useAuth } from '../../auth/useAuth'

interface LoginFormProps {
  onSuccess?: () => void
  onSwitchToSignup?: () => void
}

export function LoginForm({ onSuccess, onSwitchToSignup }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error } = await signIn(email, password)

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      onSuccess?.()
    }
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
        {loading ? 'Logging in...' : 'Log in'}
      </button>
      {onSwitchToSignup && (
        <button
          type="button"
          onClick={onSwitchToSignup}
          className="w-full text-sm text-center"
          style={{ color: '#171512' }}
        >
          Don't have an account? Sign up
        </button>
      )}
    </form>
  )
}

