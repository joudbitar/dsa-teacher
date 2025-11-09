import { cn } from "@/lib/utils";
import type { CSSProperties } from "react";
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
  time: _time,
  level: _level,
  selectedLanguage,
  currentStepIndex = 0,
  onStepClick,
  maxAccessibleStep = 0,
}: ChallengeSidebarProps) {
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

              const stepInlineStyles: CSSProperties = {
                cursor: isAccessible ? "pointer" : "not-allowed",
                transition: "transform 200ms ease, box-shadow 200ms ease",
              };

              if (isCurrentStep) {
                stepInlineStyles.transform = "translateY(-2px)";
                stepInlineStyles.boxShadow =
                  "0 12px 26px rgba(86, 60, 44, 0.24), 0 0 0 1px rgba(176, 147, 109, 0.28)";
                stepInlineStyles.borderRadius = "16px";
                stepInlineStyles.background = "rgba(176, 147, 109, 0.08)";
              }

              return (
                <div
                  key={sub.id}
                  className="relative group"
                  onClick={() => isAccessible && onStepClick?.(index)}
                  style={stepInlineStyles}
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
                    <div className="flex-1 min-w-0 text-center">
                      <p
                        className={cn(
                          "flex items-baseline justify-center gap-2 leading-snug font-mono transition-all duration-200 text-sm font-semibold",
                          isCurrentStep
                            ? "text-[#4A2F23] text-base font-bold"
                            : "text-foreground",
                          !isAccessible && !isCurrentStep && "opacity-50"
                        )}
                      >
                        {index === 0 ? (
                          <span>{sub.name}</span>
                        ) : (
                          <>
                            <span
                              style={{
                                fontFeatureSettings: '"tnum"',
                                minWidth: "2ch",
                                textAlign: "right",
                              }}
                            >
                              {index}.
                            </span>
                            <span className="text-left">{sub.name}</span>
                          </>
                        )}
                        {isCompleted && index <= maxAccessibleStep && (
                          <span className="ml-1">✓</span>
                        )}
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
