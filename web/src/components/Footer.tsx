import { Linkedin, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTheme } from '../theme/ThemeContext'

export function Footer({ className }: { className?: string }) {
  const { backgroundColor, textColor, secondaryTextColor } = useTheme()
  
  // Use the primary brown color from the theme
  const primaryBrown = '#7F5539'
  
  return (
    <footer 
      className={`border-t backdrop-blur-sm ${className || ''}`}
      style={{
        backgroundColor: backgroundColor,
        borderColor: '#D4CFC0',
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12 text-center">
          <Link to="/" className="flex items-center gap-4 group">
            <img
              src="/turtle_logo.png"
              alt="DSA Lab logo"
              className="block h-14 w-auto transition-all group-hover:scale-105 object-contain"
            />
            <span
              className="text-3xl font-bold tracking-tight leading-none"
              style={{
                color: textColor,
                fontFamily: 'JetBrains Mono, monospace',
              }}
            >
              DSA Lab
            </span>
          </Link>
          <p className="text-base font-mono max-w-md" style={{ color: secondaryTextColor }}>
            Level up your data structures and algorithms with hands-on, guided challenges.
          </p>
        </div>
        {/* Team and Connect - Horizontal and Centered */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-16 mb-8">
          <div className="flex flex-col items-center gap-3">
            <h3 className="font-semibold font-mono" style={{ color: textColor }}>Team</h3>
            <div className="flex gap-4 text-sm font-mono">
              <span style={{ color: primaryBrown }}>Taha</span>
              <span style={{ color: secondaryTextColor }}>•</span>
              <span style={{ color: primaryBrown }}>Ethan</span>
              <span style={{ color: secondaryTextColor }}>•</span>
              <span style={{ color: primaryBrown }}>Joud</span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-3">
            <h3 className="font-semibold font-mono" style={{ color: textColor }}>Connect</h3>
            <div className="flex space-x-4">
              <a
                href="https://x.com/dsalab"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:opacity-80"
                style={{ color: primaryBrown }}
                title="X (formerly Twitter)"
              >
                <svg 
                  className="h-5 w-5" 
                  viewBox="0 0 24 24" 
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a
                href="https://linkedin.com/company/dsalab"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:opacity-80"
                style={{ color: primaryBrown }}
                title="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="mailto:contact@dsalab.dev"
                className="transition-colors hover:opacity-80"
                style={{ color: primaryBrown }}
                title="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div 
          className="mt-8 border-t pt-8 text-center text-sm font-mono"
          style={{ 
            borderColor: '#D4CFC0',
            color: secondaryTextColor 
          }}
        >
          <p>© 2025 DSA Lab. Built for hackers who want to master fundamentals.</p>
        </div>
      </div>
    </footer>
  )
}

