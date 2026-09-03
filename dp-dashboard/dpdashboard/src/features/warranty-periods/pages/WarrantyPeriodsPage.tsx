import { Button } from '@/shared/components/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/card'
import { useZodForm } from '@/shared/components/form-fields'
import { GenericDataGrid } from '@/shared/components/GenericDataGrid'
import { SearchInput } from '@/shared/components/input'
import ModalStatus from '@/shared/components/modal-status'
import { useTableState } from '@/shared/hooks/useTableState'
import { useProfile } from '@/features/auth/api/useAuth'
import { hasPermission } from '@/shared/utils/permissions'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { FormProvider } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import {
  useCreateWarrantyPeriod,
  useDeleteWarrantyPeriod,
  useWarrantyPeriod,
  useWarrantyPeriodsList,
  useToggleWarrantyPeriodStatus,
  useUpdateWarrantyPeriod,
  type WarrantyPeriod,
} from '../api/useWarrantyPeriods'
import { getWarrantyPeriodsColumnDefs } from './ColumnDefs'
import { WarrantyPeriodsFormModal } from './WarrantyPeriodsFormModal'
import { createSchema, getInitialValues, updateSchema, type WarrantyPeriodFormValues } from './validationSchema'

export default function WarrantyPeriodsPage() {
  const { t, i18n } = useTranslation()
  const label = t('warrantyPeriods') || 'Warranty Periods'
  const table = useTableState()
  const { data: admin } = useProfile()

  const canCreate = hasPermission(admin, 'warranty_periods.create')
  const canUpdate = hasPermission(admin, 'warranty_periods.update')
  const canDelete = hasPermission(admin, 'warranty_periods.delete')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<WarrantyPeriod | null>(null)
  const [deletingItem, setDeletingItem] = useState<WarrantyPeriod | null>(null)
  const [isViewOnly, setIsViewOnly] = useState(false)
  const [statusFilter, setStatusFilter] = useState('')
  const [unitFilter, setUnitFilter] = useState('')

  const schema = editingItem ? updateSchema : createSchema
  const methods = useZodForm(schema, getInitialValues(null))

  const { data: periodDetail, isLoading: periodDetailLoading } = useWarrantyPeriod(
    isModalOpen && editingItem ? editingItem.id : null
  )

  const { data: paginatedData, isLoading } = useWarrantyPeriodsList(
    table.page,
    table.search,
    statusFilter,
    unitFilter
  )
  const items = paginatedData?.data ?? []

  const createMutation = useCreateWarrantyPeriod(methods.setError)
  const updateMutation = useUpdateWarrantyPeriod(methods.setError)
  const deleteMutation = useDeleteWarrantyPeriod()
  const toggleMutation = useToggleWarrantyPeriodStatus()

  const handleSave = (formData: WarrantyPeriodFormValues) => {
    if (editingItem?.id) {
      updateMutation.mutate(
        { id: editingItem.id, payload: formData },
        {
          onSuccess: () => {
            setIsModalOpen(false)
            setEditingItem(null)
          },
        }
      )
    } else {
      createMutation.mutate(formData, {
        onSuccess: () => setIsModalOpen(false),
      })
    }
  }

  const columnDefs = getWarrantyPeriodsColumnDefs({
    t,
    lang: i18n.language,
    toggleMutation,
    setEditingItem,
    setIsModalOpen,
    setDeletingItem,
    setIsViewOnly,
    canUpdate,
    canDelete,
  })

  return (
    <FormProvider {...methods}>
      <Card className="border-border/60 shadow-sm rounded-2xl overflow-hidden bg-card">
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border/40 px-6 py-5">
          <CardTitle className="text-lg font-bold text-foreground">{label}</CardTitle>
          {canCreate && (
            <Button
              onClick={() => {
                setEditingItem(null)
                setIsViewOnly(false)
                methods.reset(getInitialValues(null))
                setIsModalOpen(true)
              }}
              className="h-9 px-4 rounded-xl"
            >
              <Plus className="mr-2 h-4 w-4" /> {t('add') || 'Add New'}
            </Button>
          )}
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 max-w-2xl">
            <div className="flex-1">
              <SearchInput
                placeholder={`${t('search')} ${label}...`}
                value={table.search}
                onChange={(e) => table.setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value)
                  table.setPage(1)
                }}
                className="w-full sm:w-36 h-10 px-3 rounded-xl border border-border/60 bg-card text-xs font-bold"
              >
                <option value="">{t('status')}</option>
                <option value="true">{t('active')}</option>
                <option value="false">{t('inactive')}</option>
              </select>

              <select
                value={unitFilter}
                onChange={(e) => {
                  setUnitFilter(e.target.value)
                  table.setPage(1)
                }}
                className="w-full sm:w-36 h-10 px-3 rounded-xl border border-border/60 bg-card text-xs font-bold"
              >
                <option value="">{t('allUnits') || 'All Units'}</option>
                <option value="month">{t('month')}</option>
                <option value="year">{t('year')}</option>
              </select>
            </div>
          </div>

          <GenericDataGrid
            rowData={items}
            columnDefs={columnDefs}
            rowHeight={50}
            headerHeight={50}
            loading={isLoading}
            onViewRow={(data) => {
              setEditingItem(data as WarrantyPeriod)
              setIsViewOnly(true)
              setIsModalOpen(true)
            }}
            isServerSide
            currentPage={table.page}
            totalPages={paginatedData?.meta?.last_page ?? 1}
            onPageChange={table.setPage}
            paginationLinks={paginatedData?.meta?.links ?? paginatedData?.links}
          />
        </CardContent>

        <WarrantyPeriodsFormModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          editingItem={editingItem}
          detail={periodDetail}
          detailLoading={periodDetailLoading}
          onSave={handleSave}
          loading={createMutation.isPending || updateMutation.isPending}
          label={label}
          isViewOnly={isViewOnly}
        />

        <ModalStatus
          open={!!deletingItem}
          onOpenChange={(v) => !v && setDeletingItem(null)}
          title={`${t('delete')} ${label}`}
          description={t('deleteConfirmation')}
          agreeLabel={t('delete')}
          cancelLabel={t('cancel')}
          onAgreeButtonClick={() => {
            if (deletingItem?.id) {
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
    </FormProvider>
  )
}
