import { Unlock, Calculator, Layers } from 'lucide-react'

export function CalculatorMetaphor() {
  const blockLabels = ['Stack', 'Queue', 'Pointers']

  return (
    <section className="py-20 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text */}
          <div className="space-y-6">
            <h2 className="text-4xl font-bold">Why fundamentals first?</h2>
            <p className="text-lg text-muted-foreground">
              We don't ban AI or tools. We just unlock them after you've built the mental model.
            </p>
            <p className="text-muted-foreground">
              It's like learning multiplication before using a calculator. Once you understand the fundamentals, 
              tools become power-ups, not crutches.
            </p>
          </div>

          {/* Right: Static Illustration */}
          <div className="relative flex items-center justify-center gap-8 min-h-[300px]">
            {/* Calculator */}
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center rounded-lg border-2 border-primary/30 bg-card">
                <Calculator className="h-10 w-10 text-primary" />
              </div>
              
              {/* Unlock Icon */}
              <div className="absolute -top-2 -right-2">
                <Unlock className="h-6 w-6 text-success" />
              </div>
            </div>

            {/* Building Blocks */}
            <div className="flex flex-col gap-3">
              {blockLabels.map((label) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-primary/30 bg-primary/10">
                    <Layers className="h-6 w-6 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-foreground">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

