import { cn } from '@/utils/cn'
import type { Difficulty } from '@/types'

const styles: Record<Difficulty, string> = {
  Beginner: 'bg-white text-navy ring-1 ring-navy/10',
  Intermediate: 'bg-white text-accent ring-1 ring-baazex/25',
  Advanced: 'bg-navy text-white',
}

export function DifficultyBadge({ level }: { level: Difficulty }) {
  return (
    <span className={cn('inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide', styles[level])}>
      {level}
    </span>
  )
}
