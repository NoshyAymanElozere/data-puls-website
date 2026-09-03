import React from 'react'
import { AgGridReact, type AgGridReactProps } from 'ag-grid-react'
import { AllCommunityModule, ModuleRegistry, themeQuartz } from 'ag-grid-community'
import { useTranslation } from 'react-i18next'
import { SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/shared/utils/utils'

// Register all community features
ModuleRegistry.registerModules([AllCommunityModule])

// Modern theme with light and dark color schemes
const customTheme = themeQuartz
  .withParams({
    browserColorScheme: 'light',
    accentColor: '#5B4B8A',
    backgroundColor: '#FFFFFF',
    foregroundColor: '#29223F',
    borderColor: '#E8E4D9',
    borderRadius: 10,
    headerBackgroundColor: '#FAF7EE',
    headerTextColor: '#6B6380',
    headerFontWeight: 600,
    headerFontSize: 13,
    fontSize: 14,
    rowBorder: { color: '#F0EDE4', width: 1, style: 'solid' },
    columnBorder: false,
    rowHoverColor: 'rgba(91, 75, 138, 0.05)',
    selectedRowBackgroundColor: 'rgba(91, 75, 138, 0.09)',
    rangeSelectionBackgroundColor: 'rgba(91, 75, 138, 0.12)',
    cellHorizontalPadding: 16,
    headerColumnResizeHandleColor: '#5B4B8A',
    fontFamily: "'IBM Plex Sans Arabic', sans-serif",
    wrapperBorderRadius: 12,
    spacing: 6,
    oddRowBackgroundColor: '#FDFCF8',
  }, 'light')
  .withParams({
    browserColorScheme: 'dark',
    accentColor: '#8B7BB5',
    backgroundColor: '#1A1628',
    foregroundColor: '#FAF7EE',
    borderColor: '#2E2840',
    borderRadius: 10,
    headerBackgroundColor: '#151222',
    headerTextColor: '#A39BB5',
    headerFontWeight: 600,
    headerFontSize: 13,
    fontSize: 14,
    rowBorder: { color: '#252038', width: 1, style: 'solid' },
    columnBorder: false,
    rowHoverColor: 'rgba(139, 123, 181, 0.08)',
    selectedRowBackgroundColor: 'rgba(139, 123, 181, 0.12)',
    rangeSelectionBackgroundColor: 'rgba(139, 123, 181, 0.16)',
    cellHorizontalPadding: 16,
    headerColumnResizeHandleColor: '#8B7BB5',
    fontFamily: "'IBM Plex Sans Arabic', sans-serif",
    wrapperBorderRadius: 12,
    spacing: 6,
    oddRowBackgroundColor: '#1E1A2E',
  }, 'dark')

const CustomLoadingOverlay = () => {
  return (
    <div className="absolute inset-0 flex flex-col bg-card/60 backdrop-blur-[1px] z-50 p-4">
      <div className="w-full space-y-4 animate-pulse">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="flex gap-4 items-center py-3 border-b border-border/10">
            <div className="h-4 bg-muted/80 rounded-md flex-1" />
            <div className="h-4 bg-muted/80 rounded-md flex-1" />
            <div className="h-4 bg-muted/80 rounded-md flex-1" />
            <div className="h-4 bg-muted/80 rounded-md flex-1" />
            <div className="h-4 bg-muted/80 rounded-md flex-1" />
          </div>
        ))}
      </div>
    </div>
  )
}

interface GenericDataGridProps<TData = any> extends AgGridReactProps<TData> {
  loading?: boolean
  height?: string | number
  onViewRow?: (data: TData) => void
  isServerSide?: boolean
  currentPage?: number
  totalPages?: number
  onPageChange?: (page: number) => void
  paginationLinks?: Array<{ url: string | null; label: string; active: boolean }>
}

