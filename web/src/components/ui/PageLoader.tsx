import { useTheme } from '@/theme/ThemeContext'
import { LoadingSpinner } from './LoadingSpinner'

interface PageLoaderProps {
  message?: string
}

export function PageLoader({ message = 'Loading...' }: PageLoaderProps) {
  const { backgroundColor, textColor, secondaryTextColor } = useTheme()

  const themeStyle = {
    backgroundColor,
    color: textColor,
    fontFamily: 'JetBrains Mono, monospace',
  }

  return (
    <div 
      className="flex flex-col items-center justify-center min-h-screen"
      style={themeStyle}
    >
      <LoadingSpinner size="lg" />
      <p 
        className="mt-6 text-lg font-medium"
        style={{ color: secondaryTextColor, fontFamily: themeStyle.fontFamily }}
      >
        {message}
      </p>
    </div>
  )
}

