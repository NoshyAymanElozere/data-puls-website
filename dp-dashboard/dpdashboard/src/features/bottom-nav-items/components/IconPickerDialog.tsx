import { Check, Loader2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/components/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/dialog'
import { SearchInput } from '@/shared/components/input'
import { cn } from '@/shared/utils/utils'
import {
  useFontAwesomeIcons,
  type BottomNavItem,
  type FontAwesomeIcon,
  type FontAwesomeStyle,
} from '../api/useBottomNavItems'

/** Rendering every icon at once makes typing in the search box lag. */
const MAX_VISIBLE_ICONS = 150

/**
 * Lower is a better match, null is no match. Whole words in the name come first, then the rest of the name,
 * then the icon's terms. Terms start with its former names, so searching "home" puts the house icon first.
 */
function searchRank(icon: FontAwesomeIcon, query: string): number | null {
  if (icon.name === query) return 0
  if (icon.name.split('-').includes(query)) return 1
  if (icon.name.includes(query)) return 2
  const terms = icon.terms.map((term) => term.toLowerCase())
  const exactTerm = terms.indexOf(query)
  if (exactTerm !== -1) return 3 + exactTerm
  return terms.some((term) => term.includes(query)) ? 1000 : null
}

interface Selection {
  style: FontAwesomeStyle
  name: string
}

interface IconPickerDialogProps {
  item: BottomNavItem | null
  onOpenChange: (open: boolean) => void
  onSave: (selection: Selection) => void
  saving: boolean
}

export function IconPickerDialog({ item, onOpenChange, onSave, saving }: IconPickerDialogProps) {
  const { t } = useTranslation()
  const open = !!item
  const { data: icons = [], isLoading, isError } = useFontAwesomeIcons(open)

  const [search, setSearch] = useState('')
  const [selection, setSelection] = useState<Selection | null>(null)

  useEffect(() => {
    if (!item) return
    setSearch('')
    setSelection({ style: item.icon.style, name: item.icon.name })
  }, [item])

  const { visible, total } = useMemo(() => {
    const query = search.trim().toLowerCase()
    const matches = query
      ? icons
          .map((icon) => ({ icon, rank: searchRank(icon, query) }))
          .filter(({ rank }) => rank !== null)
          .sort((a, b) => (a.rank as number) - (b.rank as number))
          .map(({ icon }) => icon)
      : icons
    // One tile per style, so the regular (outline) and solid versions can be told apart.
    const tiles = matches.flatMap((icon) =>
      icon.styles.map((style) => ({ style, name: icon.name, label: icon.label }))
    )
    // The current icon comes first, or the cut-off below could hide it.
    if (!query && item) {
      const current = tiles.findIndex((tile) => tile.name === item.icon.name && tile.style === item.icon.style)
      if (current > 0) tiles.unshift(...tiles.splice(current, 1))
    }
    return { visible: tiles.slice(0, MAX_VISIBLE_ICONS), total: tiles.length }
  }, [icons, search, item])

  const unchanged = selection?.name === item?.icon.name && selection?.style === item?.icon.style

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle>
            {t('bottomNavChooseIcon')}: {item?.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <SearchInput
            autoFocus
            placeholder={t('bottomNavSearchIcons')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="h-80 overflow-y-auto rounded-xl border border-border/60 p-2">
            {isLoading ? (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : isError ? (
              <p className="py-12 text-center text-sm text-destructive">{t('bottomNavIconsLoadFailed')}</p>
            ) : visible.length === 0 ? (
              <p className="py-12 text-center text-sm text-muted-foreground">{t('bottomNavNoIconsFound')}</p>
            ) : (
              <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-6">
                {visible.map((icon) => {
                  const selected = selection?.name === icon.name && selection?.style === icon.style
                  return (
                    <button
                      key={`${icon.style}-${icon.name}`}
                      type="button"
                      title={`fa-${icon.style} fa-${icon.name}`}
                      aria-label={`${icon.label} (${icon.style})`}
                      aria-pressed={selected}
                      onClick={() => setSelection({ style: icon.style, name: icon.name })}
                      className={cn(
                        'relative flex h-20 flex-col items-center justify-center gap-1.5 rounded-lg border border-transparent px-1 text-foreground transition-colors hover:bg-muted',
                        selected && 'border-main bg-main/10 text-main hover:bg-main/10'
                      )}
                    >
                      {selected && <Check className="absolute end-1 top-1 h-3 w-3" aria-hidden />}
                      <i className={`fa-${icon.style} fa-${icon.name} text-xl`} aria-hidden />
                      <span className="w-full truncate text-center text-[10px] text-muted-foreground" dir="ltr">
                        {icon.name}
                      </span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {total > visible.length && (
            <p className="text-xs text-muted-foreground">
              {t('bottomNavIconsTruncated', { shown: visible.length, total })}
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('cancel')}
          </Button>
          <Button
            disabled={!selection || unchanged || saving}
            onClick={() => selection && onSave(selection)}
          >
            {saving && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
            {t('save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
