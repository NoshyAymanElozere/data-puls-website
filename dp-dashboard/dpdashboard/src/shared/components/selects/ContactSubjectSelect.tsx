import { useTranslation } from 'react-i18next'
import { useActiveContactSubjects, getSubjectName } from '@/features/contact/api/useContactSubjects'

interface ContactSubjectSelectProps {
  value: string
  onChange: (value: string) => void
  className?: string
  showAllOption?: boolean
}

export function ContactSubjectSelect({
  value,
  onChange,
  className,
  showAllOption = true,
}: ContactSubjectSelectProps) {
  const { t, i18n } = useTranslation()
  const { data: subjects = [] } = useActiveContactSubjects()

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={
        className ??
        'w-full h-10 px-3 rounded-xl border border-border/60 bg-card text-xs font-bold text-foreground outline-none focus:border-primary/50 transition-colors'
      }
    >
      {showAllOption && <option value="">{t('allSubjects') || 'All Subjects'}</option>}
      {subjects.map((subject) => (
        <option key={subject.id} value={String(subject.id)}>
          {getSubjectName(subject.name, i18n.language)}
        </option>
      ))}
    </select>
  )
}
