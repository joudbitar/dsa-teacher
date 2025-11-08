import { Code2, Lightbulb, Target, CheckCircle2, Copy, Check } from 'lucide-react'
import { ChallengeSteps } from './ChallengeSteps'
import { ChallengeData } from '@/data/challenges/types'
import { OrganicStep } from './OrganicStep'
import { cn } from '@/lib/utils'

interface TimelineStep {
  id: string
  name: string
  completed: boolean
}

// Language name mapping for display
const getLanguageDisplayName = (langId: string): string => {
  const languageNames: Record<string, string> = {
    typescript: 'TypeScript',
    python: 'Python',
    javascript: 'JavaScript',
    go: 'Go',
    java: 'Java',
    cpp: 'C++'
  }
  return languageNames[langId] || langId.charAt(0).toUpperCase() + langId.slice(1)
}

interface ChallengeInfoProps {
  title: string
  summary: string
  description: string
  concept: string
  benefits: string[]
  githubRepoUrl?: string
  challengeData?: ChallengeData
  currentStepIndex?: number
  timelineSteps?: TimelineStep[]
  selectedLanguage?: string
  onStartChallenge?: (language: string) => void
  showRepoCommand?: boolean
  repoCommand?: string
  onCopyCommand?: () => void
  copied?: boolean
  onNextStep?: () => void
  onPreviousStep?: () => void
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
  timelineSteps = [],
  selectedLanguage,
  onStartChallenge,
  showRepoCommand = false,
  repoCommand,
  onCopyCommand,
  copied = false,
  onNextStep,
  onPreviousStep
}: ChallengeInfoProps) {
  // Step 0 = Choose Language
  // Step 1+ = Challenge steps
  const isLanguageStep = currentStepIndex === 0
  const challengeStepIndex = currentStepIndex > 0 ? currentStepIndex - 1 : -1
  const currentStep = challengeData?.steps[challengeStepIndex]
  const currentTimelineStep = timelineSteps[currentStepIndex]

  return (
    <div className="flex-1 space-y-6">
      {/* Step 0: Language Selection - Show button */}
      {isLanguageStep && (
        <div className="text-center py-8 space-y-4">
          {!selectedLanguage ? (
            <button
              disabled
              className="px-6 py-3 rounded-lg bg-muted text-muted-foreground cursor-not-allowed font-medium"
            >
              Select a language
            </button>
          ) : (
            <>
              <button
                onClick={() => onStartChallenge?.(selectedLanguage)}
                className="px-6 py-3 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 font-medium transition-colors font-mono"
              >
                Start with {selectedLanguage ? getLanguageDisplayName(selectedLanguage) : 'Language'}
              </button>
            </>
          )}
        </div>
      )}

      {/* Step 1+: Show specific step details */}
      {!isLanguageStep && currentStep && challengeData && (
        <>
          {/* Show general challenge info only on first step (step 1) */}
          {challengeStepIndex === 0 && (
            <>
              {/* Repo command - shown at top of first step */}
              {showRepoCommand && repoCommand && (
                <OrganicStep isCurrent={false} isCompleted={false} className="p-6">
                  <p className="text-base text-[#3E2723]/90 mb-3 font-medium font-mono">Clone your repository:</p>
                  <div className="bg-muted rounded-lg p-4 relative">
                    <code className="text-sm text-foreground break-all pr-12 block font-mono">
                      {repoCommand}
                    </code>
                    <button
                      onClick={onCopyCommand}
                      className="absolute top-2 right-2 p-2 rounded-lg hover:bg-background transition-colors"
                      title="Copy to clipboard"
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-success" />
                      ) : (
                        <Copy className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </OrganicStep>
              )}
              
              {/* Description */}
              <OrganicStep isCurrent={false} isCompleted={false} className="p-6">
                <p className="text-base text-[#3E2723]/90 leading-relaxed font-mono">
                  {description}
                </p>
              </OrganicStep>

              {/* Concept Explanation */}
              <OrganicStep isCurrent={false} isCompleted={false} className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 border border-accent/20">
                    <Lightbulb className="h-5 w-5 text-accent" />
                  </div>
                  <h2 className="text-2xl font-bold font-mono text-[#3E2723]">Understanding the Concept</h2>
                </div>
                <p className="text-base text-[#3E2723]/90 leading-relaxed font-mono">
                  {concept}
                </p>
              </OrganicStep>

              {/* How This Helps You */}
              <OrganicStep isCurrent={false} isCompleted={false} className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10 border border-success/20">
                    <Target className="h-5 w-5 text-success" />
                  </div>
                  <h2 className="text-2xl font-bold font-mono text-[#3E2723]">How This Helps You</h2>
                </div>
                <ul className="space-y-3">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/10 mt-0.5">
                        <span className="text-xs font-bold text-accent font-mono">{index + 1}</span>
                      </div>
                      <p className="text-base text-[#3E2723]/90 font-mono">{benefit}</p>
                    </li>
                  ))}
                </ul>
              </OrganicStep>
            </>
          )}

          {/* Learning Outcome - Always show at top of step */}
          <OrganicStep isCurrent={true} isCompleted={false} className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20 border border-accent/30">
                <Target className="h-5 w-5 text-accent" />
              </div>
              <h2 className="text-2xl font-bold font-mono text-[#3E2723]">Learning Outcome</h2>
            </div>
            <p className="text-base text-[#3E2723]/90 leading-relaxed font-mono">
              {challengeData.learningOutcome}
            </p>
          </OrganicStep>

          <ChallengeSteps
            steps={challengeData.steps}
            learningOutcome={challengeData.learningOutcome}
            coreSkills={challengeData.coreSkills}
            integrationProject={challengeData.integrationProject}
            currentStepIndex={challengeStepIndex}
            showOnlyCurrentStep={true}
            onNextStep={onNextStep}
          />

          {/* Core Skills - Show for each step */}
          <OrganicStep isCurrent={false} isCompleted={false} className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle2 className="h-5 w-5 text-success" />
              <h2 className="text-2xl font-bold font-mono text-[#3E2723]">Core Skills You'll Build</h2>
            </div>
            <ul className="space-y-3">
              {challengeData.coreSkills.map((skill, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/10 border border-accent/20 mt-0.5">
                    <span className="text-sm font-bold text-accent font-mono">{index + 1}</span>
                  </div>
                  <p className="text-base text-[#3E2723]/90 leading-relaxed font-mono">{skill}</p>
                </li>
              ))}
            </ul>
          </OrganicStep>

          {/* Get Started Section - Enhanced */}
          {githubRepoUrl && challengeStepIndex === 0 && (
            <OrganicStep isCurrent={false} isCompleted={false} className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20 border border-accent/30">
                  <Code2 className="h-5 w-5 text-accent" />
                </div>
                <h2 className="text-2xl font-bold font-mono text-[#3E2723]">Get Started</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-base text-[#3E2723]/90 mb-3 font-medium font-mono">
                    Clone your repository and start building:
                  </p>
                  <div className="rounded-lg border-2 border-accent/20 bg-background p-4 font-mono text-sm">
                    <code className="text-foreground font-mono">git clone {githubRepoUrl}</code>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-base text-[#3E2723]/90 font-medium font-mono">Next steps:</p>
                  <ol className="space-y-2 ml-4 list-decimal text-[#3E2723]/90 font-mono">
                    <li>Navigate to the project directory: <code className="px-2 py-1 rounded bg-muted text-accent text-sm font-mono">cd {challengeData.id}-{selectedLanguage || 'your-language'}</code></li>
                    <li>Install dependencies: <code className="px-2 py-1 rounded bg-muted text-accent text-sm font-mono">npm install</code> or <code className="px-2 py-1 rounded bg-muted text-accent text-sm font-mono">pnpm install</code></li>
                    <li>Run tests to check your progress: <code className="px-2 py-1 rounded bg-muted text-accent text-sm font-mono">dsa test</code></li>
                    <li>Submit your solution: <code className="px-2 py-1 rounded bg-muted text-accent text-sm font-mono">dsa submit</code></li>
                  </ol>
                </div>
              </div>
            </OrganicStep>
          )}

          {/* Navigation Buttons - Single section at the very end */}
          {!isLanguageStep && challengeData && (
            <div className="flex justify-between items-center pt-6 mt-6 border-t border-border">
              {/* Back Button */}
              {currentStepIndex > 0 && onPreviousStep && (
                <button
                  onClick={onPreviousStep}
                  className="px-6 py-3 rounded-lg border-2 border-border bg-background hover:bg-muted font-medium font-mono transition-colors"
                >
                  ← Back
                </button>
              )}
              {/* Spacer if no back button */}
              {currentStepIndex === 0 && <div />}
              
              {/* Next Step Button - Only show if not on last step */}
              {challengeStepIndex >= 0 && challengeStepIndex < challengeData.steps.length - 1 && onNextStep && (
                <button
                  onClick={onNextStep}
                  className="px-6 py-3 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 font-medium font-mono transition-colors"
                >
                  Next Step →
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}

