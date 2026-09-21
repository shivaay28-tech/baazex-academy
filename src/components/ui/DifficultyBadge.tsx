import { cn } from '@/utils/cn'
import type { Difficulty } from '@/types'

const styles: Record<Difficulty, string> = {
  Beginner: 'bg-bright/10 text-baazex',
  Intermediate: 'bg-navy/8 text-navy',
  Advanced: 'bg-navy text-white',
}

export function DifficultyBadge({ level }: { level: Difficulty }) {
  return (
    <span className={cn('inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide', styles[level])}>
      {level}
    </span>
  )
}
