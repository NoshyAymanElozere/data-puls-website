import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import i18n from '@/shared/i18n/i18n'
import api, { getErrorMessage } from '@/shared/services/axios'

export function useSettings() {
  return useQuery({
    queryKey: ['app-settings'],
    queryFn: async () => {
      const response = await api.get<{ data: Record<string, string> }>('/settings')
      return response.data.data
    },
  })
}

export function useUpdateSettings() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (settings: Record<string, string>) => {
      const response = await api.put('/settings', settings)
      return response.data
    },
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['app-settings'] })
      qc.invalidateQueries({ queryKey: ['global-settings'] })
      toast.success(res.message || i18n.t('settingsUpdated'))
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, i18n.t('settingsUpdateFailed')))
    },
  })
}
