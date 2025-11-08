import { useEffect, useRef, useState } from 'react'

interface TurtleProgressProps {
  progress: number // 0-100
  className?: string
  showPercentage?: boolean // Whether to show percentage text below the line
}

export function TurtleProgress({ progress, className = '', showPercentage = true }: TurtleProgressProps) {
  const [animatedProgress, setAnimatedProgress] = useState(progress)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Animate progress changes smoothly
    const duration = 800 // milliseconds
    const startProgress = animatedProgress
    const endProgress = Math.max(0, Math.min(100, progress)) // Clamp between 0-100
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const t = Math.min(elapsed / duration, 1)
      
      // Easing function for smooth animation
      const easeOutCubic = 1 - Math.pow(1 - t, 3)
      const currentProgress = startProgress + (endProgress - startProgress) * easeOutCubic
      
      setAnimatedProgress(currentProgress)

      if (t < 1) {
        requestAnimationFrame(animate)
      } else {
        setAnimatedProgress(endProgress)
      }
    }

    if (Math.abs(startProgress - endProgress) > 0.1) {
      requestAnimationFrame(animate)
    } else {
      setAnimatedProgress(endProgress)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress])

  // Calculate turtle position (0% to 100% of the line width)
  // Clamp position to ensure turtle doesn't go outside bounds
  const clampedProgress = Math.max(0, Math.min(100, animatedProgress))
  const progressPercent = `${clampedProgress}%`
  const lineWidth = '100%'
  const lineHeight = 2 // Thinner line

  // Calculate turtle left position - keep it within bounds
  // Emoji is ~20px wide, so clamp position to keep it visible
  const turtleOffset = 10 // Half width for centering
  const turtleLeftPercent = Math.max(2, Math.min(98, clampedProgress))

  return (
    <div ref={containerRef} className={`relative ${className}`} style={{ width: lineWidth, paddingTop: showPercentage ? '4px' : '4px', paddingBottom: showPercentage ? '20px' : '4px' }}>
      {/* Progress Line - very thin */}
      <div className="relative w-full" style={{ height: `${lineHeight}px` }}>
        {/* Background Line */}
        <div 
          className="absolute top-0 left-0 rounded-full"
          style={{
            width: '100%',
            height: `${lineHeight}px`,
            backgroundColor: '#D4C4A8',
          }}
        />
        
        {/* Filled Line */}
        <div 
          className="absolute top-0 left-0 rounded-full transition-all duration-500 ease-out"
          style={{
            width: progressPercent,
            height: `${lineHeight}px`,
            backgroundColor: '#D4A574',
          }}
        />

        {/* Turtle Emoji - positioned exactly on the progress line, facing right */}
        <div
          className="absolute transition-all duration-500 ease-out text-base leading-none z-10 pointer-events-none"
          style={{
            left: `calc(${turtleLeftPercent}% - ${turtleOffset}px)`,
            top: '-12px',
            lineHeight: '1',
            transform: 'scaleX(-1)', // Flip horizontally to face right
          }}
        >
          🐢
        </div>
      </div>

      {/* Percentage Text - Only show if requested */}
      {showPercentage && (
        <div className="mt-2 text-center">
          <span className="text-xs font-bold font-mono text-[#3E2723]">
            {Math.round(animatedProgress)}%
          </span>
        </div>
      )}
    </div>
  )
}

