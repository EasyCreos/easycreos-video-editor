import { cn } from '@/lib/utils'
import React from 'react'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'outline'
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'rounded-full px-4 py-2 text-lg font-semibold transition cursor-pointer disabled:cursor-not-allowed',
          variant === 'default'
            ? 'bg-primary text-brand-white hover:bg-blue-500'
            : 'border border-primary hover:bg-blue-100',
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
