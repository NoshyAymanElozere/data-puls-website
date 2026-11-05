import {
  ArrowDown,
  ArrowUp,
  BarChart3,
  Crown,
  FileText,
  GripVertical,
  Headphones,
  Layers,
  Loader2,
  ScanFace,
  Settings,
  ShieldCheck,
  Store,
} from 'lucide-react'
import { useState, type ElementType } from 'react'
import { useTranslation } from 'react-i18next'
import { useProfile } from '@/features/auth/api/useAuth'
import { Button } from '@/shared/components/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/card'
import { NoPermissionCard } from '@/shared/components/NoPermissionCard'
import { StatusToggle } from '@/shared/components/StatusToggle'
import { hasPermission } from '@/shared/utils/permissions'
import { cn } from '@/shared/utils/utils'
import {
  useProfileSections,
  useSortProfileSections,
  useToggleProfileSectionStatus,
  type ProfileSection,
  type ProfileSectionKey,
} from '../api/useProfileSections'

/** Same icons the mobile "My Account" page shows next to each section. */
const SECTION_ICONS: Record<ProfileSectionKey, ElementType> = {
  subscription: Crown,
  financial_analysis: BarChart3,
  app_settings: Settings,
  biometric_login: ScanFace,
  categories: Layers,
  herz_partners: Store,
  privacy_policy: ShieldCheck,
  contact_us: Headphones,
  terms_and_conditions: FileText,
}

function moveSection(sections: ProfileSection[], from: number, to: number): ProfileSection[] {
  const next = [...sections]
  const [moved] = next.splice(from, 1)
  next.splice(to, 0, moved)
  return next
}

export default function ProfileSectionsPage() {
  const { t } = useTranslation()
  const { data: admin, isLoading: profileLoading } = useProfile()
  const canView = hasPermission(admin, 'profile_sections.view')
  const canUpdate = hasPermission(admin, 'profile_sections.update')

  const { data: sections = [], isLoading } = useProfileSections()
  const sortMutation = useSortProfileSections()
  const toggleMutation = useToggleProfileSectionStatus()

  const [draggingIndex, setDraggingIndex] = useState<number | null>(null)
  const [dropIndex, setDropIndex] = useState<number | null>(null)

  if (!profileLoading && !canView) return <NoPermissionCard />

  const canSort = canUpdate && !sortMutation.isPending

  const reorder = (from: number, to: number) => {
    if (!canSort || from === to || to < 0 || to >= sections.length) return
    sortMutation.mutate(moveSection(sections, from, to))
  }

  const endDrag = () => {
    setDraggingIndex(null)
    setDropIndex(null)
  }

  return (
    <Card className="border-border/60 shadow-sm rounded-2xl overflow-hidden bg-card">
      <CardHeader className="pb-4 border-b border-border/40 px-6 py-5">
        <CardTitle className="text-lg font-bold text-foreground">{t('profileSections')}</CardTitle>
        <p className="mt-1 text-xs text-muted-foreground">{t('profileSectionsSubtitle')}</p>
      </CardHeader>
      <CardContent className="p-6">
        {isLoading ? (
          <div className="flex justify-center py-12 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <ol className="max-w-3xl space-y-2">
            {sections.map((section, index) => {
              const Icon = SECTION_ICONS[section.key] ?? FileText
              return (
                <li
                  key={section.id}
                  data-testid={`profile-section-${section.key}`}
                  draggable={canSort}
                  onDragStart={(e) => {
                    e.dataTransfer.effectAllowed = 'move'
                    // Firefox only starts a drag when data is set.
                    e.dataTransfer.setData('text/plain', section.key)
                    setDraggingIndex(index)
                  }}
                  onDragOver={(e) => {
                    if (draggingIndex === null) return
                    e.preventDefault()
                    setDropIndex(index)
                  }}
                  onDrop={(e) => {
                    e.preventDefault()
                    if (draggingIndex !== null) reorder(draggingIndex, index)
                    endDrag()
                  }}
                  onDragEnd={endDrag}
                  className={cn(
                    'flex flex-wrap items-center gap-3 rounded-xl border border-border/60 bg-card px-3 py-2.5 transition-colors',
                    draggingIndex === index && 'opacity-50',
                    dropIndex === index && draggingIndex !== index && 'border-main ring-1 ring-main'
                  )}
                >
                  {canUpdate && (
                    <GripVertical
                      className={cn('h-4 w-4 shrink-0 text-muted-foreground', canSort && 'cursor-grab')}
                      aria-hidden
                    />
                  )}
                  <span className="w-5 shrink-0 text-center text-xs font-bold tabular-nums text-muted-foreground">
                    {index + 1}
                  </span>
                  <span
                    className={cn(
                      'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-main/10 text-main',
                      !section.is_active && 'opacity-40'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span
                    className={cn(
                      'min-w-40 flex-1 text-sm font-semibold text-foreground',
                      !section.is_active && 'text-muted-foreground'
                    )}
                  >
                    {section.title}
                  </span>
                  <div className="h-9">
                    <StatusToggle
                      value={section.is_active}
                      onChange={() => toggleMutation.mutateAsync(section.id)}
                      disabled={!canUpdate}
                    />
                  </div>
                  {canUpdate && (
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        title={t('moveUp')}
                        aria-label={`${t('moveUp')}: ${section.title}`}
                        disabled={!canSort || index === 0}
                        onClick={() => reorder(index, index - 1)}
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        title={t('moveDown')}
                        aria-label={`${t('moveDown')}: ${section.title}`}
                        disabled={!canSort || index === sections.length - 1}
                        onClick={() => reorder(index, index + 1)}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </li>
              )
            })}
          </ol>
        )}
      </CardContent>
    </Card>
  )
}
