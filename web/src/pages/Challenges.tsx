import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { ChallengesGrid } from '@/components/ChallengesGrid'
import { useTheme } from '@/theme/ThemeContext'

export function Challenges() {
  const { backgroundColor } = useTheme()
  
  return (
    <div className="min-h-screen flex flex-col relative" style={{ backgroundColor }}>
      <Navbar className="relative z-10" />
      <main className="flex-1 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-4">Data Structures & Algorithms Challenges</h1>
            <p className="text-lg text-muted-foreground">
              Pick a challenge and start building. Each module comes with tests, starter code, and clear goals.
            </p>
          </div>

          <ChallengesGrid />
        </div>
      </main>
      <Footer className="relative z-10" />
    </div>
  )
}

