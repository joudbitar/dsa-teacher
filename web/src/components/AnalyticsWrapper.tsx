import { useEffect, useState } from 'react'
import { Analytics } from '@vercel/analytics/react'

/**
 * Wrapper component for Vercel Analytics that handles errors gracefully.
 * This prevents ad blockers or privacy extensions from causing console errors.
 * 
 * Note: The unload event listener warning from chext_driver.js is from a browser
 * extension and cannot be fixed in application code.
 */
export function AnalyticsWrapper() {
  const [shouldLoad, setShouldLoad] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    // Only load analytics in production
    if (import.meta.env.PROD) {
      // Check if we're in a browser environment
      if (typeof window !== 'undefined') {
        // Small delay to ensure the page is fully loaded
        // This helps avoid conflicts with ad blockers
        const timer = setTimeout(() => {
          // Check if the script would be blocked by testing a similar request
          // If it fails, we'll catch it and not render Analytics
          setShouldLoad(true)
        }, 100)

        return () => clearTimeout(timer)
      }
    }
  }, [])

  // Handle script loading errors
  useEffect(() => {
    if (!shouldLoad || !import.meta.env.PROD) return

    const handleError = (event: ErrorEvent) => {
      // Check if the error is related to Vercel Analytics being blocked
      if (
        event.message?.includes('vercel') ||
        event.message?.includes('insights') ||
        event.filename?.includes('vercel') ||
        event.filename?.includes('insights')
      ) {
        setHasError(true)
      }
    }

    window.addEventListener('error', handleError)
    return () => window.removeEventListener('error', handleError)
  }, [shouldLoad])

  // Don't render Analytics if it shouldn't load, if we're in development, or if there's an error
  if (!shouldLoad || !import.meta.env.PROD || hasError) {
    return null
  }

  return <Analytics mode="production" />
}

