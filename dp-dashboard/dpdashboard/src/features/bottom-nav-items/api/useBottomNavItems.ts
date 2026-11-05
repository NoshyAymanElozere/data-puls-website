import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import i18n from '@/shared/i18n/i18n'
import api, { getErrorMessage } from '@/shared/services/axios'
import type { SuccessResponse } from '@/shared/types/laravel'

export type FontAwesomeStyle = 'solid' | 'regular'

export interface BottomNavItem {
  id: number
  key: 'categories' | 'invoices' | 'home' | 'family_members' | 'account'
  /** Localized by the backend from Accept-Language. */
  title: string
  icon: {
    class: string
    style: FontAwesomeStyle
    name: string
    unicode: string
    code_point: number
    font_family: string
  }
}

export interface FontAwesomeIcon {
  name: string
  label: string
  unicode: string
  styles: FontAwesomeStyle[]
  /** English aliases and search terms. */
  terms: string[]
}

const QUERY_KEY = 'bottom-nav-items'

export function useBottomNavItems() {
  const { i18n: instance } = useTranslation()

  return useQuery({
    // Titles come translated from the backend, so each language has its own cache entry.
    queryKey: [QUERY_KEY, instance.language],
    queryFn: async () => {
      const response = await api.get<SuccessResponse<BottomNavItem[]>>('/bottom-nav-items')
      return response.data.data
    },
  })
}

/** The catalog only changes with a backend release, so it is fetched once per session and only when the picker opens. */
export function useFontAwesomeIcons(enabled: boolean) {
  return useQuery({
    queryKey: ['font-awesome-icons'],
    queryFn: async () => {
      const response = await api.get<SuccessResponse<{ version: string; icons: FontAwesomeIcon[] }>>(
        '/bottom-nav-items/icons'
      )
      return response.data.data.icons
    },
    enabled,
    staleTime: Infinity,
  })
}

export function useUpdateBottomNavItem() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, style, name }: { id: number; style: FontAwesomeStyle; name: string }) => {
      const response = await api.put<SuccessResponse<BottomNavItem>>(`/bottom-nav-items/${id}`, {
        icon_style: style,
        icon_name: name,
      })
      return response.data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success(i18n.t('bottomNavIconUpdated'))
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, i18n.t('bottomNavIconUpdateFailed')))
    },
  })
}
