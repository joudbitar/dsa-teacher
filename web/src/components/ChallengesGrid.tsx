import { Link, useLocation } from 'react-router-dom'
import { Layers, Search, Minus, Code2 } from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { OrganicStep } from './OrganicStep'
import { TurtleProgress } from './TurtleProgress'
import { getChallengeProgress, calculateProgressPercentage } from '@/utils/challengeProgress'
import { challengeData } from '@/data/challenges'
import { apiClient, Module } from '@/lib/api'

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
}

export function ChallengesGrid({ modules }: ChallengesGridProps) {
  const [moduleProgress, setModuleProgress] = useState<Record<string, number>>({})
  const location = useLocation()

  // Function to load and update progress from API and localStorage
  const updateProgress = useCallback(async () => {
    const progress: Record<string, number> = {}
    
    try {
      // Fetch all user projects from API
      const projects = await apiClient.getProjects()

      // Build progress map from API projects (this is the source of truth)
      projects.forEach((project) => {
        progress[project.moduleId] = project.progress
      })

      // Also check localStorage for any modules not in API
      modules.forEach((module) => {
        if (!(module.id in progress)) {
          const savedProgress = getChallengeProgress(module.id)
          const challenge = challengeData[module.id]
          
          if (savedProgress && challenge) {
            // Total steps = challenge steps + 1 (for "Choose Language" step)
            const totalSteps = challenge.steps.length + 1
            // Ensure completedSteps is an array and calculate progress
            const completedStepsArray = Array.isArray(savedProgress.completedSteps) 
              ? savedProgress.completedSteps 
              : []
            const calculatedProgress = calculateProgressPercentage(completedStepsArray, totalSteps)
            progress[module.id] = calculatedProgress
          } else {
            progress[module.id] = 0
          }
        }
      })
    } catch (error) {
      console.error('Failed to load progress from API, falling back to localStorage:', error)
      // Fallback to localStorage only if API fails
      modules.forEach((module) => {
        const savedProgress = getChallengeProgress(module.id)
        const challenge = challengeData[module.id]
        
        if (savedProgress && challenge) {
          const totalSteps = challenge.steps.length + 1
          const completedStepsArray = Array.isArray(savedProgress.completedSteps) 
            ? savedProgress.completedSteps 
            : []
          const calculatedProgress = calculateProgressPercentage(completedStepsArray, totalSteps)
          progress[module.id] = calculatedProgress
        } else {
          progress[module.id] = 0
        }
      })
    }
    
    setModuleProgress(progress)
  }, [modules])

  // Load progress for all modules
  useEffect(() => {
    updateProgress()
  }, [location.pathname, updateProgress]) // Reload when navigating to Challenges page

  // Also reload on window focus (when user switches back to the tab)
  useEffect(() => {
    const handleFocus = () => {
      updateProgress()
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [updateProgress])

  // Listen for custom event to refresh progress when it changes in ChallengeDetail
  useEffect(() => {
    const handleProgressUpdate = () => {
      // Refresh progress when any challenge progress is updated
      updateProgress()
    }

    // Listen for custom event fired when progress is updated
    window.addEventListener('challenge-progress-updated', handleProgressUpdate)
    return () => window.removeEventListener('challenge-progress-updated', handleProgressUpdate)
  }, [updateProgress])

  return (
    <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 challenges-page">
      {modules.map((module) => {
        const Icon = iconMap[module.id] || Code2
        const isIntermediate = module.level === 'Intermediate'
        const isAdvanced = module.level === 'Advanced'
        const progress = moduleProgress[module.id] || 0
        
        return (
          <div
            key={module.id}
            className="transition-none"
            style={{ transform: 'none' }}
          >
            <Link
              to={`/challenges/${module.id}`}
              className="block"
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

                {/* Start Building - Bottom right */}
                <div className="absolute bottom-6 right-6 text-sm text-primary font-medium font-mono">
                  <span>Start building →</span>
                </div>
              </OrganicStep>
            </Link>
          </div>
        )
      })}
    </div>
  )
}

