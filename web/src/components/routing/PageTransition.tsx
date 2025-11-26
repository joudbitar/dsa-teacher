import { ReactNode } from 'react'

interface PageTransitionProps {
  children: ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  // No animations - just render children directly
  return (
    <div className="w-full min-h-screen">
      {children}
    </div>
  )
}

