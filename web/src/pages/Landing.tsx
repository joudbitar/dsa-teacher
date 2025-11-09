import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Link } from 'react-router-dom'
import { ArrowRight, GitBranch, Terminal, Code2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { useTheme } from '@/theme/ThemeContext'

const codeExamples = {
  stack: {
    prefix: 'Build a: Stack',
    code: `class Stack<T> {
  private items: T[] = [];
}`
  },
  queue: {
    prefix: 'Build a: Queue',
    code: `class Queue<T> {
  private items: T[] = [];
}`
  },
  'binary-search': {
    prefix: 'Build a: Tree',
    code: `class Tree {
  private root: TreeNode | null = null;
}`
  },
  'min-heap': {
    prefix: 'Build a: Min-Heap',
    code: `class MinHeap {
  private heap: number[] = [];
}`
  },
}

// Enhanced syntax highlighting function with IDE-like colors
const highlightCode = (code: string, defaultTextColor: string) => {
  const tokens: Array<{ text: string; color: string }> = []
  const lines = code.split('\n')
  
  lines.forEach((line, lineIdx) => {
    // More comprehensive regex to match different token types
    const tokenRegex = /(\/\/.*$)|(\s+)|(class|function|private|const|let|return|if|else|while|for|interface|type|extends|implements)\b|(number|void|undefined|string|boolean|null|any|unknown)\b|([a-zA-Z_$][a-zA-Z0-9_$]*)|([0-9]+)|([<>():,;={}\[\]|&])|(\[\]|:)/g
    let match
    let lastIndex = 0
    
    while ((match = tokenRegex.exec(line)) !== null) {
      const [fullMatch, comment, whitespace, keyword, type, identifier, number, bracket, arrayType] = match
      
      // Handle text before the match
      if (match.index > lastIndex) {
        const beforeText = line.substring(lastIndex, match.index)
        if (beforeText) {
          tokens.push({ text: beforeText, color: defaultTextColor })
        }
      }
      lastIndex = match.index + fullMatch.length
      
      if (comment) {
        tokens.push({ text: comment, color: '#6a737d' }) // Gray for comments
      } else if (whitespace) {
        tokens.push({ text: whitespace, color: defaultTextColor })
      } else if (keyword) {
        // Make class and private blue, others red
        const blueKeywords = ['class', 'private']
        const color = blueKeywords.includes(keyword) ? '#0969da' : '#cf222e'
        tokens.push({ text: keyword, color }) // Blue for class/private, red for other keywords
      } else if (type) {
        tokens.push({ text: type, color: '#8250df' }) // Purple for types
      } else if (number) {
        tokens.push({ text: number, color: '#0550ae' }) // Blue for numbers
      } else if (arrayType) {
        tokens.push({ text: arrayType, color: '#8250df' }) // Purple for array type
      } else if (identifier) {
        // Check if it's a type parameter like T
        if (identifier === 'T' && line.includes('<')) {
          tokens.push({ text: identifier, color: '#8250df' }) // Purple for type parameters
        } else if (line.includes('class ') && identifier === line.split('class ')[1]?.split(/[<{\s]/)[0]) {
          tokens.push({ text: identifier, color: '#953800' }) // Brown/Orange for class names
        } else if (line.includes('function ') && identifier === line.split('function ')[1]?.split(/[<(\s]/)[0]) {
          tokens.push({ text: identifier, color: '#8250df' }) // Purple for function names
        } else {
          tokens.push({ text: identifier, color: defaultTextColor }) // Use theme color for other identifiers
        }
      } else if (bracket) {
        tokens.push({ text: bracket, color: defaultTextColor }) // Use theme color for brackets
      }
    }
    
    // Handle remaining text after last match
    if (lastIndex < line.length) {
      const remaining = line.substring(lastIndex)
      if (remaining) {
        tokens.push({ text: remaining, color: defaultTextColor })
      }
    }
    
    if (lineIdx < lines.length - 1) {
      tokens.push({ text: '\n', color: defaultTextColor })
    }
  })
  
  return tokens
}

const challenges = [
  { id: 'stack', title: 'Build a Stack', prefix: codeExamples.stack.prefix, code: codeExamples.stack.code },
  { id: 'queue', title: 'Build a Queue', prefix: codeExamples.queue.prefix, code: codeExamples.queue.code },
  { id: 'binary-search', title: 'Binary Search', prefix: codeExamples['binary-search'].prefix, code: codeExamples['binary-search'].code },
  { id: 'min-heap', title: 'Build a Min-Heap', prefix: codeExamples['min-heap'].prefix, code: codeExamples['min-heap'].code },
]

const steps = [
  { number: 1, title: 'Pick a challenge', description: '50+ challenges to master' },
  { number: 2, title: 'Get a private repo', description: 'GitHub repo with starter code and tests' },
  { number: 3, title: 'Code locally', description: 'Clone it, run our dsa CLI tool to test your work' },
  { number: 4, title: 'Submit & track', description: 'Dashboard updates in real-time' },
]

const features = [
  {
    icon: GitBranch,
    title: 'Real Repos',
    description: 'Get actual GitHub repos you can build on, not browser editors',
  },
  {
    icon: Terminal,
    title: 'CLI-First',
    description: 'Work in your terminal like a real engineer',
  },
  {
    icon: Code2,
    title: 'Build Systems',
    description: 'Structured projects with tests, not isolated puzzles',
  },
]

export function Landing() {
  const [currentChallenge, setCurrentChallenge] = useState(0)
  const { backgroundColor, textColor, borderColor, secondaryTextColor, sectionBackgroundColor, accentGreen } = useTheme()

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentChallenge((prev) => (prev + 1) % challenges.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const themeStyle = {
    backgroundColor,
    color: textColor,
    fontFamily: 'JetBrains Mono, monospace',
  }

  return (
    <div className="min-h-screen flex flex-col" style={themeStyle}>
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <div className="text-center lg:text-left">
              <h1 
                className="text-5xl sm:text-6xl lg:text-7xl mb-6 font-bold leading-tight"
                style={themeStyle}
              >
                Stop memorizing.
                <br />
                <span className="font-bold">Start learning.</span>
              </h1>
              <p 
                className="text-xl sm:text-2xl mb-8" 
                style={{ color: secondaryTextColor, fontFamily: themeStyle.fontFamily }}
              >
                Learn data structures and algorithms by building them from scratch.
              </p>
              <Link
                to="/auth?mode=signup"
                className="inline-flex items-center justify-center rounded-lg px-8 py-4 text-lg font-bold transition-all hover:opacity-90 hover:scale-105"
                style={{ 
                  backgroundColor: accentGreen, 
                  color: backgroundColor,
                  fontFamily: themeStyle.fontFamily
                }}
              >
                Start Coding
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>

            {/* Right: Challenge Carousel */}
            <div className="relative w-full">
              {/* Build a text above the box */}
              <div className="text-center mb-6 relative" style={{ minHeight: '3rem' }}>
                {challenges.map((challenge, index) => {
                  const [buildPart, dsName] = challenge.prefix.split(': ')
                  return (
                    <h2
                      key={challenge.id}
                      className="absolute inset-0 flex items-center justify-center transition-opacity duration-500 text-3xl sm:text-4xl lg:text-5xl leading-tight"
                      style={{
                        fontFamily: themeStyle.fontFamily,
                        opacity: index === currentChallenge ? 1 : 0,
                        pointerEvents: index === currentChallenge ? 'auto' : 'none'
                      }}
                    >
                      <span style={{ fontWeight: 'normal', color: secondaryTextColor }}>
                        {buildPart}:
                      </span>
                      <span style={{ fontWeight: 'bold', color: textColor, marginLeft: '0.5rem' }}>
                        {dsName}
                      </span>
                    </h2>
                  )
                })}
              </div>
              
              <div className="relative h-64 rounded-2xl border-2 overflow-hidden" style={{ borderColor: borderColor }}>
                <div className="relative h-full w-full">
                  {challenges.map((challenge, index) => {
                    return (
                      <div
                        key={challenge.id}
                        className="absolute inset-0 h-full overflow-hidden transition-opacity duration-500 flex items-center justify-center"
                        style={{ 
                          backgroundColor: backgroundColor,
                          opacity: index === currentChallenge ? 1 : 0,
                          pointerEvents: index === currentChallenge ? 'auto' : 'none'
                        }}
                      >
                        <pre className="m-0 text-center" style={{ 
                          fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
                          fontSize: '1.5rem',
                          lineHeight: '1.8',
                          color: textColor,
                          whiteSpace: 'pre'
                        }}>
                          <code>
                            {highlightCode(challenge.code, textColor).map((token, i) => (
                              <span key={i} style={{ color: token.color }}>
                                {token.text}
                              </span>
                            ))}
                          </code>
                        </pre>
                      </div>
                    )
                  })}
                </div>
              </div>
              {/* Carousel Indicators */}
              <div className="flex justify-center gap-2 mt-4">
                {challenges.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentChallenge(index)}
                    className={cn(
                      "h-2 rounded-full transition-all",
                      index === currentChallenge ? "w-8" : "w-2"
                    )}
                    style={{ 
                      backgroundColor: index === currentChallenge ? textColor : secondaryTextColor
                    }}
                    aria-label={`Go to challenge ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Why Section */}
        <section className="py-16 sm:py-24" style={{ backgroundColor: sectionBackgroundColor }}>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12">
              <div className="text-center lg:text-left lg:flex-1">
                <h2
                  className="text-3xl sm:text-4xl font-bold mb-6"
                  style={{ color: textColor, fontFamily: themeStyle.fontFamily }}
                >
                  Missing the fundamentals?
                  <br />
                  We've got your back.
                </h2>
                <p
                  className="text-xl sm:text-2xl leading-relaxed"
                  style={{ color: secondaryTextColor, fontFamily: themeStyle.fontFamily }}
                >
                  AI won’t transform you into a standout engineer—<span className="font-semibold">mastery of fundamentals will</span>.
                  Dive deep into <span className="font-semibold">how and why data structures and algorithms work</span> so you can build
                  with confidence, speed, and impact.
                </p>
              </div>
              <div className="w-full max-w-xs lg:flex-1">
                <img
                  src="/gotyourback.png"
                  alt="Students supporting each other while learning data structures"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 sm:py-24" style={themeStyle}>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center" style={themeStyle}>
              How it works.
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className="relative rounded-xl border-2 p-6 text-center"
                  style={{ borderColor: borderColor, backgroundColor: backgroundColor }}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full mx-auto mb-4" style={{ backgroundColor: textColor }}>
                    <span className="text-2xl font-bold" style={{ color: backgroundColor, fontFamily: themeStyle.fontFamily }}>
                      {step.number}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold mb-2" style={themeStyle}>
                    {step.title}
                  </h3>
                  <p className="text-sm" style={{ color: secondaryTextColor, fontFamily: themeStyle.fontFamily }}>
                    {step.description}
                  </p>
                  {step.number < steps.length && (
                    <div className="hidden lg:block absolute top-1/2 -right-6 transform -translate-y-1/2">
                      <ArrowRight className="h-6 w-6" style={{ color: secondaryTextColor }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="text-center mt-6">
              <Link
                to="/docs"
                className="inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-bold transition-all hover:opacity-90 hover:scale-105"
                style={{ 
                  backgroundColor: textColor,
                  color: backgroundColor,
                  fontFamily: themeStyle.fontFamily
                }}
              >
                view docs
              </Link>
            </div>
          </div>
        </section>

        {/* Key Differentiators */}
        <section className="py-16 sm:py-24" style={{ backgroundColor: sectionBackgroundColor }}>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center" style={{ color: textColor, fontFamily: themeStyle.fontFamily }}>
              Build like an <span className="font-extrabold">engineer</span>.
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {features.map((feature) => {
                const Icon = feature.icon
                return (
                  <div
                    key={feature.title}
                    className="rounded-xl border-2 p-6 text-center"
                    style={{ borderColor: borderColor, backgroundColor: backgroundColor }}
                  >
                    <div className="flex h-16 w-16 items-center justify-center rounded-full mx-auto mb-4" style={{ backgroundColor: textColor }}>
                      <Icon className="h-8 w-8" style={{ color: backgroundColor }} />
                    </div>
                    <h3 className="text-xl font-bold mb-3" style={themeStyle}>
                      {feature.title}
                    </h3>
                    <p className="leading-relaxed" style={{ color: secondaryTextColor, fontFamily: themeStyle.fontFamily }}>
                      {feature.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 sm:py-24" style={themeStyle}>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6" style={themeStyle}>
                Ready to start building?
              </h2>
              <p className="text-xl mb-8" style={{ color: secondaryTextColor, fontFamily: themeStyle.fontFamily }}>
                Pick your first challenge and start learning by doing.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  to="/auth?mode=signup"
                  className="inline-flex items-center justify-center rounded-lg px-8 py-4 text-lg font-bold transition-all hover:opacity-90 hover:scale-105"
                  style={{
                    backgroundColor: '#66A056',
                    color: backgroundColor,
                    fontFamily: themeStyle.fontFamily
                  }}
                >
                  Start Your First Challenge
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center justify-center rounded-lg border-2 px-8 py-4 text-lg font-semibold transition-all hover:opacity-80"
                  style={{ 
                    borderColor: borderColor,
                    color: textColor,
                    fontFamily: themeStyle.fontFamily
                  }}
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
