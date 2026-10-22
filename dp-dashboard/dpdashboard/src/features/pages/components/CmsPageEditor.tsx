import React from 'react'
import { Save } from 'lucide-react'
import { FormProvider, Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import { useZodForm } from '@/shared/components/form-fields'
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/card'
import { Button } from '@/shared/components/button'
import { BaseInputField } from '@/shared/components/base-input-field'
import { TableSkeleton } from '@/shared/components/table'
import { RichTextEditor } from '@/shared/components/rich-text-editor'
import { usePageByKey, useUpdatePage, pageToFormValues } from '@/features/pages/api/usePages'
import { PageSectionsPanel } from '@/features/pages/components/PageSectionsPanel'

const schema = z.object({
  titleAr: z.string().min(1, 'requiredField'),
  titleEn: z.string().min(1, 'requiredField'),
  contentAr: z.string().min(1, 'requiredField'),
  contentEn: z.string().min(1, 'requiredField'),
})

interface CmsPageEditorProps {
  pageKey: string
  titleKey: string
  contentLabelEn: string
  contentLabelAr: string
}

export function CmsPageEditor({ pageKey, titleKey, contentLabelEn, contentLabelAr }: CmsPageEditorProps) {
  const { t } = useTranslation()
  const { pageId, data: itemData, isLoading, isNotFound } = usePageByKey(pageKey)
  const saveMutation = useUpdatePage()

  const methods = useZodForm(schema, {
    titleAr: '',
    titleEn: '',
    contentAr: '',
    contentEn: '',
  })

  React.useEffect(() => {
    if (itemData) {
      methods.reset(pageToFormValues(itemData))
    }
  }, [itemData, methods.reset])

  const onSubmit = (formData: z.infer<typeof schema>) => {
    if (!pageId) return
    saveMutation.mutate({ id: pageId, payload: formData })
  }


  if (isLoading) {
    return (
      <Card className="border-border/60 shadow-sm rounded-2xl p-6 bg-card">
        <TableSkeleton rows={4} cols={1} />
      </Card>
    )
  }

  if (isNotFound) {
    return (
      <Card className="border-border/60 shadow-sm rounded-2xl p-6 bg-card">
        <p className="text-muted-foreground text-center py-8">
          {t('pageNotFound') || `Page "${pageKey}" was not found. Please ask the backend team to seed it.`}
        </p>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="border-border/60 shadow-sm rounded-2xl overflow-hidden bg-card">
        <CardHeader className="border-b border-border/40 px-6 py-5">
          <CardTitle className="text-lg font-bold text-foreground">{t(titleKey) || titleKey}</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <BaseInputField name="titleAr" label="العنوان (عربي) / Arabic Title" required />
                <BaseInputField name="titleEn" label="English Title / العنوان (إنجليزي)" required />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2 flex flex-col text-right" dir="rtl">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                    {contentLabelAr} <span className="text-rose-500">*</span>
                  </label>
                  <Controller
                    name="contentAr"
                    control={methods.control}
                    render={({ field }) => (
                      <RichTextEditor value={field.value} onChange={field.onChange} contentLanguage="ar" />
                    )}
                  />
                </div>
                <div className="space-y-2 flex flex-col text-left" dir="ltr">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                    {contentLabelEn} <span className="text-rose-500">*</span>
                  </label>
                  <Controller
                    name="contentEn"
                    control={methods.control}
                    render={({ field }) => (
                      <RichTextEditor value={field.value} onChange={field.onChange} contentLanguage="en" />
                    )}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-border/40 flex justify-end">
                <Button type="submit" loading={saveMutation.isPending} className="px-6 h-10 rounded-xl">
                  <Save className="mr-2 h-4 w-4" /> {t('saveChanges') || 'Save Changes'}
                </Button>
              </div>
            </form>
          </FormProvider>
        </CardContent>
      </Card>

      {pageId && <PageSectionsPanel pageId={pageId} />}
    </div>
  )
}
