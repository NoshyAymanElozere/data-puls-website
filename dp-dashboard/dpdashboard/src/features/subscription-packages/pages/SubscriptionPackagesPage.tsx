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
import { useEffect, useState } from 'react'
import { FormProvider } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import {
  useCreateSubscriptionPackage,
  useDeleteSubscriptionPackage,
  useSubscriptionPackage,
  useSubscriptionPackagesList,
  useToggleSubscriptionPackageStatus,
  type SubscriptionPackage,
} from '../api/useSubscriptionPackages'
import { getSubscriptionPackagesColumnDefs } from './ColumnDefs'
import { SubscriptionPackageFormModal } from './SubscriptionPackageFormModal'
import { createSchema, getInitialValues, type SubscriptionPackageFormValues } from './validationSchema'

export default function SubscriptionPackagesPage() {
  const { t, i18n } = useTranslation()
  const label = t('subscriptionPackages')
  const table = useTableState()
  const { data: admin } = useProfile()

  const canCreate = hasPermission(admin, 'subscription_packages.create')
  const canUpdate = hasPermission(admin, 'subscription_packages.update')
  const canDelete = hasPermission(admin, 'subscription_packages.delete')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<SubscriptionPackage | null>(null)
  const [deletingItem, setDeletingItem] = useState<SubscriptionPackage | null>(null)
  const [isViewOnly, setIsViewOnly] = useState(false)
  const [statusFilter, setStatusFilter] = useState('')

  const methods = useZodForm(createSchema, getInitialValues())

  const { data: paginatedData, isLoading } = useSubscriptionPackagesList(table.page, table.search, statusFilter)
  const items = paginatedData?.data ?? []

  const viewPackageId = isViewOnly && editingItem?.id ? editingItem.id : null
  const { data: viewPackageDetail } = useSubscriptionPackage(viewPackageId)

  useEffect(() => {
    if (isModalOpen && isViewOnly && viewPackageDetail) {
      methods.reset(getInitialValues(viewPackageDetail))
    }
  }, [isModalOpen, isViewOnly, viewPackageDetail, methods.reset])

  const createMutation = useCreateSubscriptionPackage(methods.setError)
  const deleteMutation = useDeleteSubscriptionPackage()
  const toggleMutation = useToggleSubscriptionPackageStatus()

  const handleSave = (formData: SubscriptionPackageFormValues) => {
    createMutation.mutate(formData, {
      onSuccess: () => {
        setIsModalOpen(false)
        setEditingItem(null)
      },
    })
  }

  const columnDefs = getSubscriptionPackagesColumnDefs({
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
                methods.reset(getInitialValues())
                setIsModalOpen(true)
              }}
              className="h-9 px-4 rounded-xl"
            >
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
            onViewRow={(data) => {
              setEditingItem(data as SubscriptionPackage)
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

        <SubscriptionPackageFormModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          editingItem={editingItem}
          onSave={handleSave}
          loading={createMutation.isPending}
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
