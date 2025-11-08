import { Code2, Lightbulb, Target, CheckCircle2 } from 'lucide-react'
import { ChallengeStep } from '@/data/challenges/types'
import { cn } from '@/lib/utils'

interface ChallengeStepsProps {
  steps: ChallengeStep[]
  learningOutcome: string
  coreSkills: string[]
  integrationProject?: {
    title: string
    description: string
  }
  currentStepIndex?: number // Index of the current step (0-based, -1 if no step started)
  showOnlyCurrentStep?: boolean // If true, only show the current step details
}

export function ChallengeSteps({ steps, learningOutcome, coreSkills, integrationProject, currentStepIndex = -1, showOnlyCurrentStep = false }: ChallengeStepsProps) {
  // Filter steps based on showOnlyCurrentStep
  const displaySteps = showOnlyCurrentStep && currentStepIndex >= 0
    ? [steps[currentStepIndex]].filter(Boolean)
    : steps.filter((_, index) => currentStepIndex >= index)

  return (
    <div className="space-y-8">
      {/* Learning Outcome - Show only if showing all steps or on first step */}
      {(!showOnlyCurrentStep || currentStepIndex === 0) && (
        <div className="rounded-xl border border-border bg-muted p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 border border-accent/20">
              <Target className="h-5 w-5 text-accent" />
            </div>
            <h2 className="text-2xl font-bold">Learning Outcome</h2>
          </div>
          <p className="text-foreground/90 leading-relaxed">
            {learningOutcome}
          </p>
        </div>
      )}

      {/* Current Step Details */}
      {showOnlyCurrentStep && currentStepIndex >= 0 && currentStepIndex < steps.length && steps[currentStepIndex] && (
        <div className="space-y-6">
          <div className="rounded-xl border-2 border-accent bg-accent/5 p-6">
            <div className="flex items-start gap-4">
              {/* Step Number */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground font-bold text-lg">
                {steps[currentStepIndex].step}
              </div>

              {/* Step Content */}
              <div className="flex-1 space-y-4">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{steps[currentStepIndex].focus}</h2>
                  <p className="text-lg text-foreground/90 font-medium">{steps[currentStepIndex].challenge}</p>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg bg-background/50">
                  <Lightbulb className="h-5 w-5 text-accent mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground mb-2">Concept You'll Gain:</p>
                    <p className="text-base text-foreground/90">{steps[currentStepIndex].conceptGained}</p>
                  </div>
                </div>

                {steps[currentStepIndex].visualization && (
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-background/50">
                    <Code2 className="h-5 w-5 text-accent mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground mb-2">Visualization:</p>
                      <p className="text-base text-foreground/90 italic">{steps[currentStepIndex].visualization}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step-by-Step Progression - Show all visible steps when not in single-step mode */}
      {!showOnlyCurrentStep && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Step-by-Step Progression</h2>
          <div className="space-y-4">
            {displaySteps.map((step, index) => {
              const originalIndex = steps.findIndex(s => s.step === step.step)
              const isCurrentStep = originalIndex === currentStepIndex
              
              return (
                <div
                  key={step.step}
                  className={cn(
                    "rounded-xl border p-6 transition-all",
                    step.focus === 'Integration Project'
                      ? "border-accent bg-accent/5"
                      : isCurrentStep
                      ? "border-accent bg-accent/5"
                      : "border-border bg-muted"
                  )}
                >
                  <div className="flex items-start gap-4">
                    {/* Step Number */}
                    <div className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold text-lg",
                      step.focus === 'Integration Project'
                        ? "bg-accent text-accent-foreground"
                        : isCurrentStep
                        ? "bg-accent text-accent-foreground"
                        : "bg-muted text-foreground"
                    )}>
                      {step.step}
                    </div>

                    {/* Step Content */}
                    <div className="flex-1 space-y-3">
                      <div>
                        <h3 className="text-xl font-bold mb-1">{step.focus}</h3>
                        <p className="text-foreground/90 font-medium">{step.challenge}</p>
                      </div>

                      <div className="flex items-start gap-2">
                        <Lightbulb className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-1">Concept Gained:</p>
                          <p className="text-sm text-foreground/80">{step.conceptGained}</p>
                        </div>
                      </div>

                      {step.visualization && (
                        <div className="flex items-start gap-2">
                          <Code2 className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">Visualization:</p>
                            <p className="text-sm text-foreground/80 italic">{step.visualization}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Core Skills - Show only if showing all steps or on first step */}
      {(!showOnlyCurrentStep || currentStepIndex === 0) && (
        <div className="rounded-xl border border-border bg-muted p-6">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle2 className="h-5 w-5 text-success" />
            <h2 className="text-2xl font-bold">Core Skills</h2>
          </div>
          <ul className="space-y-2">
            {coreSkills.map((skill, index) => (
              <li key={index} className="flex items-center gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/10">
                <span className="text-xs font-bold text-accent">{index + 1}</span>
                </div>
                <p className="text-foreground/90">{skill}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Integration Project - Show only on the integration project step */}
      {integrationProject && (!showOnlyCurrentStep || (currentStepIndex >= 0 && steps[currentStepIndex]?.focus === 'Integration Project')) && (
        <div className="rounded-xl border-2 border-accent bg-accent/5 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20 border border-accent/30">
              <Code2 className="h-5 w-5 text-accent" />
            </div>
            <h2 className="text-2xl font-bold">Integration Project</h2>
          </div>
          <div className="space-y-3">
            <h3 className="text-xl font-semibold">{integrationProject.title}</h3>
            <p className="text-foreground/90 leading-relaxed">
              {integrationProject.description}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

