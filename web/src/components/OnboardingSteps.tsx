import { CheckCircle2, GitBranch, Code, FileCheck, BarChart3 } from 'lucide-react'

const steps = [
  {
    icon: CheckCircle2,
    title: 'Pick a Challenge',
    description: 'Choose a data structure or algorithm module to master',
  },
  {
    icon: GitBranch,
    title: 'Get Your Private Repo',
    description: 'We create a GitHub repo with starter code and tests',
  },
  {
    icon: Code,
    title: 'Code Locally & Test',
    description: 'Clone, implement, and run `dsa test` to check your work',
  },
  {
    icon: FileCheck,
    title: 'Submit Your Solution',
    description: 'Run `dsa submit` when ready to track your progress',
  },
  {
    icon: BarChart3,
    title: 'Track Progress',
    description: 'Watch your dashboard update in real-time as you master each concept',
  },
]

export function OnboardingSteps() {
  return (
    <section id="how-it-works" className="py-20 sm:py-32 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            A structured approach to learning data structures and algorithms
          </p>
        </div>

        <div className="relative">
          {/* Desktop: Horizontal timeline */}
          <div className="hidden md:block">
            <div className="flex items-start">
              {steps.map((step, index) => {
                const Icon = step.icon
                const isLast = index === steps.length - 1
                
                return (
                  <div key={index} className="flex flex-col items-center flex-1 relative">
                    <div className="flex flex-col items-center w-full">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-primary bg-primary text-primary-foreground relative z-10 shadow-md">
                        <Icon className="h-6 w-6" />
                      </div>
                      {!isLast && (
                        <div className="absolute left-1/2 top-6 h-0.5 w-full bg-gradient-to-r from-primary to-secondary -z-0" />
                      )}
                    </div>
                    <div className="mt-6 text-center max-w-[200px] mx-auto">
                      <h3 className="font-semibold">{step.title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Mobile: Vertical list */}
          <div className="md:hidden space-y-8">
            {steps.map((step, index) => {
              const Icon = step.icon
              
              return (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-primary text-primary-foreground shadow-md">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1 pt-2">
                    <h3 className="font-semibold">{step.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

