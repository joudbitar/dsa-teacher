import { useState } from 'react'
import { cn } from '@/lib/utils'

const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
const mockStreak = [true, true, true, true, false, false, false] // Mock data

export function StreakSection() {
  const [hoveredDay, setHoveredDay] = useState<number | null>(null)

  return (
    <section className="py-20 sm:py-32 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Your coding streak, but for fundamentals</h2>
          <p className="text-lg text-muted-foreground">
            Run <code className="px-2 py-1 rounded bg-muted text-primary">dsa test</code> daily to build your streak
          </p>
        </div>

        <div className="flex justify-center">
          <div className="flex gap-4">
            {days.map((day, index) => {
              const isActive = mockStreak[index]
              const isHovered = hoveredDay === index
              
              return (
                <div
                  key={index}
                  onMouseEnter={() => setHoveredDay(index)}
                  onMouseLeave={() => setHoveredDay(null)}
                  className="relative"
                >
                  <div
                    className={cn(
                      "flex h-16 w-16 items-center justify-center rounded-xl border-2 font-bold text-lg transition-colors",
                      isActive
                        ? "bg-success/20 border-success text-success glow-green"
                        : "bg-muted border-border text-muted-foreground"
                    )}
                  >
                    {day}
                  </div>
                  
                  {/* Tooltip */}
                  {isHovered && (
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-card border border-border px-3 py-2 text-xs shadow-lg z-10">
                      {isActive ? (
                        <>You ran tests 3 times today · +1 Fundamentals Streak</>
                      ) : (
                        <>Run <code className="text-primary">dsa test</code> to light up this day</>
                      )}
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 h-2 w-2 rotate-45 bg-card border-r border-b border-border" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-muted-foreground">
            <span className="text-success font-bold">4 day streak</span> · Keep it going! 🔥
          </p>
        </div>
      </div>
    </section>
  )
}

