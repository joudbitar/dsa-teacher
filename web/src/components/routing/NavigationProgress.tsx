import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useTheme } from '@/theme/ThemeContext'

export function NavigationProgress() {
  const [progress, setProgress] = useState(0)
  const [show, setShow] = useState(false)
  const location = useLocation()
  const { accentGreen } = useTheme()

  useEffect(() => {
    // Reset progress when location changes
    setProgress(0)
    setShow(true)

    // Simulate progress
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(timer)
          return 90
        }
        return prev + 10
      })
    }, 50)

    // Complete progress when navigation is done
    const completeTimer = setTimeout(() => {
      setProgress(100)
      setTimeout(() => {
        setShow(false)
        setProgress(0)
      }, 200)
    }, 300)

    return () => {
      clearInterval(timer)
      clearTimeout(completeTimer)
    }
  }, [location.pathname])

  if (!show) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1">
      <div
        className="h-full transition-all duration-200 ease-out"
        style={{
          width: `${progress}%`,
          backgroundColor: accentGreen,
        }}
      />
    </div>
  )
}

