import type { TFunction } from 'i18next'

/**
 * Translates backend KPI metric texts, subtitles, and labels to Arabic when in RTL mode,
 * and normalizes phrases to maintain clean, consistent dashboard card layouts without truncation.
 */
export function translateMetricText(
  text: string | undefined | null,
  t: TFunction,
  isRtl: boolean,
  fallbackKey?: string
): string {
  if (!text) {
    return fallbackKey ? t(fallbackKey) : ''
  }

  let result = text.trim()

  if (!isRtl) {
    // English normalization: clean redundant "in spending"
    result = result.replace(/increase in spending from/gi, 'increase from')
    result = result.replace(/decrease in spending from/gi, 'decrease from')
    result = result.replace(/increase in spending/gi, 'increase')
    result = result.replace(/decrease in spending/gi, 'decrease')
    return result
  }

  // Arabic normalization when backend sends Arabic directly
  result = result.replace(/زيادة\s+في\s+الإنفاق\s+مقارنة\s+بالعام\s+الماضي/gi, 'زيادة مقارنة بالعام الماضي')
  result = result.replace(/انخفاض\s+في\s+الإنفاق\s+مقارنة\s+بالعام\s+الماضي/gi, 'انخفاض مقارنة بالعام الماضي')
  result = result.replace(/زيادة\s+في\s+الإنفاق\s+مقارنة\s+بالشهر\s+الماضي/gi, 'زيادة مقارنة بالشهر الماضي')
  result = result.replace(/انخفاض\s+في\s+الإنفاق\s+مقارنة\s+بالشهر\s+الماضي/gi, 'انخفاض مقارنة بالشهر الماضي')
  result = result.replace(/(زيادة|انخفاض)\s+في\s+الإنفاق/gi, '$1')

  // Full English compound phrases -> Arabic
  result = result.replace(/(?:increase\s+(?:in\s+spending\s+)?from\s+last\s+year)/gi, 'زيادة مقارنة بالعام الماضي')
  result = result.replace(/(?:decrease\s+(?:in\s+spending\s+)?from\s+last\s+year)/gi, 'انخفاض مقارنة بالعام الماضي')
  result = result.replace(/(?:increase\s+(?:in\s+spending\s+)?from\s+previous\s+year)/gi, 'زيادة مقارنة بالعام السابق')
  result = result.replace(/(?:decrease\s+(?:in\s+spending\s+)?from\s+previous\s+year)/gi, 'انخفاض مقارنة بالعام السابق')

  result = result.replace(/(?:increase\s+(?:in\s+spending\s+)?from\s+last\s+month)/gi, 'زيادة مقارنة بالشهر الماضي')
  result = result.replace(/(?:decrease\s+(?:in\s+spending\s+)?from\s+last\s+month)/gi, 'انخفاض مقارنة بالشهر الماضي')
  result = result.replace(/(?:increase\s+(?:in\s+spending\s+)?from\s+previous\s+month)/gi, 'زيادة مقارنة بالشهر السابق')
  result = result.replace(/(?:decrease\s+(?:in\s+spending\s+)?from\s+previous\s+month)/gi, 'انخفاض مقارنة بالشهر السابق')

  result = result.replace(/(?:increase\s+(?:in\s+spending\s+)?from\s+last\s+week)/gi, 'زيادة مقارنة بالأسبوع الماضي')
  result = result.replace(/(?:decrease\s+(?:in\s+spending\s+)?from\s+last\s+week)/gi, 'انخفاض مقارنة بالأسبوع الماضي')

  // Partial English phrase fragments
  result = result.replace(/from\s+last\s+year/gi, 'مقارنة بالعام الماضي')
  result = result.replace(/from\s+previous\s+year/gi, 'مقارنة بالعام السابق')
  result = result.replace(/from\s+last\s+month/gi, 'مقارنة بالشهر الماضي')
  result = result.replace(/from\s+previous\s+month/gi, 'مقارنة بالشهر السابق')
  result = result.replace(/from\s+last\s+week/gi, 'مقارنة بالأسبوع الماضي')
  result = result.replace(/from\s+previous\s+week/gi, 'مقارنة بالأسبوع السابق')

  result = result.replace(/increase\s+in\s+spending/gi, 'زيادة')
  result = result.replace(/decrease\s+in\s+spending/gi, 'انخفاض')
  result = result.replace(/\bincrease\b/gi, 'زيادة')
  result = result.replace(/\bdecrease\b/gi, 'انخفاض')
  result = result.replace(/last\s+year/gi, 'العام الماضي')
  result = result.replace(/last\s+month/gi, 'الشهر الماضي')

  // Other KPI subtitles
  result = result.replace(/tracking\s+on\s+target/gi, t('trackingOnTarget'))
  result = result.replace(/expiring\s+within\s+30\s+days/gi, t('expiringWithin30Days'))
  result = result.replace(/\bactive\b/gi, t('active'))
  result = result.replace(/\binactive\b/gi, t('inactive'))
  result = result.replace(/\bcompleted\b/gi, t('completed'))
  result = result.replace(/\bin\s+progress\b/gi, t('inProgress'))
  result = result.replace(/\bpending\b/gi, t('pending'))

  return result
}
