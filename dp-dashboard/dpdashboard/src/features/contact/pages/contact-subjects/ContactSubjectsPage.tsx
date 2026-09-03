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
  useContactSubject,
  useContactSubjectsList,
  useCreateContactSubject,
  useDeleteContactSubject,
  useToggleContactSubjectStatus,
  useUpdateContactSubject,
} from '../../api/useContactSubjects'
import { getContactSubjectsColumnDefs } from './ColumnDefs'
import { ContactSubjectsFormModal } from './ContactSubjectsFormModal'
import { createSchema, getInitialValues, updateSchema, type ContactSubjectFormValues } from './validationSchema'
import type { ContactSubject } from '../../api/useContactSubjects'

export default function ContactSubjectsPage() {
  const { t, i18n } = useTranslation()
  const label = t('contactSubjects') || 'Contact Subjects'
  const table = useTableState()
  const { data: admin } = useProfile()

  const canCreate = hasPermission(admin, 'contact_subjects.create')
  const canUpdate = hasPermission(admin, 'contact_subjects.update')
  const canDelete = hasPermission(admin, 'contact_subjects.delete')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<ContactSubject | null>(null)
  const [deletingItem, setDeletingItem] = useState<ContactSubject | null>(null)
  const [isViewOnly, setIsViewOnly] = useState(false)
  const [statusFilter, setStatusFilter] = useState('')

  const schema = editingItem ? updateSchema : createSchema
  const methods = useZodForm(schema, getInitialValues(null))

  const { data: subjectDetail, isLoading: subjectDetailLoading } = useContactSubject(
    isModalOpen && editingItem ? editingItem.id : null
  )

  const { data: paginatedData, isLoading } = useContactSubjectsList(table.page, table.search, statusFilter)
  const items = paginatedData?.data ?? []

  const createMutation = useCreateContactSubject(methods.setError)
  const updateMutation = useUpdateContactSubject(methods.setError)
  const deleteMutation = useDeleteContactSubject()
  const toggleMutation = useToggleContactSubjectStatus()

  const handleSave = (formData: ContactSubjectFormValues) => {
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

  const columnDefs = getContactSubjectsColumnDefs({
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
          <div className="flex flex-col sm:flex-row gap-3 max-w-xl">
            <div className="flex-1">
              <SearchInput
                placeholder={`${t('search') || 'Search'} ${label}...`}
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
              setEditingItem(data as ContactSubject)
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

        <ContactSubjectsFormModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          editingItem={editingItem}
          detail={subjectDetail}
          detailLoading={subjectDetailLoading}
          onSave={handleSave}
          loading={createMutation.isPending || updateMutation.isPending}
          label={label}
          isViewOnly={isViewOnly}
        />

        <ModalStatus
          open={!!deletingItem}
          onOpenChange={(v) => !v && setDeletingItem(null)}
          title={`${t('delete') || 'Delete'} ${label}`}
          description={t('deleteConfirmation') || 'Are you sure?'}
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
