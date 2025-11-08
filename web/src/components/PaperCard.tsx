import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface PaperCardProps {
  children: ReactNode
  title?: string
  className?: string
  variant?: 'default' | 'torn'
}

export function PaperCard({ children, title, className, variant = 'default' }: PaperCardProps) {
  return (
    <div
      className={cn(
        'relative rounded-2xl border border-border bg-background',
        'shadow-[0_10px_25px_rgba(23,21,18,0.08)]',
        'transition-all hover:translate-y-[1px] hover:shadow-[0_12px_30px_rgba(23,21,18,0.12)]',
        variant === 'torn' && 'paper-torn',
        className
      )}
      style={{
        backgroundImage: `
          /* Paper texture - subtle noise */
          radial-gradient(circle at 20% 30%, rgba(139, 119, 101, 0.02) 0%, transparent 50%),
          radial-gradient(circle at 80% 70%, rgba(160, 140, 120, 0.015) 0%, transparent 50%),
          linear-gradient(135deg, rgba(245, 240, 230, 0.3) 0%, rgba(250, 245, 235, 0.2) 100%)
        `,
        backgroundSize: '100% 100%, 100% 100%, 100% 100%',
      }}
    >
      {/* Organic edge effect using clip-path */}
      <div 
        className="paper-clip-path"
        style={{
          clipPath: variant === 'torn' 
            ? 'polygon(0% 2%, 3% 0%, 8% 1%, 15% 0%, 22% 2%, 30% 0%, 38% 1%, 45% 0%, 52% 1%, 60% 0%, 68% 2%, 75% 0%, 82% 1%, 90% 0%, 96% 2%, 99% 4%, 100% 8%, 99% 15%, 100% 22%, 98% 30%, 99% 38%, 100% 45%, 98% 52%, 99% 60%, 97% 68%, 99% 75%, 98% 82%, 99% 90%, 97% 96%, 94% 99%, 88% 98%, 82% 100%, 75% 98%, 68% 99%, 60% 97%, 52% 99%, 45% 98%, 38% 100%, 30% 97%, 22% 99%, 15% 96%, 8% 98%, 3% 95%, 1% 92%, 0% 85%, 1% 78%, 0% 70%, 2% 62%, 0% 55%, 1% 48%, 0% 40%, 2% 32%, 0% 25%, 1% 18%, 0% 10%)'
            : 'polygon(1% 1%, 5% 0%, 12% 2%, 20% 0%, 28% 1%, 35% 0%, 42% 2%, 50% 0%, 58% 1%, 65% 0%, 72% 2%, 80% 0%, 88% 1%, 95% 0%, 99% 2%, 100% 5%, 99% 12%, 100% 20%, 98% 28%, 100% 35%, 99% 42%, 100% 50%, 98% 58%, 100% 65%, 97% 72%, 99% 80%, 98% 88%, 100% 95%, 97% 99%, 90% 100%, 82% 98%, 75% 100%, 68% 97%, 60% 100%, 52% 98%, 45% 100%, 38% 97%, 30% 100%, 22% 98%, 15% 100%, 8% 97%, 2% 99%, 0% 95%, 1% 88%, 0% 80%, 2% 72%, 0% 65%, 1% 58%, 0% 50%, 2% 42%, 0% 35%, 1% 28%, 0% 20%, 2% 12%, 0% 5%)',
        padding: 'inherit',
      }}
    >
      {title && (
        <h3 className="text-xl font-bold mb-4">{title}</h3>
      )}
      {children}
      </div>
    </div>
  )
}

