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
  getChallengeProgress,
} from "@/utils/challengeProgress";

type ProgressModalState = {
  isLastStep: boolean;
  nextStepName?: string;
  previousStepIndex: number;
  nextStepIndex: number;
  completedStepsSnapshot: number[];
};

export function ChallengeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { backgroundColor, borderColor, textColor, accentGreen } = useTheme();
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
  const [cliCopied, setCliCopied] = useState(false);
  const [moduleData, setModuleData] = useState<Module | null>(null);
  const [showStepWarning, setShowStepWarning] = useState(false);
  const [pendingStepIndex, setPendingStepIndex] = useState<number | null>(null);
  const [progressModal, setProgressModal] = useState<ProgressModalState | null>(
    null
  );

  useEffect(() => {
    let cancelled = false;
    let interval: number | undefined;
    let timeout: number | undefined;

    if (progressModal?.isLastStep) {
      import("canvas-confetti").then(({ default: confetti }) => {
        if (cancelled) return;

        const duration = 2500;
        const animationEnd = Date.now() + duration;
        const defaults = {
          spread: 60,
          ticks: 200,
          gravity: 0.35,
          scalar: 0.6,
          zIndex: 30,
        };

        const shoot = () => {
          if (cancelled || Date.now() > animationEnd) {
            if (interval) clearInterval(interval);
            return;
          }

          confetti({
            ...defaults,
            particleCount: 20,
            origin: { x: 0.35, y: 0.25 },
          });

          confetti({
            ...defaults,
            particleCount: 18,
            origin: { x: 0.65, y: 0.25 },
          });
        };

        shoot();
        interval = window.setInterval(shoot, 340);
        timeout = window.setTimeout(() => {
          if (interval) clearInterval(interval);
        }, duration + 200);
      });
    }

    return () => {
      cancelled = true;
      if (interval) clearInterval(interval);
      if (timeout) clearTimeout(timeout);
    };
  }, [progressModal]);

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
          // Get the most recent project (or filter by selected language if available)
          const project = projects[0];

          // Store the existing project info but don't auto-navigate
          setExistingProject(project);
          setSelectedLanguage(project.language.toLowerCase());

          // Set progress from project
          // If currentChallengeIndex = 0 (just created), keep on step 0 (setup)
          // Otherwise, show the current challenge step
          const stepIndex =
            project.currentChallengeIndex === 0
              ? 0 // Stay on setup/language selection - repo created but not working on challenges yet
              : project.currentChallengeIndex + 1; // +1 for "Choose Language" step
          setCurrentStepIndex(stepIndex);

          // Mark completed steps based on currentChallengeIndex
          // Step 0 is only complete when user moves to first challenge (currentChallengeIndex >= 1)
          const completed =
            project.currentChallengeIndex === 0
              ? [] // No steps completed - still on setup
              : Array.from(
                  { length: project.currentChallengeIndex + 1 },
                  (_, i) => i
                );
          setCompletedSteps(completed);

          // Set saved repo URL
          setSavedRepoUrl(project.githubRepoUrl || undefined);
        } else {
          // No project exists - ensure we start fresh (don't load stale localStorage)
          // If user just restarted, localStorage should already be cleared
          // But check again to be safe
          setSelectedLanguage(undefined);
          setCurrentStepIndex(0);
          setCompletedSteps([]);
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

  // Listen for module restart events
  useEffect(() => {
    const handleRestart = (event: CustomEvent) => {
      if (event.detail?.moduleId === id) {
        // Module was restarted - clear state and reload
        setExistingProject(null);
        setSelectedLanguage(undefined);
        setCurrentStepIndex(0);
        setCompletedSteps([]);
        setSavedRepoUrl(undefined);
      }
    };

    window.addEventListener(
      "challenge-restarted",
      handleRestart as EventListener
    );
    return () =>
      window.removeEventListener(
        "challenge-restarted",
        handleRestart as EventListener
      );
  }, [id]);

  // Poll for progress updates when user has an existing project
  useEffect(() => {
    if (!existingProject) return;

    // Track if we've shown initial state to avoid false notifications
    let hasShownInitialState = false;

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

            const isRealProgress =
              hasShownInitialState &&
              updatedProject.currentChallengeIndex >
                existingProject.currentChallengeIndex;

            setExistingProject(updatedProject);

            // Update steps - challenge was completed, advance to next
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

            // Show success notification ONLY for real progress (not initial load)
            if (isRealProgress) {
              const nextStepName =
                moduleData?.subchallenges?.[
                  updatedProject.currentChallengeIndex
                ];

              // Check if this is the last step
              const isLastStep =
                updatedProject.currentChallengeIndex >=
                (moduleData?.subchallenges?.length || 0);

              setProgressModal({
                isLastStep,
                nextStepName: nextStepName || "Next step",
                previousStepIndex: Math.max(newIndex - 1, 0),
                nextStepIndex: newIndex,
                completedStepsSnapshot: completed,
              });
            }

            hasShownInitialState = true;
          } else {
            // Same state, mark as shown
            hasShownInitialState = true;
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
  // Once project exists (repo created), show the current challenge step
  const displayStepIndex = existingProject ? currentStepIndex : 0;

  // Max accessible step is based on backend's currentChallengeIndex
  // currentChallengeIndex = 0 means working on first challenge (step 1) - user can access it
  // currentChallengeIndex = 1 means working on second challenge (step 2), etc.
  // Once a project exists, user can always access the current challenge they're working on
  const maxAccessibleStep = existingProject
    ? existingProject.currentChallengeIndex + 1 // Can access current challenge
    : isLanguageStepCompleted
    ? 1
    : 0;

  // Debug logging
  console.log("ChallengeDetail Debug:", {
    existingProject: existingProject
      ? {
          id: existingProject.id,
          currentChallengeIndex: existingProject.currentChallengeIndex,
        }
      : null,
    currentStepIndex,
    maxAccessibleStep,
    completedSteps,
    isLanguageStepCompleted,
  });

  // Handle project creation when language is selected
  const handleStartChallenge = async (language: string) => {
    if (!id) return;

    // Check if user is authenticated
    if (!user || !session) {
      setProjectError(
        "Please sign in to create a project. Redirecting to login..."
      );
      setTimeout(() => {
        navigate("/login");
      }, 2000);
      return;
    }

    try {
      setCreatingProject(true);
      setProjectError(null);

      // Clear old project info if switching languages
      if (
        existingProject &&
        existingProject.language.toLowerCase() !== language.toLowerCase()
      ) {
        setExistingProject(null);
        setSavedRepoUrl(undefined);
        setCurrentStepIndex(0);
        setCompletedSteps([]);
      }

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

      // Don't mark step 0 as completed yet - user needs to actually start working on challenges
      // Step 0 represents the setup phase and should only complete when they move to challenge 1

      // Save to localStorage
      saveChallengeProgress(id, {
        completedSteps: [], // No steps completed yet - just created repo
        currentStepIndex: 0,
        selectedLanguage: language,
        lastUpdated: Date.now(),
      });

      // Stay on language step - user will see repo instructions
      // They stay here until they complete the first challenge (currentChallengeIndex becomes 1)
      setCurrentStepIndex(0);
      setCompletedSteps([]); // Keep step 0 uncompleted
    } catch (error) {
      console.error("Failed to create project:", error);
      console.error("Error details:", {
        message: error instanceof Error ? error.message : String(error),
        status: (error as any)?.status,
        originalError: (error as any)?.originalError,
      });
      let errorMessage = "Failed to create project. Please try again.";

      if (error instanceof Error) {
        if (
          error.message.includes("No active session") ||
          error.message.includes("Unauthorized")
        ) {
          errorMessage =
            "You must be signed in to create a project. Please sign in and try again.";
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
        } else if (
          error.message.includes("private key") ||
          error.message.includes("not configured")
        ) {
          errorMessage =
            "GitHub App is not properly configured. Please contact support.\n\n" +
            "The backend needs GitHub App credentials to create repositories.";
        } else if (
          error.message.includes("authentication") ||
          error.message.includes("401") ||
          error.message.includes("403")
        ) {
          errorMessage =
            "GitHub authentication failed. Please contact support.\n\n" +
            "The GitHub App credentials may be incorrect or expired.";
        } else {
          // Use the full error message which may include hints
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

  // Copy CLI install command to clipboard
  const handleCopyCLI = async () => {
    try {
      const installCommand = "curl -fsSL https://raw.githubusercontent.com/joudbitar/dsa-teacher/main/scripts/install-cli.sh | bash";
      await navigator.clipboard.writeText(installCommand);
      setCliCopied(true);
      setTimeout(() => setCliCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Continue to challenge after viewing repo modal
  const handleContinueToChallenge = () => {
    setShowRepoCommand(false);

    // Move to first challenge (step 1)
    setCurrentStepIndex(1);

    // Mark step 0 (language selection) as completed
    if (!completedSteps.includes(0)) {
      setCompletedSteps([0]);

      // Save to localStorage
      if (id) {
        saveChallengeProgress(id, {
          completedSteps: [0],
          currentStepIndex: 1,
          selectedLanguage,
          lastUpdated: Date.now(),
        });
      }
    }
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

  const handleProgressModalStay = () => {
    if (!progressModal) return;
    if (progressModal.isLastStep) {
      setProgressModal(null);
      return;
    }
    const stayIndex = Math.max(progressModal.previousStepIndex, 0);
    setCurrentStepIndex(stayIndex);
    if (id) {
      saveChallengeProgress(id, {
        completedSteps: progressModal.completedStepsSnapshot,
        currentStepIndex: stayIndex,
        selectedLanguage,
        lastUpdated: Date.now(),
      });
    }
    setProgressModal(null);
  };

  const handleProgressModalContinue = () => {
    if (progressModal) {
      if (progressModal.isLastStep) {
        setProgressModal(null);
        navigate("/challenges");
        return;
      }

      setCurrentStepIndex(progressModal.nextStepIndex);
      if (id) {
        saveChallengeProgress(id, {
          completedSteps: progressModal.completedStepsSnapshot,
          currentStepIndex: progressModal.nextStepIndex,
          selectedLanguage,
          lastUpdated: Date.now(),
        });
      }
    }
    setProgressModal(null);
  };

  const handleCancelStepNavigate = () => {
    setPendingStepIndex(null);
    setShowStepWarning(false);
  };

  const handleNewAttempt = () => {
    // Reset to language selection step to allow creating a new project
    setCurrentStepIndex(0);
    setCompletedSteps([]);
    // Optionally clear existing project so they start fresh
    // setExistingProject(null);
    // setSavedRepoUrl(null);
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
        <main className="flex-1 relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-20 flex items-center justify-center">
          <div className="relative flex h-16 w-16 items-center justify-center">
            <span className="absolute inset-0 rounded-full border-2 border-border/50" />
            <span className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin" />
          </div>
        </main>
        <Footer className="relative z-10 mt-auto" />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col text-foreground"
      style={{ backgroundColor }}
    >
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
              <div className="rounded-lg border border-border bg-muted/50 p-4">
                <p className="text-sm font-medium mb-2">Install the DSA CLI</p>
                <p className="text-xs text-muted-foreground mb-3">
                  Install the CLI tool to run tests and submit your solutions:
                </p>
                <div className="bg-background rounded-lg p-3 font-mono text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <code className="flex-1 break-all">
                      curl -fsSL https://raw.githubusercontent.com/joudbitar/dsa-teacher/main/scripts/install-cli.sh | bash
                    </code>
                    <button
                      onClick={handleCopyCLI}
                      className="px-2 py-1 rounded bg-accent/10 hover:bg-accent/20 border border-accent/20 transition-colors shrink-0 flex items-center gap-1"
                      title="Copy install command"
                    >
                      {cliCopied ? (
                        <Check className="h-3 w-3 text-accent" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                After cloning and installing the CLI, run{" "}
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
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
          onClick={handleCancelStepNavigate}
        >
          <div
            className="rounded-lg border shadow-xl max-w-md w-full p-6 space-y-6"
            style={{ backgroundColor, borderColor }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-2">
              <p className="text-sm uppercase tracking-wide text-muted-foreground font-mono">
                Review completed step
              </p>
              <h2 className="text-2xl font-bold font-mono">
                Revisit “{timelineSteps[pendingStepIndex]?.name}”?
              </h2>
            </div>
            <p className="text-muted-foreground leading-relaxed font-mono">
              You’ve already finished this challenge. You can review your notes
              or code without losing progress, but make sure to return to your
              current step when you’re ready to continue.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCancelStepNavigate}
                className="px-4 py-2 rounded border font-mono text-sm transition-opacity hover:opacity-70"
                style={{ borderColor, color: textColor }}
              >
                Stay on current step
              </button>
              <button
                onClick={handleConfirmStepNavigate}
                className="px-4 py-2 rounded border font-mono text-sm transition-opacity hover:opacity-80"
                style={{
                  backgroundColor: accentGreen,
                  borderColor: accentGreen,
                  color: backgroundColor,
                }}
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
          <div className="mb-6">
            <Link
              to="/challenges"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Challenges
            </Link>
          </div>
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
        <main className="relative flex-1 p-8 overflow-y-auto">
          <div
            className={`relative max-w-4xl mx-auto ${
              progressModal ? "pointer-events-none" : ""
            }`}
            style={{
              filter: progressModal ? "blur(4px)" : "none",
            }}
          >
            {/* Back Button - Top of Page */}
            {existingProject && displayStepIndex > 0 && (
              <button
                onClick={() => handleStepClick(0)}
                className="inline-flex items-center gap-2 text-sm font-mono text-muted-foreground hover:text-foreground transition-colors mb-6"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Setup
              </button>
            )}
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
                onNewAttempt={handleNewAttempt}
                isCreatingProject={creatingProject}
                projectError={projectError}
                moduleId={id}
                subchallengeName={timelineSteps[displayStepIndex]?.name}
              />
            </div>
          </div>

          {progressModal && (
            <div
              className="fixed inset-0 z-40 flex items-center justify-center p-4"
              onClick={handleProgressModalStay}
            >
              <div
                className="rounded-lg border shadow-xl max-w-md w-full p-6 space-y-6"
                style={{ backgroundColor, borderColor }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold font-mono">
                    {progressModal.isLastStep
                      ? "Module Complete!"
                      : "Step Completed!"}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed font-mono">
                    {progressModal.isLastStep
                      ? "Congratulations! You finished this module. Explore more modules or stay here to review your work."
                      : `Ready to move on to ${
                          progressModal.nextStepName || "the next step"
                        }?`}
                  </p>
                </div>
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={handleProgressModalStay}
                    className="px-4 py-2 rounded border font-mono text-sm transition-opacity hover:opacity-70"
                    style={{ borderColor, color: textColor }}
                  >
                    {progressModal.isLastStep
                      ? "Stay here"
                      : "Stay on current step"}
                  </button>
                  <button
                    onClick={handleProgressModalContinue}
                    className="px-4 py-2 rounded border font-mono text-sm transition-opacity hover:opacity-80"
                    style={{
                      backgroundColor: accentGreen,
                      borderColor: accentGreen,
                      color: backgroundColor,
                    }}
                  >
                    {progressModal.isLastStep
                      ? "Explore more modules"
                      : "Continue to next step"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}
