import type { TFunction } from 'i18next'

/**
 * Translates backend KPI metric texts, subtitles, and labels to Arabic when in RTL mode.
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

  if (!isRtl) {
    return text
  }

  let result = text
  result = result.replace(/increase in spending from last month/gi, t('increaseInSpendingFromLastMonth'))
  result = result.replace(/decrease in spending from last month/gi, t('decreaseInSpendingFromLastMonth'))
  result = result.replace(/increase from last month/gi, t('increaseFromLastMonth'))
  result = result.replace(/decrease from last month/gi, t('decreaseFromLastMonth'))
  result = result.replace(/increase in spending/gi, t('increaseInSpending'))
  result = result.replace(/decrease in spending/gi, t('decreaseInSpending'))
  result = result.replace(/tracking on target/gi, t('trackingOnTarget'))
  result = result.replace(/expiring within 30 days/gi, t('expiringWithin30Days'))
  result = result.replace(/\bactive\b/gi, t('active'))
  result = result.replace(/\binactive\b/gi, t('inactive'))
  result = result.replace(/\bcompleted\b/gi, t('completed'))
  result = result.replace(/\bin progress\b/gi, t('inProgress'))
  result = result.replace(/\bpending\b/gi, t('pending'))

  return result
}
