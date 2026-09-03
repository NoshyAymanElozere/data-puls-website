import type { ReactNode } from 'react'
import { CardHeader, CardTitle } from '@/shared/components/card'
import { cn } from '@/shared/utils/utils'

interface StickyFormActionsProps {
  title: ReactNode
  children?: ReactNode
  className?: string
}

export function StickyFormActions({ title, children, className }: StickyFormActionsProps) {
  return (
    <CardHeader
      className={cn(
        'sticky top-0 z-20 flex flex-row items-center justify-between gap-4',
        'border-b border-border/40 px-6 py-4',
        'bg-card/95 backdrop-blur-md supports-[backdrop-filter]:bg-card/85',
        'shadow-sm',
        className
      )}
    >
      <CardTitle className="text-lg font-bold text-foreground min-w-0 truncate">{title}</CardTitle>
      {children ? <div className="shrink-0">{children}</div> : null}
    </CardHeader>
  )
}
