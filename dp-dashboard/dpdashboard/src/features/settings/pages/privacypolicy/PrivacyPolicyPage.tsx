import { CmsPageEditor } from '@/features/pages/components/CmsPageEditor'

export default function PrivacyPolicyPage() {
  return (
    <CmsPageEditor
      pageKey="privacy_policy"
      titleKey="privacyPolicy"
      contentLabelEn="Privacy Policy (English)"
      contentLabelAr="سياسة الخصوصية (عربي)"
    />
  )
}
