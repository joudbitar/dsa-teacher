import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Layers, Search, Minus } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const modules = [
  {
    id: 'stack',
    title: 'Stack 101',
    icon: Layers,
    invariants: ['Push/Pop', 'Underflow safety', 'Dynamic resize', 'Min stack'],
    time: '30-45 min',
    progress: 0,
  },
  {
    id: 'queue',
    title: 'Queue 101',
    icon: Layers,
    invariants: ['Enqueue', 'Dequeue', 'Front', 'Size'],
    time: '30-45 min',
    progress: 50,
  },
  {
    id: 'linked-list',
    title: 'Linked List 101',
    icon: Minus,
    invariants: ['Insert', 'Delete', 'Search', 'Reverse'],
    time: '45-60 min',
    progress: 0,
  },
]

export function ModulesStrip() {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold mb-2">Pick Your First Build</h2>
          <p className="text-muted-foreground">Small, finishable chunks → huge psychological win</p>
        </motion.div>

        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
          {modules.map((module, index) => {
            const Icon = module.icon
            const isHovered = hoveredId === module.id
            
            return (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onHoverStart={() => setHoveredId(module.id)}
                onHoverEnd={() => setHoveredId(null)}
                whileHover={{ 
                  y: -8,
                  rotateY: 5,
                  rotateX: 5,
                }}
                className="min-w-[320px] flex-shrink-0"
              >
                <Link
                  to={`/challenges/${module.id}`}
                  className={cn(
                    "block rounded-xl border border-border bg-card p-6 transition-all",
                    "hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20"
                  )}
                >
                  {/* Icon and Title */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{module.title}</h3>
                      <p className="text-sm text-muted-foreground">{module.time}</p>
                    </div>
                  </div>

                  {/* Invariants */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {module.invariants.map((invariant, i) => (
                      <span
                        key={i}
                        className="text-xs px-2 py-1 rounded-full bg-muted border border-border text-muted-foreground"
                      >
                        {invariant}
                      </span>
                    ))}
                  </div>

                  {/* Progress Ring */}
                  <div className="relative w-16 h-16 mb-4">
                    <svg className="w-16 h-16 transform -rotate-90">
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                        className="text-muted"
                      />
                      <motion.circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                        className="text-success"
                        initial={{ pathLength: module.progress / 100 }}
                        animate={isHovered ? { pathLength: 1 } : { pathLength: module.progress / 100 }}
                        transition={{ duration: 0.5 }}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-bold">{module.progress}%</span>
                    </div>
                  </div>

                  {/* Hover Effect */}
                  <motion.div
                    initial={false}
                    animate={{
                      opacity: isHovered ? 1 : 0,
                      y: isHovered ? 0 : -10,
                    }}
                    className="text-sm text-primary font-medium"
                  >
                    Time to mastery: ~{module.time}
                  </motion.div>

                  <ArrowRight className="mt-4 h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

