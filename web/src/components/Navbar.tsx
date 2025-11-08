import { Link } from 'react-router-dom'
import { Code2, Github } from 'lucide-react'

export function Navbar({ className }: { className?: string }) {
  return (
    <nav className={`border-b border-border/40 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/95 sticky top-0 z-50 ${className || ''}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 group-hover:bg-primary/20 group-hover:border-primary/40 transition-colors">
              <Code2 className="h-5 w-5 text-primary" />
            </div>
            <span className="text-xl font-bold text-foreground">
              DSA Lab
            </span>
          </Link>
          
          <div className="flex items-center space-x-6">
            <Link
              to="/challenges"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Challenges
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Github className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}

