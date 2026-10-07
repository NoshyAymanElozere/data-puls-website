import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/shared/services/axios'
import toast from 'react-hot-toast'

export interface Contact {
  _id: string
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
  status: 'new' | 'read' | 'archived'
  createdAt?: string
  updatedAt?: string
}

export function useContactList() {
  return useQuery({
    queryKey: ['contact-list'],
    queryFn: async () => {
      const response = await api.get('/contact')
      return response.data.data as Contact[]
    }
  })
}

export function useDeleteContact() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/contact/${id}`)
      return response.data
    },
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['contact-list'] })
      toast.success(res.message || 'Contact message deleted successfully.')
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to delete contact message.')
    }
  })
}
