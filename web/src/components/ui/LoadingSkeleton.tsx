import { useTheme } from '@/theme/ThemeContext'
import { cn } from '@/lib/utils'

interface LoadingSkeletonProps {
  className?: string
  variant?: 'text' | 'rectangular' | 'circular'
  width?: string | number
  height?: string | number
}

export function LoadingSkeleton({ 
  className = '', 
  variant = 'rectangular',
  width,
  height 
}: LoadingSkeletonProps) {
  const { sectionBackgroundColor } = useTheme()

  const baseClasses = 'animate-pulse'
  
  const variantClasses = {
    text: 'rounded',
    rectangular: 'rounded-lg',
    circular: 'rounded-full',
  }

  const style: React.CSSProperties = {
    backgroundColor: sectionBackgroundColor,
    width: width || '100%',
    height: height || '1rem',
  }

  return (
    <div
      className={cn(baseClasses, variantClasses[variant], className)}
      style={style}
    />
  )
}

export function LoadingSkeletonGroup({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      {children}
    </div>
  )
}

