import { useState, useEffect, useMemo } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ChallengesGrid } from "@/components/ChallengesGrid";
import { OrganicStep } from "@/components/OrganicStep";
import { useTheme } from "@/theme/ThemeContext";
import { fetchUserProjects, apiClient, type Project } from "@/lib/api";
import { useAuth } from "@/auth/useAuth";
import { Link, useLocation } from "react-router-dom";
import { challengeData } from "@/data/challenges";
import { clearChallengeProgress } from "@/utils/challengeProgress";
import { cn } from "@/lib/utils";
import {
  Layers,
  Search,
  Minus,
  Code2,
  CheckCircle2,
  RotateCcw,
  X,
} from "lucide-react";

// Icon mapping for different data structures
const iconMap: Record<string, any> = {
  stack: Layers,
  queue: Layers,
  "binary-search": Search,
  "min-heap": Minus,
  "linked-list": Minus,
};

export function Challenges() {
  const {
    backgroundColor,
    sectionBackgroundColor,
    textColor,
    borderColor,
    secondaryTextColor,
  } = useTheme();
  const location = useLocation();
  const { user } = useAuth();
  const [modules, setModules] = useState<any[]>([]);
  const [modulesLoading, setModulesLoading] = useState(true);
  const [modulesError, setModulesError] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [restartingProjectId, setRestartingProjectId] = useState<string | null>(
    null
  );
  const [showRestartConfirm, setShowRestartConfirm] = useState(false);
  const [projectToRestart, setProjectToRestart] = useState<{
    id: string;
    title: string;
  } | null>(null);

  // Load modules for ChallengesGrid
  useEffect(() => {
    async function loadModules() {
      try {
        setModulesLoading(true);
        const data = await apiClient.getModules();
        setModules(data);
      } catch (err) {
        console.error("Failed to load modules:", err);
        setModulesError(
          err instanceof Error ? err.message : "Failed to load modules"
        );
      } finally {
        setModulesLoading(false);
      }
    }

    loadModules();
  }, []);

  // Fetch projects from API for Your Library section
  useEffect(() => {
    const loadProjects = async (isInitial: boolean) => {
      if (!user) {
        setProjects([])
        setProjectsLoading(false)
        return
      }

      // Only show loading state on initial load, not on background polling
      if (isInitial) {
        setProjectsLoading(true)
      }

      try {
        const fetchedProjects = await fetchUserProjects()
        setProjects(fetchedProjects)
      } catch (error) {
        console.error('Error loading projects:', error)
        setProjects([])
      } finally {
        if (isInitial) {
          setProjectsLoading(false)
        }
      }
    }

    // Initial load
    loadProjects(true)

    // Poll for updates every 10 seconds to catch CLI submissions (silently in background)
    const interval = setInterval(() => {
      loadProjects(false)
    }, 10000)

    return () => clearInterval(interval)
  }, [user, location.pathname])

  // Handle restart module
  const handleRestartClick = (projectId: string, moduleTitle: string) => {
    setProjectToRestart({ id: projectId, title: moduleTitle });
    setShowRestartConfirm(true);
  };

  const handleRestartConfirm = async () => {
    if (!projectToRestart) return;

    setRestartingProjectId(projectToRestart.id);
    setShowRestartConfirm(false);

    try {
      // Find the module ID for this project before deleting
      const projectToDelete = projects.find((p) => p.id === projectToRestart.id);
      const moduleId = projectToDelete?.moduleId;

      // Delete the project from database
      await apiClient.deleteProject(projectToRestart.id);

      // Clear localStorage checkmarks and progress for this module
      if (moduleId) {
        clearChallengeProgress(moduleId);
        
        // Also dispatch event to notify ChallengeDetail page to refresh
        window.dispatchEvent(new CustomEvent('challenge-restarted', {
          detail: { moduleId }
        }));
      }

      // Remove the project from state
      setProjects(projects.filter((p) => p.id !== projectToRestart.id));

      // Show success message (optional - could add a toast notification)
      console.log(`Successfully restarted module: ${projectToRestart.title}`);
    } catch (error) {
      console.error("Error restarting module:", error);
      alert("Failed to restart module. Please try again.");
    } finally {
      setRestartingProjectId(null);
      setProjectToRestart(null);
    }
  };

  const handleRestartCancel = () => {
    setShowRestartConfirm(false);
    setProjectToRestart(null);
  };

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showRestartConfirm) {
        handleRestartCancel();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [showRestartConfirm]);

  // Calculate challenge statistics and collect all library challenges from database projects
  const { libraryChallenges, inProgressCount, completedCount } = useMemo(() => {
    let inProgress = 0;
    let completed = 0;
    const challenges: Array<{
      id: string;
      title: string;
      level: string;
      completedTasks: number;
      totalTasks: number;
      progressPercentage: number;
      lastUpdated: number;
      status: "in-progress" | "completed";
      project: Project;
    }> = [];

    // Map database projects to challenge display format
    projects.forEach((project) => {
      const challenge = challengeData[project.moduleId];
      if (!challenge) return;

      // Get total number of subchallenges (test cases)
      // Filter out "Choose Language", "Create class", "Create node" for task counting
      const methodsToImplement = challenge.subchallenges.filter((sub) => {
        const lower = sub.toLowerCase();
        return (
          !lower.includes("choose language") &&
          !lower.includes("create class") &&
          !lower.includes("create node")
        );
      });
      const totalTasks = methodsToImplement.length;

      // Calculate completed tasks based on currentChallengeIndex
      // currentChallengeIndex is 0-based and represents the NEXT challenge to work on
      // Index 0 = "Choose Language" (not a task)
      // Index 1 = "Create class"/"Create node" (not a task)
      // Index 2+ = Actual methods (these are tasks)
      // So if currentChallengeIndex is 3, that means challenges 0, 1, 2 are done
      // Challenge 2 is the first task, so completedTasks = currentChallengeIndex - 2
      const completedTasks = Math.max(0, project.currentChallengeIndex - 2);

      // Use progress from database (0-100)
      const progressPercentage = project.progress;

      // Determine status
      const status =
        project.status === "completed"
          ? ("completed" as const)
          : progressPercentage > 0 && progressPercentage < 100
          ? ("in-progress" as const)
          : ("in-progress" as const);

      if (status === "in-progress") {
        // Show all in-progress projects, even if progress is 0% (just created repo)
        inProgress++;
        challenges.push({
          id: project.moduleId,
          title: challenge.title,
          level: challenge.level,
          completedTasks,
          totalTasks,
          progressPercentage,
          lastUpdated: new Date(project.updatedAt).getTime(),
          status: "in-progress",
          project,
        });
      } else if (status === "completed") {
        completed++;
        challenges.push({
          id: project.moduleId,
          title: challenge.title,
          level: challenge.level,
          completedTasks: totalTasks,
          totalTasks,
          progressPercentage: 100,
          lastUpdated: new Date(project.updatedAt).getTime(),
          status: "completed",
          project,
        });
      }
    });

    // Sort by status (in-progress first), then by most recent
    challenges.sort((a, b) => {
      if (a.status !== b.status) {
        return a.status === "in-progress" ? -1 : 1;
      }
      return (b.lastUpdated || 0) - (a.lastUpdated || 0);
    });

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
    <div
      className="min-h-screen flex flex-col relative"
      style={{ backgroundColor }}
    >
      <Navbar className="relative z-10" />
      <main className="flex-1 relative z-10 pb-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[calc(100vh-12rem)]">
          {/* Your Library Section */}
          <div
            className="mb-8 rounded-lg border p-6"
            style={{
              backgroundColor: sectionBackgroundColor,
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
              <div className="relative flex gap-4 overflow-x-auto pb-4 scrollbar-hide" style={{ paddingRight: `${libraryChallenges.length * 60}px` }}>
                {libraryChallenges.map((challenge, index) => {
                  const Icon = iconMap[challenge.id] || Code2;
                  const isIntermediate = challenge.level === "Intermediate";
                  const isAdvanced = challenge.level === "Advanced";

                  return (
                    <Link
                      key={challenge.id}
                      to={`/challenges/${challenge.id}`}
                      className="block shrink-0 sticky"
                      style={{ 
                        transform: 'none',
                        zIndex: libraryChallenges.length - index,
                        left: `${index * 30}px`,
                        width: '300px'
                      }}
                    >
                      <OrganicStep
                        isCurrent={false}
                        isCompleted={challenge.status === "completed"}
                        className="p-4 relative h-full min-h-[160px]"
                      >
                        {/* Status Badge */}
                        <div className="absolute top-4 right-4">
                          {challenge.status === "completed" ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold font-mono bg-success/20 text-success">
                              <CheckCircle2 className="h-3 w-3" />
                              Completed
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold font-mono bg-muted text-foreground">
                              In Progress
                            </span>
                          )}
                        </div>

                        {/* Icon and Title */}
                        <div className="flex items-start gap-2 mb-2 pr-24">
                          <div className="flex h-10 w-10 shrink-0 aspect-square items-center justify-center rounded-sm bg-primary/10 border border-primary/20">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-sm font-bold font-mono leading-tight">{challenge.title}</h3>
                          </div>
                        </div>

                        {/* Level Badge */}
                        <div className="mb-2 ml-[48px]">
                          <span className="inline-block px-1.5 py-0.5 rounded-full text-xs font-medium font-mono bg-[#7F5539] text-white">
                            {challenge.level}
                          </span>
                        </div>

                        {/* Progress Info */}
                        {challenge.status === "in-progress" && (
                          <div className="mb-2 ml-[48px]">
                            <p className="text-xs text-muted-foreground font-mono">
                              {challenge.totalTasks > 0
                                ? `${challenge.completedTasks}/${challenge.totalTasks}`
                                : "Getting started..."}
                            </p>
                          </div>
                        )}

                        {challenge.status === "completed" && (
                          <p className="text-xs text-muted-foreground mb-2 font-mono ml-[48px]">
                            {challenge.totalTasks}/{challenge.totalTasks}
                          </p>
                        )}

                        {/* Action Buttons - Bottom right */}
                        <div className="absolute bottom-4 right-4 flex items-center gap-2">
                          <Link
                            to={`/challenges/${challenge.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="text-xs text-primary font-medium font-mono"
                          >
                            View →
                          </Link>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleRestartClick(
                                challenge.project.id,
                                challenge.title
                              );
                            }}
                            disabled={
                              restartingProjectId === challenge.project.id
                            }
                            className="text-xs text-muted-foreground font-mono transition-opacity hover:opacity-70 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Restart this module and create a new repository"
                          >
                            <RotateCcw className="h-3 w-3" />
                          </button>
                        </div>
                      </OrganicStep>
                    </Link>
                  );
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

          <div className="mb-8">
            <h2
              className="text-3xl font-bold font-mono mb-2"
              style={{ color: textColor }}
            >
              All Challenges
            </h2>
            <p
              className="text-base font-mono"
              style={{ color: secondaryTextColor }}
            >
              Pick a challenge and start building. Each module comes with tests,
              starter code, and clear goals.
            </p>
          </div>

          <ChallengesGrid modules={modules} />
        </div>
      </main>
      <Footer className="relative z-10 mt-auto" />

      {/* Restart Confirmation Modal */}
      {showRestartConfirm && projectToRestart && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={handleRestartCancel}
          >
            <div
              className="rounded-lg border p-6 max-w-md w-full shadow-xl"
            style={{
              backgroundColor: backgroundColor,
              borderColor: borderColor,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <h3
                className="text-xl font-bold font-mono"
                style={{ color: textColor }}
              >
                Restart Module?
              </h3>
              <button
                onClick={handleRestartCancel}
                className="transition-opacity hover:opacity-70"
                style={{ color: secondaryTextColor }}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p
              className="text-base font-mono mb-4"
              style={{ color: textColor }}
            >
              Are you sure you want to restart{" "}
              <strong>{projectToRestart.title}</strong>?
            </p>

            <p
              className="text-sm font-mono mb-6"
              style={{ color: secondaryTextColor }}
            >
              This will:
            </p>
            <ul
              className="text-sm font-mono mb-6 space-y-2 list-disc list-inside"
              style={{ color: secondaryTextColor }}
            >
              <li>Reset your progress to 0%</li>
              <li>Remove this project from your library</li>
              <li>Allow you to create a new repository</li>
              <li>Your old repository will remain in GitHub</li>
            </ul>

            <div className="flex gap-3 justify-end">
              <button
                onClick={handleRestartCancel}
                className="px-4 py-2 rounded border font-mono text-sm transition-opacity hover:opacity-70"
                style={{
                  borderColor: borderColor,
                  color: textColor,
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleRestartConfirm}
                className="px-4 py-2 rounded border font-mono text-sm transition-opacity hover:opacity-70"
                style={{
                  backgroundColor: "#B91C1C",
                  borderColor: "#B91C1C",
                  color: backgroundColor,
                }}
              >
                Restart Module
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
