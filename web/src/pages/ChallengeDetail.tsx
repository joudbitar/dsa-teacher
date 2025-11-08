import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft, Copy, Check } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ChallengeSidebar } from "@/components/ChallengeSidebar";
import { ChallengeInfo } from "@/components/ChallengeInfo";
import { LanguagePicker } from "@/components/LanguagePicker";
import { challengeData } from "@/data/challenges";
import { useTheme } from "@/theme/ThemeContext";
import { apiClient, Project, Module } from "@/lib/api";
import { useAuth } from "@/auth/useAuth";
import {
  saveChallengeProgress,
  markStepCompleted,
  getChallengeProgress,
} from "@/utils/challengeProgress";

export function ChallengeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { backgroundColor } = useTheme();
  const { user, session } = useAuth();
  const [selectedLanguage, setSelectedLanguage] = useState<string | undefined>(
    undefined
  );
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0); // Track which step the user is viewing
  const [existingProject, setExistingProject] = useState<Project | null>(null);
  const [loadingProject, setLoadingProject] = useState(true);
  const [creatingProject, setCreatingProject] = useState(false);
  const [projectError, setProjectError] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [showRepoCommand, setShowRepoCommand] = useState(false);
  const [savedRepoUrl, setSavedRepoUrl] = useState<string | undefined>(
    undefined
  );
  const [copied, setCopied] = useState(false);
  const [moduleData, setModuleData] = useState<Module | null>(null);
  const [showStepWarning, setShowStepWarning] = useState(false);
  const [pendingStepIndex, setPendingStepIndex] = useState<number | null>(null);

  if (!id || !challengeData[id]) {
    return (
      <div
        className="min-h-screen flex flex-col relative"
        style={{ backgroundColor }}
      >
        <Navbar className="relative z-10" />
        <main className="flex-1 relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Challenge not found</h1>
            <button
              onClick={() => navigate("/challenges")}
              className="text-primary hover:underline"
            >
              Back to Challenges
            </button>
          </div>
        </main>
        <Footer className="relative z-10" />
      </div>
    );
  }

  const challenge = challengeData[id];

  // Check for existing project and fetch module data on mount
  useEffect(() => {
    async function loadData() {
      if (!id) return;

      try {
        setLoadingProject(true);

        // Fetch module data from API to get subchallenges
        const modules = await apiClient.getModules();
        const module = modules.find((m) => m.id === id);
        if (module) {
          setModuleData(module);
        }

        // Check for existing project
        const projects = await apiClient.getProjects(id);

        if (projects.length > 0) {
          // User has already started this module
          const project = projects[0];
          setExistingProject(project);

          // Auto-select the language they chose
          setSelectedLanguage(project.language.toLowerCase());

          // Set progress from project
          setCurrentStepIndex(project.currentChallengeIndex + 1); // +1 for "Choose Language" step

          // Mark completed steps based on currentChallengeIndex
          const completed = Array.from(
            { length: project.currentChallengeIndex + 1 },
            (_, i) => i
          );
          setCompletedSteps(completed);

          // Set saved repo URL
          setSavedRepoUrl(project.githubRepoUrl || undefined);
        } else {
          // Load from localStorage if no API project
          const savedProgress = getChallengeProgress(id);
          if (savedProgress) {
            setSelectedLanguage(savedProgress.selectedLanguage);
            setCurrentStepIndex(savedProgress.currentStepIndex || 0);
            setCompletedSteps(savedProgress.completedSteps || []);
          }
        }
      } catch (error) {
        console.error("Failed to check existing project:", error);
        // Fallback to localStorage
        const savedProgress = getChallengeProgress(id);
        if (savedProgress) {
          setSelectedLanguage(savedProgress.selectedLanguage);
          setCurrentStepIndex(savedProgress.currentStepIndex || 0);
          setCompletedSteps(savedProgress.completedSteps || []);
        }
      } finally {
        setLoadingProject(false);
      }
    }

    loadData();
  }, [id]);

  // Poll for progress updates when user has an existing project
  useEffect(() => {
    if (!existingProject) return;

    const pollInterval = setInterval(async () => {
      try {
        const projects = await apiClient.getProjects(id!);

        if (projects.length > 0) {
          const updatedProject = projects[0];

          // Update local state if progress changed
          if (
            updatedProject.currentChallengeIndex !==
            existingProject.currentChallengeIndex
          ) {
            console.log(
              `🎉 Progress detected! Moving from challenge ${existingProject.currentChallengeIndex} to ${updatedProject.currentChallengeIndex}`
            );

            setExistingProject(updatedProject);

            // Update steps
            const newIndex = updatedProject.currentChallengeIndex + 1; // +1 for "Choose Language"
            setCurrentStepIndex(newIndex);

            // Mark completed steps
            const completed = Array.from({ length: newIndex }, (_, i) => i);
            setCompletedSteps(completed);

            // Save to localStorage
            if (id) {
              saveChallengeProgress(id, {
                completedSteps: completed,
                currentStepIndex: newIndex,
                selectedLanguage,
                lastUpdated: Date.now(),
              });

              // Fire custom event to update ChallengesGrid
              window.dispatchEvent(new Event("challenge-progress-updated"));
            }

            // Scroll to top of main content to show new step
            window.scrollTo({ top: 0, behavior: "smooth" });

            // Show success notification
            const subchallengeName =
              moduleData?.subchallenges?.[updatedProject.currentChallengeIndex];
            if (subchallengeName) {
              // Create a temporary toast notification
              const toast = document.createElement("div");
              toast.className =
                "fixed top-20 right-4 bg-success text-success-foreground px-6 py-3 rounded-lg shadow-lg z-50 animate-in slide-in-from-right";
              toast.innerHTML = `
                <div class="flex items-center gap-2">
                  <span class="text-xl">✅</span>
                  <span class="font-semibold">Challenge completed!</span>
                </div>
                <div class="text-sm mt-1">Moving to: ${subchallengeName}</div>
              `;
              document.body.appendChild(toast);

              // Remove after 4 seconds
              setTimeout(() => {
                toast.style.opacity = "0";
                toast.style.transition = "opacity 0.3s";
                setTimeout(() => toast.remove(), 300);
              }, 4000);
            }
          }
        }
      } catch (error) {
        console.error("Failed to poll project status:", error);
      }
    }, 3000); // Poll every 3 seconds for faster feedback

    return () => clearInterval(pollInterval);
  }, [existingProject, id, selectedLanguage, moduleData]);

  // Check if "Choose Language" step is completed (language selected AND project created)
  const isLanguageSelected = selectedLanguage !== undefined;
  const isLanguageStepCompleted = completedSteps.includes(0);

  // Build timeline from API subchallenges (matches CLI test names)
  const timelineSteps = [
    {
      id: `${id}-0`,
      name: "Choose Language",
      completed: isLanguageStepCompleted,
    },
    ...(moduleData?.subchallenges || []).map((subchallenge, index) => ({
      id: `${id}-${index + 1}`,
      name: subchallenge,
      completed: completedSteps.includes(index + 1),
    })),
  ];

  // Display step 0 (language selection) until project is created
  // After that, show the current challenge step
  const displayStepIndex = isLanguageStepCompleted ? currentStepIndex : 0;

  const highestCompletedStep =
    completedSteps.length > 0 ? Math.max(...completedSteps) : -1;
  const maxAccessibleStep = isLanguageStepCompleted
    ? Math.min(
        timelineSteps.length - 1,
        Math.max(displayStepIndex, highestCompletedStep + 1)
      )
    : 0;

  // Handle project creation when language is selected
  const handleStartChallenge = async (language: string) => {
    if (!id) return;

    // Check if user is authenticated
    if (!user || !session) {
      setProjectError("Please sign in to create a project. Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
      return;
    }

    try {
      setCreatingProject(true);
      setProjectError(null);

      // Call API to create project
      const response = await apiClient.createProject({
        moduleId: id,
        language: language.charAt(0).toUpperCase() + language.slice(1), // Capitalize
      });

      // Fetch the full project data to get projectToken
      const fullProject = await apiClient.getProject(response.id);

      // Store the project
      setExistingProject(fullProject);

      // Set repo URL and show modal (use response.githubRepoUrl as fallback)
      const repoUrl = fullProject.githubRepoUrl || response.githubRepoUrl;
      setSavedRepoUrl(repoUrl || undefined);
      setShowRepoCommand(true);

      // Mark language step as completed
      if (!completedSteps.includes(0)) {
        markStepCompleted(id, 0);
        setCompletedSteps((prev) => [...prev, 0]);
      }

      // Save to localStorage
      saveChallengeProgress(id, {
        completedSteps: [0],
        currentStepIndex: 0,
        selectedLanguage: language,
        lastUpdated: Date.now(),
      });

      // Don't move to next step yet - wait for user to click "Continue" in the modal
    } catch (error) {
      console.error("Failed to create project:", error);
      let errorMessage = "Failed to create project. Please try again.";

      if (error instanceof Error) {
        if (error.message.includes("No active session") || error.message.includes("Unauthorized")) {
          errorMessage = "You must be signed in to create a project. Please sign in and try again.";
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        } else if (error.message.includes("rate limit")) {
          errorMessage =
            "GitHub API rate limit exceeded. Please try again in a few minutes.";
        } else if (error.message.includes("template")) {
          errorMessage =
            "Template repository not found. Please contact support.";
        } else if (error.message.includes("already exists")) {
          errorMessage = "You already have a project for this module.";
        } else {
          errorMessage = error.message;
        }
      }

      setProjectError(errorMessage);
    } finally {
      setCreatingProject(false);
    }
  };

  // Copy to clipboard handler
  const handleCopy = async () => {
    if (savedRepoUrl) {
      await navigator.clipboard.writeText(`git clone ${savedRepoUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Continue to challenge after viewing repo modal
  const handleContinueToChallenge = () => {
    setShowRepoCommand(false);
    setCurrentStepIndex(1);
  };

  const handleStepClick = (stepIndex: number) => {
    if (stepIndex < 0 || stepIndex >= timelineSteps.length) return;

    if (stepIndex > maxAccessibleStep) return;

    if (stepIndex === currentStepIndex) return;

    const isCompleted = timelineSteps[stepIndex]?.completed;

    if (stepIndex < currentStepIndex && isCompleted) {
      setPendingStepIndex(stepIndex);
      setShowStepWarning(true);
      return;
    }

    setCurrentStepIndex(stepIndex);
  };

  const handleConfirmStepNavigate = () => {
    if (pendingStepIndex !== null) {
      setCurrentStepIndex(pendingStepIndex);
    }
    setPendingStepIndex(null);
    setShowStepWarning(false);
  };

  const handleCancelStepNavigate = () => {
    setPendingStepIndex(null);
    setShowStepWarning(false);
  };

  const progress = Math.round(
    (timelineSteps.filter((s) => s.completed).length / timelineSteps.length) *
      100
  );

  // Show loading state while checking for existing project
  if (loadingProject) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor }}>
        <Navbar className="relative z-10" />
        <main className="flex-1 relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <p className="text-lg">Loading challenge...</p>
          </div>
        </main>
        <Footer className="relative z-10 mt-auto" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      {/* Repository Command Modal */}
      {showRepoCommand && savedRepoUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-background border border-border rounded-xl p-8 max-w-2xl w-full mx-4">
            <h2 className="text-2xl font-bold mb-4">🎉 Repository Created!</h2>
            <p className="text-muted-foreground mb-6">
              Your project repository has been created. Clone it to get started:
            </p>

            <div className="bg-muted rounded-lg p-4 mb-6 font-mono text-sm">
              <div className="flex items-center justify-between">
                <code className="flex-1">git clone {savedRepoUrl}</code>
                <button
                  onClick={handleCopy}
                  className="ml-4 px-3 py-1 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 transition-colors flex items-center gap-2"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                After cloning, run{" "}
                <code className="px-2 py-1 rounded bg-muted text-accent">
                  dsa test
                </code>{" "}
                to check your progress.
              </p>

              <button
                onClick={handleContinueToChallenge}
                className="w-full px-6 py-3 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 font-medium transition-colors"
              >
                Continue to Challenge
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step revisit confirmation modal */}
      {showStepWarning && pendingStepIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-background border border-border rounded-2xl shadow-2xl max-w-lg w-full p-8 space-y-6">
            <div className="space-y-2">
              <p className="text-sm uppercase tracking-wide text-muted-foreground font-mono">
                Review completed step
              </p>
              <h2 className="text-2xl font-bold font-mono">
                Revisit &ldquo;{timelineSteps[pendingStepIndex]?.name}&rdquo;?
              </h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              You&rsquo;ve already finished this challenge. You can review your
              notes or code without losing progress, but make sure to return to
              your current step when you&rsquo;re ready to continue.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                onClick={handleCancelStepNavigate}
                className="px-6 py-3 rounded-lg border border-border bg-muted text-foreground hover:bg-muted/80 transition-colors font-medium"
              >
                Stay on current step
              </button>
              <button
                onClick={handleConfirmStepNavigate}
                className="px-6 py-3 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 transition-colors font-medium"
              >
                Review completed step
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-1">
        {/* Sidebar - Desktop only */}
        <aside className="hidden lg:block w-96 border-r border-border bg-card p-8 overflow-y-auto">
          <ChallengeSidebar
            title={challenge.title}
            subchallenges={timelineSteps}
            progress={progress}
            time={challenge.time}
            level={challenge.level}
            selectedLanguage={selectedLanguage}
            currentStepIndex={currentStepIndex}
            onStepClick={handleStepClick}
            maxAccessibleStep={maxAccessibleStep}
          />
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            {/* Back Button - Top of Page */}
            <Link
              to="/challenges"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Challenges
            </Link>
            {/* Main Content */}
            <div className="space-y-6">
              {/* Language Picker - Show on step 0 only, or always allow changing */}
              {(displayStepIndex === 0 || !isLanguageSelected) && (
                <LanguagePicker
                  selectedLanguage={selectedLanguage}
                  onSelect={setSelectedLanguage}
                />
              )}

              <ChallengeInfo
                title={challenge.title}
                summary={challenge.summary}
                description={challenge.description}
                concept={challenge.concept}
                benefits={challenge.benefits}
                githubRepoUrl={savedRepoUrl}
                challengeData={challenge}
                currentStepIndex={displayStepIndex}
                timelineSteps={timelineSteps}
                selectedLanguage={selectedLanguage}
                onStartChallenge={handleStartChallenge}
                isCreatingProject={creatingProject}
                projectError={projectError}
                moduleId={id}
                subchallengeName={timelineSteps[displayStepIndex]?.name}
              />
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
