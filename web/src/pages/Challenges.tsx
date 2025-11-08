import { useState, useEffect } from 'react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { ChallengesGrid } from '@/components/ChallengesGrid'
import { useTheme } from '@/theme/ThemeContext'
import { apiClient, Module } from '@/lib/api'

export function Challenges() {
  const { backgroundColor } = useTheme()
  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadModules() {
      try {
        setLoading(true)
        const data = await apiClient.getModules()
        setModules(data)
      } catch (err) {
        console.error('Failed to load modules:', err)
        setError(err instanceof Error ? err.message : 'Failed to load modules')
      } finally {
        setLoading(false)
      }
    }

    loadModules()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col relative" style={{ backgroundColor }}>
        <Navbar className="relative z-10" />
        <main className="flex-1 relative z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <p className="text-lg">Loading challenges...</p>
            </div>
          </div>
        </main>
        <Footer className="relative z-10" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col relative" style={{ backgroundColor }}>
        <Navbar className="relative z-10" />
        <main className="flex-1 relative z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <p className="text-lg text-destructive">Error: {error}</p>
            </div>
          </div>
        </main>
        <Footer className="relative z-10" />
      </div>
    )
  }
  
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

          <ChallengesGrid modules={modules} />
        </div>
      </main>
      <Footer className="relative z-10" />
    </div>
  )
}

