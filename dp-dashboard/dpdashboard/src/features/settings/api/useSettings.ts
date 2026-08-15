import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/shared/services/axios'
import toast from 'react-hot-toast'

export function useSettings() {
  return useQuery({
    queryKey: ['system-settings'],
    queryFn: async () => {
      const response = await api.get('/admin/settings')
      const list = response.data.data?.data || response.data.data || []
      const settingsMap = list.reduce((acc: Record<string, string>, item: any) => {
        acc[item.key] = item.value
        return acc
      }, {})
      return settingsMap
    }
  })
}

export function useUpdateSettings() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (settings: Record<string, string>) => {
      const response = await api.post('/admin/settings', { settings })
      return response.data
    },
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['system-settings'] })
      toast.success(res.message || 'Settings updated successfully.')
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to update settings.')
    }
  })
}
