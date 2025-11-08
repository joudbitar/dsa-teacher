import { Navbar } from '@/components/Navbar'

export function Landing() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F0ECDA', color: '#171512' }}>
      <Navbar />
      <main className="flex-1 flex items-center justify-center">
        {/* Hero Section */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            Stop memorizing, start learning.
          </h1>
        </section>
      </main>
    </div>
  )
}
