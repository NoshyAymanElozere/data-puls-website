import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/shared/utils/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive: 'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline: 'text-foreground',
        success: 'border-transparent bg-success/10 text-success',
        warning: 'border-transparent bg-action/10 text-action',
        info: 'border-transparent bg-brand-active/10 text-brand-active',
        purple: 'border-transparent bg-brand-active/10 text-brand-active',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean
}

function Badge({ className, variant, dot, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {dot && (
        <span
          className={cn(
            'h-1.5 w-1.5 rounded-full',
            variant === 'success' && 'bg-success',
            variant === 'warning' && 'bg-action',
            variant === 'destructive' && 'bg-action',
            variant === 'info' && 'bg-brand-active',
            variant === 'default' && 'bg-white',
            variant === 'secondary' && 'bg-foreground',
            variant === 'outline' && 'bg-foreground',
            variant === 'purple' && 'bg-purple-500',
          )}
        />
      )}
      {children}
    </div>
  )
}

export { Badge, badgeVariants }
