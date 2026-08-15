import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { getCookie } from '@/shared/utils/cookies'

export function ProtectedRoute() {
  const token = getCookie('dpulse-token')

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export function PublicRoute() {
  const token = getCookie('dpulse-token')

  if (token) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
