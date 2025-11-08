import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

export function Docs() {
  const themeStyle = {
    backgroundColor: '#F0ECDA',
    color: '#171512',
    fontFamily: 'JetBrains Mono, monospace',
  }

  return (
    <div className="min-h-screen flex flex-col" style={themeStyle}>
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-6" style={themeStyle}>
              Documentation
            </h1>
            <div className="prose prose-lg" style={{ fontFamily: themeStyle.fontFamily }}>
              <p className="text-lg text-[#4B463F] mb-8">
                Welcome to the DSA Lab documentation. Here you'll find guides, tutorials, and reference materials to help you get started.
              </p>
              
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-4" style={themeStyle}>
                  Getting Started
                </h2>
                <p className="text-[#4B463F] mb-4">
                  Learn how to set up your environment and start your first challenge.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-4" style={themeStyle}>
                  CLI Reference
                </h2>
                <p className="text-[#4B463F] mb-4">
                  Complete reference for the DSA CLI tool commands and options.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-4" style={themeStyle}>
                  API Reference
                </h2>
                <p className="text-[#4B463F] mb-4">
                  Documentation for the DSA Lab API endpoints and authentication.
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

