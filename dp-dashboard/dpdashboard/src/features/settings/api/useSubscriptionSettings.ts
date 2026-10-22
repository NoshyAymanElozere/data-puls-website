import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import type { FieldValues, UseFormSetError } from 'react-hook-form'
import i18n from '@/shared/i18n/i18n'
import api, { getErrorMessage } from '@/shared/services/axios'
import type { SuccessResponse } from '@/shared/types/laravel'
import { applyValidationErrors } from '@/shared/utils/form-errors'
import { unwrapSettingsPayload } from './useAppSettings'

// ─── Types ────────────────────────────────────────────────────────────────────

/** App settings group `subscriptions` (free trial + follow-up window). */
export interface SubscriptionsSettings {
  free_trial_enabled: boolean
  free_trial_months: number
  expiring_soon_days: number
}

/** App settings group `statistics` (manual store download counters). */
export interface StatisticsSettings {
  app_downloads_ios: number
  app_downloads_android: number
}

export const DEFAULT_SUBSCRIPTIONS_SETTINGS: SubscriptionsSettings = {
  free_trial_enabled: true,
  free_trial_months: 6,
  expiring_soon_days: 7,
}

export const DEFAULT_STATISTICS_SETTINGS: StatisticsSettings = {
  app_downloads_ios: 0,
  app_downloads_android: 0,
}

// ─── Normalizers ──────────────────────────────────────────────────────────────

function toBoolean(value: unknown, fallback: boolean): boolean {
  if (typeof value === 'boolean') return value
  if (value === 1 || value === '1' || value === 'true') return true
  if (value === 0 || value === '0' || value === 'false') return false
  return fallback
}

function toInteger(value: unknown, fallback: number): number {
  const n = Number(value)
  return Number.isFinite(n) ? Math.trunc(n) : fallback
}

function normalizeSubscriptionsSettings(raw: Record<string, unknown>): SubscriptionsSettings {
  const d = DEFAULT_SUBSCRIPTIONS_SETTINGS
  return {
    free_trial_enabled: toBoolean(raw.free_trial_enabled, d.free_trial_enabled),
    free_trial_months: toInteger(raw.free_trial_months, d.free_trial_months),
    expiring_soon_days: toInteger(raw.expiring_soon_days, d.expiring_soon_days),
  }
}

function normalizeStatisticsSettings(raw: Record<string, unknown>): StatisticsSettings {
  const d = DEFAULT_STATISTICS_SETTINGS
  return {
    app_downloads_ios: toInteger(raw.app_downloads_ios, d.app_downloads_ios),
    app_downloads_android: toInteger(raw.app_downloads_android, d.app_downloads_android),
  }
}

// ─── Subscriptions group ──────────────────────────────────────────────────────

export function useSubscriptionsSettings() {
  return useQuery({
    queryKey: ['app-settings', 'subscriptions'],
    queryFn: async () => {
      const res = await api.get<SuccessResponse<SubscriptionsSettings>>('/app-settings/subscriptions')
      return normalizeSubscriptionsSettings(unwrapSettingsPayload(res.data))
    },
  })
}

export function useUpdateSubscriptionsSettings<TForm extends FieldValues>(setError?: UseFormSetError<TForm>) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (payload: SubscriptionsSettings) => {
      const res = await api.put<SuccessResponse<SubscriptionsSettings>>('/app-settings/subscriptions', payload)
      return res.data
    },
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['app-settings', 'subscriptions'] })
      // The expiring-soon window drives the dashboard follow-up widget and stats
      qc.invalidateQueries({ queryKey: ['dashboard-subscriber-follow-up'] })
      qc.invalidateQueries({ queryKey: ['dashboard-subscribers'] })
      qc.invalidateQueries({ queryKey: ['dashboard-stats'] })
      toast.success(res.message || i18n.t('settingsUpdated'))
    },
    onError: (error) => {
      if (setError && applyValidationErrors(error, setError)) return
      toast.error(getErrorMessage(error, i18n.t('settingsUpdateFailed')))
    },
  })
}

// ─── Statistics group ─────────────────────────────────────────────────────────

export function useStatisticsSettings() {
  return useQuery({
    queryKey: ['app-settings', 'statistics'],
    queryFn: async () => {
      const res = await api.get<SuccessResponse<StatisticsSettings>>('/app-settings/statistics')
      return normalizeStatisticsSettings(unwrapSettingsPayload(res.data))
    },
  })
}

export function useUpdateStatisticsSettings<TForm extends FieldValues>(setError?: UseFormSetError<TForm>) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (payload: StatisticsSettings) => {
      const res = await api.put<SuccessResponse<StatisticsSettings>>('/app-settings/statistics', payload)
      return res.data
    },
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['app-settings', 'statistics'] })
      qc.invalidateQueries({ queryKey: ['dashboard-stats'] })
      toast.success(res.message || i18n.t('settingsUpdated'))
    },
    onError: (error) => {
      if (setError && applyValidationErrors(error, setError)) return
      toast.error(getErrorMessage(error, i18n.t('settingsUpdateFailed')))
    },
  })
}
