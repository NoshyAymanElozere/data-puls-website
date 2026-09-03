import { useState, useMemo } from 'react'
import { FormProvider } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Plus } from 'lucide-react'
import { z } from 'zod'
import { Button } from '@/shared/components/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/card'
import { useZodForm } from '@/shared/components/form-fields'
import { GenericDataGrid } from '@/shared/components/GenericDataGrid'
import { SearchInput } from '@/shared/components/input'
import ModalStatus from '@/shared/components/modal-status'
import { useProfile } from '@/features/auth/api/useAuth'
import { hasPermission } from '@/shared/utils/permissions'
import {
  useCreatePageSection,
  useDeletePageSection,
  usePageSectionsList,
  useUpdatePageSection,
  sectionToFormValues,
  type PageSection,
} from '@/features/pages/api/usePageSections'
import { localizedNameColumnDef } from '@/shared/utils/localized-value'
import { PageSectionFormModal } from './PageSectionFormModal'
import type { ColDef } from 'ag-grid-community'
import { Pencil, Trash2 } from 'lucide-react'

const schema = z.object({
  titleEn: z.string().min(1, 'requiredField'),
  titleAr: z.string().min(1, 'requiredField'),
  descriptionEn: z.string().min(1, 'requiredField'),
  descriptionAr: z.string().min(1, 'requiredField'),
  sort_order: z.coerce.number().min(0),
  icon: z.any().optional(),
})

type SectionFormValues = z.infer<typeof schema>

interface PageSectionsPanelProps {
  pageId: number
}

export function PageSectionsPanel({ pageId }: PageSectionsPanelProps) {
  const { t, i18n } = useTranslation()
  const { data: admin } = useProfile()
  const canCreate = hasPermission(admin, 'pages.create')
  const canUpdate = hasPermission(admin, 'pages.update')
  const canDelete = hasPermission(admin, 'pages.delete')

  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<PageSection | null>(null)
  const [deletingItem, setDeletingItem] = useState<PageSection | null>(null)

  const { data: paginatedData, isLoading } = usePageSectionsList(pageId, page, search)
  const items = paginatedData?.data ?? []

  const methods = useZodForm(schema, sectionToFormValues(null))
  const createMutation = useCreatePageSection(methods.setError)
  const updateMutation = useUpdatePageSection(methods.setError)
  const deleteMutation = useDeletePageSection()

  const handleOpenCreate = () => {
    setEditingItem(null)
    methods.reset(sectionToFormValues(null))
    setIsModalOpen(true)
  }

  const handleOpenEdit = (item: PageSection) => {
    setEditingItem(item)
    methods.reset(sectionToFormValues(item))
    setIsModalOpen(true)
  }

  const handleSave = (formData: SectionFormValues) => {
    if (editingItem?.id) {
      updateMutation.mutate(
        { id: editingItem.id, pageId, payload: formData },
        { onSuccess: () => setIsModalOpen(false) }
      )
    } else {
      createMutation.mutate(
        { pageId, payload: formData },
        { onSuccess: () => setIsModalOpen(false) }
      )
    }
  }

  const columnDefs: ColDef[] = useMemo(
    () => [
      localizedNameColumnDef(t, i18n.language, { field: 'title', headerKey: 'name' }),
      {
        headerName: t('sortOrder') || 'Sort',
        field: 'sort_order',
        width: 90,
      },
    {
      headerName: t('sectionIcon') || 'Icon',
      field: 'icon_url',
      width: 80,
      cellRenderer: (params: { value?: string }) =>
        params.value ? (
          <img src={params.value} alt="" className="h-8 w-8 object-contain rounded" />
        ) : (
          '-'
        ),
    },
    {
      headerName: t('actions') || 'Actions',
      width: 120,
      cellRenderer: (params: { data?: PageSection }) => {
        const item = params.data
        if (!item) return null
        return (
          <div className="flex items-center gap-1 h-full">
            {canUpdate && (
              <Button variant="ghost" size="icon-sm" onClick={() => handleOpenEdit(item)}>
                <Pencil className="h-4 w-4" />
              </Button>
            )}
            {canDelete && (
              <Button variant="ghost" size="icon-sm" onClick={() => setDeletingItem(item)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            )}
          </div>
        )
      },
    },
    ],
    [t, i18n.language, canUpdate, canDelete]
  )

  return (
    <Card className="border-border/60 shadow-sm rounded-2xl overflow-hidden bg-white">
      <CardHeader className="flex flex-row items-center justify-between border-b border-gray-50 px-6 py-5">
        <CardTitle className="text-lg font-bold text-gray-800">{t('pageSections') || 'Page Sections'}</CardTitle>
        {canCreate && (
          <Button onClick={handleOpenCreate} className="h-9 px-4 rounded-xl">
            <Plus className="mr-2 h-4 w-4" /> {t('addSection') || 'Add Section'}
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-6 space-y-4" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="max-w-sm">
          <SearchInput
            placeholder={`${t('search') || 'Search'}...`}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
          />
        </div>

        <GenericDataGrid
          rowData={items}
          columnDefs={columnDefs}
          rowHeight={50}
          headerHeight={50}
          loading={isLoading}
          isServerSide
          currentPage={page}
          totalPages={paginatedData?.meta?.last_page ?? 1}
          onPageChange={setPage}
          paginationLinks={paginatedData?.meta?.links ?? paginatedData?.links}
        />
      </CardContent>

      <FormProvider {...methods}>
        <PageSectionFormModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          editingItem={editingItem}
          onSave={handleSave}
          loading={createMutation.isPending || updateMutation.isPending}
        />
      </FormProvider>

      <ModalStatus
        open={!!deletingItem}
        onOpenChange={(v) => !v && setDeletingItem(null)}
        title={t('delete') || 'Delete'}
        description={t('deleteConfirmation') || 'Are you sure?'}
        agreeLabel={t('delete') || 'Delete'}
        cancelLabel={t('cancel') || 'Cancel'}
        onAgreeButtonClick={() => {
          if (deletingItem) {
            deleteMutation.mutate(
              { id: deletingItem.id, pageId },
              { onSuccess: () => setDeletingItem(null) }
            )
          }
        }}
        onCancelButtonClick={() => setDeletingItem(null)}
        loading={deleteMutation.isPending}
        type="delete"
      />
    </Card>
  )
}
