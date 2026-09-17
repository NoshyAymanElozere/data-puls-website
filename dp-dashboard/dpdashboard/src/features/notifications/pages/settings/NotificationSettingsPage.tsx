import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BellRing } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/card'
import { GenericDataGrid } from '@/shared/components/GenericDataGrid'
import { SearchInput } from '@/shared/components/input'
import { useProfile } from '@/features/auth/api/useAuth'
import { hasPermission } from '@/shared/utils/permissions'
import { getLocalizedValue } from '@/shared/utils/localized-value'
import {
  useNotificationSettingsList,
  useToggleNotificationSettingStatus,
  type NotificationSettingListItem,
} from '../../api/useNotificationSettings'
import { getSettingsColumnDefs } from './SettingsColumnDefs'
import { NotificationSettingEditModal } from './NotificationSettingEditModal'
import { NotificationSettingDetailModal } from './NotificationSettingDetailModal'

export default function NotificationSettingsPage() {
  const { t, i18n } = useTranslation()
  const { data: admin } = useProfile()
  const isRtl = i18n.language === 'ar'

  const canUpdate = hasPermission(admin, 'notification_settings.update')

  const [search, setSearch] = useState('')
  const [editingItem, setEditingItem] = useState<NotificationSettingListItem | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [viewingItem, setViewingItem] = useState<NotificationSettingListItem | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  const { data: settingsList = [], isLoading } = useNotificationSettingsList()
  const toggleMutation = useToggleNotificationSettingStatus()

  // Filtered rows for search
  const filteredData = useMemo(() => {
    if (!search.trim()) return settingsList
    const q = search.toLowerCase().trim()
    return settingsList.filter((item) => {
      const keyMatch = item.key.toLowerCase().includes(q)
      const nameMatch = getLocalizedValue(item.name, i18n.language).toLowerCase().includes(q)
      const titleMatch = getLocalizedValue(item.title, i18n.language).toLowerCase().includes(q)
      return keyMatch || nameMatch || titleMatch
    })
  }, [settingsList, search, i18n.language])

  const handleEdit = (item: NotificationSettingListItem) => {
    setEditingItem(item)
    setIsEditModalOpen(true)
  }

  const handleView = (item: NotificationSettingListItem) => {
    setViewingItem(item)
    setIsDetailModalOpen(true)
  }

  const columnDefs = useMemo(
    () =>
      getSettingsColumnDefs({
        t,
        lang: i18n.language,
        canUpdate,
        onEdit: handleEdit,
        onView: handleView,
        toggleMutation,
      }),
    [t, i18n.language, canUpdate, toggleMutation]
  )

  return (
    <div className="space-y-6">
      <Card className="border-border/60 shadow-sm rounded-2xl overflow-hidden bg-card">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/40 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-main/10 text-main border border-main/20 shadow-xs">
              <BellRing className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-foreground">
                {t('notificationSettings')}
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                {t('notificationSettingsDesc')}
              </p>
            </div>
          </div>

          <div className="w-full sm:w-72" dir={isRtl ? 'rtl' : 'ltr'}>
            <SearchInput
              placeholder={`${t('search')}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="rounded-xl overflow-hidden border border-border/60">
            <GenericDataGrid
              rowData={filteredData}
              columnDefs={columnDefs}
              loading={isLoading}
              isServerSide={false}
              hidePagination={true}
              domLayout="autoHeight"
              rowHeight={68}
            />
          </div>
        </CardContent>
      </Card>

      {/* Show / Detail Modal */}
      <NotificationSettingDetailModal
        open={isDetailModalOpen}
        onOpenChange={(open) => {
          setIsDetailModalOpen(open)
          if (!open) setViewingItem(null)
        }}
        settingId={viewingItem?.id ?? null}
        canUpdate={canUpdate}
        onEdit={(setting) => {
          setEditingItem(setting as NotificationSettingListItem)
          setIsEditModalOpen(true)
        }}
      />

      {/* Edit Modal */}
      <NotificationSettingEditModal
        open={isEditModalOpen}
        onOpenChange={(open) => {
          setIsEditModalOpen(open)
          if (!open) setEditingItem(null)
        }}
        settingId={editingItem?.id ?? null}
      />
    </div>
  )
}
