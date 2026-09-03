import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './index.css'
import '@/shared/i18n/i18n'
import { queryClient } from '@/shared/services/queryClient'
import { fetchPublicAppBranding } from '@/features/settings/api/useAppSettings'

queryClient.prefetchQuery({
  queryKey: ['app-branding-public'],
  queryFn: fetchPublicAppBranding,
  staleTime: 5 * 60 * 1000,
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <Toaster position="top-right" />
    </QueryClientProvider>
  </React.StrictMode>,
)
