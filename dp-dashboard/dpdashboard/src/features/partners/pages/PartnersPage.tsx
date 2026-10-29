import { Plus } from 'lucide-react'
import { useState, type ChangeEvent } from 'react'
import { FormProvider } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useProfile } from '@/features/auth/api/useAuth'
import { usePartnerSectorOptions } from '@/features/partner-sectors/api/usePartnerSectors'
import { useActiveCities } from '@/features/settings/api/useCities'
import { Button } from '@/shared/components/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/card'
import { useZodForm } from '@/shared/components/form-fields'
import { GenericDataGrid } from '@/shared/components/GenericDataGrid'
import { SearchInput } from '@/shared/components/input'
import ModalStatus from '@/shared/components/modal-status'
import { NoPermissionCard } from '@/shared/components/NoPermissionCard'
import { useTableState } from '@/shared/hooks/useTableState'
import { getLocalizedValue } from '@/shared/utils/localized-value'
import { hasPermission } from '@/shared/utils/permissions'
import {
  useCreatePartner,
  useDeletePartner,
  usePartner,
  usePartnersList,
  useTogglePartnerStatus,
  useUpdatePartner,
  type PartnerListItem,
} from '../api/usePartners'
import { getPartnersColumnDefs } from './ColumnDefs'
import { PartnersFormModal } from './PartnersFormModal'
import { getInitialValues, schema, type PartnerFormValues } from './validationSchema'

const filterSelectClass = 'w-full sm:w-44 h-10 px-3 rounded-xl border border-border/60 bg-card text-xs font-bold'

export default function PartnersPage() {
  const { t, i18n } = useTranslation()
  const label = t('herzPartners')
  const table = useTableState()
  const { data: admin, isLoading: profileLoading } = useProfile()

  const canView = hasPermission(admin, 'partners.view')
  const canCreate = hasPermission(admin, 'partners.create')
  const canUpdate = hasPermission(admin, 'partners.update')
  const canDelete = hasPermission(admin, 'partners.delete')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<PartnerListItem | null>(null)
  const [deletingItem, setDeletingItem] = useState<PartnerListItem | null>(null)
  const [isViewOnly, setIsViewOnly] = useState(false)
  const [sectorFilter, setSectorFilter] = useState('')
  const [cityFilter, setCityFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const methods = useZodForm<PartnerFormValues>(schema, getInitialValues(null))

  const { data: sectors = [] } = usePartnerSectorOptions()
  const { data: cities = [] } = useActiveCities()

  const { data: detail, isLoading: detailLoading } = usePartner(isModalOpen && editingItem ? editingItem.id : null)
  const { data: paginatedData, isLoading } = usePartnersList({
    page: table.page,
    search: table.search,
    sectorId: sectorFilter,
    cityId: cityFilter,
    isActive: statusFilter,
  })
  const items = paginatedData?.data ?? []

  const createMutation = useCreatePartner(methods.setError)
  const updateMutation = useUpdatePartner(methods.setError)
  const deleteMutation = useDeletePartner()
  const toggleMutation = useTogglePartnerStatus()

  if (!profileLoading && !canView) return <NoPermissionCard />

  const openModal = (item: PartnerListItem | null, viewOnly: boolean) => {
    setEditingItem(item)
    setIsViewOnly(viewOnly)
    methods.reset(getInitialValues(null))
    setIsModalOpen(true)
  }

  const handleSave = (values: PartnerFormValues) => {
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

  const onFilterChange = (setter: (value: string) => void) => (e: ChangeEvent<HTMLSelectElement>) => {
    setter(e.target.value)
    table.setPage(1)
  }

  const columnDefs = getPartnersColumnDefs({
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
            <p className="mt-1 text-xs text-muted-foreground">{t('herzPartnersSubtitle')}</p>
          </div>
          {canCreate && (
            <Button onClick={() => openModal(null, false)} className="h-9 px-4 rounded-xl">
              <Plus className="mr-2 h-4 w-4" /> {t('add')}
            </Button>
          )}
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="flex-1 max-w-md">
              <SearchInput
                placeholder={`${t('search')} ${label}...`}
                value={table.search}
                onChange={(e) => table.setSearch(e.target.value)}
              />
            </div>
            <select value={sectorFilter} onChange={onFilterChange(setSectorFilter)} className={filterSelectClass}>
              <option value="">{t('allPartnerSectors')}</option>
              {sectors.map((s) => (
                <option key={s.id} value={String(s.id)}>
                  {getLocalizedValue(s.name, i18n.language) || s.id}
                </option>
              ))}
            </select>
            <select value={cityFilter} onChange={onFilterChange(setCityFilter)} className={filterSelectClass}>
              <option value="">{t('allCities')}</option>
              {cities.map((c) => (
                <option key={c.id} value={String(c.id)}>
                  {getLocalizedValue(c.name, i18n.language) || c.id}
                </option>
              ))}
            </select>
            <select value={statusFilter} onChange={onFilterChange(setStatusFilter)} className={filterSelectClass}>
              <option value="">{t('status')}</option>
              <option value="true">{t('active')}</option>
              <option value="false">{t('inactive')}</option>
            </select>
          </div>

          <GenericDataGrid
            rowData={items}
            columnDefs={columnDefs}
            rowHeight={54}
            headerHeight={50}
            loading={isLoading}
            onViewRow={(data) => openModal(data as PartnerListItem, true)}
            isServerSide
            currentPage={table.page}
            totalPages={paginatedData?.meta?.last_page ?? 1}
            onPageChange={table.setPage}
            paginationLinks={paginatedData?.meta?.links ?? paginatedData?.links}
          />
        </CardContent>

        <PartnersFormModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          editingItem={editingItem}
          detail={detail}
          detailLoading={detailLoading}
          onSave={handleSave}
          loading={createMutation.isPending || updateMutation.isPending}
          label={t('herzPartner')}
          isViewOnly={isViewOnly}
        />

        <ModalStatus
          open={!!deletingItem}
          onOpenChange={(v) => !v && setDeletingItem(null)}
          title={`${t('delete')} ${t('herzPartner')}`}
          description={t('deleteConfirmation')}
          agreeLabel={t('delete')}
          cancelLabel={t('cancel')}
          onAgreeButtonClick={() => {
            if (deletingItem?.id) {
              deleteMutation.mutate(deletingItem.id, { onSuccess: () => setDeletingItem(null) })
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
