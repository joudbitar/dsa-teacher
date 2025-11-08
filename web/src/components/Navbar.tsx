import { Link } from 'react-router-dom'
import { Code2 } from 'lucide-react'

export function Navbar({ className }: { className?: string }) {
  return (
    <nav 
      className={`sticky top-0 z-50 ${className || ''}`}
      style={{ 
        backgroundColor: '#F0ECDA'
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          {/* Left: Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div 
              className="flex h-8 w-8 items-center justify-center rounded-lg border"
              style={{ 
                borderColor: '#171512',
                backgroundColor: 'transparent'
              }}
            >
              <Code2 className="h-5 w-5" style={{ color: '#171512' }} />
            </div>
            <span 
              className="text-xl font-bold"
              style={{ 
                color: '#171512',
                fontFamily: 'JetBrains Mono, monospace'
              }}
            >
              DSA Lab
            </span>
          </Link>
          
          {/* Center: Navigation Links */}
          <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-6">
            <Link
              to="/about"
              className="text-sm font-medium transition-colors hover:opacity-70"
              style={{ 
                color: '#171512',
                fontFamily: 'JetBrains Mono, monospace'
              }}
            >
              About
            </Link>
            <Link
              to="/challenges"
              className="text-sm font-medium transition-colors hover:opacity-70"
              style={{ 
                color: '#171512',
                fontFamily: 'JetBrains Mono, monospace'
              }}
            >
              Challenges
            </Link>
            <Link
              to="/docs"
              className="text-sm font-medium transition-colors hover:opacity-70"
              style={{ 
                color: '#171512',
                fontFamily: 'JetBrains Mono, monospace'
              }}
            >
              Docs
            </Link>
          </div>
          
          {/* Right: Auth Buttons */}
          <div className="flex items-center gap-3">
            <button
              className="inline-flex items-center justify-center rounded-lg border-2 bg-transparent px-4 py-2 text-sm font-semibold transition-colors hover:opacity-80"
              style={{ 
                borderColor: '#171512', 
                color: '#171512',
                fontFamily: 'JetBrains Mono, monospace'
              }}
            >
              Log in
            </button>
            <Link
              to="/challenges"
              className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-bold transition-colors hover:opacity-90"
              style={{ 
                backgroundColor: '#171512', 
                color: '#F0ECDA',
                fontFamily: 'JetBrains Mono, monospace'
              }}
            >
              Start Learning
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

