import { useState, useEffect, useMemo } from 'react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { ChallengesGrid } from '@/components/ChallengesGrid'
import { useTheme } from '@/theme/ThemeContext'
import { apiClient, Module, fetchUserProjects, type Project } from '@/lib/api'
import { useAuth } from '@/auth/useAuth'
import { Link, useLocation } from 'react-router-dom'
import { challengeData } from '@/data/challenges'
import { ArrowRight, Layers, Search, Minus, Code2, CheckCircle2 } from 'lucide-react'

// Helper function to convert hex to rgba
function hexToRgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

// Icon mapping for different data structures
const iconMap: Record<string, any> = {
  stack: Layers,
  queue: Layers,
  'binary-search': Search,
  'min-heap': Minus,
  'linked-list': Minus,
}

export function Challenges() {
  const { backgroundColor, textColor, borderColor, secondaryTextColor, accentGreen } = useTheme()
  const location = useLocation()
  const { user } = useAuth()
  const [modules, setModules] = useState<Module[]>([])
  const [modulesLoading, setModulesLoading] = useState(true)
  const [modulesError, setModulesError] = useState<string | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [projectsLoading, setProjectsLoading] = useState(true)

  // Load modules for ChallengesGrid
  useEffect(() => {
    async function loadModules() {
      try {
        setModulesLoading(true)
        const data = await apiClient.getModules()
        setModules(data)
      } catch (err) {
        console.error('Failed to load modules:', err)
        setModulesError(err instanceof Error ? err.message : 'Failed to load modules')
      } finally {
        setModulesLoading(false)
      }
    }

    loadModules()
  }, [])

  // Fetch projects from API for Your Library section
  useEffect(() => {
    const loadProjects = async () => {
      if (!user) {
        setProjects([])
        setProjectsLoading(false)
        return
      }

      setProjectsLoading(true)
      try {
        const fetchedProjects = await fetchUserProjects()
        setProjects(fetchedProjects)
      } catch (error) {
        console.error('Error loading projects:', error)
        setProjects([])
      } finally {
        setProjectsLoading(false)
      }
    }

    loadProjects()

    // Poll for updates every 10 seconds to catch CLI submissions
    const interval = setInterval(loadProjects, 10000)

    return () => clearInterval(interval)
  }, [user, location.pathname])

  // Calculate challenge statistics and collect all library challenges from database projects
  const { libraryChallenges, inProgressCount, completedCount } = useMemo(() => {
    let inProgress = 0
    let completed = 0
    const challenges: Array<{
      id: string
      title: string
      level: string
      completedTasks: number
      totalTasks: number
      progressPercentage: number
      lastUpdated: number
      status: 'in-progress' | 'completed'
      project: Project
    }> = []

    // Map database projects to challenge display format
    projects.forEach(project => {
      const challenge = challengeData[project.moduleId]
      if (!challenge) return

      // Get total number of subchallenges (test cases)
      // Filter out "Choose Language", "Create class", "Create node" for task counting
      const methodsToImplement = challenge.subchallenges.filter(
        sub => {
          const lower = sub.toLowerCase()
          return !lower.includes('choose language') && 
                 !lower.includes('create class') &&
                 !lower.includes('create node')
        }
      )
      const totalTasks = methodsToImplement.length

      // Calculate completed tasks based on currentChallengeIndex
      // currentChallengeIndex is 0-based and represents the NEXT challenge to work on
      // Index 0 = "Choose Language" (not a task)
      // Index 1 = "Create class"/"Create node" (not a task)
      // Index 2+ = Actual methods (these are tasks)
      // So if currentChallengeIndex is 3, that means challenges 0, 1, 2 are done
      // Challenge 2 is the first task, so completedTasks = currentChallengeIndex - 2
      const completedTasks = Math.max(0, project.currentChallengeIndex - 2)

      // Use progress from database (0-100)
      const progressPercentage = project.progress

      // Determine status
      const status = project.status === 'completed' 
        ? 'completed' as const
        : progressPercentage > 0 && progressPercentage < 100
        ? 'in-progress' as const
        : 'in-progress' as const

      if (status === 'in-progress' && progressPercentage > 0) {
        inProgress++
        challenges.push({
          id: project.moduleId,
          title: challenge.title,
          level: challenge.level,
          completedTasks,
          totalTasks,
          progressPercentage,
          lastUpdated: new Date(project.updatedAt).getTime(),
          status: 'in-progress',
          project
        })
      } else if (status === 'completed') {
        completed++
        challenges.push({
          id: project.moduleId,
          title: challenge.title,
          level: challenge.level,
          completedTasks: totalTasks,
          totalTasks,
          progressPercentage: 100,
          lastUpdated: new Date(project.updatedAt).getTime(),
          status: 'completed',
          project
        })
      }
    })

    // Sort by status (in-progress first), then by most recent
    challenges.sort((a, b) => {
      if (a.status !== b.status) {
        return a.status === 'in-progress' ? -1 : 1
      }
      return (b.lastUpdated || 0) - (a.lastUpdated || 0)
    })

    return { libraryChallenges: challenges, inProgressCount: inProgress, completedCount: completed }
  }, [projects])

  if (modulesLoading) {
    return (
      <div className="min-h-screen flex flex-col relative" style={{ backgroundColor }}>
        <Navbar className="relative z-10" />
        <main className="flex-1 relative z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <p className="text-lg">Loading challenges...</p>
            </div>
          </div>
        </main>
        <Footer className="relative z-10" />
      </div>
    )
  }

  if (modulesError) {
    return (
      <div className="min-h-screen flex flex-col relative" style={{ backgroundColor }}>
        <Navbar className="relative z-10" />
        <main className="flex-1 relative z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <p className="text-lg text-destructive">Error: {modulesError}</p>
            </div>
          </div>
        </main>
        <Footer className="relative z-10" />
      </div>
    )
  }
  
  return (
    <div className="min-h-screen flex flex-col relative" style={{ backgroundColor }}>
      <Navbar className="relative z-10" />
      <main className="flex-1 relative z-10 pb-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[calc(100vh-12rem)]">
          {/* Your Library Section */}
          <div 
            className="mb-8 rounded-lg border-2 p-8"
            style={{
              backgroundColor: backgroundColor,
              borderColor: borderColor,
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 
                  className="text-3xl font-bold font-mono mb-2"
                  style={{ color: textColor }}
                >
                  Your Library
                </h2>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span 
                      className="text-sm font-mono"
                      style={{ color: secondaryTextColor }}
                    >
                      In Progress:
                    </span>
                    <span 
                      className="text-base font-bold font-mono"
                      style={{ color: textColor }}
                    >
                      {inProgressCount}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span 
                      className="text-sm font-mono"
                      style={{ color: secondaryTextColor }}
                    >
                      Completed:
                    </span>
                    <span 
                      className="text-base font-bold font-mono"
                      style={{ color: textColor }}
                    >
                      {completedCount}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {projectsLoading ? (
              <div className="py-6">
                <p 
                  className="text-lg font-mono"
                  style={{ color: secondaryTextColor }}
                >
                  Loading your library...
                </p>
              </div>
            ) : libraryChallenges.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {libraryChallenges.map((challenge) => {
                  const Icon = iconMap[challenge.id] || Code2
                  const isIntermediate = challenge.level === 'Intermediate'
                  const isAdvanced = challenge.level === 'Advanced'
                  
                  return (
                    <Link
                      key={challenge.id}
                      to={`/challenges/${challenge.id}`}
                      className="group relative rounded-lg border-2 p-4 transition-all hover:shadow-lg hover:-translate-y-1"
                      style={{
                        backgroundColor: backgroundColor,
                        borderColor: borderColor,
                      }}
                    >
                      {/* Status Badge */}
                      <div className="absolute top-3 right-3">
                        {challenge.status === 'completed' ? (
                          <span 
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold font-mono"
                            style={{
                              backgroundColor: accentGreen,
                              color: backgroundColor,
                            }}
                          >
                            <CheckCircle2 className="h-3 w-3" />
                            Completed
                          </span>
                        ) : (
                          <span 
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold font-mono"
                            style={{
                              backgroundColor: hexToRgba(textColor, 0.15),
                              color: textColor,
                            }}
                          >
                            In Progress
                          </span>
                        )}
                      </div>

                      {/* Icon */}
                      <div className="mb-3">
                        <div 
                          className="flex h-10 w-10 items-center justify-center rounded-lg"
                          style={{
                            backgroundColor: hexToRgba(textColor, 0.1),
                            borderColor: borderColor,
                            borderWidth: '1px',
                          }}
                        >
                          <Icon className="h-5 w-5" style={{ color: textColor }} />
                        </div>
                      </div>

                      {/* Title */}
                      <h3 
                        className="text-lg font-semibold font-mono mb-2 group-hover:opacity-80 transition-opacity"
                        style={{ color: textColor }}
                      >
                        {challenge.title}
                      </h3>

                      {/* Level Badge */}
                      <div className="mb-3">
                        <span 
                          className="inline-block px-2.5 py-1 rounded text-xs font-semibold font-mono"
                          style={{
                            backgroundColor: isAdvanced
                              ? hexToRgba('#B91C1C', 0.2)
                              : isIntermediate
                              ? hexToRgba('#F4A300', 0.2)
                              : hexToRgba(accentGreen, 0.2),
                            color: isAdvanced
                              ? '#B91C1C'
                              : isIntermediate
                              ? '#F4A300'
                              : accentGreen,
                          }}
                        >
                          {challenge.level}
                        </span>
                      </div>

                      {/* Progress Info */}
                      {challenge.status === 'in-progress' && (
                        <div className="space-y-2">
                          <p 
                            className="text-sm font-mono"
                            style={{ color: secondaryTextColor }}
                          >
                            {challenge.totalTasks > 0 
                              ? `${challenge.completedTasks}/${challenge.totalTasks} tasks`
                              : 'Getting started...'}
                          </p>
                          {/* Progress Bar */}
                          <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: hexToRgba(textColor, 0.1) }}>
                            <div
                              className="h-full transition-all duration-300 rounded-full"
                              style={{
                                width: `${challenge.progressPercentage}%`,
                                backgroundColor: accentGreen,
                              }}
                            />
                          </div>
                        </div>
                      )}

                      {challenge.status === 'completed' && (
                        <p 
                          className="text-sm font-mono"
                          style={{ color: secondaryTextColor }}
                        >
                          {challenge.totalTasks} tasks completed
                        </p>
                      )}

                      {/* Arrow Icon */}
                      <ArrowRight 
                        className="absolute bottom-4 right-4 h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
                        style={{ color: secondaryTextColor }}
                      />
                    </Link>
                  )
                })}
              </div>
            ) : (
              <div className="py-6">
                <p 
                  className="text-lg font-mono"
                  style={{ color: secondaryTextColor }}
                >
                  Your library looks empty :( Start a new challenge!
                </p>
              </div>
            )}
          </div>

          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-4">Data Structures & Algorithms Challenges</h1>
            <p className="text-lg text-muted-foreground">
              Pick a challenge and start building. Each module comes with tests, starter code, and clear goals.
            </p>
          </div>

          <ChallengesGrid modules={modules} />
        </div>
      </main>
      <Footer className="relative z-10 mt-auto" />
    </div>
  )
}
