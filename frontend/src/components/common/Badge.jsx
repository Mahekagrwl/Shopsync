import React from 'react'
import { cn } from '../../utils/cn'

const badgeVariants = {
  default: 'bg-stone-100 text-stone-800 border-stone-200',
  rose: 'bg-rose-50 text-rose-700 border-rose-200',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  info: 'bg-sky-50 text-sky-700 border-sky-200',
  dark: 'bg-stone-900 text-stone-100 border-stone-800'
}

export function Badge({ children, variant = 'default', className = '', ...props }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border tracking-wide',
        badgeVariants[variant] || badgeVariants.default,
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

export default Badge
