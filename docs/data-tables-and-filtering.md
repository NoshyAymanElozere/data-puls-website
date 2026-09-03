# Data Tables & Filtering

## GenericDataGrid

Location: `src/shared/components/GenericDataGrid.tsx`

Features:
- Column sort and filter (AG Grid defaults)
- Column show/hide dropdown
- Server-side or client-side pagination
- Laravel `meta.links` pagination buttons
- RTL and dark theme support

## Server-side pattern (recommended for API lists)

Used by `UsersPage`, `CountriesPage`, etc.:

```tsx
const table = useTableState({ sortBy: 'created_at', sortOrder: 'desc' })
const { data, isLoading } = useUsersList(table.page, table.search, table.sortBy, table.sortOrder)

<GenericDataGrid
  rowData={data?.data ?? []}
  columnDefs={columnDefs}
  loading={isLoading}
  isServerSide
  currentPage={table.page}
  totalPages={data?.meta?.last_page ?? 1}
  onPageChange={table.setPage}
  paginationLinks={data?.meta?.links}
/>
```

## useTableState

Location: `src/shared/hooks/useTableState.ts`

Manages: `page`, `pageSize`, `search`, `sortBy`, `sortOrder` with reset helper.

Use inline `useState` for simple pages with only page + search (also valid).

## Column definitions

Define in `ColumnDefs.tsx` per feature. Use `StatusDropdown` in cell renderers for toggle columns.

## Search

`SearchInput` debouncing is not built-in — pass value to query hook; Query refetches when `search` in queryKey changes.

Reset `page` to 1 when search changes.
