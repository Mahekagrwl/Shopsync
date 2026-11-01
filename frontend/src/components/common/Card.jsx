import React from 'react'
import { cn } from '../../utils/cn'

export function Card({ children, className = '', hover = false, ...props }) {
  return (
    <div
      className={cn(
        'rounded-xl border border-stone-200/80 bg-white p-6 shadow-sm',
        hover && 'transition-all duration-200 hover:shadow-md hover:border-stone-300',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ title, description, action, className = '' }) {
  return (
    <div className={cn('flex items-start justify-between gap-4 pb-4 border-b border-stone-100 mb-4', className)}>
      <div>
        <h3 className="text-base font-semibold text-stone-900">{title}</h3>
        {description && <p className="text-xs text-stone-500 mt-0.5">{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}

export default Card
