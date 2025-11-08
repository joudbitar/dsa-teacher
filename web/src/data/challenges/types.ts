// Challenge step with detailed learning progression
export interface ChallengeStep {
  step: number
  focus: string
  challenge: string
  conceptGained: string
  visualization?: string
}

// Challenge data interface
export interface ChallengeData {
  id: string
  title: string
  level: string
  summary: string
  description: string
  concept: string
  benefits: string[]
  learningOutcome: string
  coreSkills: string[]
  steps: ChallengeStep[]
  subchallenges: string[]
  time: string
  integrationProject?: {
    title: string
    description: string
  }
}
