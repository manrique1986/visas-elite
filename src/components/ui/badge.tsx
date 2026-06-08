import { cn } from '@/lib/utils'
import { type CaseStatus } from '@/lib/types'
import { statusConfig } from '@/lib/utils'

interface StatusBadgeProps {
  status: CaseStatus
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status]
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border',
        config.bg,
        config.color,
        className
      )}
    >
      {config.label}
    </span>
  )
}

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'info'
  className?: string
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold',
        variant === 'default' && 'bg-[#0f2447]/10 text-[#0f2447]',
        variant === 'info' && 'bg-blue-50 text-blue-700 border border-blue-200',
        className
      )}
    >
      {children}
    </span>
  )
}
