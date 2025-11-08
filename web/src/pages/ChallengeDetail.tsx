import { useParams, useNavigate, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { ArrowLeft, History, Globe, X, Copy, Check, CheckCircle2 } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { ChallengeSidebar } from '@/components/ChallengeSidebar'
import { ChallengeInfo } from '@/components/ChallengeInfo'
import { LanguagePicker } from '@/components/LanguagePicker'
import { OrganicStep } from '@/components/OrganicStep'
import { challengeData } from '@/data/challenges'
import { languageDatastructureInfo } from '@/data/language-datastructure-info'
import { getChallengeProgress, saveChallengeProgress, markStepCompleted, calculateProgressPercentage } from '@/utils/challengeProgress'

// Language name mapping for display
const getLanguageDisplayName = (langId: string): string => {
  const languageNames: Record<string, string> = {
    typescript: 'TypeScript',
    python: 'Python',
    javascript: 'JavaScript',
    go: 'Go',
    java: 'Java',
    cpp: 'C++'
  }
  return languageNames[langId] || langId.charAt(0).toUpperCase() + langId.slice(1)
}

export function ChallengeDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [selectedLanguage, setSelectedLanguage] = useState<string | undefined>(undefined)
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0) // Track which step the user is viewing
  const [completedSteps, setCompletedSteps] = useState<number[]>([]) // Track completed step indices
  const [showRepoCommand, setShowRepoCommand] = useState<boolean>(false)
  const [copied, setCopied] = useState<boolean>(false)
  const [savedRepoUrl, setSavedRepoUrl] = useState<string | undefined>(undefined)

  // Load progress from localStorage on mount
  useEffect(() => {
    if (!id) return
    
    const savedProgress = getChallengeProgress(id)
    if (savedProgress) {
      setSelectedLanguage(savedProgress.selectedLanguage)
      setCurrentStepIndex(savedProgress.currentStepIndex)
      setCompletedSteps(savedProgress.completedSteps)
    }
  }, [id])

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    if (!id) return
    
    saveChallengeProgress(id, {
      completedSteps,
      currentStepIndex,
      selectedLanguage,
      lastUpdated: Date.now()
    })
  }, [id, completedSteps, currentStepIndex, selectedLanguage])

  if (!id || !challengeData[id]) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-dev-lab relative datastructures-page">
        <Navbar className="relative z-10" />
        <main className="flex-1 relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4 font-mono">Challenge not found</h1>
            <button
              onClick={() => navigate('/challenges')}
              className="text-primary hover:underline font-mono"
            >
              Back to Challenges
            </button>
          </div>
        </main>
        <Footer className="relative z-10" />
      </div>
    )
  }

  const challenge = challengeData[id]
  
  // Check if "Choose Language" step is completed (language selected AND we've moved past it)
  const isLanguageSelected = selectedLanguage !== undefined
  const isLanguageStepCompleted = completedSteps.includes(0)
  
  // Build timeline from steps - first add "Choose Language", then add all challenge steps
  const timelineSteps = [
    {
      id: `${id}-0`,
      name: 'Choose Language',
      completed: isLanguageStepCompleted
    },
    ...challenge.steps.map((step, index) => ({
      id: `${id}-${index + 1}`,
      name: step.focus,
      completed: completedSteps.includes(index + 1) // Check if step is in completedSteps array
    }))
  ]
  
  // Determine the current step to display content for
  // Step 0 = Choose Language
  // Step 1+ = Challenge steps (only accessible after language is selected)
  const displayStepIndex = currentStepIndex
  
  // Mark the last step as completed when user reaches it
  useEffect(() => {
    if (!id || !challenge) return
    
    // Total steps = challenge steps + 1 (for "Choose Language" step)
    const totalSteps = challenge.steps.length + 1
    const lastStepIndex = totalSteps - 1
    
    // If user is on the last step and it's not marked as completed, mark it
    if (currentStepIndex === lastStepIndex && lastStepIndex > 0) {
      setCompletedSteps(prev => {
        // Only update if not already completed
        if (!prev.includes(lastStepIndex)) {
          markStepCompleted(id, lastStepIndex)
          return [...prev, lastStepIndex]
        }
        return prev
      })
    }
  }, [id, currentStepIndex, challenge])
  
  // Update current step when language is selected
  const handleLanguageSelect = (language: string | undefined) => {
    setSelectedLanguage(language)
    if (language) {
      // Mark language step as completed when a language is selected
      if (!completedSteps.includes(0)) {
        markStepCompleted(id!, 0)
        setCompletedSteps(prev => [...prev, 0])
      }
      // Don't auto-advance - let user stay on language selection to see the info
      // User can manually click on step 1 to proceed
    } else {
      // When language is cleared, go back to step 0 and remove it from completed steps
      setCurrentStepIndex(0)
      setCompletedSteps(prev => prev.filter(step => step !== 0))
    }
    // In production, this would POST to /api/projects to create the project or DELETE if undefined
  }
  
  const handleStepClick = (stepIndex: number) => {
    // Only allow clicking on completed steps or step 0 (Choose Language)
    if (stepIndex === 0 || timelineSteps[stepIndex]?.completed || (stepIndex === 1 && isLanguageSelected)) {
      setCurrentStepIndex(stepIndex)
    }
  }
  
  const handleNextStep = () => {
    // Move to next step if not at the last step
    if (currentStepIndex < timelineSteps.length - 1) {
      const nextStepIndex = currentStepIndex + 1
      setCurrentStepIndex(nextStepIndex)
      
      // Mark the current step as completed when moving to the next step
      if (!completedSteps.includes(currentStepIndex)) {
        markStepCompleted(id!, currentStepIndex)
        setCompletedSteps(prev => [...prev, currentStepIndex])
      }
    }
  }
  
  const handlePreviousStep = () => {
    // Move to previous step if not at the first step
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1)
    }
  }
  
  const handleStartChallenge = (language: string) => {
    const repoUrl = `https://github.com/dsa-lab/${challenge.id}-${language}`
    setSavedRepoUrl(repoUrl)
    setShowRepoCommand(true)
    // Mark language step as completed
    if (!completedSteps.includes(0)) {
      markStepCompleted(id!, 0)
      setCompletedSteps(prev => [...prev, 0])
    }
    // In production, this would POST to /api/projects to create the project
  }
  
  const handleGoToNextStep = () => {
    setShowRepoCommand(false)
    // Move to step 1 (first challenge step)
    setCurrentStepIndex(1)
    // Mark language step as completed if not already
    if (!completedSteps.includes(0)) {
      markStepCompleted(id!, 0)
      setCompletedSteps(prev => [...prev, 0])
    }
  }
  
  const handleCopyCommand = () => {
    const command = savedRepoUrl ? `git clone ${savedRepoUrl}` : `git clone https://github.com/dsa-lab/${challenge.id}-${selectedLanguage}`
    navigator.clipboard.writeText(command).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }
  
  // Calculate progress based on completed steps
  const progress = calculateProgressPercentage(completedSteps, timelineSteps.length)

  return (
    <div className="min-h-screen flex flex-col bg-gradient-dev-lab datastructures-page">
      <Navbar className="relative z-10" />
      <main className="flex-1 relative z-10 flex min-h-0">
        {/* Sidebar - Sticky positioning, scrollable content */}
        <aside className="hidden lg:block w-96 shrink-0">
          <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto border-r border-border bg-background z-[60]">
            <div className="p-8 pb-8">
              <ChallengeSidebar
                title={challenge.title}
                subchallenges={timelineSteps}
                progress={progress}
                time={challenge.time}
                level={challenge.level}
                selectedLanguage={selectedLanguage}
                currentStepIndex={currentStepIndex}
                onStepClick={handleStepClick}
              />
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-h-0 relative">
          <div className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 overflow-y-auto relative">
            {/* Back Button - Top of Page */}
            <Link
              to="/challenges"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 font-mono"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Challenges
            </Link>
            
            {/* Sidebar - Mobile only */}
            <div className="lg:hidden mb-8">
              <ChallengeSidebar
                title={challenge.title}
                subchallenges={timelineSteps}
                progress={progress}
                time={challenge.time}
                level={challenge.level}
                selectedLanguage={selectedLanguage}
                currentStepIndex={currentStepIndex}
                onStepClick={handleStepClick}
              />
            </div>

            {/* Main Content */}
            <div className="space-y-6 pb-8">
              {/* Language Picker - Show on step 0 */}
              {displayStepIndex === 0 && (
                <>
                  <LanguagePicker
                    selectedLanguage={selectedLanguage}
                    onSelect={handleLanguageSelect}
                    dataStructureId={challenge.id}
                  />
                  
                  {/* Language Information Section - Separate box */}
                  {challenge && selectedLanguage && languageDatastructureInfo[challenge.id] && languageDatastructureInfo[challenge.id][selectedLanguage] && (
                    <OrganicStep isCurrent={false} isCompleted={false} className="p-8">
                      <div className="space-y-6">
                        <h2 className="text-2xl font-bold font-mono text-[#3E2723]">
                          Why {getLanguageDisplayName(selectedLanguage)} for {challenge.title.replace('Build a ', '')}?
                        </h2>

                        <div className="space-y-4 text-base leading-relaxed font-mono">
                          <p className="text-[#3E2723]/90">
                            {languageDatastructureInfo[challenge.id][selectedLanguage].history}
                          </p>
                          
                          <p className="italic text-[#3E2723]/80">
                            {languageDatastructureInfo[challenge.id][selectedLanguage].funFact}
                          </p>
                          
                          <p className="text-[#3E2723]/90">
                            {languageDatastructureInfo[challenge.id][selectedLanguage].detailedUsage}
                          </p>
                          
                          <p className="text-[#3E2723]/90">
                            {languageDatastructureInfo[challenge.id][selectedLanguage].differentiation}
                          </p>
                          
                          <p className="italic text-[#3E2723]/80">
                            {languageDatastructureInfo[challenge.id][selectedLanguage].realWorldAnalogy}
                          </p>
                          
                          <p className="text-[#3E2723]/90">
                            The key advantages include {languageDatastructureInfo[challenge.id][selectedLanguage].keyAdvantages.slice(0, -1).join(', ')}, and {languageDatastructureInfo[challenge.id][selectedLanguage].keyAdvantages[languageDatastructureInfo[challenge.id][selectedLanguage].keyAdvantages.length - 1].toLowerCase()}.
                          </p>
                        </div>
                      </div>
                    </OrganicStep>
                  )}
                </>
              )}
              
              <ChallengeInfo
                title={challenge.title}
                summary={challenge.summary}
                description={challenge.description}
                concept={challenge.concept}
                benefits={challenge.benefits}
                githubRepoUrl={isLanguageSelected ? `https://github.com/dsa-lab/${challenge.id}-${selectedLanguage}` : undefined}
                challengeData={challenge}
                currentStepIndex={displayStepIndex}
                timelineSteps={timelineSteps}
                selectedLanguage={selectedLanguage}
                onStartChallenge={handleStartChallenge}
                showRepoCommand={showRepoCommand || !!savedRepoUrl}
                repoCommand={savedRepoUrl ? `git clone ${savedRepoUrl}` : undefined}
                onCopyCommand={handleCopyCommand}
                copied={copied}
                onNextStep={handleNextStep}
                onPreviousStep={handlePreviousStep}
              />
            </div>
          </div>
        </div>
      </main>
      
      {/* Success Modal Notification - centered in viewport */}
      {showRepoCommand && selectedLanguage && challenge && savedRepoUrl && (
        <>
          {/* Overlay - blur effect, only covers main content area */}
          <div className="fixed top-16 bottom-0 right-0 backdrop-blur-sm z-[55] pointer-events-none lg:left-96" />
          {/* Modal Content - fixed to viewport, centered */}
          <div className="fixed inset-0 flex items-center justify-center z-[56] p-4 pointer-events-none">
            <div 
              className="rounded-xl border-2 p-6 max-w-lg w-full shadow-lg relative overflow-hidden pointer-events-auto"
            style={{
              backgroundColor: '#D4C4A8',
              borderColor: '#B8A082',
              backgroundImage: `
                /* Wood grain lines - horizontal */
                repeating-linear-gradient(
                  0deg,
                  transparent 0px,
                  transparent 8px,
                  rgba(139, 115, 85, 0.15) 8px,
                  rgba(139, 115, 85, 0.15) 9px,
                  transparent 9px,
                  transparent 10px
                ),
                /* Wood grain lines - vertical variations */
                repeating-linear-gradient(
                  90deg,
                  transparent 0px,
                  transparent 20px,
                  rgba(139, 115, 85, 0.08) 20px,
                  rgba(139, 115, 85, 0.08) 21px,
                  transparent 21px,
                  transparent 40px,
                  rgba(139, 115, 85, 0.12) 40px,
                  rgba(139, 115, 85, 0.12) 41px,
                  transparent 41px,
                  transparent 60px
                ),
                /* Wood knots and natural variations */
                radial-gradient(ellipse 200px 30px at 25% 30%, rgba(139, 115, 85, 0.2) 0%, transparent 50%),
                radial-gradient(ellipse 150px 25px at 75% 60%, rgba(139, 115, 85, 0.15) 0%, transparent 50%),
                radial-gradient(ellipse 180px 28px at 50% 80%, rgba(139, 115, 85, 0.18) 0%, transparent 50%),
                /* Subtle wood texture overlay */
                linear-gradient(
                  180deg,
                  rgba(255, 255, 255, 0.1) 0%,
                  transparent 20%,
                  transparent 80%,
                  rgba(0, 0, 0, 0.05) 100%
                )
              `,
              boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.3), inset 0 -1px 2px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.1)'
            }}
          >
            <div className="relative z-10">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/20 shrink-0">
                  <CheckCircle2 className="h-6 w-6 text-success" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold mb-1" style={{ color: '#171512' }}>Repository Created!</h3>
                  <p className="text-sm" style={{ color: '#4B463F' }}>Your project is ready to clone</p>
                </div>
                <button
                  onClick={() => setShowRepoCommand(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
                  style={{ color: '#4B463F' }}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="mb-4">
                <p className="text-sm mb-3" style={{ color: '#4B463F' }}>
                  Open your terminal and clone your repository:
                </p>
                <div className="bg-muted rounded-lg p-4 relative border border-border">
                  <code className="text-sm text-foreground break-all pr-12 block" style={{ color: '#171512' }}>
                    git clone {savedRepoUrl}
                  </code>
                  <button
                    onClick={handleCopyCommand}
                    className="absolute top-2 right-2 p-2 rounded-lg hover:bg-background transition-colors"
                    title="Copy to clipboard"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-success" />
                    ) : (
                      <Copy className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowRepoCommand(false)}
                  className="flex-1 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors font-medium"
                  style={{ borderColor: '#D3CDBB', color: '#171512' }}
                >
                  Stay here
                </button>
                <button
                  onClick={handleGoToNextStep}
                  className="flex-1 px-4 py-2 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 font-medium transition-colors"
                >
                  Continue to Challenge
                </button>
              </div>
            </div>
          </div>
            </div>
        </>
      )}
      
      <Footer className="relative z-[60] mt-auto" />
    </div>
  )
}

