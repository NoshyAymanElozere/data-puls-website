import { Navigate, Outlet } from 'react-router-dom'
import { AUTH_TOKEN_KEY, getCookie } from '@/shared/utils/cookies'

export function ProtectedRoute() {
  const token = getCookie(AUTH_TOKEN_KEY)
  if (!token) return <Navigate to="/login" replace />
  return <Outlet />
}

export function PublicRoute() {
  const token = getCookie(AUTH_TOKEN_KEY)
  if (token) return <Navigate to="/" replace />
  return <Outlet />
}
