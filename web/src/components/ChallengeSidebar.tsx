import { Check, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Subchallenge {
  id: string
  name: string
  completed: boolean
}

interface ChallengeSidebarProps {
  title: string
  subchallenges: Subchallenge[]
  progress: number
  time: string
  level: string
  selectedLanguage?: string
  currentStepIndex?: number
  onStepClick?: (stepIndex: number) => void
}

export function ChallengeSidebar({ title, subchallenges, progress, time, level, selectedLanguage, currentStepIndex = 0, onStepClick }: ChallengeSidebarProps) {
  const isIntermediate = level === 'Intermediate'
  const isAdvanced = level === 'Advanced'
  
  const languageNames: Record<string, string> = {
    typescript: 'TypeScript',
    python: 'Python',
    javascript: 'JavaScript',
    go: 'Go',
    java: 'Java',
    cpp: 'C++'
  }

  return (
    <aside className="w-full">
      <div>
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{title}</h2>
          <div className="flex items-center gap-3 mb-6 flex-wrap">
            <span className={cn(
              "rounded-full px-3 py-1.5 text-sm font-medium",
              isAdvanced
                ? "bg-destructive/20 text-destructive"
                : isIntermediate
                ? "bg-warning/20 text-warning"
                : "bg-success/20 text-success"
            )}>
              {level}
            </span>
            <span className="text-base text-muted-foreground">{time}</span>
            {selectedLanguage && (
              <span className="rounded-full px-3 py-1.5 text-sm font-medium bg-accent/20 text-accent border border-accent/30">
                {languageNames[selectedLanguage] || selectedLanguage}
              </span>
            )}
          </div>
          
          {/* Progress */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-base">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-semibold text-lg">{progress}%</span>
            </div>
            <div className="h-3 rounded-full bg-muted overflow-hidden">
              <div 
                className="h-full bg-success rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-1">
          <h3 className="text-base font-semibold mb-6 text-muted-foreground uppercase tracking-wide">
            Project Timeline
          </h3>
          <div className="relative">
            <div className="space-y-0">
              {subchallenges.map((sub, index) => {
                const prevCompleted = index > 0 ? subchallenges[index - 1]?.completed : false
                const isLineActive = sub.completed || prevCompleted
                const isCurrentStep = currentStepIndex === index
                const isClickable = sub.completed || index === 0 || (index > 0 && subchallenges[index - 1]?.completed)
                
                // Check if there's a step after this one
                const hasNext = index < subchallenges.length - 1
                
                const stepContent = (
                  <div className={cn(
                    "flex items-start gap-4 relative pb-20 last:pb-0",
                    isClickable && "cursor-pointer",
                    isCurrentStep && "bg-accent/10 rounded-lg p-2 -m-2"
                  )}
                  onClick={() => isClickable && onStepClick?.(index)}
                  >
                    {/* Connecting line segment between items - fixed 80px spacing */}
                    {hasNext && (
                      <div 
                        className={cn(
                          "absolute left-4 w-0.5",
                          isLineActive ? "bg-success/50" : "bg-border"
                        )}
                        style={{ 
                          top: '32px',
                          height: '80px'
                        }}
                      />
                    )}
                    
                    {/* Icon */}
                    <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center">
                      {sub.completed ? (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success text-success-foreground border-2 border-success">
                          <Check className="h-5 w-5" />
                        </div>
                      ) : (
                        <div className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-full border-2 bg-background",
                          isCurrentStep ? "border-accent" : "border-border"
                        )}>
                          <Circle className="h-3 w-3 fill-current text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    
                    {/* Text */}
                    <div className="flex-1 pt-0.5">
                      <p className={cn(
                        "text-base leading-relaxed",
                        sub.completed ? "text-foreground/70 line-through" : "text-foreground",
                        isCurrentStep && !sub.completed && "font-semibold text-accent"
                      )}>
                        {sub.name}
                      </p>
                    </div>
                  </div>
                )
                
                return stepContent
              })}
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}

