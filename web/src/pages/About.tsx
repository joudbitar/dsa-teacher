import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Target, Heart } from 'lucide-react'
import { useTheme } from '@/theme/ThemeContext'

export function About() {
  const { backgroundColor, textColor, secondaryTextColor, accentBlue } = useTheme()
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
        <section className="py-16 sm:py-24" style={themeStyle}>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl sm:text-5xl font-bold mb-6" style={themeStyle}>
                About Shelly
              </h1>
              <p className="text-xl mb-8" style={{ color: secondaryTextColor, fontFamily: themeStyle.fontFamily }}>
                Learn data structures and algorithms by building them from scratch.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-12 sm:py-16" style={themeStyle}>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-start gap-4 mb-8">
                <Target className="h-8 w-8 flex-shrink-0" style={{ color: accentBlue }} />
                <div>
                  <h2 className="text-3xl font-bold mb-4" style={themeStyle}>
                    Our Mission
                  </h2>
                  <p className="text-lg mb-4" style={{ color: secondaryTextColor, fontFamily: themeStyle.fontFamily }}>
                    With AI tools becoming ubiquitous, it's tempting to skip the fundamentals. But if you never built a stack, queue, or hash map yourself, you cap your ceiling.
                  </p>
                  <p className="text-lg" style={{ color: secondaryTextColor, fontFamily: themeStyle.fontFamily }}>
                    Shelly bridges that gap by giving you real projects to build in your own environment, with real tests, and real feedback—just like you'd work on the job.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How We Can Help Section */}
        <section className="py-12 sm:py-16" style={themeStyle}>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-start gap-4 mb-8">
                <Heart className="h-8 w-8 flex-shrink-0" style={{ color: accentBlue }} />
                <div>
                  <h2 className="text-3xl font-bold mb-4" style={themeStyle}>
                    How We Can Help
                  </h2>
                  <ul className="space-y-3 text-lg list-disc list-inside" style={{ color: secondaryTextColor, fontFamily: themeStyle.fontFamily }}>
                    <li>Practicing for a technical interview</li>
                    <li>Learning in conjunction with courses</li>
                    <li>Interest in the fundamental data structures in computer science</li>
                  </ul>
                  <p className="text-lg mt-4 font-bold" style={{ color: secondaryTextColor, fontFamily: themeStyle.fontFamily }}>
                    Shelly will be with you every step of the way.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

