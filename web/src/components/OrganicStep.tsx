import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface OrganicStepProps {
  children: ReactNode
  isCurrent?: boolean
  isCompleted?: boolean
  isClickable?: boolean
  className?: string
  shapeVariant?: number
}

export function OrganicStep({ 
  children, 
  isCurrent = false, 
  isCompleted: _isCompleted = false,
  isClickable: _isClickable = true,
  className,
  shapeVariant: _shapeVariant = 0
}: OrganicStepProps) {
  // Text color hex code for border - using foreground color from theme
  const textColor = '#171512' // Espresso black from theme
  
  // Use padding from className if provided, otherwise default
  const paddingClasses = className?.match(/\b(p|px|py|pt|pb|pl|pr)-\d+\b/)
    ? "" // Use padding from className
    : "px-4 py-3" // Default padding
  
  return (
    <div 
      className={cn(
        "relative rounded-lg border-2",
        paddingClasses,
        "shadow-[0_2px_4px_rgba(0,0,0,0.1)]",
        "hover:shadow-[0_8px_16px_rgba(0,0,0,0.25)]",
        "active:shadow-[0_4px_12px_rgba(0,0,0,0.2)]",
        "transition-shadow duration-200 ease-in-out",
        className
      )}
      style={{
        backgroundColor: isCurrent
          ? '#D4A574' 
          : '#E5E0CC',
        borderColor: textColor,
      }}
    >
      {children}
    </div>
  )
}
