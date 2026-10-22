import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { ImageIcon, RotateCcw, UploadCloud } from 'lucide-react'
import { Button } from '@/shared/components/button'
import { cn } from '@/shared/utils/utils'
import type { ScreenFormValues } from '../pages/validationSchema'

interface ImageFileFieldProps {
  name: 'screenshot'
  label?: string
  currentUrl?: string | null
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
  label,
  currentUrl,
  disabled = false,
  previewClassName = 'h-40 w-full',
  imageClassName = 'object-cover',
}: ImageFileFieldProps) {
  const { t } = useTranslation()
  const { control, setValue, formState } = useFormContext<ScreenFormValues>()
  const inputRef = useRef<HTMLInputElement>(null)

  const file = useWatch({ control, name })
  const filePreview = useFilePreview(file)
  const shownUrl = filePreview ?? (currentUrl || null)

  const error = formState.errors[name]?.message as string | undefined

  const pick = () => {
    if (!disabled) inputRef.current?.click()
  }

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const next = e.target.files?.[0]
    if (!next) return
    setValue(name, next, { shouldDirty: true })
  }

  const clearNewFile = () => {
    setValue(name, null, { shouldDirty: true })
    if (inputRef.current) inputRef.current.value = ''
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
          <img src={shownUrl} alt="" className={cn('h-full w-full', imageClassName)} />
        ) : (
          <div className="flex flex-col items-center justify-center p-4 text-center text-muted-foreground">
            <ImageIcon className="h-6 w-6 mb-1.5 opacity-50" />
            <span className="text-xs font-semibold">{t('noImage')}</span>
          </div>
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
            {shownUrl ? t('screenReplaceImage') : t('uploadImage')}
          </Button>
          {filePreview && (
            <Button type="button" variant="ghost" size="sm" onClick={clearNewFile} className="rounded-lg">
              <RotateCcw className="h-4 w-4" />
              {t('screenUndoUpload')}
            </Button>
          )}
        </div>
      )}

      <p className="text-[10px] text-muted-foreground">{t('screenImageHint')}</p>
      {error && <p className="text-xs text-rose-500 font-semibold">{t(error)}</p>}
    </div>
  )
}
