import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { colors } from '@/theme/colors'
import { MarkdownContent } from '@/components/MarkdownContent'
import cliReferenceContent from '@/content/docs/cli-reference.md?raw'

export function CLIReference() {
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
            <Link
              to="/docs"
              className="inline-flex items-center text-[#4B463F] hover:text-[#171512] mb-6 transition-colors"
              style={{ fontFamily: themeStyle.fontFamily }}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Documentation
            </Link>
            
            <MarkdownContent content={cliReferenceContent} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