export function GenericDataGrid<TData = any>({
  rowData,
  columnDefs,
  loading = false,
  height = 600,
  onViewRow,
  isServerSide = false,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  paginationLinks,
  ...props
}: GenericDataGridProps<TData>) {
  const { i18n } = useTranslation()
  const isRtl = i18n.language === 'ar'
  const gridInstanceKey = `${i18n.language}-${isRtl ? 'rtl' : 'ltr'}`

  const [gridApi, setGridApi] = React.useState<any>(null)
  const [columns, setColumns] = React.useState<any[]>([])
  const [isOpen, setIsOpen] = React.useState(false)
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  // Local pagination states (used if isServerSide is false)
  const [localPage, setLocalPage] = React.useState(1)
  const [localPageSize, setLocalPageSize] = React.useState(10)

  // Reset local page if array size changes
  React.useEffect(() => {
    setLocalPage(1)
  }, [rowData])

  React.useEffect(() => {
    if (!gridApi) return
    gridApi.setGridOption('enableRtl', isRtl)
  }, [gridApi, isRtl, i18n.language])

  const displayRowData = React.useMemo(() => {
    if (isServerSide || !rowData) return rowData
    const startIndex = (localPage - 1) * localPageSize
    return rowData.slice(startIndex, startIndex + localPageSize)
  }, [rowData, isServerSide, localPage, localPageSize])

  const activePage = isServerSide ? (currentPage || 1) : localPage
  const totalPagesCount = isServerSide
    ? (totalPages || 1)
    : (Math.ceil((rowData?.length || 0) / localPageSize) || 1)

  const handlePageChange = (page: number) => {
    if (isServerSide) {
      onPageChange?.(page)
    } else {
      setLocalPage(page)
    }
  }

  const startRowIndex = isServerSide ? ((activePage - 1) * 10 + 1) : ((activePage - 1) * localPageSize + 1)
  const endRowIndex = isServerSide
    ? (activePage * 10)
    : Math.min(activePage * localPageSize, rowData?.length || 0)
  const totalEntriesCount = isServerSide ? null : (rowData?.length || 0)

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPagesCount <= maxVisible) {
      for (let i = 1; i <= totalPagesCount; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      let start = Math.max(2, activePage - 1);
      let end = Math.min(totalPagesCount - 1, activePage + 1);

      if (activePage <= 2) {
        end = 4;
      } else if (activePage >= totalPagesCount - 1) {
        start = totalPagesCount - 3;
      }

      if (start > 2) {
        pages.push('...');
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPagesCount - 1) {
        pages.push('...');
      }

      pages.push(totalPagesCount);
    }
    return pages;
  };

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const onGridReady = (params: any) => {
    setGridApi(params.api)
    const allCols = params.api.getColumns() || []
    setColumns(
      allCols.map((col: any) => ({
        id: col.getColId(),
        name: col.getColDef().headerName || col.getColId(),
        visible: col.isVisible()
      }))
    )
    if (props.onGridReady) {
      props.onGridReady(params)
    }
  }

  const toggleColumn = (colId: string) => {
    if (!gridApi) return
    const col = columns.find((c) => c.id === colId)
    if (!col) return
    const nextVisible = !col.visible
    gridApi.setColumnsVisible([colId], nextVisible)
    setColumns((prev) =>
      prev.map((c) => (c.id === colId ? { ...c, visible: nextVisible } : c))
    )
  }

  const defaultColDef = React.useMemo(() => {
    return {
      flex: 1,
      minWidth: 100,
      filter: true,
      sortable: true,
      resizable: true,
      ...props.defaultColDef
    }
  }, [props.defaultColDef])

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex justify-end relative z-10">
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-card text-foreground hover:bg-primary/5 hover:border-primary/30 transition-all duration-200 active:scale-95 shadow-sm"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground transition-colors group-hover:text-primary" />
            <span>تعديل الأعمدة / Columns</span>
          </button>

          {isOpen && (
            <div className={`absolute top-full mt-2 w-60 rounded-2xl border border-border/60 bg-card/95 backdrop-blur-md p-2.5 shadow-xl shadow-black/10 z-50 animate-in fade-in slide-in-from-top-2 duration-150 ${isRtl ? 'left-0' : 'right-0'}`}>
              <div className="px-2.5 py-2 text-[11px] uppercase tracking-wider font-semibold text-muted-foreground/80 border-b border-border/40 mb-2">
                إظهار وإخفاء الأعمدة
              </div>
              <div className="max-h-64 overflow-y-auto space-y-0.5 pr-1">
                {columns.map((col) => (
                  <label
                    key={col.id}
                    className="flex items-center gap-3 px-2.5 py-2 rounded-xl hover:bg-primary/5 hover:text-primary transition-all duration-150 cursor-pointer text-xs font-semibold text-foreground/90 select-none"
                  >
                    <input
                      type="checkbox"
                      checked={col.visible}
                      onChange={() => toggleColumn(col.id)}
                      className="accent-[#5B4B8A] h-4 w-4 rounded-md border-border/60 cursor-pointer"
                    />
                    <span>{col.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="w-full animate-fade-in" style={{ height }} dir={isRtl ? 'rtl' : 'ltr'}>
        <AgGridReact
          key={gridInstanceKey}
          theme={customTheme}
          rowData={displayRowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          enableRtl={isRtl}
          loading={loading}
          loadingOverlayComponent={CustomLoadingOverlay}
          pagination={false}
          onGridReady={onGridReady}
          onRowDoubleClicked={(event) => {
            if (onViewRow && event.data) {
              onViewRow(event.data)
            }
            if (props.onRowDoubleClicked) {
              props.onRowDoubleClicked(event)
            }
          }}
          {...props}
        />
      </div>

      {/* Modern Custom Pagination component for both server and memory lists */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 bg-card border border-border/60 rounded-2xl shadow-sm mt-4 animate-in fade-in duration-200" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            {isServerSide ? (
              isRtl ? `الصفحة ${activePage} من ${totalPagesCount}` : `Page ${activePage} of ${totalPagesCount}`
            ) : (
              isRtl
                ? `عرض ${startRowIndex}-${endRowIndex} من أصل ${totalEntriesCount} مدخل`
                : `Showing ${startRowIndex}-${endRowIndex} of ${totalEntriesCount} entries`
            )}
          </span>

          {!isServerSide && (
            <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground/80">
              <span>{isRtl ? 'حجم الصفحة:' : 'Page Size:'}</span>
              <select
                value={localPageSize}
                onChange={(e) => {
                  setLocalPageSize(Number(e.target.value))
                  setLocalPage(1)
                }}
                className="bg-background border border-border/50 rounded-xl px-2.5 py-1 outline-none text-foreground cursor-pointer focus:border-primary transition-all text-xs font-bold h-7"
              >
                {[5, 10, 20, 50, 100].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isServerSide && paginationLinks && paginationLinks.length > 0 ? (
            paginationLinks.map((link, idx) => {
              const isPrev = link.label.includes('Previous') || link.label.includes('&laquo;') || link.label.includes('«')
              const isNext = link.label.includes('Next') || link.label.includes('&raquo;') || link.label.includes('»')

              let cleanLabel = link.label
                .replace('&laquo; ', '')
                .replace(' &raquo;', '')
                .replace('« ', '')
                .replace(' »', '')
                .replace('Previous', '')
                .replace('Next', '')

              const pageMatch = link.url ? link.url.match(/page=(\d+)/) : null
              const pageNum = pageMatch ? parseInt(pageMatch[1], 10) : null

              return (
                <button
                  key={idx}
                  onClick={() => pageNum && handlePageChange(pageNum)}
                  disabled={!link.url}
                  className={cn(
                    "h-9 min-w-9 px-3 flex items-center justify-center rounded-xl border text-xs font-bold transition-all duration-300 disabled:opacity-40 disabled:pointer-events-none active:scale-95",
                    link.active
                      ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20 font-extrabold"
                      : "border-border/60 bg-background text-muted-foreground hover:text-foreground hover:bg-muted hover:border-border"
                  )}
                >
                  {isPrev ? (
                    isRtl ? <ChevronRight className="h-4 w-4 stroke-[2.5]" /> : <ChevronLeft className="h-4 w-4 stroke-[2.5]" />
                  ) : isNext ? (
                    isRtl ? <ChevronLeft className="h-4 w-4 stroke-[2.5]" /> : <ChevronRight className="h-4 w-4 stroke-[2.5]" />
                  ) : (
                    cleanLabel
                  )}
                </button>
              )
            })
          ) : (
            <>
              <button
                onClick={() => handlePageChange(Math.max((activePage || 1) - 1, 1))}
                disabled={activePage === 1}
                className="h-9 w-9 flex items-center justify-center rounded-xl border border-border/60 bg-background text-muted-foreground hover:text-foreground hover:bg-muted hover:border-border transition-all duration-300 disabled:opacity-40 disabled:pointer-events-none active:scale-95"
              >
                {isRtl ? <ChevronRight className="h-4 w-4 stroke-[2.5]" /> : <ChevronLeft className="h-4 w-4 stroke-[2.5]" />}
              </button>

              {getPageNumbers().map((pageNum, idx) => {
                if (pageNum === '...') {
                  return (
                    <span key={`dots-${idx}`} className="h-9 w-9 flex items-center justify-center text-xs font-bold text-muted-foreground/60 select-none">
                      ...
                    </span>
                  )
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(Number(pageNum))}
                    className={cn(
                      "h-9 min-w-9 px-3 flex items-center justify-center rounded-xl border text-xs font-bold transition-all duration-300 active:scale-95",
                      activePage === pageNum
                        ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20 font-extrabold"
                        : "border-border/60 bg-background text-muted-foreground hover:text-foreground hover:bg-muted hover:border-border"
                    )}
                  >
                    {pageNum}
                  </button>
                )
              })}

              <button
                onClick={() => handlePageChange(Math.min((activePage || 1) + 1, totalPagesCount))}
                disabled={activePage === totalPagesCount}
                className="h-9 w-9 flex items-center justify-center rounded-xl border border-border/60 bg-background text-muted-foreground hover:text-foreground hover:bg-muted hover:border-border transition-all duration-300 disabled:opacity-40 disabled:pointer-events-none active:scale-95"
              >
                {isRtl ? <ChevronLeft className="h-4 w-4 stroke-[2.5]" /> : <ChevronRight className="h-4 w-4 stroke-[2.5]" />}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
