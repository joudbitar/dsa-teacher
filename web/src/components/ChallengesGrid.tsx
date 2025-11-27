import { ProtectedLink } from '@/components/auth/ProtectedLink'
import { Layers, Search, Minus, Code2, Lock } from 'lucide-react'
import { useMemo } from 'react'
import { OrganicStep } from './OrganicStep'
import { TurtleProgress } from './TurtleProgress'
import { Module, Project } from '@/lib/api'
import { useAuth } from '@/auth/useAuth'

// Icon mapping for different data structures
const iconMap: Record<string, any> = {
  stack: Layers,
  queue: Layers,
  'binary-search': Search,
  'min-heap': Minus,
  'linked-list': Minus,
}

interface ChallengesGridProps {
  modules: Module[]
  projects: Project[]
}

export function ChallengesGrid({ modules, projects }: ChallengesGridProps) {
  const { user } = useAuth()

  // Calculate progress for each module based on projects prop
  // Only show progress from projects that exist in the projects array
  // Default to 0% if no project exists for a module
  const moduleProgress = useMemo(() => {
    const progress: Record<string, number> = {}
    
    // Initialize all modules to 0%
    modules.forEach((module) => {
      progress[module.id] = 0
    })
    
    // Update progress for modules that have projects
    projects.forEach((project) => {
      if (project.moduleId in progress) {
        // Only show progress for in-progress or completed projects
        // If project exists, use its progress value
        progress[project.moduleId] = project.progress
      }
    })
    
    return progress
  }, [modules, projects])

  return (
    <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 challenges-page">
      {modules.map((module) => {
        const Icon = iconMap[module.id] || Code2
        const progress = moduleProgress[module.id] || 0
        
        return (
          <div
            key={module.id}
            className="transition-none"
            style={{ transform: 'none' }}
          >
            <ProtectedLink
              to={`/challenges/${module.id}`}
              className="block relative"
              style={{ transform: 'none' }}
            >
              <OrganicStep
                isCurrent={false}
                isCompleted={progress === 100}
                className="p-6 h-full relative"
              >
                {/* Icon and Title */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 aspect-square items-center justify-center rounded-sm bg-primary/10 border border-primary/20">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold font-mono">{module.title}</h3>
                    </div>
                  </div>
                  <span className="rounded-full px-2.5 py-1 text-xs font-medium font-mono bg-[#7F5539] text-white">
                    {module.level}
                  </span>
                </div>

                {/* Summary */}
                <p className="text-sm text-muted-foreground mb-4 font-mono">{module.summary}</p>

                {/* Turtle Progress */}
                <div className="mb-4">
                  <TurtleProgress progress={progress} />
                </div>

                {/* Start Building / Sign in - Bottom right */}
                <div className="absolute bottom-6 right-6">
                  {!user ? (
                    <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-warning/20 text-warning text-sm font-medium font-mono">
                      <Lock className="h-4 w-4" />
                      <span>Sign in</span>
                    </div>
                  ) : (
                    <span className="text-sm text-primary font-medium font-mono">Start building →</span>
                  )}
                </div>
              </OrganicStep>
            </ProtectedLink>
          </div>
        )
      })}
    </div>
  )
}

