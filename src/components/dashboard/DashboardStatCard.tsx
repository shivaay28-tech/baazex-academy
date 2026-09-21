import { cn } from '@/utils/cn'
import type { LucideIcon } from 'lucide-react'

export function DashboardStatCard({
  label,
  value,
  hint,
  icon: Icon,
  accent = 'blue',
}: {
  label: string
  value: string | number
  hint?: string
  icon: LucideIcon
  accent?: 'blue' | 'navy' | 'green'
}) {
  return (
    <article className="rounded-2xl border border-line bg-white p-5 shadow-[0_10px_40px_-18px_rgb(6_21_43_/_0.1)]">
      <div className="flex items-start justify-between">
        <p className="text-sm font-semibold text-muted">{label}</p>
        <span
          className={cn(
            'grid h-9 w-9 place-items-center rounded-xl',
            accent === 'blue' && 'bg-baazex/10 text-baazex',
            accent === 'navy' && 'bg-navy/10 text-navy',
            accent === 'green' && 'bg-success/10 text-success',
          )}
        >
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-3 text-3xl font-extrabold tracking-tight text-navy">{value}</p>
      {hint ? <p className="mt-1 text-xs text-muted">{hint}</p> : null}
    </article>
  )
}
