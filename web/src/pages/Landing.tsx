import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { colors } from '@/theme/colors'

export function Landing() {
  const [currentChallenge, setCurrentChallenge] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentChallenge((prev) => (prev + 1) % challenges.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const themeStyle = {
    backgroundColor: '#F0ECDA',
    color: '#171512',
    fontFamily: 'JetBrains Mono, monospace',
  }

  return (
    <div 
      className="min-h-screen flex flex-col" 
      style={{ 
        backgroundColor: colors.background.base, 
        color: colors.text.primary 
      }}
    >
      <Navbar />
      <main className="flex-1 flex items-center justify-center">
        {/* Hero Section */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 
            className="text-5xl sm:text-6xl lg:text-7xl font-bold" 
            style={{ 
              fontFamily: 'JetBrains Mono, monospace',
              color: colors.text.primary
            }}
          >
            Stop memorizing, start learning.
          </h1>
        </section>
      </main>
      <Footer />
    </div>
  )
}
