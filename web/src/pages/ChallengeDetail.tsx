import { useParams, useNavigate, Link } from 'react-router-dom'
import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { ChallengeSidebar } from '@/components/ChallengeSidebar'
import { ChallengeInfo } from '@/components/ChallengeInfo'
import { LanguagePicker } from '@/components/LanguagePicker'
import { challengeData } from '@/data/challenges'

export function ChallengeDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [selectedLanguage, setSelectedLanguage] = useState<string | undefined>(undefined)
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0) // Track which step the user is viewing

  if (!id || !challengeData[id]) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-dev-lab relative">
        <Navbar className="relative z-10" />
        <main className="flex-1 relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Challenge not found</h1>
            <button
              onClick={() => navigate('/challenges')}
              className="text-primary hover:underline"
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
  
  // Check if "Choose Language" step is completed (language selected)
  const isLanguageSelected = selectedLanguage !== undefined
  
  // Build timeline from steps - first add "Choose Language", then add all challenge steps
  const timelineSteps = [
    {
      id: `${id}-0`,
      name: 'Choose Language',
      completed: isLanguageSelected
    },
    ...challenge.steps.map((step, index) => ({
      id: `${id}-${index + 1}`,
      name: step.focus,
      completed: false // Steps start as not completed (in production, this comes from API)
    }))
  ]
  
  // Determine the current step to display content for
  // Step 0 = Choose Language
  // Step 1+ = Challenge steps (only accessible after language is selected)
  const displayStepIndex = isLanguageSelected ? Math.max(1, currentStepIndex) : 0
  
  // Update current step when language is selected
  const handleLanguageSelect = (language: string | undefined) => {
    setSelectedLanguage(language)
    if (language) {
      // When language is selected, move to first challenge step
      setCurrentStepIndex(1)
    } else {
      // When language is cleared, go back to step 0
      setCurrentStepIndex(0)
    }
    // In production, this would POST to /api/projects to create the project or DELETE if undefined
  }
  
  const handleStepClick = (stepIndex: number) => {
    // Only allow clicking on completed steps or step 0 (Choose Language)
    if (stepIndex === 0 || timelineSteps[stepIndex]?.completed || (stepIndex === 1 && isLanguageSelected)) {
      setCurrentStepIndex(stepIndex)
    }
  }
  
  const progress = Math.round((timelineSteps.filter(s => s.completed).length / timelineSteps.length) * 100)

  return (
    <div className="min-h-screen flex flex-col bg-gradient-dev-lab">
      <Navbar className="relative z-10" />
      <main className="flex-1 relative z-10 flex min-h-0">
        {/* Sidebar - Fixed to left on desktop */}
        <div className="hidden lg:block fixed left-0 top-16 bottom-0 w-96 border-r border-border bg-background z-20 overflow-y-auto">
          <div className="p-8">
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

        {/* Main Content Area */}
        <div className="flex-1 lg:pl-96 flex flex-col min-h-0">
          <div className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 overflow-y-auto">
            {/* Back Button - Top of Page */}
            <Link
              to="/challenges"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
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
              {/* Language Picker - Show on step 0 only, or always allow changing */}
              {(displayStepIndex === 0 || !isLanguageSelected) && (
                <LanguagePicker
                  selectedLanguage={selectedLanguage}
                  onSelect={handleLanguageSelect}
                />
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
              />
            </div>
          </div>
        </div>
      </main>
      <Footer className="relative z-10 mt-auto" />
    </div>
  )
}

