import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/card'
import { SearchInput } from '@/shared/components/input'
import ModalStatus from '@/shared/components/modal-status'
import { GenericDataGrid } from '@/shared/components/GenericDataGrid'
import { ContactSubjectSelect } from '@/shared/components/selects/ContactSubjectSelect'
import { useProfile } from '@/features/auth/api/useAuth'
import { hasPermission } from '@/shared/utils/permissions'
import {
  useContactMessagesList,
  useDeleteContactMessage,
} from '@/features/contact/api/useContactMessages'
import { getSupportColumnDefs } from './ColumnDefs'
import { SupportViewModal } from './SupportViewModal'

export default function SupportPage() {
  const { t, i18n } = useTranslation()
  const { data: admin } = useProfile()
  const canDelete = hasPermission(admin, 'contact_messages.delete')

  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [subjectFilter, setSubjectFilter] = useState('')
  const [createdFrom, setCreatedFrom] = useState('')
  const [createdTo, setCreatedTo] = useState('')
  const label = t('contactMessages') || 'Contact Messages'
  const isRtl = i18n.language === 'ar'

  const [viewingItem, setViewingItem] = useState<{ id: number } | null>(null)
  const [deletingItem, setDeletingItem] = useState<{ id: number } | null>(null)

  const { data: paginatedData, isLoading } = useContactMessagesList(
    page,
    search,
    subjectFilter,
    createdFrom,
    createdTo
  )
  const items = paginatedData?.data || []

  const deleteMutation = useDeleteContactMessage()

  const columnDefs = getSupportColumnDefs({
    t,
    lang: i18n.language,
    setViewingItem,
    setDeletingItem,
    canDelete,
  })

  return (
    <Card className="border-border/60 shadow-sm rounded-2xl overflow-hidden bg-card">
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border/40 px-6 py-5">
        <CardTitle className="text-lg font-bold text-foreground">{label}</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3" dir={isRtl ? 'rtl' : 'ltr'}>
          <div className="flex-1 max-w-md">
            <SearchInput
              placeholder={`${t('search') || 'Search'} ${label}...`}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
            />
          </div>
          <div className="w-full sm:w-44">
            <ContactSubjectSelect
              value={subjectFilter}
              onChange={(value) => {
                setSubjectFilter(value)
                setPage(1)
              }}
            />
          </div>
          <div className="w-full sm:w-40">
            <input
              type="date"
              value={createdFrom}
              onChange={(e) => {
                setCreatedFrom(e.target.value)
                setPage(1)
              }}
              className="w-full h-10 px-3 rounded-xl border border-border/60 bg-card text-xs font-bold"
              placeholder={t('dateFrom') || 'From'}
            />
          </div>
          <div className="w-full sm:w-40">
            <input
              type="date"
              value={createdTo}
              onChange={(e) => {
                setCreatedTo(e.target.value)
                setPage(1)
              }}
              className="w-full h-10 px-3 rounded-xl border border-border/60 bg-card text-xs font-bold"
              placeholder={t('dateTo') || 'To'}
            />
          </div>
        </div>

        <GenericDataGrid
          rowData={items}
          columnDefs={columnDefs}
          rowHeight={50}
          headerHeight={50}
          loading={isLoading}
          onViewRow={(data) => setViewingItem(data as { id: number })}
          isServerSide
          currentPage={page}
          totalPages={paginatedData?.meta?.last_page || paginatedData?.last_page || 1}
          onPageChange={setPage}
          paginationLinks={paginatedData?.meta?.links || paginatedData?.links}
        />
      </CardContent>

      <SupportViewModal
        open={!!viewingItem}
        onOpenChange={(open) => !open && setViewingItem(null)}
        messageId={viewingItem?.id || null}
      />

      <ModalStatus
        open={!!deletingItem}
        onOpenChange={(v) => !v && setDeletingItem(null)}
        title={`${t('delete') || 'Delete'} ${label}`}
        description={t('deleteConfirmation') || 'Are you sure you want to delete this item? This action cannot be undone.'}
        agreeLabel={t('delete') || 'Delete'}
        cancelLabel={t('cancel') || 'Cancel'}
        onAgreeButtonClick={() => {
          if (deletingItem) {
            deleteMutation.mutate(deletingItem.id, {
              onSuccess: () => setDeletingItem(null),
            })
          }
        }}
        onCancelButtonClick={() => setDeletingItem(null)}
        loading={deleteMutation.isPending}
        type="delete"
      />
    </Card>
  )
}
