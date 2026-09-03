import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { FormProvider } from 'react-hook-form'
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/card'
import { Button } from '@/shared/components/button'
import { SearchInput } from '@/shared/components/input'
import { useZodForm } from '@/shared/components/form-fields'
import ModalStatus from '@/shared/components/modal-status'
import { GenericDataGrid } from '@/shared/components/GenericDataGrid'
import { useTableState } from '@/shared/hooks/useTableState'
import { useProfile } from '@/features/auth/api/useAuth'
import { hasPermission } from '@/shared/utils/permissions'
import { getLocalizedValue } from '@/shared/utils/localized-value'
import { useActiveCountries } from '../../api/useCountries'
import type { City } from '../../api/useCities'
import {
  useCitiesList,
  useCity,
  useCreateCity,
  useUpdateCity,
  useDeleteCity,
  useToggleCityStatus,
} from '../../api/useCities'
import { getCitiesColumnDefs } from './ColumnDefs'
import { CitiesFormModal } from './CitiesFormModal'
import { createSchema, getInitialValues, updateSchema, type CitiesFormValues } from './validationSchema'

export default function CitiesPage() {
  const { t, i18n } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const label = t('cities') || 'Cities'
  const table = useTableState()
  const { data: admin } = useProfile()

  const canCreate = hasPermission(admin, 'cities.create')
  const canUpdate = hasPermission(admin, 'cities.update')
  const canDelete = hasPermission(admin, 'cities.delete')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<City | null>(null)
  const [deletingItem, setDeletingItem] = useState<City | null>(null)
  const [isViewOnly, setIsViewOnly] = useState(false)
  const [statusFilter, setStatusFilter] = useState('')
  const [countryFilter, setCountryFilter] = useState('')

  const schema = editingItem ? updateSchema : createSchema
  const methods = useZodForm(schema, getInitialValues(editingItem))

  const { data: cityDetail, isLoading: cityDetailLoading } = useCity(editingItem?.id ?? null)
  const { data: countries = [] } = useActiveCountries()

  const { data: paginatedData, isLoading } = useCitiesList(
    table.page,
    countryFilter || undefined,
    table.search,
    statusFilter
  )
  const items = paginatedData?.data ?? []

  const createMutation = useCreateCity(methods.setError)
  const updateMutation = useUpdateCity(methods.setError)
  const deleteMutation = useDeleteCity()
  const toggleMutation = useToggleCityStatus()

  useEffect(() => {
    const countryParam = searchParams.get('country')
    if (countryParam) {
      setCountryFilter(countryParam)
    }

    const viewParam = searchParams.get('view')
    if (!viewParam) return

    const viewId = Number(viewParam)
    if (Number.isNaN(viewId)) return

    setEditingItem({ id: viewId } as City)
    setIsViewOnly(true)
    setIsModalOpen(true)
  }, [searchParams])

  const handleModalOpenChange = (open: boolean) => {
    setIsModalOpen(open)
    if (!open) {
      setEditingItem(null)
      setIsViewOnly(false)

      if (searchParams.has('view')) {
        const next = new URLSearchParams(searchParams)
        next.delete('view')
        setSearchParams(next, { replace: true })
      }
    }
  }

  const handleSave = (formData: CitiesFormValues) => {
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

  const columnDefs = getCitiesColumnDefs({
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
                placeholder={`${t('search') || 'Search'} ${label}...`}
                value={table.search}
                onChange={(e) => table.setSearch(e.target.value)}
              />
            </div>
            <select
              value={countryFilter}
              onChange={(e) => {
                setCountryFilter(e.target.value)
                table.setPage(1)
              }}
              className="w-full sm:w-44 h-10 px-3 rounded-xl border border-border/60 bg-card text-xs font-bold"
            >
              <option value="">{t('country') || 'Country'}</option>
              {countries.map((c) => (
                <option key={c.id} value={String(c.id)}>
                  {getLocalizedValue(c.name, i18n.language)}
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                table.setPage(1)
              }}
              className="w-full sm:w-40 h-10 px-3 rounded-xl border border-border/60 bg-card text-xs font-bold"
            >
              <option value="">{t('status') || 'Status'}</option>
              <option value="true">{t('active') || 'Active'}</option>
              <option value="false">{t('inactive') || 'Inactive'}</option>
            </select>
          </div>

          <GenericDataGrid
            rowData={items}
            columnDefs={columnDefs}
            rowHeight={50}
            headerHeight={50}
            loading={isLoading}
            onViewRow={(data) => {
              setEditingItem(data as City)
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

        <CitiesFormModal
          open={isModalOpen}
          onOpenChange={handleModalOpenChange}
          editingItem={editingItem}
          detail={cityDetail}
          detailLoading={cityDetailLoading}
          onSave={handleSave}
          loading={createMutation.isPending || updateMutation.isPending}
          label={label}
          isViewOnly={isViewOnly}
        />

        <ModalStatus
          open={!!deletingItem}
          onOpenChange={(v) => !v && setDeletingItem(null)}
          title={`${t('delete') || 'Delete'} ${label}`}
          description={t('deleteConfirmation') || 'Are you sure you want to delete this item? This action cannot be undone.'}
          agreeLabel={t('delete') || 'Delete'}
          cancelLabel={t('cancel') || 'Cancel'}
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
