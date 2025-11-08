// Utility functions for managing challenge progress in localStorage

export interface ChallengeProgress {
  completedSteps: number[] // Array of completed step indices
  currentStepIndex: number
  selectedLanguage?: string
  lastUpdated: number // Timestamp
}

const STORAGE_KEY_PREFIX = 'dsa-lab-challenge-progress-'

/**
 * Get progress for a specific challenge from localStorage
 */
export function getChallengeProgress(challengeId: string): ChallengeProgress | null {
  try {
    const key = `${STORAGE_KEY_PREFIX}${challengeId}`
    const stored = localStorage.getItem(key)
    if (!stored) return null
    return JSON.parse(stored) as ChallengeProgress
  } catch (error) {
    console.error('Error reading challenge progress from localStorage:', error)
    return null
  }
}

/**
 * Save progress for a specific challenge to localStorage
 */
export function saveChallengeProgress(challengeId: string, progress: ChallengeProgress): void {
  try {
    const key = `${STORAGE_KEY_PREFIX}${challengeId}`
    const progressToSave = {
      ...progress,
      lastUpdated: Date.now()
    }
    localStorage.setItem(key, JSON.stringify(progressToSave))
    
    // Dispatch custom event to notify other components of progress update
    window.dispatchEvent(new CustomEvent('challenge-progress-updated', {
      detail: { challengeId, progress: progressToSave }
    }))
  } catch (error) {
    console.error('Error saving challenge progress to localStorage:', error)
  }
}

/**
 * Mark a step as completed for a challenge
 */
export function markStepCompleted(challengeId: string, stepIndex: number): void {
  const current = getChallengeProgress(challengeId)
  const completedSteps = current?.completedSteps || []
  
  if (!completedSteps.includes(stepIndex)) {
    completedSteps.push(stepIndex)
    saveChallengeProgress(challengeId, {
      completedSteps: [...completedSteps],
      currentStepIndex: current?.currentStepIndex || stepIndex,
      selectedLanguage: current?.selectedLanguage,
      lastUpdated: Date.now()
    })
  }
}

/**
 * Calculate progress percentage based on completed steps
 */
export function calculateProgressPercentage(completedSteps: number[], totalSteps: number): number {
  if (totalSteps === 0) return 0
  return Math.round((completedSteps.length / totalSteps) * 100)
}

/**
 * Get all challenge progress (for displaying on Challenges page)
 */
export function getAllChallengeProgress(): Record<string, number> {
  const progress: Record<string, number> = {}
  
  try {
    // Iterate through all localStorage keys with our prefix
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith(STORAGE_KEY_PREFIX)) {
        const challengeId = key.replace(STORAGE_KEY_PREFIX, '')
        const stored = localStorage.getItem(key)
        if (stored) {
          try {
            const data = JSON.parse(stored) as ChallengeProgress
            // We'll calculate the percentage based on completed steps
            // For now, we need to know the total steps - we'll get this from the challenge data
            // But for the grid, we can use a simple calculation based on completed steps
            progress[challengeId] = data.completedSteps.length
          } catch (e) {
            console.error('Error parsing progress for', challengeId, e)
          }
        }
      }
    }
  } catch (error) {
    console.error('Error reading all challenge progress:', error)
  }
  
  return progress
}

/**
 * Clear all progress for a specific challenge (used when restarting a module)
 */
export function clearChallengeProgress(challengeId: string): void {
  try {
    const key = `${STORAGE_KEY_PREFIX}${challengeId}`
    localStorage.removeItem(key)
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('challenge-progress-cleared', {
      detail: { challengeId }
    }))
    
    console.log(`Cleared local progress for challenge: ${challengeId}`)
  } catch (error) {
    console.error('Error clearing challenge progress from localStorage:', error)
  }
}

