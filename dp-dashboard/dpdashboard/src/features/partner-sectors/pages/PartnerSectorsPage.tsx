import { Plus } from 'lucide-react'
import { useState } from 'react'
import { FormProvider } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useProfile } from '@/features/auth/api/useAuth'
import { Button } from '@/shared/components/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/card'
import { useZodForm } from '@/shared/components/form-fields'
import { GenericDataGrid } from '@/shared/components/GenericDataGrid'
import { SearchInput } from '@/shared/components/input'
import ModalStatus from '@/shared/components/modal-status'
import { NoPermissionCard } from '@/shared/components/NoPermissionCard'
import { useTableState } from '@/shared/hooks/useTableState'
import { hasPermission } from '@/shared/utils/permissions'
import {
  useCreatePartnerSector,
  useDeletePartnerSector,
  usePartnerSector,
  usePartnerSectorsList,
  useTogglePartnerSectorStatus,
  useUpdatePartnerSector,
  type PartnerSector,
} from '../api/usePartnerSectors'
import { getPartnerSectorsColumnDefs } from './ColumnDefs'
import { PartnerSectorsFormModal } from './PartnerSectorsFormModal'
import { getInitialValues, schema, type PartnerSectorFormValues } from './validationSchema'

export default function PartnerSectorsPage() {
  const { t, i18n } = useTranslation()
  const label = t('partnerSectors')
  const table = useTableState()
  const { data: admin, isLoading: profileLoading } = useProfile()

  const canView = hasPermission(admin, 'partner_sectors.view')
  const canCreate = hasPermission(admin, 'partner_sectors.create')
  const canUpdate = hasPermission(admin, 'partner_sectors.update')
  const canDelete = hasPermission(admin, 'partner_sectors.delete')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<PartnerSector | null>(null)
  const [deletingItem, setDeletingItem] = useState<PartnerSector | null>(null)
  const [isViewOnly, setIsViewOnly] = useState(false)
  const [statusFilter, setStatusFilter] = useState('')

  const methods = useZodForm<PartnerSectorFormValues>(schema, getInitialValues(null))

  const { data: detail, isLoading: detailLoading } = usePartnerSector(
    isModalOpen && editingItem ? editingItem.id : null
  )
  const { data: paginatedData, isLoading } = usePartnerSectorsList(table.page, table.search, statusFilter)
  const items = paginatedData?.data ?? []

  const createMutation = useCreatePartnerSector(methods.setError)
  const updateMutation = useUpdatePartnerSector(methods.setError)
  const deleteMutation = useDeletePartnerSector()
  const toggleMutation = useTogglePartnerSectorStatus()

  if (!profileLoading && !canView) return <NoPermissionCard />

  const openModal = (item: PartnerSector | null, viewOnly: boolean) => {
    setEditingItem(item)
    setIsViewOnly(viewOnly)
    methods.reset(getInitialValues(null))
    setIsModalOpen(true)
  }

  const handleSave = (values: PartnerSectorFormValues) => {
    if (editingItem?.id) {
      updateMutation.mutate(
        { id: editingItem.id, values },
        {
          onSuccess: () => {
            setIsModalOpen(false)
            setEditingItem(null)
          },
        }
      )
    } else {
      createMutation.mutate(values, { onSuccess: () => setIsModalOpen(false) })
    }
  }

  const columnDefs = getPartnerSectorsColumnDefs({
    t,
    lang: i18n.language,
    toggleMutation,
    onView: (item) => openModal(item, true),
    onEdit: (item) => openModal(item, false),
    onDelete: setDeletingItem,
    canUpdate,
    canDelete,
  })

  return (
    <FormProvider {...methods}>
      <Card className="border-border/60 shadow-sm rounded-2xl overflow-hidden bg-card">
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border/40 px-6 py-5">
          <div>
            <CardTitle className="text-lg font-bold text-foreground">{label}</CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">{t('partnerSectorsSubtitle')}</p>
          </div>
          {canCreate && (
            <Button onClick={() => openModal(null, false)} className="h-9 px-4 rounded-xl">
              <Plus className="mr-2 h-4 w-4" /> {t('add')}
            </Button>
          )}
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 max-w-xl">
            <div className="flex-1">
              <SearchInput
                placeholder={`${t('search')} ${label}...`}
                value={table.search}
                onChange={(e) => table.setSearch(e.target.value)}
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                table.setPage(1)
              }}
              className="w-full sm:w-40 h-10 px-3 rounded-xl border border-border/60 bg-card text-xs font-bold"
            >
              <option value="">{t('status')}</option>
              <option value="true">{t('active')}</option>
              <option value="false">{t('inactive')}</option>
            </select>
          </div>

          <GenericDataGrid
            rowData={items}
            columnDefs={columnDefs}
            rowHeight={50}
            headerHeight={50}
            loading={isLoading}
            onViewRow={(data) => openModal(data as PartnerSector, true)}
            isServerSide
            currentPage={table.page}
            totalPages={paginatedData?.meta?.last_page ?? 1}
            onPageChange={table.setPage}
            paginationLinks={paginatedData?.meta?.links ?? paginatedData?.links}
          />
        </CardContent>

        <PartnerSectorsFormModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          editingItem={editingItem}
          detail={detail}
          detailLoading={detailLoading}
          onSave={handleSave}
          loading={createMutation.isPending || updateMutation.isPending}
          label={t('partnerSector')}
          isViewOnly={isViewOnly}
        />

        <ModalStatus
          open={!!deletingItem}
          onOpenChange={(v) => !v && setDeletingItem(null)}
          title={`${t('delete')} ${t('partnerSector')}`}
          description={t('partnerSectorDeleteConfirmation')}
          agreeLabel={t('delete')}
          cancelLabel={t('cancel')}
          onAgreeButtonClick={() => {
            if (deletingItem?.id) {
              // On 422 (sector still has partners) the backend message is toasted and the dialog closes.
              deleteMutation.mutate(deletingItem.id, { onSettled: () => setDeletingItem(null) })
            }
          }}
          onCancelButtonClick={() => setDeletingItem(null)}
          loading={deleteMutation.isPending}
          type="delete"
        />
      </Card>
    </FormProvider>
  )
}
