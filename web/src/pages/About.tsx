import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { colors } from '@/theme/colors'

export function About() {
  const themeStyle = {
    backgroundColor: colors.background.base,
    color: colors.text.primary,
    fontFamily: 'JetBrains Mono, monospace',
  }

  return (
    <div className="min-h-screen flex flex-col" style={themeStyle}>
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-4xl mx-auto">
            <h1 
              className="text-4xl font-bold mb-6"
              style={themeStyle}
            >
              About DSA Lab
            </h1>
            <div 
              className="prose prose-lg"
              style={{ 
                fontFamily: themeStyle.fontFamily,
                color: colors.text.primary
              }}
            >
              <p className="text-lg text-[#4B463F] mb-8">
                DSA Lab is a platform designed to help you learn data structures and algorithms through hands-on practice.
              </p>
              
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-4" style={themeStyle}>
                  Our Mission
                </h2>
                <p className="text-[#4B463F] mb-4 leading-relaxed">
                  We believe that memorizing algorithms isn't enough. You need to understand how and why they work. 
                  DSA Lab provides real-world coding challenges that help you build the fundamental skills needed 
                  to become a better engineer.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-4" style={themeStyle}>
                  How We're Different
                </h2>
                <ul className="list-disc list-inside text-[#4B463F] space-y-2 leading-relaxed">
                  <li>Real GitHub repositories, not browser editors</li>
                  <li>CLI-first workflow that matches real engineering environments</li>
                  <li>Structured projects with tests and build systems</li>
                  <li>Focus on understanding fundamentals, not just solving puzzles</li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-4" style={themeStyle}>
                  Get Started
                </h2>
                <p className="text-[#4B463F] mb-4 leading-relaxed">
                  Ready to start learning? Head over to our challenges page and pick your first challenge. 
                  Each challenge comes with starter code, tests, and clear instructions to guide you along the way.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
