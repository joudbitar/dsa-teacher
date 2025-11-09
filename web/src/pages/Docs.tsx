import { type ReactNode, useState, useEffect } from "react";
import {
  BookOpen,
  Bug,
  Command,
  Download,
  Info,
  Layers,
  LifeBuoy,
  ListChecks,
  Network,
  Settings,
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

const docSections: DocSection[] = [
  {
    id: "overview",
    title: "Platform Overview",
    summary:
      "Understand how the dashboard, CLI, challenge templates, and Supabase work together to deliver the Shelly learning experience.",
    icon: <Layers className="h-6 w-6 text-emerald-300" />,
    link: {
      href: "/docs/README.md",
      label: "Open docs/README.md",
    },
    content: (
      <>
        <p>
          Shelly blends a React dashboard, per-learner challenge repositories, a
          TypeScript CLI, and Supabase Edge Functions. Learners work locally,
          while submissions and hints sync with the hosted services.
        </p>
        <ul className="marker:text-emerald-300">
          <li>
            <strong>Dashboard</strong> – provisions repositories, unlocks
            subchallenges, and surfaces analytics.
          </li>
          <li>
            <strong>CLI</strong> – executes template tests, displays hints, and
            submits results.
          </li>
          <li>
            <strong>Supabase Edge Functions</strong> – validate tokens, persist
            submissions, and notify the dashboard.
          </li>
        </ul>
        <Callout title="Quick Facts" icon={<Info className="h-4 w-4" />}>
          <ul className="marker:text-emerald-300">
            <li>
              Every repo includes a `dsa.config.json` with project metadata.
            </li>
            <li>
              CLI commands exit with `0` on success and `1` on configuration or
              runtime errors.
            </li>
            <li>
              Supabase APIs require both `projectId` and `projectToken`; rotate
              tokens when regenerating repos.
            </li>
          </ul>
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
          Learners typically install via npm; contributors build from source.
          All installers place the `dsa` binary in a user-owned directory so no
          superuser privileges are required.
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
              className="text-[0.75rem] uppercase tracking-wide"
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
                  Scenario
                </th>
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
                  Notes
                </th>
              </tr>
            </thead>
            <tbody
              className="divide-y"
              style={{ borderColor: colors.border.divider }}
            >
              <tr>
                <td className="px-4 py-3 font-medium">
                  Local workspace (recommended)
                </td>
                <td className="px-4 py-3">
                  <code>make install-cli</code>
                </td>
                <td className="px-4 py-3">
                  Builds from your checkout and links <code>dsa</code> into{" "}
                  <code>~/.local/bin</code>.
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Remote fetch helper</td>
                <td className="px-4 py-3">
                  <code>make install-cli-remote</code>
                </td>
                <td className="px-4 py-3">
                  Downloads the latest sources before running the helper script.
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">
                  npm registry (default)
                </td>
                <td className="px-4 py-3">
                  <code>npm install -g @dsa/cli</code>
                </td>
                <td className="px-4 py-3">
                  Update with <code>npm update -g @dsa/cli</code>.
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Local helper script</td>
                <td className="px-4 py-3">
                  <code>./scripts/install-cli.sh</code>
                </td>
                <td className="px-4 py-3">
                  Builds from source, links to <code>~/.local/bin/dsa</code>.
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Remote one-liner</td>
                <td className="px-4 py-3">
                  <code>
                    curl -fsSL
                    https://raw.githubusercontent.com/&lt;org&gt;/&lt;repo&gt;/main/scripts/install-cli.sh
                    | env
                    DSA_CLI_REPO="https://github.com/&lt;org&gt;/&lt;repo&gt;"
                    bash
                  </code>
                </td>
                <td className="px-4 py-3">
                  Set <code>DSA_CLI_HOME</code> and <code>DSA_CLI_BIN</code> for
                  custom directories.
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Windows PowerShell</td>
                <td className="px-4 py-3">
                  <code>cd cli; .\scripts\install.ps1</code>
                </td>
                <td className="px-4 py-3">
                  Run elevated on first install to satisfy execution policy.
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Manual fallback</td>
                <td className="px-4 py-3">
                  <code>pnpm install && pnpm build && pnpm link --global</code>
                </td>
                <td className="px-4 py-3">
                  Requires local repository and pnpm; ideal for contributors.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <Callout
          title="Environment Variables"
          icon={<Settings className="h-4 w-4" />}
        >
          <ul className="marker:text-sky-300">
            <li>
              <code>DSA_CLI_REPO</code> – git URL to clone (defaults to public
              repo).
            </li>
            <li>
              <code>DSA_CLI_HOME</code> – artifact cache directory (defaults to{" "}
              <code>~/.local/share/dsa-cli</code>).
            </li>
            <li>
              <code>DSA_CLI_BIN</code> – directory for the `dsa` symlink
              (defaults to <code>~/.local/bin</code>).
            </li>
            <li>
              <code>COREPACK_ENABLE=0</code> – force pnpm from PATH when
              Corepack is unavailable.
            </li>
          </ul>
        </Callout>
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
    id: "config",
    title: "Configuration & Repository Setup",
    summary:
      "Understand challenge repo anatomy, the dsa.config.json schema, and what to adjust when tokens or environments change.",
    icon: <Settings className="h-6 w-6 text-purple-300" />,
    link: {
      href: "/docs/README.md#configuration-reference-dsaconfigjson",
      label: "Configuration deep dive",
    },
    content: (
      <>
        <p>
          Every template ships with a `dsa.config.json` that identifies the
          learner project, the Supabase endpoint, and the test command. The CLI
          searches upward from your working directory until it locates this
          file.
        </p>
        <pre
          className="overflow-x-auto rounded-lg p-4 text-xs"
          style={{
            backgroundColor: colors.background.surface,
            color: colors.text.primary,
          }}
        >
          <code>
            {`{
  "projectId": "uuid-string",
  "projectToken": "secure-token",
  "moduleId": "min-heap",
  "language": "TypeScript",
  "apiUrl": "https://<region>.supabase.co/functions/v1",
  "testCommand": "pnpm test",
  "reportFile": ".dsa-report.json",
  "currentChallengeIndex": 0
}`}
          </code>
        </pre>
        <ul className="marker:text-purple-300">
          <li>
            Update <code>apiUrl</code> to target staging or local Supabase
            during development.
          </li>
          <li>
            Keep <code>projectToken</code> secret; rotate via the dashboard if
            it leaks.
          </li>
          <li>
            <code>currentChallengeIndex</code> is maintained by the CLI—do not
            edit manually unless restoring from a backup.
          </li>
        </ul>
        <Callout
          title="Repository Checklist"
          icon={<ListChecks className="h-4 w-4" />}
        >
          <ul className="marker:text-purple-300">
            <li>Clone the provisioned repository before running installers.</li>
            <li>
              Install template dependencies (`pnpm install`, `npm install`,
              etc.) before running `dsa test`.
            </li>
            <li>
              Leave `HINTS.md` and `.dsa-report.json` untouched unless updating
              templates.
            </li>
          </ul>
        </Callout>
      </>
    ),
  },
  {
    id: "workflow",
    title: "Daily Workflow",
    summary:
      "Adopt a repeatable loop for implementing solutions, running tests, requesting hints, and submitting progress.",
    icon: <Workflow className="h-6 w-6 text-amber-300" />,
    link: {
      href: "/docs/README.md#daily-workflow",
      label: "View workflow details",
    },
    content: (
      <>
        <ol className="list-decimal space-y-2 pl-5 marker:text-amber-400">
          <li>Pull the latest template updates before starting work.</li>
          <li>
            Implement your solution inside the designated `solutions/` path.
          </li>
          <li>
            Run <code>dsa test</code> frequently; the CLI regenerates
            `.dsa-report.json` and highlights unlocked subchallenges.
          </li>
          <li>
            Use <code>dsa hint</code> for contextual guidance when you get
            stuck.
          </li>
          <li>
            After tests pass, run <code>dsa submit</code> to re-run the suite,
            post results, and unlock the next challenge.
          </li>
          <li>
            Review the dashboard to confirm Supabase recorded the submission.
          </li>
        </ol>
        <Callout title="Automation Tip" icon={<Terminal className="h-4 w-4" />}>
          <pre
            className="overflow-x-auto rounded-lg p-4 text-xs"
            style={{
              backgroundColor: colors.background.surface,
              color: colors.text.primary,
            }}
          >
            <code>
              {`pnpm lint && dsa test && git commit -am "Solve heap insert"
dsa submit && open https://dashboard.dsa-lab.dev/projects/<projectId>`}
            </code>
          </pre>
        </Callout>
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
        <Callout title="Flag Highlights" icon={<Info className="h-4 w-4" />}>
          <ul className="marker:text-blue-300">
            <li>
              <code>--report &lt;path&gt;</code>: override the report file
              location.
            </li>
            <li>
              <code>--skip-test</code>: reuse a fresh report during submissions.
            </li>
            <li>
              <code>--ci</code>: suppress interactive prompts in automation.
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
          title="Deep-Dive Checklist"
          icon={<Shield className="h-4 w-4" />}
        >
          <ul className="marker:text-rose-300">
            <li>
              Enable verbose logs with <code>DEBUG=dsa:*</code> (if
              implemented).
            </li>
            <li>
              Inspect `.dsa-report.json` for schema mismatches or null values.
            </li>
            <li>Use `supabase functions logs` to catch backend errors.</li>
            <li>
              Verify network access with <code>curl {"{apiUrl}"}/health</code>.
            </li>
          </ul>
        </Callout>
      </>
    ),
  },
  {
    id: "architecture",
    title: "Architecture & Internals",
    summary:
      "Dive into CLI module responsibilities, Supabase integrations, and the release pipeline for maintainers.",
    icon: <Network className="h-6 w-6 text-teal-300" />,
    link: {
      href: "/docs/README.md#how-the-cli-works-internally",
      label: "Architecture overview",
    },
    content: (
      <>
        <p>
          The CLI is composed of modular files under <code>cli/src</code>, each
          handling a dedicated concern. Understanding the layout accelerates
          debugging and feature work.
        </p>
        <ul className="marker:text-teal-300">
          <li>
            <code>index.ts</code> – registers commands with{" "}
            <code>commander</code>
            and centralizes error handling.
          </li>
          <li>
            <code>commands/</code> – `test`, `submit`, and `hint` orchestrators.
          </li>
          <li>
            <code>lib/loadConfig.ts</code> – validates and normalizes config
            files.
          </li>
          <li>
            <code>lib/runCommand.ts</code> – executes <code>testCommand</code>{" "}
            and streams output.
          </li>
          <li>
            <code>lib/parseReport.ts</code> – normalizes `.dsa-report.json`.
          </li>
          <li>
            <code>lib/http.ts</code> – signs Supabase requests with
            <code>projectToken</code>.
          </li>
          <li>
            <code>lib/git.ts</code> – captures the latest commit SHA when
            available.
          </li>
        </ul>
        <Callout
          title="Release Strategy"
          icon={<BookOpen className="h-4 w-4" />}
        >
          <p>
            The CLI follows semantic versioning. Update `cli/package.json`, run{" "}
            <code>pnpm --filter ./cli build</code>, publish to npm, tag the
            repository, and refresh documentation. Deprecate commands gradually
            and communicate via release notes.
          </p>
        </Callout>
      </>
    ),
  },
  {
    id: "support",
    title: "Support Playbook & Resources",
    summary:
      "Equip instructors and maintainers with a repeatable triage process, token rotation guidance, and links to deeper references.",
    icon: <LifeBuoy className="h-6 w-6 text-indigo-300" />,
    link: {
      href: "/docs/README.md#support-playbook",
      label: "Read the support playbook",
    },
    content: (
      <>
        <p>
          Collect context, reproduce locally, and escalate fix ownership to the
          right subsystem—configuration, template, or backend.
        </p>
        <Callout title="Support Flow" icon={<ListChecks className="h-4 w-4" />}>
          <ol className="list-decimal space-y-2 pl-5 marker:text-indigo-300">
            <li>
              Capture environment details: OS, Node/pnpm versions, CLI version,
              command output.
            </li>
            <li>Reproduce using the same template and `dsa.config.json`.</li>
            <li>
              Rotate tokens or regenerate projects when authentication fails.
            </li>
            <li>Report template bugs with reproducible steps and logs.</li>
            <li>Document lessons learned to expand the knowledge base.</li>
          </ol>
        </Callout>
        <Callout
          title="Further Reading"
          icon={<BookOpen className="h-4 w-4" />}
        >
          <ul className="marker:text-indigo-300">
            <li>
              <a
                href="/docs/guides/QUICK_START.md"
                className="underline decoration-dotted underline-offset-4"
              >
                `guides/QUICK_START.md`
              </a>{" "}
              – instructor onboarding and provisioning.
            </li>
            <li>
              <a
                href="/docs/guides/RUN_APP.md"
                className="underline decoration-dotted underline-offset-4"
              >
                `guides/RUN_APP.md`
              </a>{" "}
              – running the dashboard and Supabase locally.
            </li>
            <li>
              <a
                href="/docs/command-line-tips.md"
                className="underline decoration-dotted underline-offset-4"
              >
                `command-line-tips.md`
              </a>{" "}
              – terminal productivity notes.
            </li>
          </ul>
        </Callout>
      </>
    ),
  },
];

export function Docs() {
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
              Shelly Platform Manual
            </h1>
            <p
              className="mt-4 max-w-3xl text-lg leading-relaxed"
              style={{ color: colors.text.secondary }}
            >
              A single reference for learners, instructors, and maintainers.
              Learn how the dashboard, CLI, templates, and Supabase services
              collaborate, and keep installation, configuration,
              troubleshooting, and support guides within reach.
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
