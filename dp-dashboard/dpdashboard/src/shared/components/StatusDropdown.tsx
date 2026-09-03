import React, { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown, Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface StatusDropdownProps {
  /** Current status value from the server */
  value: boolean
  /**
   * Called only when the user selects a *different* status.
   * Must return a Promise so the component can manage its own loading state.
   * Throw/reject to trigger an automatic rollback.
   */
  onChange: (newValue: boolean) => Promise<unknown>
  usePortal?: boolean
}

export function StatusDropdown({ value, onChange, usePortal = true }: StatusDropdownProps) {
  const { t, i18n } = useTranslation()
  const isRtl = i18n.language === 'ar'

  const [localValue, setLocalValue] = useState(value)
  const [isOpen, setIsOpen] = useState(false)
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 })

  const containerRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const isPendingRef = useRef(false)
  const lastSyncedValueRef = useRef(value)

  useEffect(() => {
    if (isPendingRef.current) return
    if (value === lastSyncedValueRef.current) return
    lastSyncedValueRef.current = value
    setLocalValue(value)
  }, [value])

  // Close dropdown on outside click; calculate portal coords when opening
  useEffect(() => {
    if (!isOpen) return
    function handleClickOutside(e: MouseEvent) {
      const t = e.target as Node
      if (!containerRef.current?.contains(t) && !dropdownRef.current?.contains(t)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    if (usePortal && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setCoords({ top: rect.bottom, left: rect.left, width: rect.width })
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, usePortal])

  const handleSelect = useCallback(async (newValue: boolean) => {
    setIsOpen(false)
    if (isPendingRef.current || newValue === lastSyncedValueRef.current) return

    const previous = lastSyncedValueRef.current
    lastSyncedValueRef.current = newValue
    setLocalValue(newValue)
    isPendingRef.current = true

    try {
      await onChange(newValue)
    } catch {
      lastSyncedValueRef.current = previous
      setLocalValue(previous)
    } finally {
      isPendingRef.current = false
    }
  }, [onChange])

  const colorCls = localValue
    ? 'bg-success/10 text-success border-success/20 hover:bg-success/15'
    : 'bg-muted text-muted-foreground border-border hover:bg-muted/80'

  const dropdownMenu = (
    <>
      <button
        type="button"
        onClick={() => handleSelect(true)}
        className="flex items-center justify-between w-full px-2.5 py-1.5 rounded-lg hover:bg-success/5 hover:text-success text-left text-xs font-semibold text-foreground/90 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-success" />
          <span>{t('active') || 'Active'}</span>
        </div>
        {localValue && <Check className="h-3 w-3" />}
      </button>
      <button
        type="button"
        onClick={() => handleSelect(false)}
        className="flex items-center justify-between w-full px-2.5 py-1.5 rounded-lg hover:bg-rose-500/5 hover:text-rose-500 text-left text-xs font-semibold text-foreground/90 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
          <span>{t('inactive') || 'Inactive'}</span>
        </div>
        {!localValue && <Check className="h-3 w-3" />}
      </button>
    </>
  )

  const dropdownPanel = (
    <div
      ref={dropdownRef}
      className={
        usePortal
          ? 'fixed rounded-xl border border-border/60 bg-card p-1 shadow-lg z-[9999] animate-in fade-in slide-in-from-top-1 duration-150'
          : `absolute mt-1.5 rounded-xl border border-border/60 bg-card p-1 shadow-lg z-[9999] animate-in fade-in slide-in-from-top-1 duration-150 ${isRtl ? 'right-0' : 'left-0'}`
      }
      style={usePortal ? { top: coords.top + 6, left: coords.left, minWidth: '120px' } : { minWidth: '120px' }}
      onClick={(e) => e.stopPropagation()}
    >
      {dropdownMenu}
    </div>
  )

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      <button
        type="button"
        ref={buttonRef}
        onClick={(e) => { e.stopPropagation(); setIsOpen((o) => !o) }}
        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer border ${colorCls}`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${localValue ? 'bg-success' : 'bg-muted-foreground'}`} />
        <span>{localValue ? t('active') || 'Active' : t('inactive') || 'Inactive'}</span>
        <ChevronDown className={`h-3 w-3 opacity-60 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (usePortal ? createPortal(dropdownPanel, document.body) : dropdownPanel)}
    </div>
  )
}
