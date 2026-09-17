import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  AlertCircle,
  Eye,
  FolderTree,
  Pencil,
  Plus,
  Receipt,
  Search,
  Trash2,
  X,
} from 'lucide-react'
import { Badge } from '@/shared/components/badge'
import { Button } from '@/shared/components/button'
import ModalStatus from '@/shared/components/modal-status'
import { StatusToggle } from '@/shared/components/StatusToggle'
import { getLocalizedValue } from '@/shared/utils/localized-value'
import { useProfile } from '@/features/auth/api/useAuth'
import { hasPermission } from '@/shared/utils/permissions'
import { cn } from '@/shared/utils/utils'
import {
  useDeleteUserCategory,
  useToggleUserCategoryStatus,
  useUserCategories,
} from '../api/useUserCategories'
import type { UserCategoryItem } from '../types/categories'
import { UserCategoryFormModal } from './UserCategoryFormModal'

interface UserCategoriesPanelProps {
  userId: number | null | undefined
}

export function UserCategoriesPanel({ userId }: UserCategoriesPanelProps) {
  const { t, i18n } = useTranslation()
  const isRtl = i18n.language === 'ar'
  const { data: admin } = useProfile()

  const canUpdate = hasPermission(admin, 'users.update')
  const canDelete = hasPermission(admin, 'users.delete')

  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')

  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<UserCategoryItem | null>(null)
  const [isViewOnly, setIsViewOnly] = useState(false)
  const [deletingCategory, setDeletingCategory] = useState<UserCategoryItem | null>(null)

  const activeParam =
    statusFilter === 'active' ? true : statusFilter === 'inactive' ? false : undefined

  const { data: paginatedData, isLoading } = useUserCategories(
    userId,
    page,
    search,
    12,
    activeParam
  )

  const toggleStatusMutation = useToggleUserCategoryStatus(userId)
  const deleteMutation = useDeleteUserCategory(userId)

  const categories = paginatedData?.data ?? []
  const meta = paginatedData?.meta
  const totalCount = meta?.total ?? categories.length
  const lastPage = meta?.last_page ?? 1

  const handleOpenCreate = () => {
    setEditingCategory(null)
    setIsViewOnly(false)
    setIsFormModalOpen(true)
  }

  const handleOpenEdit = (cat: UserCategoryItem) => {
    setEditingCategory(cat)
    setIsViewOnly(false)
    setIsFormModalOpen(true)
  }

  const handleOpenView = (cat: UserCategoryItem) => {
    setEditingCategory(cat)
    setIsViewOnly(true)
    setIsFormModalOpen(true)
  }

  const handleDelete = () => {
    if (!deletingCategory) return
    deleteMutation.mutate(deletingCategory.id, {
      onSuccess: () => setDeletingCategory(null),
    })
  }

  const handleToggleStatus = (cat: UserCategoryItem, checked: boolean) => {
    toggleStatusMutation.mutate({ categoryId: cat.id, isActive: checked })
  }

  return (
    <div className="space-y-4" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Search, Filter & Action Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-muted/20 p-2.5 rounded-2xl border border-border/50">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1">
          {/* Search Input */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder={t('searchCategories')}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              className="w-full h-10 pl-9 pr-9 rtl:pl-9 rtl:pr-9 rounded-xl border border-border/60 bg-card text-xs font-semibold placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-main/20 focus:border-main transition-all shadow-xs"
            />
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch('')
                  setPage(1)
                }}
                className="absolute right-2.5 rtl:right-auto rtl:left-2.5 top-1/2 -translate-y-1/2 p-1 rounded-md text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Status Filter Segment */}
          <div className="flex items-center gap-1 bg-card border border-border/60 p-1 rounded-xl h-10 shadow-xs">
            <button
              type="button"
              onClick={() => {
                setStatusFilter('all')
                setPage(1)
              }}
              className={cn(
                'px-2.5 py-1 text-xs font-bold rounded-lg transition-all',
                statusFilter === 'all'
                  ? 'bg-main text-white shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {t('all')}
            </button>
            <button
              type="button"
              onClick={() => {
                setStatusFilter('active')
                setPage(1)
              }}
              className={cn(
                'px-2.5 py-1 text-xs font-bold rounded-lg transition-all',
                statusFilter === 'active'
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {t('active')}
            </button>
            <button
              type="button"
              onClick={() => {
                setStatusFilter('inactive')
                setPage(1)
              }}
              className={cn(
                'px-2.5 py-1 text-xs font-bold rounded-lg transition-all',
                statusFilter === 'inactive'
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {t('inactive')}
            </button>
          </div>
        </div>

        {/* Add Category Button */}
        {canUpdate && (
          <Button
            onClick={handleOpenCreate}
            size="sm"
            className="h-10 px-4 rounded-xl gap-1.5 shadow-xs font-bold shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>{t('addCategory')}</span>
          </Button>
        )}
      </div>

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-28 rounded-2xl bg-muted/30 border border-border/40 animate-pulse"
            />
          ))}
        </div>
      ) : categories.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center rounded-2xl border border-dashed border-border/80 bg-muted/10">
          <div className="w-14 h-14 rounded-2xl bg-main/10 border border-main/20 flex items-center justify-center text-main mb-3">
            <FolderTree className="h-7 w-7" />
          </div>
          <h4 className="text-sm font-bold text-foreground mb-1">{t('noCategoriesFound')}</h4>
          <p className="text-xs text-muted-foreground max-w-sm mb-4">
            {search
              ? t('tryAdjustingSearch') || 'No categories matched your search criteria.'
              : t('noCategoriesAddedUser') || 'This user has not created any custom categories.'}
          </p>
          {canUpdate && !search && (
            <Button onClick={handleOpenCreate} size="sm" className="rounded-xl gap-1.5 font-bold">
              <Plus className="h-4 w-4" />
              <span>{t('addCategory')}</span>
            </Button>
          )}
        </div>
      ) : (
        /* Categories Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {categories.map((cat) => {
            const localizedName = getLocalizedValue(cat.name, i18n.language) || '—'
            const localizedDesc = cat.description
              ? getLocalizedValue(cat.description, i18n.language)
              : null
            const hasInvoices = (cat.invoices_count ?? 0) > 0

            return (
              <div
                key={cat.id}
                className="group relative flex flex-col justify-between p-4 rounded-2xl border border-border/60 bg-card hover:border-main/40 hover:shadow-sm transition-all"
              >
                <div>
                  {/* Top row: Icon + Name + Actions */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs border border-white/20"
                        style={{ backgroundColor: cat.icon_bg_color || '#6366F1' }}
                      >
                        <i className={cn(cat.icon || 'fa-solid fa-shapes', 'text-lg')} />
                      </div>
                      <div className="min-w-0">
                        <h4
                          className="text-sm font-black text-foreground truncate"
                          title={localizedName}
                        >
                          {localizedName}
                        </h4>
                        {cat.slug && (
                          <span className="text-[10px] font-mono text-muted-foreground block truncate">
                            {cat.slug}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenView(cat)}
                        className="h-8 w-8 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground"
                        title={t('view')}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                      {canUpdate && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenEdit(cat)}
                          className="h-8 w-8 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground"
                          title={t('edit')}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                      )}

                      {canDelete && (
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={hasInvoices}
                          onClick={() => setDeletingCategory(cat)}
                          className={cn(
                            'h-8 w-8 rounded-lg transition-colors',
                            hasInvoices
                              ? 'opacity-40 cursor-not-allowed text-muted-foreground'
                              : 'hover:bg-destructive/10 text-muted-foreground hover:text-destructive'
                          )}
                          title={
                            hasInvoices
                              ? t('cannotDeleteCategoryWithInvoices')
                              : t('delete')
                          }
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  {localizedDesc && (
                    <p
                      className="mt-2 text-xs text-muted-foreground line-clamp-2 leading-relaxed"
                      title={localizedDesc}
                    >
                      {localizedDesc}
                    </p>
                  )}
                </div>

                {/* Bottom Row: Invoices count badge + Status Toggle */}
                <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between gap-2">
                  {/* Invoices Count Badge */}
                  <div className="flex items-center gap-1.5">
                    {hasInvoices ? (
                      <Badge
                        variant="warning"
                        className="gap-1 py-0.5 px-2 text-[10px] font-black border border-amber-500/30"
                        title={t('cannotDeleteCategoryWithInvoices')}
                      >
                        <Receipt className="h-3 w-3" />
                        <span>
                          {cat.invoices_count} {t('invoicesLinked')}
                        </span>
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="gap-1 py-0.5 px-2 text-[10px] font-bold text-muted-foreground">
                        <Receipt className="h-3 w-3 opacity-60" />
                        <span>0 {t('invoices')}</span>
                      </Badge>
                    )}
                  </div>

                  {/* Status Toggle or Badge */}
                  <div>
                    {canUpdate ? (
                      <StatusToggle
                        value={cat.is_active}
                        onChange={(checked) => handleToggleStatus(cat, checked)}
                      />
                    ) : (
                      <Badge
                        variant={cat.is_active ? 'success' : 'destructive'}
                        className="text-[10px] font-black py-0.5 px-2"
                      >
                        {cat.is_active ? t('active') : t('inactive')}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Pagination Footer */}
      {totalCount > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <span className="text-xs font-semibold text-muted-foreground">
            {t('total') || 'Total'}: <strong className="text-foreground">{totalCount}</strong>{' '}
            {t('records')}
          </span>

          {lastPage > 1 && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="h-8 px-3 rounded-lg text-xs font-bold"
              >
                {t('previous') || 'Previous'}
              </Button>
              <span className="text-xs font-bold text-muted-foreground px-2">
                {page} / {lastPage}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
                disabled={page >= lastPage}
                className="h-8 px-3 rounded-lg text-xs font-bold"
              >
                {t('next') || 'Next'}
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Category Create/Edit/View Form Modal */}
      {userId && (
        <UserCategoryFormModal
          open={isFormModalOpen}
          onOpenChange={setIsFormModalOpen}
          userId={userId}
          category={editingCategory}
          isViewOnly={isViewOnly}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ModalStatus
        open={!!deletingCategory}
        onOpenChange={(open) => !open && setDeletingCategory(null)}
        title={t('delete')}
        agreeLabel={t('delete')}
        cancelLabel={t('cancel')}
        onAgreeButtonClick={handleDelete}
        onCancelButtonClick={() => setDeletingCategory(null)}
        loading={deleteMutation.isPending}
        color="red"
      >
        <div className="space-y-3 py-2 text-xs" dir={isRtl ? 'rtl' : 'ltr'}>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p className="font-semibold leading-relaxed">
              {t('deleteConfirmation')}
            </p>
          </div>
          {deletingCategory && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 border border-border/50">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center text-white shrink-0"
                style={{ backgroundColor: deletingCategory.icon_bg_color || '#6366F1' }}
              >
                <i className={cn(deletingCategory.icon || 'fa-solid fa-shapes', 'text-sm')} />
              </div>
              <div className="min-w-0">
                <span className="font-bold text-foreground block truncate">
                  {getLocalizedValue(deletingCategory.name, i18n.language)}
                </span>
                <span className="text-[11px] font-mono text-muted-foreground block truncate">
                  {deletingCategory.slug}
                </span>
              </div>
            </div>
          )}
        </div>
      </ModalStatus>
    </div>
  )
}
