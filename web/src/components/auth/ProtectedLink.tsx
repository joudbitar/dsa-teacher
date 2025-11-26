import { Link, LinkProps } from 'react-router-dom'
import { ReactNode, useState, MouseEvent } from 'react'
import { useAuth } from '@/auth/useAuth'
import { LoginPrompt } from './LoginPrompt'

interface ProtectedLinkProps extends Omit<LinkProps, 'to'> {
  to: string
  children: ReactNode
  requireAuth?: boolean
  className?: string
}

export function ProtectedLink({ 
  to, 
  children, 
  requireAuth,
  className = '',
  ...props 
}: ProtectedLinkProps) {
  const { user } = useAuth()
  const [showPrompt, setShowPrompt] = useState(false)

  // Check if route requires auth (starts with /challenges)
  const needsAuth = requireAuth !== undefined ? requireAuth : to.startsWith('/challenges')

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (needsAuth && !user) {
      e.preventDefault()
      setShowPrompt(true)
    }
  }

  if (needsAuth && !user) {
    return (
      <>
        <Link
          to={to}
          onClick={handleClick}
          className={className}
          {...props}
        >
          {children}
        </Link>
        <LoginPrompt
          isOpen={showPrompt}
          onClose={() => setShowPrompt(false)}
          intendedPath={to}
        />
      </>
    )
  }

  return (
    <Link
      to={to}
      className={className}
      {...props}
    >
      {children}
    </Link>
  )
}

