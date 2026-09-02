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
import { useMemo, useState } from 'react'
import { FormProvider } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import {
  useCreateUser,
  useDeleteUser,
  useUpdateUser,
  useUpdateUserStatus,
  useUser,
  useUsersList,
  type UserListItem,
} from '../api/useUsers'
import { getUsersColumnDefs } from './ColumnDefs'
import { UsersFormModal } from './UsersFormModal'
import { createSchema, getInitialValues, updateSchema, type UserFormValues } from './validationSchema'

export default function UsersPage() {
  const { t, i18n } = useTranslation()
  const label = t('users')
  const table = useTableState()
  const { data: admin } = useProfile()
  const isRtl = i18n.language === 'ar'

  const canCreate = hasPermission(admin, 'users.create')
  const canUpdate = hasPermission(admin, 'users.update')
  const canDelete = hasPermission(admin, 'users.delete')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<UserListItem | null>(null)
  const [deletingItem, setDeletingItem] = useState<UserListItem | null>(null)
  const [isViewOnly, setIsViewOnly] = useState(false)
  const [statusFilter, setStatusFilter] = useState('')
  const [genderFilter, setGenderFilter] = useState('')
  const [registeredFrom, setRegisteredFrom] = useState('')
  const [registeredTo, setRegisteredTo] = useState('')
  const [subscribedOnly, setSubscribedOnly] = useState(false)

  const schema = editingItem && !isViewOnly ? updateSchema : createSchema
  const methods = useZodForm(schema, getInitialValues(null))

  const { data: userDetail, isLoading: userDetailLoading } = useUser(
    isModalOpen && editingItem ? editingItem.id : null
  )

  const { data: paginatedData, isLoading } = useUsersList(
    table.page,
    table.search,
    statusFilter,
    genderFilter,
    registeredFrom,
    registeredTo
  )
  const items = useMemo(() => {
    const rows = paginatedData?.data ?? []
    return subscribedOnly ? rows.filter((row) => row.is_subscribed) : rows
  }, [paginatedData?.data, subscribedOnly])

  const createMutation = useCreateUser(methods.setError)
  const updateMutation = useUpdateUser(methods.setError)
  const deleteMutation = useDeleteUser()
  const statusMutation = useUpdateUserStatus()

  const handleSave = (formData: UserFormValues) => {
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

  const columnDefs = getUsersColumnDefs({
    t,
    statusMutation,
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
              variant="action"
              className="h-9 px-4 rounded-xl"
            >
              <Plus className="mr-2 h-4 w-4" /> {t('add')}
            </Button>
          )}
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3" dir={isRtl ? 'rtl' : 'ltr'}>
            <div className="flex-1 max-w-md">
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
              <option value="">{t('allStatuses')}</option>
              <option value="active">{t('active')}</option>
              <option value="suspended">{t('suspended')}</option>
            </select>
            <select
              value={genderFilter}
              onChange={(e) => {
                setGenderFilter(e.target.value)
                table.setPage(1)
              }}
              className="w-full sm:w-40 h-10 px-3 rounded-xl border border-border/60 bg-card text-xs font-bold"
            >
              <option value="">{t('allGenders')}</option>
              <option value="male">{t('male')}</option>
              <option value="female">{t('female')}</option>
            </select>
            <input
              type="date"
              value={registeredFrom}
              onChange={(e) => {
                setRegisteredFrom(e.target.value)
                table.setPage(1)
              }}
              className="w-full sm:w-40 h-10 px-3 rounded-xl border border-border/60 bg-card text-xs font-bold"
              aria-label={t('dateFrom')}
            />
            <input
              type="date"
              value={registeredTo}
              onChange={(e) => {
                setRegisteredTo(e.target.value)
                table.setPage(1)
              }}
              className="w-full sm:w-40 h-10 px-3 rounded-xl border border-border/60 bg-card text-xs font-bold"
              aria-label={t('dateTo')}
            />
            <label className="flex items-center gap-2 h-10 px-3 rounded-xl border border-border/60 bg-card text-xs font-bold whitespace-nowrap cursor-pointer">
              <input
                type="checkbox"
                checked={subscribedOnly}
                onChange={(e) => setSubscribedOnly(e.target.checked)}
                className="rounded border-border"
              />
              {t('subscribedOnly')}
            </label>
          </div>

          <GenericDataGrid
            rowData={items}
            columnDefs={columnDefs}
            rowHeight={50}
            headerHeight={50}
            loading={isLoading}
            onViewRow={(data) => {
              setEditingItem(data as UserListItem)
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

        <UsersFormModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          editingItem={editingItem}
          detail={userDetail}
          detailLoading={userDetailLoading}
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
