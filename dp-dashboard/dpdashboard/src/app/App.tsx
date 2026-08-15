import { Layout } from '@/shared/layouts/Layout'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'

// Direct component imports
import Login from '@/features/auth/pages/Login'
import BlogList from '@/features/blog/pages/BlogList'
import BlogForm from '@/features/blog/pages/BlogForm'
import BlogView from '@/features/blog/pages/BlogView'
import DepartmentList from '@/features/department/pages/DepartmentList'

import { ProtectedRoute, PublicRoute } from '@/shared/components/RouteGuards'

const Placeholder = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
    <h2 className="text-2xl font-semibold opacity-50">{title}</h2>
    <p className="text-muted-foreground">This page is under construction.</p>
  </div>
)

function App() {
  return (
    <BrowserRouter basename="/dpulse">
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Layout />}>
            {/* Redirect root dashboard path to the blogs management section */}
            <Route index element={<Navigate to="blogs" replace />} />

            {/* Blog Module Routes */}
            <Route path="blogs" element={<BlogList />} />
            <Route path="blogs/new" element={<BlogForm />} />
            <Route path="blogs/edit/:slug" element={<BlogForm />} />
            <Route path="blogs/view/:slug" element={<BlogView />} />

            {/* Department Module Routes */}
            <Route path="departments" element={<DepartmentList />} />

            <Route path="*" element={<Placeholder title="404 Not Found" />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
