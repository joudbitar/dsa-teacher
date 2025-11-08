import { type ReactNode } from 'react'
import { Command, Info, Terminal } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { useTheme } from '@/theme/ThemeContext'

type DocSection = {
  id: string
  title: string
  summary: string
  icon: ReactNode
  link: {
    href: string
    label: string
  }
  content: ReactNode
}

function Callout({
  title,
  icon,
  children,
}: {
  title: string
  icon?: ReactNode
  children: ReactNode
}) {
  return (
    <div className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-5 text-sm leading-relaxed shadow-sm">
      <div className="flex items-center gap-2 font-semibold uppercase tracking-wide text-black">
        {icon}
        {title}
      </div>
      <div className="mt-3 space-y-2 text-black">{children}</div>
    </div>
  )
}

const docSections: DocSection[] = [
  {
    id: 'tips',
    title: 'Command-Line Tips',
    summary:
      'Practical guidance for navigating the terminal, managing Git repositories, installing tooling, and avoiding common pitfalls while solving challenges.',
    icon: <Terminal className="h-6 w-6 text-emerald-300" />,
    link: {
      href: '/docs/command-line-tips.md',
      label: 'Open command-line-tips.md',
    },
    content: (
      <>
        <p>
          The tips guide walks through environment prerequisites (Node.js, pnpm, Git), shell navigation for macOS/Linux and
          Windows, Git workflows, editor recommendations, and a troubleshooting matrix for frequent terminal errors.
        </p>
        <ul className="marker:text-emerald-400">
          <li>Side-by-side command tables for bash/zsh vs. PowerShell users.</li>
          <li>Habits that keep repos clean: predictable folder structures, frequent commits, and restarting shells after installs.</li>
          <li>Examples for setting environment variables inline when targeting local Supabase deployments.</li>
        </ul>
        <Callout title="Sample Snippet" icon={<Terminal className="h-4 w-4" />}>
          <pre className="overflow-x-auto rounded-lg bg-black/70 p-4 text-xs text-white/85">
            <code>
{`# Navigation & Git refresher
pwd            # print working directory
ls -la         # list files (all)
git status     # staged & unstaged changes
git add src/stack.ts
git commit -m "Implement push method"`}
            </code>
          </pre>
        </Callout>
      </>
    ),
  },
  {
    id: 'cli',
    title: 'DSA Lab CLI Reference',
    summary:
      'Authoritative documentation for installing the CLI, interpreting dsa.config.json, running tests, submitting results, and debugging failures.',
    icon: <Command className="h-6 w-6 text-sky-300" />,
    link: {
      href: '/docs/cli-reference.md',
      label: 'Open cli-reference.md',
    },
    content: (
      <>
        <p>
          The CLI reference explains one-command installers, manual setup, and the step-by-step execution flow of both
          <code>dsa test</code> and <code>dsa submit</code>. It also documents exit codes, common API responses, and how to
          update or uninstall the tool.
        </p>
        <ul className="marker:text-sky-300">
          <li>Breakdown of <code>dsa test</code>: config discovery, running <code>testCommand</code>, parsing <code>.dsa-report.json</code>, and rendering result panels.</li>
          <li>Breakdown of <code>dsa submit</code>: rerunning tests, gathering Git metadata, POSTing to Supabase Edge Functions, and updating <code>currentChallengeIndex</code>.</li>
          <li>Troubleshooting table covering HTTP 401/404 responses, missing report files, and PATH issues.</li>
        </ul>
        <Callout title="Command Summary" icon={<Command className="h-4 w-4" />}>
          <pre className="overflow-x-auto rounded-lg bg-black/70 p-4 text-xs text-white/85">
            <code>
{`dsa --help     # list available commands and version
dsa test        # run tests and show guided output
dsa submit      # re-run tests, upload results, unlock next challenge`}
            </code>
          </pre>
        </Callout>
      </>
    ),
  },
]

export function Docs() {
  const { backgroundColor, textColor, secondaryTextColor } = useTheme()
  const themeStyle = {
    backgroundColor,
    color: textColor,
    fontFamily: 'JetBrains Mono, monospace',
  }

  return (
    <div className="min-h-screen flex flex-col" style={themeStyle}>
      <Navbar />
      <main className="flex-1">
        <div className="relative overflow-hidden border-y border-white/10 bg-gradient-to-b from-white/10 via-transparent to-transparent">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(94,234,212,0.14),transparent_55%)]" />
          <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="max-w-4xl space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: secondaryTextColor }}>
                Documentation
              </span>
              <h1 className="text-4xl font-bold leading-tight md:text-5xl">
                Command-Line Guidance & CLI Reference
              </h1>
              <p className="text-lg leading-relaxed" style={{ color: secondaryTextColor }}>
                Review best practices for working in the terminal, then dive into the official reference for the `dsa`
                command-line interface. Each card links to a markdown document stored under <code>/docs</code>.
              </p>
              <Callout title="Tip" icon={<Info className="h-4 w-4" />}>
                <p>
                  Open the markdown files in a new tab to keep this overview visible. The documents render cleanly in both
                  browsers and code editors.
                </p>
              </Callout>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid gap-12 lg:grid-cols-[260px,1fr]">
            <aside className="space-y-6 lg:sticky lg:top-28 lg:h-fit lg:self-start">
              <h2 className="text-lg font-semibold uppercase tracking-wide" style={{ color: secondaryTextColor }}>
                Table of Contents
              </h2>
              <nav className="flex flex-col space-y-3 text-sm" style={{ color: secondaryTextColor }}>
                {docSections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="group inline-flex items-center gap-2 rounded-lg border border-transparent px-3 py-2 transition hover:border-white/20 hover:bg-white/10 hover:translate-x-1"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-white/40 transition group-hover:bg-white" />
                    {section.title}
                  </a>
                ))}
              </nav>
            </aside>

            <article className="space-y-12">
              {docSections.map((section) => (
                <section
                  key={section.id}
                  id={section.id}
                  className="space-y-4 rounded-2xl border border-white/15 bg-white/5 p-8 shadow-xl shadow-black/30 backdrop-blur"
                >
                  <header className="flex items-start gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/20 bg-white/10">
                      {section.icon}
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-3xl font-semibold">{section.title}</h2>
                      <p className="text-base leading-relaxed" style={{ color: secondaryTextColor }}>
                        {section.summary}
                      </p>
                      <a
                        href={section.link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide transition hover:text-primary-200"
                        style={{ color: secondaryTextColor }}
                      >
                        {section.link.label}
                        <span aria-hidden="true">↗</span>
                      </a>
                    </div>
                  </header>
                  <div className="prose prose-invert max-w-none space-y-4" style={{ color: textColor }}>
                    {section.content}
                  </div>
                </section>
              ))}
            </article>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

