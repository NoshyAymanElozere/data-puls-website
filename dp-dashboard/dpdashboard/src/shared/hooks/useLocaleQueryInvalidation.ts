import { useEffect, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

/** Refetch server data when locale changes so Accept-Language returns updated strings. */
export function useLocaleQueryInvalidation() {
  const { i18n } = useTranslation()
  const queryClient = useQueryClient()
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    queryClient.invalidateQueries()
  }, [i18n.language, queryClient])
}
