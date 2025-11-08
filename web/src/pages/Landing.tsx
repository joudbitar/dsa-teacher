import { Navbar } from '@/components/Navbar'
import { HeroLeft } from '@/components/HeroLeft'
import { HeroRight } from '@/components/HeroRight'
import { CalculatorMetaphor } from '@/components/CalculatorMetaphor'
import { StreakSection } from '@/components/StreakSection'
import { Footer } from '@/components/Footer'

export function Landing() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-dev-lab relative">
      <Navbar className="relative z-10" />
      <main className="flex-1 relative z-10">
        {/* Hero Section - Split Layout */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[600px]">
            <HeroLeft />
            <HeroRight />
          </div>
        </section>

        {/* Calculator Metaphor */}
        <CalculatorMetaphor />

        {/* Streak Section */}
        <StreakSection />
      </main>
      <Footer className="relative z-10" />
    </div>
  )
}
