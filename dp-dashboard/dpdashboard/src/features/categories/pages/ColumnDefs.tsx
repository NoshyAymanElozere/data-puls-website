import { Button } from '@/shared/components/button'
import { StatusToggle } from '@/shared/components/StatusToggle'
import { localizedNameColumnDef, getLocalizedValue } from '@/shared/utils/localized-value'
import { Badge } from '@/shared/components/badge'
import type { ColDef } from 'ag-grid-community'
import { Eye, FolderTree, Pencil, Trash2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { isNathriatCategory, type Category } from '../api/useCategories'

interface ColumnDefsProps {
  t: (key: string) => string
  lang: string
  toggleMutation: { mutate: (id: number) => void }
  setEditingItem: (item: unknown) => void
  setIsModalOpen: (open: boolean) => void
  setDeletingItem: (item: unknown) => void
  setIsViewOnly: (view: boolean) => void
  canUpdate?: boolean
  canDelete?: boolean
  showSubcategoriesLink?: boolean
  showSlug?: boolean
  editViaRoute?: boolean
}

export function getCategoriesColumnDefs({
  t,
  lang,
  toggleMutation,
  setEditingItem,
  setIsModalOpen,
  setDeletingItem,
  setIsViewOnly,
  canUpdate = true,
  canDelete = true,
  showSubcategoriesLink = true,
  showSlug = true,
  editViaRoute = false,
}: ColumnDefsProps): ColDef[] {
  const cols: ColDef[] = [
    {
      headerName: t('icon'),
      field: 'icon',
      filter: false,
      sortable: false,
      width: 80,
      cellRenderer: (params: { data?: Category }) => {
        const item = params.data
        if (!item) return null
        return (
          <div className="flex items-center justify-center h-full">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center text-white shadow-xs"
              style={{ backgroundColor: item.icon_bg_color || '#6366F1' }}
            >
              <i className={`${item.icon || 'fa-solid fa-shapes'} text-sm`} />
            </div>
          </div>
        )
      },
    },
    localizedNameColumnDef(t, lang),
    {
      headerName: t('description'),
      field: 'description',
      filter: false,
      sortable: false,
      minWidth: 160,
      flex: 1,
      cellRenderer: (params: { data?: Category }) => {
        const item = params.data
        if (!item || !item.description) {
          return <span className="text-muted-foreground/60 text-xs">—</span>
        }
        const text = getLocalizedValue(item.description, lang)
        return (
          <span className="text-xs text-muted-foreground truncate block max-w-xs" title={text}>
            {text || '—'}
          </span>
        )
      },
    },
  ]

  if (showSlug) {
    cols.push({
      headerName: t('slug'),
      field: 'slug',
      filter: false,
      width: 140,
    })
  }

  cols.push(
    {
      headerName: t('categoryType'),
      field: 'is_default',
      filter: false,
      width: 135,
      cellRenderer: (params: { data?: Category }) => {
        const item = params.data
        if (!item) return null
        return item.is_default ? (
          <Badge variant="info" dot>
            {t('systemDefault')}
          </Badge>
        ) : (
          <Badge variant="purple" dot>
            {t('userCustom')}
          </Badge>
        )
      },
    },
    {
      headerName: t('creator'),
      field: 'creator_name',
      filter: false,
      width: 130,
      cellRenderer: (params: { data?: Category }) => {
        const item = params.data
        if (!item) return null
        const name = item.creator_name || (item.is_default ? t('systemCreator') : item.user?.name || '—')
        return <span className="text-xs font-medium text-foreground">{name}</span>
      },
    },
    {
      headerName: t('sortOrder'),
      field: 'sort_order',
      filter: false,
      width: 100,
    },
    {
      headerName: t('status'),
      field: 'is_active',
      filter: false,
      width: 130,
      cellRenderer: (params: { data?: { id: number; is_active: boolean } }) => {
        const item = params.data
        if (!item) return null
        return (
          <StatusToggle
            value={item.is_active}
            onChange={() => toggleMutation.mutate(item.id)}
            disabled={!canUpdate}
          />
        )
      },
    },
    {
      headerName: t('actions'),
      filter: false,
      sortable: false,
      width: showSubcategoriesLink ? 180 : 140,
      cellRenderer: (params: { data?: Category }) => {
        const item = params.data
        if (!item) return null

        return (
          <CategoryActions
            item={item}
            t={t}
            canUpdate={canUpdate}
            canDelete={canDelete}
            showSubcategoriesLink={showSubcategoriesLink}
            editViaRoute={editViaRoute}
            setEditingItem={setEditingItem}
            setIsModalOpen={setIsModalOpen}
            setDeletingItem={setDeletingItem}
            setIsViewOnly={setIsViewOnly}
          />
        )
      },
    }
  )

  return cols
}

function CategoryActions({
  item,
  t,
  canUpdate,
  canDelete,
  showSubcategoriesLink,
  editViaRoute,
  setEditingItem,
  setIsModalOpen,
  setDeletingItem,
  setIsViewOnly,
}: {
  item: Category
  t: (key: string) => string
  canUpdate: boolean
  canDelete: boolean
  showSubcategoriesLink: boolean
  editViaRoute: boolean
  setEditingItem: (item: unknown) => void
  setIsModalOpen: (open: boolean) => void
  setDeletingItem: (item: unknown) => void
  setIsViewOnly: (view: boolean) => void
}) {
  const navigate = useNavigate()
  const isNathriat = isNathriatCategory(item)
  const canDeleteRow = canDelete && !isNathriat

  return (
    <div className="flex items-center gap-1 h-full">
      <Button
        variant="ghost"
        size="icon-sm"
        title={t('view')}
        onClick={() => {
          setEditingItem(item)
          setIsViewOnly(true)
          setIsModalOpen(true)
        }}
      >
        <Eye className="h-4 w-4" />
      </Button>
      {canUpdate &&
        (editViaRoute ? (
          <Button variant="ghost" size="icon-sm" title={t('edit')} onClick={() => navigate(`/categories/${item.id}`)}>
            <Pencil className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon-sm"
            title={t('edit')}
            onClick={() => {
              setEditingItem(item)
              setIsViewOnly(false)
              setIsModalOpen(true)
            }}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        ))}
      {showSubcategoriesLink && isNathriat && (
        <Button variant="ghost" size="icon-sm" asChild title={t('viewSubcategories')}>
          <Link to={`/categories/${item.id}/subcategories`}>
            <FolderTree className="h-4 w-4" />
          </Link>
        </Button>
      )}
      {canDeleteRow && (
        <Button
          variant="ghost"
          size="icon-sm"
          title={t('delete')}
          onClick={() => setDeletingItem(item)}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      )}
    </div>
  )
}

