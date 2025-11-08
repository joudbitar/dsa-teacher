import { Check } from 'lucide-react'

export function HeroRight() {
  const tests = [
    { id: 'push_pop_basic', name: 'push_pop_basic' },
    { id: 'underflow_safety', name: 'underflow_safety' },
    { id: 'dynamic_resize', name: 'dynamic_resize' },
    { id: 'min_stack', name: 'min_stack' },
  ]

  return (
    <div className="relative">
      <div className="relative rounded-2xl border border-border bg-card p-6 shadow-2xl">
        {/* Label */}
        <div className="absolute -top-4 left-6">
          <span className="rounded-full bg-primary/20 border border-primary/30 px-4 py-1 text-sm font-medium text-primary">
            Stack 101 · Fundamentals Lab
          </span>
        </div>

        <div className="mt-6 space-y-4">
          {/* Editor */}
          <div className="rounded-lg border border-primary/30 bg-muted/50 p-4 font-mono text-sm">
            <div className="space-y-2">
              <div className="text-primary">class Stack {'{'}</div>
              <div className="ml-4 text-foreground/80">push(item) {'{'} ... {'}'}</div>
              <div className="ml-4 text-foreground/80">pop() {'{'} ... {'}'}</div>
              <div className="text-primary">{'}'}</div>
            </div>
          </div>

          {/* Tests */}
          <div className="space-y-3">
            <div className="rounded-lg border border-border bg-muted/30 p-4 font-mono text-sm">
              <div className="text-muted-foreground mb-3">$ dsa test</div>
              <div className="text-muted-foreground mb-2">Running tests...</div>
              <div className="space-y-1">
                {tests.map((test) => (
                  <div key={test.id} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-success" />
                    <span className="text-success">
                      [✓] {test.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="text-success font-semibold">4 / 4 invariants mastered</span>
              </div>
              <div className="h-3 rounded-full bg-muted overflow-hidden">
                <div className="h-full w-full bg-gradient-to-r from-primary to-success glow-green rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

