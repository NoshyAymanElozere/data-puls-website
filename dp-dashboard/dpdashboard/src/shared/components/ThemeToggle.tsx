import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/shared/hooks/useTheme'
import { cn } from '@/shared/utils/utils'

const themes = [
  { value: 'light' as const, icon: Sun, label: 'Light mode' },
  { value: 'dark' as const, icon: Moon, label: 'Dark mode' },
]

function getEffectiveTheme(theme: 'light' | 'dark' | 'system'): 'light' | 'dark' {
  if (theme !== 'system') return theme
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const current = getEffectiveTheme(theme)

  return (
    <div
      className="relative flex h-8 items-center rounded-xl border border-border/60 bg-muted/30 p-0.5 shadow-sm"
      role="group"
      aria-label="Theme"
    >
      {themes.map(({ value, icon: Icon, label }) => {
        const isActive = current === value
        return (
          <button
            key={value}
            type="button"
            onClick={() => setTheme(value)}
            aria-pressed={isActive}
            aria-label={label}
            title={label}
            className={cn(
              'relative z-[1] flex h-7 w-9 items-center justify-center rounded-lg transition-all duration-200',
              isActive
                ? 'text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {isActive && (
              <span
                className="absolute inset-0 rounded-lg bg-primary shadow-sm shadow-primary/25"
                aria-hidden
              />
            )}
            <Icon className="relative h-3.5 w-3.5" strokeWidth={2.25} />
          </button>
        )
      })}
    </div>
  )
}
