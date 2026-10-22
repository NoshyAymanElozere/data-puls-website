import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { ImageIcon, RotateCcw, Trash2, UploadCloud } from 'lucide-react'
import { Button } from '@/shared/components/button'
import { cn } from '@/shared/utils/utils'
import type { ScreenFormValues } from '../pages/validationSchema'

type FileFieldName = 'background_image_light' | 'background_image_dark' | 'screenshot'
type RemoveFieldName = 'remove_background_image_light' | 'remove_background_image_dark'

interface ImageFileFieldProps {
  name: FileFieldName
  /** When provided, the current image can be deleted on save. */
  removeName?: RemoveFieldName
  label?: string
  currentUrl?: string | null
  /** Image used when nothing is set (e.g. inherited from the global theme). */
  inheritedUrl?: string | null
  inheritedLabel?: string
  disabled?: boolean
  previewClassName?: string
  imageClassName?: string
}

/** Object URL for a File, revoked when it changes. */
export function useFilePreview(file: unknown): string | null {
  const [url, setUrl] = useState<string | null>(null)
  useEffect(() => {
    if (!(file instanceof File)) {
      setUrl(null)
      return
    }
    const next = URL.createObjectURL(file)
    setUrl(next)
    return () => URL.revokeObjectURL(next)
  }, [file])
  return url
}

export function ImageFileField({
  name,
  removeName,
  label,
  currentUrl,
  inheritedUrl,
  inheritedLabel,
  disabled = false,
  previewClassName = 'h-40 w-full',
  imageClassName = 'object-cover',
}: ImageFileFieldProps) {
  const { t } = useTranslation()
  const { control, setValue, formState } = useFormContext<ScreenFormValues>()
  const inputRef = useRef<HTMLInputElement>(null)

  const file = useWatch({ control, name })
  const removed = useWatch({ control, name: removeName ?? 'remove_background_image_light' })
  const isRemoved = removeName ? Boolean(removed) : false
  const filePreview = useFilePreview(file)

  const ownUrl = filePreview ?? (isRemoved ? null : currentUrl || null)
  const shownUrl = ownUrl ?? inheritedUrl ?? null
  const isInherited = !ownUrl && !!inheritedUrl

  const error = formState.errors[name]?.message as string | undefined

  const pick = () => {
    if (!disabled) inputRef.current?.click()
  }

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const next = e.target.files?.[0]
    if (!next) return
    setValue(name, next, { shouldDirty: true })
    if (removeName) setValue(removeName, false, { shouldDirty: true })
  }

  const clearNewFile = () => {
    setValue(name, null, { shouldDirty: true })
    if (inputRef.current) inputRef.current.value = ''
  }

  const removeCurrent = () => {
    clearNewFile()
    if (removeName) setValue(removeName, true, { shouldDirty: true })
  }

  const undoRemove = () => {
    if (removeName) setValue(removeName, false, { shouldDirty: true })
  }

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{label}</label>
      )}

      <div
        className={cn(
          'relative flex items-center justify-center overflow-hidden rounded-2xl border bg-muted/40',
          error ? 'border-rose-500' : 'border-border/60',
          previewClassName
        )}
      >
        {shownUrl ? (
          <img
            src={shownUrl}
            alt=""
            className={cn('h-full w-full', imageClassName, isInherited && 'opacity-60')}
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-4 text-center text-muted-foreground">
            <ImageIcon className="h-6 w-6 mb-1.5 opacity-50" />
            <span className="text-xs font-semibold">{t('noImage')}</span>
          </div>
        )}

        {isInherited && (
          <span className="absolute top-2 start-2 rounded-full bg-background/90 px-2 py-0.5 text-[10px] font-bold text-muted-foreground shadow-sm">
            {inheritedLabel ?? t('screenInherited')}
          </span>
        )}
        {filePreview && (
          <span className="absolute top-2 start-2 rounded-full bg-main px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
            {t('screenNewImage')}
          </span>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onFileChange}
        disabled={disabled}
      />

      {!disabled && (
        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" variant="outline" size="sm" onClick={pick} className="rounded-lg">
            <UploadCloud className="h-4 w-4" />
            {ownUrl ? t('screenReplaceImage') : t('uploadImage')}
          </Button>
          {filePreview && (
            <Button type="button" variant="ghost" size="sm" onClick={clearNewFile} className="rounded-lg">
              <RotateCcw className="h-4 w-4" />
              {t('screenUndoUpload')}
            </Button>
          )}
          {removeName && !filePreview && !isRemoved && currentUrl && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={removeCurrent}
              className="rounded-lg text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              {t('screenRemoveImage')}
            </Button>
          )}
          {removeName && isRemoved && !filePreview && currentUrl && (
            <Button type="button" variant="ghost" size="sm" onClick={undoRemove} className="rounded-lg">
              <RotateCcw className="h-4 w-4" />
              {t('screenUndoRemove')}
            </Button>
          )}
        </div>
      )}

      {isRemoved && !filePreview && currentUrl && (
        <p className="text-xs text-amber-600 font-semibold">{t('screenImageWillBeRemoved')}</p>
      )}
      <p className="text-[10px] text-muted-foreground">{t('screenImageHint')}</p>
      {error && <p className="text-xs text-rose-500 font-semibold">{t(error)}</p>}
    </div>
  )
}
