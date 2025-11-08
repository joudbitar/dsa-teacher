import { Code2, Github } from 'lucide-react'

export function Footer({ className }: { className?: string }) {
  return (
    <footer className={`border-t border-border/40 bg-background/95 backdrop-blur-sm ${className || ''}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                <Code2 className="h-5 w-5 text-primary" />
              </div>
              <span className="font-bold text-foreground">
                DSA Lab
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Built by vibe coders, for real coders. Learn multiplication before you touch the calculator.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="/challenges" className="hover:text-primary transition-colors">
                  Challenges
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-primary transition-colors">
                  How It Works
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="https://github.com" className="hover:text-primary transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="https://github.com" className="hover:text-primary transition-colors">
                  GitHub
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Connect</h3>
            <div className="flex space-x-4">
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

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>© 2024 DSA Lab. Built for hackers who want to master fundamentals.</p>
        </div>
      </div>
    </footer>
  )
}

