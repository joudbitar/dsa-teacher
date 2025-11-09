import { Code2, Github } from 'lucide-react'
import { useTheme } from '../theme/ThemeContext'

export function Footer({ className }: { className?: string }) {
  const { backgroundColor, textColor, borderColor, secondaryTextColor } = useTheme()
  
  // Use the primary brown color from the theme
  const primaryBrown = '#7F5539'
  
  // Convert hex to rgba for opacity
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }
  
  return (
    <footer 
      className={`border-t backdrop-blur-sm ${className || ''}`}
      style={{
        backgroundColor: backgroundColor,
        borderColor: borderColor,
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div 
                className="flex h-8 w-8 items-center justify-center rounded-sm border"
                style={{
                  backgroundColor: hexToRgba(primaryBrown, 0.1),
                  borderColor: hexToRgba(primaryBrown, 0.2),
                }}
              >
                <Code2 className="h-5 w-5" style={{ color: primaryBrown }} />
              </div>
              <span className="font-bold font-mono" style={{ color: textColor }}>
                DSA Lab
              </span>
            </div>
            <p className="text-sm font-mono" style={{ color: secondaryTextColor }}>
              Built by vibe coders, for real coders. Learn multiplication before you touch the calculator.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4 font-mono" style={{ color: textColor }}>Product</h3>
            <ul className="space-y-2 text-sm font-mono" style={{ color: secondaryTextColor }}>
              <li>
                <a href="/challenges" className="transition-colors hover:opacity-80" style={{ color: primaryBrown }}>
                  Challenges
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="transition-colors hover:opacity-80" style={{ color: primaryBrown }}>
                  How It Works
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 font-mono" style={{ color: textColor }}>Resources</h3>
            <ul className="space-y-2 text-sm font-mono" style={{ color: secondaryTextColor }}>
              <li>
                <a href="https://github.com" className="transition-colors hover:opacity-80" style={{ color: primaryBrown }}>
                  Documentation
                </a>
              </li>
              <li>
                <a href="https://github.com" className="transition-colors hover:opacity-80" style={{ color: primaryBrown }}>
                  GitHub
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 font-mono" style={{ color: textColor }}>Connect</h3>
            <div className="flex space-x-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:opacity-80"
              style={{ color: primaryBrown }}
            >
              <Github className="h-5 w-5" />
            </a>
            </div>
          </div>
        </div>

        <div 
          className="mt-8 border-t pt-8 text-center text-sm font-mono"
          style={{ 
            borderColor: borderColor,
            color: secondaryTextColor 
          }}
        >
          <p>© 2024 DSA Lab. Built for hackers who want to master fundamentals.</p>
        </div>
      </div>
    </footer>
  )
}

