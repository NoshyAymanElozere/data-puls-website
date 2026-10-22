import * as React from 'react'
import { createPortal } from 'react-dom'
import {
  autoUpdate,
  flip,
  offset,
  shift,
  size,
  useFloating,
} from '@floating-ui/react-dom'
import { Check, ChevronDown, Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/utils/utils'

export interface SearchableSelectOption {
  value: string
  label: string
}

export interface SearchableSelectProps {
  id?: string
  value?: string
  onChange: (value: string) => void
  options: SearchableSelectOption[]
  placeholder?: string
  disabled?: boolean
  error?: boolean
  className?: string
  /** Preferred max menu height; Floating UI shrinks further to fit the viewport */
  maxMenuHeight?: number
}

const MENU_ATTR = 'data-searchable-select-menu'
const SEARCH_ROW_HEIGHT = 44

export function SearchableSelect({
  id,
  value,
  onChange,
  options,
  placeholder = 'Select…',
  disabled = false,
  error = false,
  className,
  maxMenuHeight = 220,
}: SearchableSelectProps) {
  const { t, i18n } = useTranslation()
  const isRtl = i18n.language === 'ar'
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState('')
  const [listMaxHeight, setListMaxHeight] = React.useState(maxMenuHeight - SEARCH_ROW_HEIGHT)
  const searchRef = React.useRef<HTMLInputElement>(null)

  const selected = options.find((o) => o.value === value) ?? null

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return options
    return options.filter((o) => o.label.toLowerCase().includes(q))
  }, [options, query])

  const { refs, floatingStyles, placement, update } = useFloating({
    placement: 'bottom-start',
    strategy: 'fixed',
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(6),
      flip({
        fallbackPlacements: ['top-start', 'bottom-end', 'top-end'],
        padding: 12,
      }),
      shift({ padding: 12, crossAxis: true }),
      size({
        padding: 12,
        apply({ availableHeight, rects, elements }) {
          const totalHeight = Math.min(maxMenuHeight, Math.max(SEARCH_ROW_HEIGHT + 72, availableHeight))
          const scrollHeight = Math.max(72, totalHeight - SEARCH_ROW_HEIGHT)
          setListMaxHeight((prev) => (prev === scrollHeight ? prev : scrollHeight))
          Object.assign(elements.floating.style, {
            width: `${Math.max(rects.reference.width, 180)}px`,
          })
        },
      }),
    ],
  })

  React.useLayoutEffect(() => {
    if (open) update()
  }, [open, filtered.length, update])

  React.useEffect(() => {
    if (!open) {
      setQuery('')
      return
    }
    const timer = window.setTimeout(() => searchRef.current?.focus(), 0)
    return () => window.clearTimeout(timer)
  }, [open])

  React.useEffect(() => {
    if (!open) return

    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null
      if (!target) return
      const floatingEl = refs.floating.current
      const referenceEl = refs.reference.current
      if (floatingEl?.contains(target) || referenceEl?.contains(target)) return
      setOpen(false)
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('touchstart', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('touchstart', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open, refs.floating, refs.reference])

  const selectOption = (option: SearchableSelectOption) => {
    onChange(option.value)
    setOpen(false)
  }

  const menu =
    open && typeof document !== 'undefined'
      ? createPortal(
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            {...{ [MENU_ATTR]: '' }}
            data-placement={placement}
            className={cn(
              'z-[99999] flex flex-col rounded-xl border border-border bg-popover text-popover-foreground',
              'shadow-[0_10px_25px_-5px_rgba(0,0,0,0.25),0_8px_10px_-6px_rgba(0,0,0,0.25)]',
              'animate-in fade-in-0 zoom-in-95 duration-150'
            )}
            onMouseDown={(e) => {
              e.stopPropagation()
            }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <div className="flex shrink-0 items-center gap-2 border-b border-border/60 px-3 py-2">
              <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              <input
                ref={searchRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholder}
                className="h-7 w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && filtered[0]) {
                    e.preventDefault()
                    selectOption(filtered[0])
                  }
                }}
              />
            </div>
            <div
              className="overflow-y-auto overscroll-contain p-1"
              style={{ maxHeight: listMaxHeight }}
              role="listbox"
            >
              {filtered.length === 0 ? (
                <div className="px-3 py-2 text-sm text-muted-foreground">
                  {t('noResultsFound') || 'No results found'}
                </div>
              ) : (
                filtered.map((option) => {
                  const isSelected = option.value === value
                  return (
                    <button
                      key={option.value}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      className={cn(
                        'flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors',
                        isSelected
                          ? 'bg-[var(--main-color,#5B4B8A)] font-semibold text-white'
                          : 'font-medium text-popover-foreground hover:bg-[color-mix(in_srgb,var(--main-color,#5B4B8A)_16%,transparent)]'
                      )}
                      onClick={() => selectOption(option)}
                    >
                      <span className="truncate">{option.label}</span>
                      {isSelected && <Check className="h-3.5 w-3.5 shrink-0 opacity-90" />}
                    </button>
                  )
                })
              )}
            </div>
          </div>,
          document.body
        )
      : null

  return (
    <div className={cn('relative w-full overflow-visible', className)}>
      <button
        id={id}
        type="button"
        ref={refs.setReference}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => !disabled && setOpen((v) => !v)}
        dir={isRtl ? 'rtl' : 'ltr'}
        className={cn(
          'flex min-h-10 w-full items-center justify-between rounded-xl border bg-card px-3.5 text-sm shadow-sm transition-all text-start',
          'focus:outline-none focus:ring-1 focus:ring-[var(--main-color,#5B4B8A)] focus:border-[var(--main-color,#5B4B8A)]',
          'disabled:cursor-not-allowed disabled:opacity-60',
          error
            ? 'border-destructive focus:ring-destructive focus:border-destructive'
            : 'border-border hover:border-muted-foreground/60',
          open && !error && 'border-[var(--main-color,#5B4B8A)] ring-1 ring-[var(--main-color,#5B4B8A)]'
        )}
      >
        <span className={cn('truncate', !selected && 'text-muted-foreground')}>
          {selected?.label || placeholder}
        </span>
        <ChevronDown
          className={cn(
            'h-4 w-4 shrink-0 text-muted-foreground transition-transform',
            isRtl ? 'mr-2' : 'ml-2',
            open && 'rotate-180'
          )}
        />
      </button>
      {menu}
    </div>
  )
}

/** True when an event target is inside a portaled SearchableSelect menu */
export function isSearchableSelectMenuTarget(target: EventTarget | null) {
  return target instanceof Element && !!target.closest(`[${MENU_ATTR}]`)
}
