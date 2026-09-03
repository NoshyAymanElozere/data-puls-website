import { CmsPageEditor } from '@/features/pages/components/CmsPageEditor'

export default function AboutUsPage() {
  return (
    <CmsPageEditor
      pageKey="about_us"
      titleKey="aboutUs"
      contentLabelEn="About Us (English)"
      contentLabelAr="من نحن (عربي)"
    />
  )
}
