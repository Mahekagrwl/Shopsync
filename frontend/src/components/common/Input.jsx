import React, { forwardRef } from 'react'
import { cn } from '../../utils/cn'

export const Input = forwardRef(function Input(
  {
    label,
    error,
    helperText,
    icon: Icon,
    className = '',
    inputClassName = '',
    id,
    type = 'text',
    ...props
  },
  ref
) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

  return (
    <div className={cn('w-full flex flex-col gap-1.5', className)}>
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold uppercase tracking-wider text-stone-600">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 pointer-events-none text-stone-400">
            <Icon className="h-4 w-4" />
          </div>
        )}
        <input
          id={inputId}
          ref={ref}
          type={type}
          className={cn(
            'w-full rounded-lg border bg-white px-3.5 py-2 text-sm text-stone-900 placeholder-stone-400',
            'transition-colors duration-150',
            'focus:outline-none focus:ring-2 focus:ring-offset-1',
            Icon ? 'pl-10' : '',
            error
              ? 'border-red-400 focus:border-red-500 focus:ring-red-400/20'
              : 'border-stone-300 focus:border-stone-900 focus:ring-stone-900/10',
            inputClassName
          )}
          {...props}
        />
      </div>
      {error && <span className="text-xs text-red-600 font-medium">{error}</span>}
      {helperText && !error && <span className="text-xs text-stone-500">{helperText}</span>}
    </div>
  )
})

export default Input
