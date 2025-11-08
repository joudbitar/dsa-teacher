import {
  Code2,
  Lightbulb,
  Target,
  CheckCircle2,
  AlertCircle,
  Check,
} from "lucide-react";
import { ChallengeSteps } from "./ChallengeSteps";
import { ChallengeData } from "@/data/challenges/types";
import { getSubchallengeInstruction } from "@/data/subchallenge-instructions";

interface TimelineStep {
  id: string;
  name: string;
  completed: boolean;
}

interface ChallengeInfoProps {
  title: string;
  summary: string;
  description: string;
  concept: string;
  benefits: string[];
  githubRepoUrl?: string;
  challengeData?: ChallengeData;
  currentStepIndex?: number;
  timelineSteps?: TimelineStep[];
  selectedLanguage?: string;
  onStartChallenge?: (language: string) => void;
  isCreatingProject?: boolean;
  projectError?: string | null;
  moduleId?: string; // e.g., 'stack', 'min-heap'
  subchallengeName?: string; // e.g., 'Insert', 'Heapify up'
  onNewAttempt?: () => void; // Callback to go back to language selection
}

export function ChallengeInfo({
  title,
  summary,
  description,
  concept,
  benefits,
  githubRepoUrl,
  challengeData,
  currentStepIndex = 0,
  timelineSteps: _timelineSteps = [], // Reserved for future use
  selectedLanguage,
  onStartChallenge,
  isCreatingProject = false,
  projectError = null,
  moduleId,
  onNewAttempt,
  subchallengeName,
}: ChallengeInfoProps) {
  // Step 0 = Choose Language
  // Step 1+ = Challenge steps
  const isLanguageStep = currentStepIndex === 0;
  const challengeStepIndex = currentStepIndex > 0 ? currentStepIndex - 1 : -1;
  const currentStep = challengeData?.steps[challengeStepIndex];
  // const currentTimelineStep = timelineSteps[currentStepIndex] // Reserved for future use

  // Get detailed instructions for the current subchallenge
  const instruction =
    moduleId && subchallengeName
      ? getSubchallengeInstruction(moduleId, subchallengeName)
      : null;

  // Helper to get display name for language
  const getLanguageDisplayName = (lang: string) => {
    const displayNames: Record<string, string> = {
      typescript: "TypeScript",
      javascript: "JavaScript",
      python: "Python",
      go: "Go",
      java: "Java",
      "c++": "C++",
    };
    return displayNames[lang.toLowerCase()] || lang;
  };

  return (
    <div className="flex-1 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-4">{title}</h1>
        <p className="text-xl text-muted-foreground">{summary}</p>
      </div>

      {/* Step 0: Language Selection - Show general info */}
      {isLanguageStep && (
        <>
          {/* Description */}
          <div className="prose prose-invert max-w-none">
            <p className="text-lg text-foreground/90 leading-relaxed">
              {description}
            </p>
          </div>

          {/* Concept Explanation */}
          <div className="rounded-xl border border-border bg-muted p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 border border-accent/20">
                <Lightbulb className="h-5 w-5 text-accent" />
              </div>
              <h2 className="text-2xl font-bold">Understanding the Concept</h2>
            </div>
            <p className="text-foreground/90 leading-relaxed">{concept}</p>
          </div>

          {/* How This Helps You */}
          <div className="rounded-xl border border-border bg-muted p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10 border border-success/20">
                <Target className="h-5 w-5 text-success" />
              </div>
              <h2 className="text-2xl font-bold">How This Helps You</h2>
            </div>
            <ul className="space-y-3">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/10 mt-0.5">
                    <span className="text-xs font-bold text-accent">
                      {index + 1}
                    </span>
                  </div>
                  <p className="text-foreground/90">{benefit}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Error Display */}
          {projectError && (
            <div className="p-4 bg-destructive/10 border border-destructive rounded-lg">
              <div className="space-y-2">
                <p className="text-destructive font-semibold">Error creating project:</p>
                <p className="text-destructive whitespace-pre-wrap text-sm">{projectError}</p>
              </div>
            </div>
          )}

          {/* Start Button or Existing Repo Info */}
          <div className="text-center py-4">
            {githubRepoUrl ? (
              /* User already has a repo - show existing repo info */
              <div className="rounded-xl border border-border bg-card p-6 space-y-4">
                <div className="flex items-center justify-center gap-2 text-success">
                  <Check className="h-5 w-5" />
                  <h3 className="text-lg font-semibold">Repository Already Created</h3>
                </div>
                <p className="text-muted-foreground text-sm">
                  You're working on this challenge with <span className="font-semibold text-foreground">{getLanguageDisplayName(selectedLanguage || '')}</span>. 
                  Clone your repository and run <code className="px-2 py-1 rounded bg-muted text-accent">dsa test</code> to continue.
                </p>
                <div className="pt-2 text-xs text-muted-foreground">
                  <p>Want to start over? Visit the Challenges page and click "Restart" on this module.</p>
                </div>
              </div>
            ) : (
              /* No repo yet - show start button */
              <>
                {!selectedLanguage ? (
                  <button
                    disabled
                    className="px-6 py-3 rounded-lg bg-muted text-muted-foreground cursor-not-allowed font-medium"
                  >
                    Select a language to continue
                  </button>
                ) : (
                  <button
                    onClick={() => onStartChallenge?.(selectedLanguage)}
                    disabled={isCreatingProject}
                    className="px-6 py-3 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 font-medium transition-colors font-mono disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isCreatingProject ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin">⏳</span>
                        Creating repository...
                      </span>
                    ) : (
                      `Start with ${getLanguageDisplayName(selectedLanguage)}`
                    )}
                  </button>
                )}
              </>
            )}
          </div>
        </>
      )}

      {/* Step 1+: Show detailed coding instructions */}
      {!isLanguageStep && instruction && (
        <div className="space-y-6">
          {/* Objective */}
          <div className="rounded-xl border border-border bg-muted p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 border border-accent/20">
                <Target className="h-5 w-5 text-accent" />
              </div>
              <h2 className="text-2xl font-bold">{instruction.title}</h2>
            </div>
            <p className="text-lg text-foreground/90">
              {instruction.objective}
            </p>
          </div>

          {/* Method Signature */}
          {selectedLanguage &&
            instruction.methodSignature[selectedLanguage.toLowerCase()] && (
              <div className="rounded-xl border border-border bg-muted p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Code2 className="h-5 w-5 text-accent" />
                  <h3 className="text-xl font-bold">Method Signature</h3>
                </div>
                <div className="rounded-lg border border-border bg-background p-4 font-mono text-sm overflow-x-auto">
                  <code className="text-accent">
                    {
                      instruction.methodSignature[
                        selectedLanguage.toLowerCase()
                      ]
                    }
                  </code>
                </div>
              </div>
            )}

          {/* Requirements */}
          <div className="rounded-xl border border-border bg-muted p-6">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle2 className="h-5 w-5 text-success" />
              <h3 className="text-xl font-bold">Requirements</h3>
            </div>
            <ul className="space-y-2">
              {instruction.requirements.map((req, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                  <span className="text-foreground/90">{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Examples */}
          <div className="rounded-xl border border-border bg-muted p-6">
            <div className="flex items-center gap-3 mb-4">
              <Lightbulb className="h-5 w-5 text-accent" />
              <h3 className="text-xl font-bold">Examples</h3>
            </div>
            <div className="space-y-4">
              {instruction.examples.map((example, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-border bg-background p-4 space-y-3"
                >
                  <div>
                    <div className="text-sm font-semibold text-muted-foreground mb-2">
                      Input:
                    </div>
                    <pre className="font-mono text-sm text-foreground/90 whitespace-pre-wrap">
                      {example.input}
                    </pre>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-muted-foreground mb-2">
                      Output:
                    </div>
                    <pre className="font-mono text-sm text-success whitespace-pre-wrap">
                      {example.output}
                    </pre>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-muted-foreground mb-2">
                      Explanation:
                    </div>
                    <p className="text-sm text-foreground/90">
                      {example.explanation}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hints */}
          <div className="rounded-xl border border-border bg-muted p-6">
            <div className="flex items-center gap-3 mb-4">
              <Lightbulb className="h-5 w-5 text-warning" />
              <h3 className="text-xl font-bold">Hints</h3>
            </div>
            <ul className="space-y-2">
              {instruction.hints.map((hint, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-warning mt-0.5">💡</span>
                  <span className="text-foreground/90">{hint}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Edge Cases */}
          <div className="rounded-xl border border-border bg-muted p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <h3 className="text-xl font-bold">Edge Cases to Test</h3>
            </div>
            <ul className="space-y-2">
              {instruction.edgeCases.map((edge, i) => (
                <li key={i} className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                  <span className="text-foreground/90">{edge}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Fallback: Show old step format if no instruction found */}
      {!isLanguageStep && !instruction && currentStep && challengeData && (
        <ChallengeSteps
          steps={challengeData.steps}
          learningOutcome={challengeData.learningOutcome}
          coreSkills={challengeData.coreSkills}
          integrationProject={challengeData.integrationProject}
          currentStepIndex={challengeStepIndex}
          showOnlyCurrentStep={true}
        />
      )}

      {/* GitHub Repo (if available) */}
      {githubRepoUrl && !isLanguageStep && (
        <div className="rounded-xl border border-border bg-muted p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Code2 className="h-5 w-5 text-accent" />
              <h2 className="text-xl font-bold">Get Started</h2>
            </div>
            <button
              onClick={onNewAttempt}
              className="px-4 py-2 rounded-lg bg-accent/10 text-accent hover:bg-accent/20 font-medium transition-colors text-sm"
              title="Create a new repository for another attempt"
            >
              + New Attempt
            </button>
          </div>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Clone your repository and start building:
            </p>
            <div className="rounded-lg border border-border bg-muted/50 p-4 font-mono text-sm">
              <code className="text-foreground">git clone {githubRepoUrl}</code>
            </div>
            <p className="text-sm text-muted-foreground">
              Then run{" "}
              <code className="px-2 py-1 rounded bg-muted text-accent">
                dsa test
              </code>{" "}
              to check your progress.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
