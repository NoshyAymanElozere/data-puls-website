import { useEffect } from 'react'
import { Button } from '@/shared/components/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/card'
import { useZodForm } from '@/shared/components/form-fields'
import { GenericDataGrid } from '@/shared/components/GenericDataGrid'
import { SearchInput } from '@/shared/components/input'
import ModalStatus from '@/shared/components/modal-status'
import { useTableState } from '@/shared/hooks/useTableState'
import { useProfile } from '@/features/auth/api/useAuth'
import { hasPermission } from '@/shared/utils/permissions'
import { getLocalizedValue } from '@/shared/utils/localized-value'
import { ArrowLeft, Plus } from 'lucide-react'
import { useState } from 'react'
import { FormProvider } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Link, Navigate, useParams } from 'react-router-dom'
import {
  isNathriatCategory,
  useCategoriesList,
  useCategory,
  useCreateCategory,
  useDeleteCategory,
  useToggleCategoryStatus,
  useUpdateCategory,
  type Category,
} from '../api/useCategories'
import { getCategoriesColumnDefs } from './ColumnDefs'
import { CategoriesFormModal } from './CategoriesFormModal'
import { createSchema, getInitialValues, updateSchema, type CategoryFormValues } from './validationSchema'

export default function SubcategoriesPage() {
  const { t, i18n } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const parentId = Number(id)
  const label = t('subcategories')
  const table = useTableState()
  const { data: admin } = useProfile()

  const canCreate = hasPermission(admin, 'categories.create')
  const canUpdate = hasPermission(admin, 'categories.update')
  const canDelete = hasPermission(admin, 'categories.delete')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Category | null>(null)
  const [deletingItem, setDeletingItem] = useState<Category | null>(null)
  const [isViewOnly, setIsViewOnly] = useState(false)
  const [statusFilter, setStatusFilter] = useState('')
  const [defaultFilter, setDefaultFilter] = useState('')

  const { data: parentCategory, isLoading: parentLoading } = useCategory(
    Number.isNaN(parentId) ? null : parentId
  )

  const schema = editingItem ? updateSchema : createSchema
  const methods = useZodForm(schema, getInitialValues(null, parentId))

  const { data: paginatedData, isLoading } = useCategoriesList(
    table.page,
    table.search,
    statusFilter,
    Number.isNaN(parentId) ? undefined : parentId,
    defaultFilter
  )
  const items = paginatedData?.data ?? []

  const createMutation = useCreateCategory(methods.setError)
  const updateMutation = useUpdateCategory(methods.setError)
  const deleteMutation = useDeleteCategory()
  const toggleMutation = useToggleCategoryStatus()

  useEffect(() => {
    if (parentCategory && !Number.isNaN(parentId)) {
      methods.reset(getInitialValues(null, parentId))
    }
  }, [parentCategory, parentId, methods.reset])

  if (!Number.isNaN(parentId) && !parentLoading && parentCategory && !isNathriatCategory(parentCategory)) {
    return <Navigate to="/categories" replace />
  }

  const handleSave = (formData: CategoryFormValues) => {
    const payload = { ...formData, parent_id: parentId }
    if (editingItem?.id) {
      updateMutation.mutate(
        { id: editingItem.id, payload },
        {
          onSuccess: () => {
            setIsModalOpen(false)
            setEditingItem(null)
          },
        }
      )
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => setIsModalOpen(false),
      })
    }
  }

  const parentName = parentCategory ? getLocalizedValue(parentCategory.name, i18n.language) : ''

  const columnDefs = getCategoriesColumnDefs({
    t,
    lang: i18n.language,
    toggleMutation,
    setEditingItem,
    setIsModalOpen,
    setDeletingItem,
    setIsViewOnly,
    canUpdate,
    canDelete,
    showSubcategoriesLink: false,
    showSlug: true,
  })

  return (
    <FormProvider {...methods}>
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/categories" className="hover:text-foreground font-semibold">
            {t('categories')}
          </Link>
          <span>/</span>
          <span className="text-foreground font-semibold">{parentName}</span>
          <span>/</span>
          <span className="text-foreground font-semibold">{label}</span>
        </div>

        <Button asChild variant="ghost" className="h-9 px-3">
          <Link to="/categories">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('categories')}
          </Link>
        </Button>

        <Card className="border-border/60 shadow-sm rounded-2xl overflow-hidden bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border/40 px-6 py-5">
            <CardTitle className="text-lg font-bold text-foreground">
              {label} — {parentName}
            </CardTitle>
            {canCreate && (
              <Button
                onClick={() => {
                  setEditingItem(null)
                  setIsViewOnly(false)
                  methods.reset(getInitialValues(null, parentId))
                  setIsModalOpen(true)
                }}
                className="h-9 px-4 rounded-xl"
              >
                <Plus className="mr-2 h-4 w-4" /> {t('add')}
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
              <select
                value={defaultFilter}
                onChange={(e) => {
                  setDefaultFilter(e.target.value)
                  table.setPage(1)
                }}
                className="w-full sm:w-44 h-10 px-3 rounded-xl border border-border/60 bg-card text-xs font-bold"
              >
                <option value="">{t('allTypes')}</option>
                <option value="true">{t('systemDefault')}</option>
                <option value="false">{t('userCustom')}</option>
              </select>
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
            </div>

            <GenericDataGrid
              rowData={items}
              columnDefs={columnDefs}
              rowHeight={50}
              headerHeight={50}
              loading={isLoading || parentLoading}
              onViewRow={(data) => {
                setEditingItem(data as Category)
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

          <CategoriesFormModal
            open={isModalOpen}
            onOpenChange={setIsModalOpen}
            editingItem={editingItem}
            onSave={handleSave}
            loading={createMutation.isPending || updateMutation.isPending}
            label={label}
            isViewOnly={isViewOnly}
            parentId={parentId}
            showSlug={false}
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
      </div>
    </FormProvider>
  )
}
