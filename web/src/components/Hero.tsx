import { Link } from 'react-router-dom'
import { ArrowRight, Code2, Terminal, GitBranch } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background py-20 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Tagline */}
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            Build the fundamentals like a{' '}
            <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              real engineer
            </span>
          </h1>
          
          <p className="mt-6 text-xl text-muted-foreground sm:text-2xl">
            Not another puzzle site — a DS&A gym wired into your{' '}
            <span className="font-semibold text-primary">GitHub + CLI</span>
          </p>

          {/* Problem/Solution */}
          <div className="mt-12 space-y-8 rounded-2xl border bg-card p-8 text-left">
            <div>
              <h2 className="text-2xl font-semibold text-foreground">The Problem</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                With AI and Copilot, people feel like they can skip fundamentals and just "ask the model". 
                But if you never built a stack, a queue, or a hash map yourself, you cap your ceiling. 
                It's like using a calculator without knowing multiplication.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-foreground">Our Solution</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Our platform gives you tiny, real repos that you clone locally, run in the CLI, and implement 
                core data structures and algorithms from scratch. You don't just pass a LeetCode problem — 
                you build a mini-library, with tests, reports, and progress tracked in a dashboard.
              </p>
            </div>
          </div>

          {/* Key Features */}
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            <div className="flex flex-col items-center rounded-lg border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                <Code2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Build Systems</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Not isolated puzzles — structured projects
              </p>
            </div>
            <div className="flex flex-col items-center rounded-lg border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10 mb-4">
                <Terminal className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="font-semibold">CLI-First</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Work in your terminal like a real engineer
              </p>
            </div>
            <div className="flex flex-col items-center rounded-lg border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                <GitBranch className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Real Repos</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Get actual GitHub repos you can build on
              </p>
            </div>
          </div>

          {/* CTA - Warm Yellow for motivation and energy */}
          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/challenges"
              className={cn(
                "inline-flex items-center justify-center rounded-lg bg-accent px-8 py-3 text-base font-semibold text-accent-foreground",
                "shadow-lg shadow-accent/30 transition-all hover:shadow-xl hover:shadow-accent/40",
                "hover:scale-105 active:scale-95 font-bold"
              )}
            >
              Browse Challenges
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center rounded-lg border-2 border-primary bg-background px-8 py-3 text-base font-semibold text-primary transition-colors hover:bg-primary/5"
            >
              How It Works
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

