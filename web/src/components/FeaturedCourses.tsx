import { Link } from 'react-router-dom'
import { ArrowRight, Code2, Layers, Search, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

const courseIcons = {
  stack: Layers,
  queue: Layers,
  'binary-search': Search,
  'min-heap': Minus,
}

const courses = [
  {
    id: 'stack',
    title: 'Build a Stack',
    level: 'Beginner',
    summary: 'Implement push, pop, peek, size.',
    subchallenges: 5,
    time: '30-45 min',
  },
  {
    id: 'queue',
    title: 'Build a Queue',
    level: 'Beginner',
    summary: 'Circular buffer with enqueue/dequeue.',
    subchallenges: 5,
    time: '30-45 min',
  },
  {
    id: 'binary-search',
    title: 'Binary Search',
    level: 'Beginner',
    summary: 'Find index in a sorted array.',
    subchallenges: 4,
    time: '20-30 min',
  },
  {
    id: 'min-heap',
    title: 'Build a Min-Heap',
    level: 'Intermediate',
    summary: 'Insert, peekMin, extractMin, heapify.',
    subchallenges: 6,
    time: '45-60 min',
  },
]

export function FeaturedCourses() {
  return (
    <section className="py-20 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Start Building Fundamentals
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Master data structures and algorithms through hands-on projects
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {courses.map((course) => {
            const Icon = courseIcons[course.id as keyof typeof courseIcons] || Code2
            const isIntermediate = course.level === 'Intermediate'
            
            return (
              <Link
                key={course.id}
                to={`/challenges/${course.id}`}
                className={cn(
                  "group relative rounded-lg border bg-card p-6 transition-all",
                  "hover:shadow-lg hover:border-primary/50 hover:-translate-y-1"
                )}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <span className={cn(
                    "rounded-full px-2.5 py-1 text-xs font-medium",
                    isIntermediate
                      ? "bg-warning/20 text-warning"
                      : "bg-success/20 text-success"
                  )}>
                    {course.level}
                  </span>
                </div>

                <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                  {course.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {course.summary}
                </p>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{course.subchallenges} subchallenges</span>
                  <span>{course.time}</span>
                </div>

                <ArrowRight className="absolute bottom-6 right-6 h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </Link>
            )
          })}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/challenges"
            className={cn(
              "inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground px-6 py-3",
              "text-base font-semibold transition-colors hover:opacity-90"
            )}
          >
            View All Challenges
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}

