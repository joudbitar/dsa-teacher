import { type ReactNode, useState, useEffect } from "react";
import {
  Bug,
  Command,
  Copy,
  Check,
  Download,
  Info,
  Layers,
  LifeBuoy,
  Network,
  Shield,
  Terminal,
  Workflow,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useTheme } from "@/theme/ThemeContext";
import { colors } from "@/theme/colors";

type DocSection = {
  id: string;
  title: string;
  summary: string;
  icon: ReactNode;
  link: {
    href: string;
    label: string;
  };
  content: ReactNode;
};

function Callout({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div
      className="flex gap-4 rounded-lg p-5 text-sm leading-relaxed"
      style={{
        backgroundColor: colors.background.surface,
        border: `1px solid ${colors.border.divider}`,
        color: colors.text.primary,
      }}
    >
      <div className="shrink-0" style={{ color: colors.accent.primary }}>
        {icon}
      </div>
      <div className="space-y-2">
        <div
          className="font-semibold uppercase tracking-wide"
          style={{ color: colors.accent.primary }}
        >
          {title}
        </div>
        <div className="space-y-3">{children}</div>
      </div>
    </div>
  );
}

// Create doc sections function that receives copy handler
const createDocSections = (handleCopyInstall: () => void, copiedInstall: boolean): DocSection[] => [
  {
    id: "getting-started",
    title: "Getting Started",
    summary:
      "Learn how to sign up, create your first challenge project, install the CLI, and start coding.",
    icon: <Layers className="h-6 w-6 text-emerald-300" />,
    link: {
      href: "/auth?mode=signup",
      label: "Sign up now",
    },
    content: (
      <>
        <p>
          Get started with DSA Lab in just a few steps. You'll be coding your first data structure in minutes.
        </p>
        <ol className="list-decimal space-y-4 pl-5 marker:text-emerald-400">
          <li>
            <strong>Sign up</strong> – Create an account on the dashboard. It's free and takes seconds.
          </li>
          <li>
            <strong>Choose a challenge</strong> – Browse available challenges (Stack, Queue, Binary Search, Min-Heap, and more).
          </li>
          <li>
            <strong>Select your language</strong> – Pick from JavaScript, TypeScript, Python, Java, or C++.
          </li>
          <li>
            <strong>Get your repository</strong> – The dashboard creates a private GitHub repository with starter code and tests.
          </li>
          <li>
            <strong>Install the CLI</strong> – Use the one-liner command to install the <code>dsa</code> tool.
          </li>
          <li>
            <strong>Clone and code</strong> – Clone your repo, implement the solution, and test locally.
          </li>
        </ol>
        <Callout title="Pro Tip" icon={<Info className="h-4 w-4" />}>
          <p>
            Each challenge repository comes with everything you need: starter code, comprehensive tests, 
            and hints. Just clone, code, and submit!
          </p>
        </Callout>
      </>
    ),
  },
  {
    id: "how-it-works",
    title: "How It Works",
    summary:
      "Understand the technology behind DSA Lab and how the dashboard, CLI, and backend work together.",
    icon: <Network className="h-6 w-6 text-blue-300" />,
    link: {
      href: "#",
      label: "",
    },
    content: (
      <>
        <p>
          DSA Lab is built with modern web technologies to give you a seamless learning experience. 
          Here's how everything connects:
        </p>
        <div className="space-y-4">
          <div className="rounded-lg p-4" style={{ backgroundColor: colors.background.surface, border: `1px solid ${colors.border.divider}` }}>
            <h4 className="font-semibold mb-2" style={{ color: colors.text.primary }}>
              🎨 Dashboard (React + TypeScript)
            </h4>
            <p className="text-sm" style={{ color: colors.text.secondary }}>
              The web interface where you browse challenges, create projects, and track your progress. 
              Built with React and deployed on Vercel for fast, reliable access.
            </p>
          </div>
          <div className="rounded-lg p-4" style={{ backgroundColor: colors.background.surface, border: `1px solid ${colors.border.divider}` }}>
            <h4 className="font-semibold mb-2" style={{ color: colors.text.primary }}>
              💻 CLI Tool (Node.js + TypeScript)
            </h4>
            <p className="text-sm" style={{ color: colors.text.secondary }}>
              The <code>dsa</code> command-line tool runs tests locally, shows hints, and submits your progress. 
              It works entirely offline for testing, then syncs results when you submit.
            </p>
          </div>
          <div className="rounded-lg p-4" style={{ backgroundColor: colors.background.surface, border: `1px solid ${colors.border.divider}` }}>
            <h4 className="font-semibold mb-2" style={{ color: colors.text.primary }}>
              🗄️ Backend (Supabase)
            </h4>
            <p className="text-sm" style={{ color: colors.text.secondary }}>
              Supabase handles authentication, stores your progress, and manages challenge repositories. 
              Edge Functions process submissions and update your dashboard in real-time.
            </p>
          </div>
          <div className="rounded-lg p-4" style={{ backgroundColor: colors.background.surface, border: `1px solid ${colors.border.divider}` }}>
            <h4 className="font-semibold mb-2" style={{ color: colors.text.primary }}>
              📦 Challenge Repositories (GitHub)
            </h4>
            <p className="text-sm" style={{ color: colors.text.secondary }}>
              Each challenge is a real GitHub repository with starter code, test suites, and documentation. 
              You work in your own private repo, just like a real software project.
            </p>
          </div>
        </div>
        <Callout title="Why This Architecture?" icon={<Info className="h-4 w-4" />}>
          <p>
            By using real repositories and a CLI tool, you learn in an environment that mirrors real-world 
            software development. No browser-based editors—just real code, real tests, and real Git workflows.
          </p>
        </Callout>
      </>
    ),
  },
  {
    id: "install",
    title: "Install & Update the CLI",
    summary:
      "Follow platform-approved installation paths for macOS, Linux, WSL, and Windows, including environment variables and update workflows.",
    icon: <Download className="h-6 w-6 text-sky-300" />,
    link: {
      href: "/docs/cli-reference.md#1-installation",
      label: "Jump to CLI installation",
    },
    content: (
      <>
        <p>
          Install the DSA CLI with a single command. The installer downloads the CLI source,
          builds it, and installs the <code>dsa</code> command to <code>~/.local/bin</code>.
          No superuser privileges are required.
        </p>

        {/* Quick Install - Prominent */}
        <div
          className="rounded-xl p-6 mb-6"
          style={{
            border: `2px solid ${colors.accent.primary}`,
            backgroundColor: colors.background.surface,
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Download className="h-5 w-5" style={{ color: colors.accent.primary }} />
            <h3 className="text-lg font-bold" style={{ color: colors.text.primary }}>
              Quick Install (Recommended)
            </h3>
          </div>
          <p className="text-sm mb-4" style={{ color: colors.text.secondary }}>
            Copy and paste this command into your terminal:
          </p>
          <div
            className="rounded-lg p-4 font-mono text-sm relative"
            style={{
              backgroundColor: colors.background.base,
              border: `1px solid ${colors.border.divider}`,
            }}
          >
            <code
              className="block break-all pr-20"
              style={{ color: colors.text.primary }}
            >
              curl -fsSL https://raw.githubusercontent.com/joudbitar/dsa-teacher/main/scripts/install-cli.sh | bash
            </code>
            <button
              onClick={handleCopyInstall}
              className="absolute top-3 right-3 flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors"
              style={{
                backgroundColor: copiedInstall
                  ? colors.accent.primary
                  : colors.background.surface,
                border: `1px solid ${colors.border.divider}`,
                color: copiedInstall
                  ? colors.background.base
                  : colors.text.primary,
              }}
              title="Copy install command"
            >
              {copiedInstall ? (
                <>
                  <Check className="h-4 w-4" />
                  <span className="text-xs font-medium">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span className="text-xs font-medium">Copy</span>
                </>
              )}
            </button>
          </div>
          <p className="text-xs mt-3" style={{ color: colors.text.secondary }}>
            After installation, verify with <code>dsa --version</code>. If the command is not found,
            add <code>~/.local/bin</code> to your PATH and restart your terminal.
          </p>
        </div>

        <Callout
          title="Verify Installation"
          icon={<Terminal className="h-4 w-4" />}
        >
          <pre
            className="overflow-x-auto rounded-lg p-4 text-xs"
            style={{
              backgroundColor: colors.background.surface,
              color: colors.text.primary,
            }}
          >
            <code>
              {`dsa --version
which dsa          # macOS/Linux
Get-Command dsa    # Windows PowerShell
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc`}
            </code>
          </pre>
        </Callout>
      </>
    ),
  },
  {
    id: "using-platform",
    title: "Using the Platform",
    summary:
      "Learn the daily workflow for solving challenges, testing your code, and submitting progress.",
    icon: <Workflow className="h-6 w-6 text-amber-300" />,
    link: {
      href: "#",
      label: "",
    },
    content: (
      <>
        <p>
          Here's the typical workflow for solving a challenge. Follow these steps to make steady progress:
        </p>
        <ol className="list-decimal space-y-4 pl-5 marker:text-amber-400">
          <li>
            <strong>Clone your repository</strong> – After creating a project, clone the GitHub repository to your local machine.
          </li>
          <li>
            <strong>Install dependencies</strong> – Run <code>npm install</code> or <code>pnpm install</code> to set up the project.
          </li>
          <li>
            <strong>Read the challenge</strong> – Check the README and code comments to understand what you need to implement.
          </li>
          <li>
            <strong>Write your solution</strong> – Implement the required functions or classes in the solution files.
          </li>
          <li>
            <strong>Test frequently</strong> – Run <code>dsa test</code> to see which tests pass and which need work.
          </li>
          <li>
            <strong>Get hints when stuck</strong> – Use <code>dsa hint</code> for guidance without spoiling the solution.
          </li>
          <li>
            <strong>Submit when ready</strong> – Once all tests pass, run <code>dsa submit</code> to unlock the next challenge.
          </li>
        </ol>
        <Callout title="Best Practice" icon={<Info className="h-4 w-4" />}>
          <p>
            Test early and often! Don't wait until you've written everything. Run <code>dsa test</code> after each 
            function you implement to catch bugs early and see your progress in real-time.
          </p>
        </Callout>
      </>
    ),
  },
  {
    id: "best-practices",
    title: "Best Practices",
    summary:
      "Tips and strategies for learning effectively and making the most of your DSA Lab experience.",
    icon: <Shield className="h-6 w-6 text-purple-300" />,
    link: {
      href: "#",
      label: "",
    },
    content: (
      <>
        <p>
          Follow these best practices to maximize your learning and avoid common pitfalls:
        </p>
        <div className="space-y-4">
          <div className="rounded-lg p-4" style={{ backgroundColor: colors.background.surface, border: `1px solid ${colors.border.divider}` }}>
            <h4 className="font-semibold mb-2" style={{ color: colors.text.primary }}>
              ✅ Test-Driven Development
            </h4>
            <p className="text-sm" style={{ color: colors.text.secondary }}>
              Write a small piece of code, then immediately run <code>dsa test</code>. This helps you catch 
              errors early and understand what each function should do before moving on.
            </p>
          </div>
          <div className="rounded-lg p-4" style={{ backgroundColor: colors.background.surface, border: `1px solid ${colors.border.divider}` }}>
            <h4 className="font-semibold mb-2" style={{ color: colors.text.primary }}>
              ✅ Use Hints Strategically
            </h4>
            <p className="text-sm" style={{ color: colors.text.secondary }}>
              Try solving the problem yourself first. Use <code>dsa hint</code> when you're genuinely stuck, 
              not as a first resort. The struggle is where real learning happens.
            </p>
          </div>
          <div className="rounded-lg p-4" style={{ backgroundColor: colors.background.surface, border: `1px solid ${colors.border.divider}` }}>
            <h4 className="font-semibold mb-2" style={{ color: colors.text.primary }}>
              ✅ Understand Before Moving On
            </h4>
            <p className="text-sm" style={{ color: colors.text.secondary }}>
              Don't just make tests pass. Make sure you understand <em>why</em> your solution works. 
              This deep understanding will help you solve similar problems in the future.
            </p>
          </div>
          <div className="rounded-lg p-4" style={{ backgroundColor: colors.background.surface, border: `1px solid ${colors.border.divider}` }}>
            <h4 className="font-semibold mb-2" style={{ color: colors.text.primary }}>
              ✅ Commit Your Progress
            </h4>
            <p className="text-sm" style={{ color: colors.text.secondary }}>
              Use Git to commit your work regularly. This creates a history of your learning journey 
              and helps you recover if something goes wrong.
            </p>
          </div>
          <div className="rounded-lg p-4" style={{ backgroundColor: colors.background.surface, border: `1px solid ${colors.border.divider}` }}>
            <h4 className="font-semibold mb-2" style={{ color: colors.text.primary }}>
              ✅ Read the Test Cases
            </h4>
            <p className="text-sm" style={{ color: colors.text.secondary }}>
              The test files are excellent documentation. They show exactly what your code should do 
              and what edge cases to handle.
            </p>
          </div>
        </div>
      </>
    ),
  },
  {
    id: "commands",
    title: "Command Reference",
    summary:
      "Master every CLI command, its exit codes, and key flags to streamline your workflow and debugging.",
    icon: <Command className="h-6 w-6 text-blue-300" />,
    link: {
      href: "/docs/cli-reference.md#3-commands",
      label: "Full command reference",
    },
    content: (
      <>
        <p>
          The CLI intentionally focuses on a small surface area. Deep
          familiarity with each command pays dividends when automation breaks or
          tests fail.
        </p>
        <div
          className="overflow-hidden rounded-xl text-xs"
          style={{
            border: `1px solid ${colors.border.divider}`,
            backgroundColor: colors.background.surface,
            color: colors.text.primary,
          }}
        >
          <table
            className="min-w-full divide-y"
            style={{ borderColor: colors.border.divider }}
          >
            <thead
              className="uppercase tracking-wide"
              style={{
                backgroundColor: colors.background.base,
                color: colors.text.secondary,
              }}
            >
              <tr>
                <th
                  className="px-4 py-3 text-left font-semibold"
                  style={{ color: colors.text.primary }}
                >
                  Command
                </th>
                <th
                  className="px-4 py-3 text-left font-semibold"
                  style={{ color: colors.text.primary }}
                >
                  Purpose
                </th>
                <th
                  className="px-4 py-3 text-left font-semibold"
                  style={{ color: colors.text.primary }}
                >
                  Exit Codes
                </th>
              </tr>
            </thead>
            <tbody
              className="divide-y"
              style={{ borderColor: colors.border.divider }}
            >
              <tr>
                <td className="px-4 py-3 font-medium">
                  <code>dsa --help</code>
                </td>
                <td className="px-4 py-3">List commands and global flags.</td>
                <td className="px-4 py-3">0 on success.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">
                  <code>dsa test</code>
                </td>
                <td className="px-4 py-3">
                  Execute <code>testCommand</code>, parse the report, render a
                  status panel.
                </td>
                <td className="px-4 py-3">
                  0 when the CLI finishes; 1 for config or runtime errors (tests
                  may still fail with exit 0).
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">
                  <code>dsa submit</code>
                </td>
                <td className="px-4 py-3">
                  Re-run tests, POST results to Supabase, bump{" "}
                  <code>currentChallengeIndex</code>.
                </td>
                <td className="px-4 py-3">
                  0 on recorded submission; 1 when tests fail or the API rejects
                  the payload.
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">
                  <code>dsa hint</code>
                </td>
                <td className="px-4 py-3">
                  Display hints from `HINTS.md` or remote sources (future).
                </td>
                <td className="px-4 py-3">
                  0 when hints render, 1 if hints are unavailable.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <Callout title="Quick Tips" icon={<Info className="h-4 w-4" />}>
          <ul className="marker:text-blue-300">
            <li>
              Run <code>dsa test</code> from anywhere inside your challenge repository.
            </li>
            <li>
              Use <code>dsa hint</code> to see hints for your current challenge step.
            </li>
            <li>
              The CLI automatically detects which challenge you're working on based on your progress.
            </li>
          </ul>
        </Callout>
      </>
    ),
  },
  {
    id: "troubleshooting",
    title: "Troubleshooting & Diagnostics",
    summary:
      "Quick fixes and deep-dive diagnostics for installation issues, configuration errors, and API failures.",
    icon: <Bug className="h-6 w-6 text-rose-300" />,
    link: {
      href: "/docs/README.md#troubleshooting--diagnostics",
      label: "Troubleshooting playbook",
    },
    content: (
      <>
        <p>
          Most errors stem from missing dependencies, incorrect tokens, or
          report parsing failures. Start with the quick matrix, then escalate to
          the diagnostic checklist.
        </p>
        <div
          className="overflow-hidden rounded-xl text-xs"
          style={{
            border: `1px solid ${colors.border.divider}`,
            backgroundColor: colors.background.surface,
            color: colors.text.primary,
          }}
        >
          <table
            className="min-w-full divide-y"
            style={{ borderColor: colors.border.divider }}
          >
            <thead
              className="uppercase tracking-wide"
              style={{
                backgroundColor: colors.background.base,
                color: colors.text.secondary,
              }}
            >
              <tr>
                <th
                  className="px-4 py-3 text-left font-semibold"
                  style={{ color: colors.text.primary }}
                >
                  Symptom
                </th>
                <th
                  className="px-4 py-3 text-left font-semibold"
                  style={{ color: colors.text.primary }}
                >
                  Likely Cause
                </th>
                <th
                  className="px-4 py-3 text-left font-semibold"
                  style={{ color: colors.text.primary }}
                >
                  Resolution
                </th>
              </tr>
            </thead>
            <tbody
              className="divide-y"
              style={{ borderColor: colors.border.divider }}
            >
              <tr>
                <td className="px-4 py-3 font-medium">
                  <code>dsa: command not found</code>
                </td>
                <td className="px-4 py-3">PATH missing CLI bin directory.</td>
                <td className="px-4 py-3">
                  Re-run installer; add <code>~/.local/bin</code> to PATH;
                  restart the shell.
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">
                  <code>Not a DSA project</code>
                </td>
                <td className="px-4 py-3">
                  `dsa.config.json` not found in current directory tree.
                </td>
                <td className="px-4 py-3">
                  Change to repository root or copy config from the template.
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">HTTP 401 / 404</td>
                <td className="px-4 py-3">
                  Token expired or project ID mismatch during submission.
                </td>
                <td className="px-4 py-3">
                  Regenerate project from dashboard; update config fields.
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">
                  <code>Failed to parse test report</code>
                </td>
                <td className="px-4 py-3">
                  `testCommand` crashed or wrote malformed JSON.
                </td>
                <td className="px-4 py-3">
                  Run the raw command, inspect stdout/stderr, delete stale
                  report, rerun <code>dsa test</code>.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <Callout
          title="Still Having Issues?"
          icon={<LifeBuoy className="h-4 w-4" />}
        >
          <p>
            If you're still stuck, make sure you're in the correct directory (the root of your challenge repository), 
            that you've installed dependencies, and that your code is saved. Most issues are resolved by 
            checking these basics first.
          </p>
        </Callout>
      </>
    ),
  },
];

export function Docs() {
  const [copiedInstall, setCopiedInstall] = useState(false);

  const handleCopyInstall = async () => {
    try {
      const installCommand = "curl -fsSL https://raw.githubusercontent.com/joudbitar/dsa-teacher/main/scripts/install-cli.sh | bash";
      await navigator.clipboard.writeText(installCommand);
      setCopiedInstall(true);
      setTimeout(() => setCopiedInstall(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const docSections = createDocSections(handleCopyInstall, copiedInstall);
  const { backgroundColor, textColor } = useTheme();
  const themeStyle = {
    backgroundColor,
    color: textColor,
    fontFamily: "JetBrains Mono, monospace",
  };

  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-20% 0px -60% 0px",
        threshold: 0,
      }
    );

    // Observe all section elements
    docSections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ ...themeStyle, backgroundColor: colors.background.base }}
    >
      <Navbar />
      <main className="flex-1">
        <div
          style={{
            borderBottom: `1px solid ${colors.border.divider}`,
            backgroundColor: colors.background.surface,
          }}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-14">
            <span
              className="mb-4 block text-xs font-semibold uppercase tracking-[0.3em]"
              style={{ color: colors.accent.primary }}
            >
              Documentation
            </span>
            <h1
              className="text-4xl font-bold leading-tight md:text-5xl"
              style={{ color: colors.text.primary }}
            >
              DSA Lab Documentation
            </h1>
            <p
              className="mt-4 max-w-3xl text-lg leading-relaxed"
              style={{ color: colors.text.secondary }}
            >
              Everything you need to know to use DSA Lab effectively. Learn how to get started, 
              use the platform, master the CLI commands, and follow best practices for learning data structures and algorithms.
            </p>
            <div className="mt-8 max-w-3xl">
              <Callout
                title="Using This Guide"
                icon={<Info className="h-5 w-5" />}
              >
                <p>
                  Open detailed markdown references in a new tab to dive deeper
                  while keeping this overview as your table of contents. All
                  documents live under <code>/docs</code> inside the repository.
                </p>
              </Callout>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid gap-12 lg:grid-cols-[260px,1fr]">
            <aside className="space-y-6 lg:sticky lg:top-28 lg:h-fit lg:self-start">
              <h2
                className="text-sm font-semibold uppercase tracking-wide"
                style={{ color: colors.text.secondary }}
              >
                Table of Contents
              </h2>
              <nav
                className="flex flex-col space-y-1 text-sm"
                style={{ color: colors.text.secondary }}
              >
                {docSections.map((section) => {
                  const isActive = activeSection === section.id;
                  return (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="rounded-md px-3 py-2 transition font-mono"
                      style={{
                        border: `1px solid transparent`,
                        color: isActive ? "#171512" : colors.text.secondary,
                        fontWeight: isActive ? "bold" : "normal",
                        backgroundColor: isActive
                          ? "rgba(127, 85, 57, 0.08)"
                          : "transparent",
                      }}
                    >
                      {section.title}
                    </a>
                  );
                })}
              </nav>
            </aside>

            <article className="space-y-20">
              {docSections.map((section) => (
                <section
                  key={section.id}
                  id={section.id}
                  className="space-y-6 pb-12"
                  style={{ borderBottom: `1px solid ${colors.border.divider}` }}
                >
                  <header className="space-y-3">
                    <div
                      className="flex items-center gap-3 text-sm font-semibold"
                      style={{ color: colors.accent.primary }}
                    >
                      {section.icon}
                      {section.title.toUpperCase()}
                    </div>
                    <h2
                      className="text-3xl font-semibold"
                      style={{ color: colors.text.primary }}
                    >
                      {section.title}
                    </h2>
                    <p
                      className="text-base leading-relaxed"
                      style={{ color: colors.text.secondary }}
                    >
                      {section.summary}
                    </p>
                    <a
                      href={section.link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide transition"
                      style={{ color: colors.accent.primary }}
                    >
                      {section.link.label}
                      <span aria-hidden="true">↗</span>
                    </a>
                  </header>
                  <div
                    className="prose max-w-none space-y-6"
                    style={{ color: colors.text.primary }}
                  >
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
  );
}
