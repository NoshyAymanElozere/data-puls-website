import { useFieldArray, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Plus, Trash2, Type } from 'lucide-react'
import { Button } from '@/shared/components/button'
import { cn } from '@/shared/utils/utils'
import type { ScreenFormValues } from '../pages/validationSchema'

const inputClass =
  'h-9 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 placeholder:text-gray-400 ' +
  'focus:outline-none focus:ring-1 focus:ring-main focus:border-main transition-all ' +
  'dark:bg-card dark:border-border dark:text-foreground dark:placeholder:text-muted-foreground ' +
  'disabled:cursor-not-allowed disabled:opacity-70'

export function ScreenTextsEditor({ disabled = false }: { disabled?: boolean }) {
  const { t } = useTranslation()
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<ScreenFormValues>()
  const { fields, append, remove } = useFieldArray({ control, name: 'texts' })

  const rootError = (errors.texts?.message ?? errors.texts?.root?.message) as string | undefined

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">{t('screenTextsHint')}</p>
        {!disabled && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-lg shrink-0"
            onClick={() => append({ key: '', en: '', ar: '' })}
          >
            <Plus className="h-4 w-4" /> {t('screenAddText')}
          </Button>
        )}
      </div>

      {fields.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/70 py-8 text-muted-foreground">
          <Type className="h-6 w-6 mb-2 opacity-50" />
          <p className="text-xs font-semibold">{t('screenNoTexts')}</p>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="hidden md:grid md:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)_minmax(0,1fr)_2.25rem] gap-2 px-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            <span>{t('screenTextKey')}</span>
            <span>{t('screenTextEn')}</span>
            <span>{t('screenTextAr')}</span>
            <span />
          </div>
          {fields.map((row, index) => {
            const rowErrors = errors.texts?.[index]
            const keyError = rowErrors?.key?.message as string | undefined
            const enError = rowErrors?.en?.message as string | undefined
            const arError = rowErrors?.ar?.message as string | undefined
            return (
              <div
                key={row.id}
                className="grid grid-cols-1 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)_minmax(0,1fr)_2.25rem] gap-2 rounded-xl border border-border/60 p-2 md:border-0 md:p-0"
              >
                <div>
                  <input
                    {...register(`texts.${index}.key`)}
                    dir="ltr"
                    disabled={disabled}
                    placeholder="welcome_title"
                    className={cn(inputClass, 'font-mono', keyError && 'border-rose-500')}
                  />
                  {keyError && <p className="mt-1 text-xs text-rose-500 font-semibold">{t(keyError)}</p>}
                </div>
                <div>
                  <input
                    {...register(`texts.${index}.en`)}
                    dir="ltr"
                    disabled={disabled}
                    placeholder={t('screenTextEn')}
                    className={cn(inputClass, enError && 'border-rose-500')}
                  />
                  {enError && <p className="mt-1 text-xs text-rose-500 font-semibold">{t(enError)}</p>}
                </div>
                <div>
                  <input
                    {...register(`texts.${index}.ar`)}
                    dir="rtl"
                    disabled={disabled}
                    placeholder={t('screenTextAr')}
                    className={cn(inputClass, arError && 'border-rose-500')}
                  />
                  {arError && <p className="mt-1 text-xs text-rose-500 font-semibold">{t(arError)}</p>}
                </div>
                <div className="flex items-start justify-end">
                  {!disabled && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                      aria-label={t('delete')}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {rootError && <p className="text-xs text-rose-500 font-semibold">{t(rootError)}</p>}
    </div>
  )
}
