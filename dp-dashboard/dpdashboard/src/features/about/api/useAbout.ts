import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/shared/services/axios'
import toast from 'react-hot-toast'

export interface AboutUsData {
  _id?: string
  ar: {
    seo: {
      title: string
      description: string
      keywords: string
    }
    hero: {
      badge: string
      title_line1: string
      title_line2: string
      subtitle: string
      scroll_label: string
    }
    overview: {
      label: string
      title_line1: string
      title_line2: string
      title_accent: string
      quote: string
      text: string
      stat1_value: string
      stat1_label: string
      stat2_value: string
      stat2_label: string
      stat3_value: string
      stat3_label: string
      marquee_text1: string
      marquee_text2: string
      pulse_glyph: string
    }
    mission_vision: {
      mission_title: string
      mission_heading: string
      mission_heading_accent: string
      mission_text: string
      vision_title: string
      vision_heading: string
      vision_heading_accent: string
      vision_text: string
    }
    values: {
      label: string
      title: string
      subtitle: string
      v1_title: string
      v1_desc: string
      v2_title: string
      v2_desc: string
      v3_title: string
      v3_desc: string
      v4_title: string
      v4_desc: string
    }
  }
  en: {
    seo: {
      title: string
      description: string
      keywords: string
    }
    hero: {
      badge: string
      title_line1: string
      title_line2: string
      subtitle: string
      scroll_label: string
    }
    overview: {
      label: string
      title_line1: string
      title_line2: string
      title_accent: string
      quote: string
      text: string
      stat1_value: string
      stat1_label: string
      stat2_value: string
      stat2_label: string
      stat3_value: string
      stat3_label: string
      marquee_text1: string
      marquee_text2: string
      pulse_glyph: string
    }
    mission_vision: {
      mission_title: string
      mission_heading: string
      mission_heading_accent: string
      mission_text: string
      vision_title: string
      vision_heading: string
      vision_heading_accent: string
      vision_text: string
    }
    values: {
      label: string
      title: string
      subtitle: string
      v1_title: string
      v1_desc: string
      v2_title: string
      v2_desc: string
      v3_title: string
      v3_desc: string
      v4_title: string
      v4_desc: string
    }
  }
}

export function useAboutUs() {
  return useQuery({
    queryKey: ['about-us-raw'],
    queryFn: async () => {
      const response = await api.get('/about?raw=true')
      return response.data.data as AboutUsData
    }
  })
}

export function useUpdateAboutUs() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: { ar: any; en: any }) => {
      const response = await api.put('/about', payload)
      return response.data
    },
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['about-us-raw'] })
      toast.success(res.message || 'About Us content updated successfully.')
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to update About Us content.')
    }
  })
}
