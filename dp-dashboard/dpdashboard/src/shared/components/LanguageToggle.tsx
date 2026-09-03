import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/utils/utils'

const languages = [
  { code: 'en', label: 'EN' },
  { code: 'ar', label: 'عربي' },
] as const

export function LanguageToggle() {
  const { i18n } = useTranslation()
  const current = i18n.language === 'ar' ? 'ar' : 'en'

  const setLanguage = (lang: 'en' | 'ar') => {
    if (lang === current) return
    i18n.changeLanguage(lang)
    localStorage.setItem('lang', lang)
  }

  return (
    <div
      className="relative flex h-8 items-center rounded-xl border border-border/60 bg-muted/30 p-0.5 shadow-sm"
      role="group"
      aria-label="Language"
    >
      {languages.map(({ code, label }) => {
        const isActive = current === code
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLanguage(code)}
            aria-pressed={isActive}
            className={cn(
              'relative z-[1] min-w-[2.75rem] h-7 rounded-lg px-2.5 text-[11px] font-bold transition-all duration-200',
              isActive
                ? 'text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {isActive && (
              <span
                className="absolute inset-0 rounded-lg bg-primary shadow-sm shadow-primary/25"
                aria-hidden
              />
            )}
            <span className="relative">{label}</span>
          </button>
        )
      })}
    </div>
  )
}
