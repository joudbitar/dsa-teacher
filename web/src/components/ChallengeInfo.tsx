import { Code2, Lightbulb, Target } from 'lucide-react'
import { ChallengeSteps } from './ChallengeSteps'
import { ChallengeData } from '@/data/challenges/types'

interface TimelineStep {
  id: string
  name: string
  completed: boolean
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
  timelineSteps: _timelineSteps = [] // Reserved for future use
}: ChallengeInfoProps) {
  // Step 0 = Choose Language
  // Step 1+ = Challenge steps
  const isLanguageStep = currentStepIndex === 0
  const challengeStepIndex = currentStepIndex > 0 ? currentStepIndex - 1 : -1
  const currentStep = challengeData?.steps[challengeStepIndex]
  // const currentTimelineStep = timelineSteps[currentStepIndex] // Reserved for future use

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
            <p className="text-foreground/90 leading-relaxed">
              {concept}
            </p>
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
                    <span className="text-xs font-bold text-accent">{index + 1}</span>
                  </div>
                  <p className="text-foreground/90">{benefit}</p>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      {/* Step 1+: Show specific step details */}
      {!isLanguageStep && currentStep && challengeData && (
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
          <div className="flex items-center gap-3 mb-4">
            <Code2 className="h-5 w-5 text-accent" />
            <h2 className="text-xl font-bold">Get Started</h2>
          </div>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Clone your repository and start building:
            </p>
            <div className="rounded-lg border border-border bg-muted/50 p-4 font-mono text-sm">
              <code className="text-foreground">git clone {githubRepoUrl}</code>
            </div>
            <p className="text-sm text-muted-foreground">
              Then run <code className="px-2 py-1 rounded bg-muted text-accent">dsa test</code> to check your progress.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

