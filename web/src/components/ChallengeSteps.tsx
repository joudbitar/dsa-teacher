import { Code2, Lightbulb, Target, CheckCircle2, BookOpen, Zap } from 'lucide-react'
import { ChallengeStep } from '@/data/challenges/types'
import { cn } from '@/lib/utils'
import { OrganicStep } from './OrganicStep'
import { MarkdownContent } from './MarkdownContent'

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
    <div className="space-y-6">
      {/* Learning Outcome - Only show in multi-step view */}
      {!showOnlyCurrentStep && (
        <OrganicStep isCurrent={true} isCompleted={false} className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20 border border-accent/30">
              <Target className="h-5 w-5 text-accent" />
            </div>
            <h2 className="text-2xl font-bold font-mono text-[#3E2723]">Learning Outcome</h2>
          </div>
          <p className="text-lg text-[#3E2723]/90 leading-relaxed font-mono">
            {learningOutcome}
          </p>
        </OrganicStep>
      )}

      {/* Current Step Details */}
      {showOnlyCurrentStep && currentStepIndex >= 0 && currentStepIndex < steps.length && steps[currentStepIndex] && (
        <div className="space-y-6">
          {/* If step has detailed content, render it with MarkdownContent */}
          {steps[currentStepIndex].content ? (
            <div className="space-y-6">
              {(() => {
                // Split content by horizontal rules (---) to create separate sections
                const sections = steps[currentStepIndex].content!.split(/\n---\n/).filter(section => section.trim())
                return sections.map((section, index) => (
                  <OrganicStep key={index} isCurrent={false} isCompleted={false} className="p-6">
                    <MarkdownContent content={section.trim()} />
                  </OrganicStep>
                ))
              })()}
            </div>
          ) : (
            /* Otherwise, use the default step display */
            <OrganicStep isCurrent={true} isCompleted={false} className="p-6">
              <div className="flex items-start gap-6">
                {/* Step Content without number badge */}
                <div className="flex-1 space-y-6">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <Zap className="h-6 w-6 text-accent" />
                      <h2 className="text-2xl font-bold font-mono text-[#3E2723]">{steps[currentStepIndex].focus}</h2>
                    </div>
                    <p className="text-base text-[#3E2723]/90 font-medium leading-relaxed font-mono">
                      {steps[currentStepIndex].challenge}
                    </p>
                  </div>

                  {/* Concept Gained Card */}
                  <OrganicStep isCurrent={false} isCompleted={false} className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 border border-accent/20">
                        <Lightbulb className="h-5 w-5 text-accent" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-[#3E2723] mb-2 font-mono">Concept You'll Gain</h3>
                        <p className="text-base text-[#3E2723]/90 leading-relaxed font-mono">
                          {steps[currentStepIndex].conceptGained}
                        </p>
                      </div>
                    </div>
                  </OrganicStep>

                  {/* Visualization Card */}
                  {steps[currentStepIndex].visualization && (
                    <OrganicStep isCurrent={false} isCompleted={false} className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 border border-accent/20">
                          <Code2 className="h-5 w-5 text-accent" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-[#3E2723] mb-2 font-mono">Visualization</h3>
                          <p className="text-base text-[#3E2723]/90 leading-relaxed italic font-mono">
                            {steps[currentStepIndex].visualization}
                          </p>
                        </div>
                      </div>
                    </OrganicStep>
                  )}

                  {/* Learning Tips */}
                  <OrganicStep isCurrent={false} isCompleted={false} className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-success/10 border border-success/20">
                        <BookOpen className="h-5 w-5 text-success" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-[#3E2723] mb-2 font-mono">Pro Tip</h3>
                        <p className="text-base text-[#3E2723]/90 leading-relaxed font-mono">
                          Start by understanding the core operation. Test edge cases early—empty stacks, single elements, and maximum capacity. Use <code className="px-2 py-0.5 rounded bg-muted text-accent text-sm font-mono">dsa test</code> frequently to catch issues before they compound.
                        </p>
                      </div>
                    </div>
                  </OrganicStep>
                </div>
              </div>
            </OrganicStep>
          )}
        </div>
      )}

      {/* Step-by-Step Progression - Show all visible steps when not in single-step mode */}
      {!showOnlyCurrentStep && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold font-mono">Step-by-Step Progression</h2>
          <div className="space-y-16">
            {displaySteps.map((step, index) => {
              const originalIndex = steps.findIndex(s => s.step === step.step)
              const isCurrentStep = originalIndex === currentStepIndex
              
              return (
                <OrganicStep
                  key={step.step}
                  shapeVariant={index}
                  isCurrent={isCurrentStep}
                  isCompleted={false}
                  className="p-6"
                >
                  {/* Step Content without numbers */}
                  <div className="flex-1 space-y-3">
                    <div>
                      <h3 className={cn(
                        "text-xl font-bold mb-1 font-mono",
                        isCurrentStep ? "text-[#3E2723]" : "text-foreground"
                      )}>{step.focus}</h3>
                      <p className={cn(
                        "text-base font-medium font-mono",
                        isCurrentStep ? "text-[#3E2723]/90" : "text-foreground/90"
                      )}>{step.challenge}</p>
                      </div>

                      <div className="flex items-start gap-2">
                        <Lightbulb className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                        <div>
                        <p className={cn(
                          "text-sm font-medium mb-1 font-mono",
                          isCurrentStep ? "text-[#3E2723]/70" : "text-muted-foreground"
                        )}>Concept Gained:</p>
                        <p className={cn(
                          "text-sm font-mono",
                          isCurrentStep ? "text-[#3E2723]/80" : "text-foreground/80"
                        )}>{step.conceptGained}</p>
                        </div>
                      </div>

                      {step.visualization && (
                        <div className="flex items-start gap-2">
                          <Code2 className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                          <div>
                          <p className={cn(
                            "text-sm font-medium mb-1 font-mono",
                            isCurrentStep ? "text-[#3E2723]/70" : "text-muted-foreground"
                          )}>Visualization:</p>
                          <p className={cn(
                            "text-sm italic font-mono",
                            isCurrentStep ? "text-[#3E2723]/80" : "text-foreground/80"
                          )}>{step.visualization}</p>
                          </div>
                        </div>
                      )}
                  </div>
                </OrganicStep>
              )
            })}
          </div>
        </div>
      )}

      {/* Core Skills - Only show in multi-step view */}
      {!showOnlyCurrentStep && (
        <OrganicStep isCurrent={false} isCompleted={false} className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle2 className="h-5 w-5 text-success" />
            <h2 className="text-2xl font-bold font-mono text-[#3E2723]">Core Skills</h2>
          </div>
          <ul className="space-y-3">
            {coreSkills.map((skill, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/10 border border-accent/20 mt-0.5">
                  <span className="text-sm font-bold text-accent font-mono">{index + 1}</span>
                </div>
                <p className="text-base text-[#3E2723]/90 leading-relaxed font-mono">{skill}</p>
              </li>
            ))}
          </ul>
        </OrganicStep>
      )}

      {/* Integration Project - Show only on the integration project step */}
      {integrationProject && (!showOnlyCurrentStep || (currentStepIndex >= 0 && steps[currentStepIndex]?.focus === 'Integration Project')) && (
        <OrganicStep isCurrent={true} isCompleted={false} className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20 border border-accent/30">
              <Code2 className="h-5 w-5 text-accent" />
            </div>
            <h2 className="text-2xl font-bold font-mono text-[#3E2723]">Integration Project</h2>
          </div>
          <div className="space-y-3">
            <h3 className="text-xl font-semibold font-mono text-[#3E2723]">{integrationProject.title}</h3>
            <p className="text-[#3E2723]/90 leading-relaxed font-mono">
              {integrationProject.description}
            </p>
          </div>
        </OrganicStep>
      )}
    </div>
  )
}

