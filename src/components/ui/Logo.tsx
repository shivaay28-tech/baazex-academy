import { cn } from '@/utils/cn'

export function Logo({
  light = false,
  compact = false,
  className,
}: {
  light?: boolean
  compact?: boolean
  className?: string
}) {
  if (compact) {
    return (
      <img
        src="/brand/logo-mark.png"
        alt=""
        className={cn('h-9 w-9 object-contain', className)}
      />
    )
  }

  return (
    <img
      src={light ? '/brand/logo-light.png' : '/brand/logo-ink.png'}
      alt="Baazex Academy"
      className={cn('h-10 w-auto sm:h-12', className)}
    />
  )
}
