import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus } from 'lucide-react'
import { Button } from '@/shared/components/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/card'
import { GenericDataGrid } from '@/shared/components/GenericDataGrid'
import { SearchInput } from '@/shared/components/input'
import ModalStatus from '@/shared/components/modal-status'
import { useTableState } from '@/shared/hooks/useTableState'
import {
  useCreateFamilyRelation,
  useDeleteFamilyRelation,
  useFamilyRelationsList,
  useToggleFamilyRelationStatus,
  useUpdateFamilyRelation,
  type FamilyRelationFormValues,
} from '../api/useFamilyRelations'
import type { FamilyRelationListItem } from '../types/family-relations'
import { getFamilyRelationsColumnDefs } from './ColumnDefs'
import { FamilyRelationDetailModal } from './FamilyRelationDetailModal'
import { FamilyRelationsFormModal } from './FamilyRelationsFormModal'

export default function FamilyRelationsPage() {
  const { t, i18n } = useTranslation()
  const label = t('familyRelations')
  const table = useTableState()
  const isRtl = i18n.language === 'ar'

  const [isActiveFilter, setIsActiveFilter] = useState<string>('')
  const [selectedRelation, setSelectedRelation] = useState<FamilyRelationListItem | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  // Form modal states (create / edit)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<FamilyRelationListItem | null>(null)

  // Delete modal state
  const [deletingItem, setDeletingItem] = useState<FamilyRelationListItem | null>(null)

  const { data: paginatedData, isLoading } = useFamilyRelationsList(
    table.page,
    table.search,
    isActiveFilter,
    15
  )

  const createMutation = useCreateFamilyRelation()
  const updateMutation = useUpdateFamilyRelation()
  const toggleStatusMutation = useToggleFamilyRelationStatus()
  const deleteMutation = useDeleteFamilyRelation()

  const items = paginatedData?.data ?? []

  const handleView = (relation: FamilyRelationListItem) => {
    setSelectedRelation(relation)
    setIsDetailOpen(true)
  }

  const handleEdit = (relation: FamilyRelationListItem) => {
    setEditingItem(relation)
    setIsFormModalOpen(true)
  }

  const handleDeletePrompt = (relation: FamilyRelationListItem) => {
    setDeletingItem(relation)
  }

  const handleToggleStatus = (relation: FamilyRelationListItem) => {
    toggleStatusMutation.mutate({
      id: relation.id,
      is_active: !relation.is_active,
    })
  }

  const handleSaveForm = (values: FamilyRelationFormValues) => {
    if (editingItem) {
      updateMutation.mutate(
        { id: editingItem.id, payload: values },
        {
          onSuccess: () => {
            setIsFormModalOpen(false)
            setEditingItem(null)
          },
        }
      )
    } else {
      createMutation.mutate(values, {
        onSuccess: () => {
          setIsFormModalOpen(false)
        },
      })
    }
  }

  const handleDeleteConfirm = () => {
    if (!deletingItem) return
    deleteMutation.mutate(deletingItem.id, {
      onSuccess: () => setDeletingItem(null),
    })
  }

  const columnDefs = getFamilyRelationsColumnDefs({
    t,
    isRtl,
    onView: handleView,
    onEdit: handleEdit,
    onDelete: handleDeletePrompt,
    onToggleStatus: handleToggleStatus,
  })

  return (
    <Card className="border-border/60 shadow-sm rounded-2xl overflow-hidden bg-card">
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border/40 px-6 py-5">
        <CardTitle className="text-lg font-bold text-foreground">{label}</CardTitle>
        <Button
          onClick={() => {
            setEditingItem(null)
            setIsFormModalOpen(true)
          }}
          variant="action"
          className="h-9 px-4 rounded-xl"
        >
          <Plus className="mr-2 h-4 w-4 rtl:mr-0 rtl:ml-2" />
          {t('add')}
        </Button>
      </CardHeader>

      <CardContent className="p-6 space-y-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3" dir={isRtl ? 'rtl' : 'ltr'}>
          <div className="flex-1 max-w-md">
            <SearchInput
              placeholder={`${t('search')} ${label}...`}
              value={table.search}
              onChange={(e) => {
                table.setSearch(e.target.value)
                table.setPage(1)
              }}
            />
          </div>

          <select
            value={isActiveFilter}
            onChange={(e) => {
              setIsActiveFilter(e.target.value)
              table.setPage(1)
            }}
            className="w-full sm:w-44 h-10 px-3 rounded-xl border border-border/60 bg-card text-xs font-bold"
          >
            <option value="">{t('allStatuses')}</option>
            <option value="true">{t('activeRelationsOnly')}</option>
            <option value="false">{t('inactiveRelationsOnly')}</option>
          </select>
        </div>

        {/* Data Grid */}
        <GenericDataGrid
          rowData={items}
          columnDefs={columnDefs}
          rowHeight={50}
          headerHeight={50}
          loading={isLoading}
          onViewRow={(data) => handleView(data as FamilyRelationListItem)}
          isServerSide
          currentPage={table.page}
          totalPages={paginatedData?.meta?.last_page ?? 1}
          onPageChange={table.setPage}
          paginationLinks={paginatedData?.meta?.links ?? paginatedData?.links}
        />
      </CardContent>

      {/* Detail Modal */}
      <FamilyRelationDetailModal
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        relationId={selectedRelation?.id ?? null}
      />

      {/* Create / Edit Form Modal */}
      <FamilyRelationsFormModal
        open={isFormModalOpen}
        onOpenChange={setIsFormModalOpen}
        editingItem={editingItem}
        onSave={handleSaveForm}
        loading={createMutation.isPending || updateMutation.isPending}
      />

      {/* Delete Confirmation Modal */}
      <ModalStatus
        open={!!deletingItem}
        onOpenChange={(v) => !v && setDeletingItem(null)}
        title={`${t('delete')} ${label}`}
        description={t('deleteConfirmation')}
        agreeLabel={t('delete')}
        cancelLabel={t('cancel')}
        onAgreeButtonClick={handleDeleteConfirm}
        onCancelButtonClick={() => setDeletingItem(null)}
        loading={deleteMutation.isPending}
        type="delete"
      />
    </Card>
  )
}
