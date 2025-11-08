import { cn } from "@/lib/utils";
import { OrganicStep } from "./OrganicStep";
import { TurtleProgress } from "./TurtleProgress";

interface Subchallenge {
  id: string;
  name: string;
  completed: boolean;
}

interface ChallengeSidebarProps {
  title: string;
  subchallenges: Subchallenge[];
  progress: number;
  time: string;
  level: string;
  selectedLanguage?: string;
  currentStepIndex?: number;
  onStepClick?: (stepIndex: number) => void;
  maxAccessibleStep?: number;
}

export function ChallengeSidebar({
  title,
  subchallenges,
  progress,
  time,
  level,
  selectedLanguage,
  currentStepIndex = 0,
  onStepClick,
  maxAccessibleStep = 0,
}: ChallengeSidebarProps) {
  const isIntermediate = level === "Intermediate";
  const isAdvanced = level === "Advanced";

  const languageNames: Record<string, string> = {
    typescript: "TypeScript",
    python: "Python",
    javascript: "JavaScript",
    go: "Go",
    java: "Java",
    cpp: "C++",
    "c++": "C++",
  };

  return (
    <aside className="w-full">
      <div>
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 font-mono">{title}</h2>
          <div className="flex items-center gap-3 mb-6 flex-wrap">
            <span
              className={cn(
                "rounded-full px-3 py-1.5 text-sm font-medium font-mono",
                isAdvanced
                  ? "bg-destructive/20 text-destructive"
                  : isIntermediate
                  ? "bg-warning/20 text-warning"
                  : "bg-success/20 text-success"
              )}
            >
              {level}
            </span>
            <span className="text-base text-muted-foreground font-mono">
              {time}
            </span>
            {selectedLanguage && (
              <span className="rounded-full px-3 py-1.5 text-sm font-medium bg-accent/20 text-accent border border-accent/30 font-mono">
                {languageNames[selectedLanguage] || selectedLanguage}
              </span>
            )}
          </div>

          {/* Progress */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-base">
              <span className="text-muted-foreground font-mono">Progress</span>
              <span className="font-semibold text-lg font-mono">
                {progress}%
              </span>
            </div>
            <TurtleProgress progress={progress} showPercentage={false} />
          </div>
        </div>

        {/* Timeline - Wooden Steps */}
        <div>
          <h3 className="text-base font-semibold mb-6 text-muted-foreground uppercase tracking-wide font-mono">
            Project Timeline
          </h3>
          <div className="space-y-16">
            {subchallenges.map((sub, index) => {
              const isCurrentStep = currentStepIndex === index;
              const isCompleted = sub.completed;
              const isAccessible = index <= maxAccessibleStep;
              const isFutureLocked = !isAccessible;

              return (
                <div
                  key={sub.id}
                  className="relative group"
                  onClick={() => isAccessible && onStepClick?.(index)}
                  style={{
                    cursor: isAccessible ? "pointer" : "not-allowed",
                  }}
                  aria-disabled={!isAccessible}
                  title={
                    isFutureLocked
                      ? "Complete previous challenges to unlock"
                      : undefined
                  }
                >
                  {/* Step box */}
                  <OrganicStep
                    isCurrent={isCurrentStep}
                    isCompleted={false}
                    isClickable={isAccessible}
                    shapeVariant={index}
                  >
                    {/* Content without numbers */}
                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          "text-sm font-medium leading-snug font-mono",
                          isCurrentStep ? "text-[#3E2723]" : "text-foreground",
                          !isAccessible && !isCurrentStep && "opacity-50"
                        )}
                      >
                        {sub.name}
                        {isFutureLocked && " 🔒"}
                        {isCompleted && index <= maxAccessibleStep && " ✓"}
                      </p>
                      {isCurrentStep && selectedLanguage && index === 0 && (
                        <p
                          className={cn(
                            "text-xs mt-0.5 font-mono",
                            "text-[#5D4037]/80"
                          )}
                        >
                          {languageNames[selectedLanguage]} selected
                        </p>
                      )}
                    </div>
                  </OrganicStep>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}
