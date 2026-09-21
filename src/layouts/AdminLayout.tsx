import { MobileNavigation } from '@/components/layout/MobileNavigation'
import { Sidebar } from '@/components/layout/Sidebar'
import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'

const subnav = [
  { to: '/admin', label: 'Dashboard' },
  { to: '/admin/courses', label: 'Courses' },
  { to: '/admin/modules', label: 'Modules' },
  { to: '/admin/lessons', label: 'Lessons' },
  { to: '/admin/students', label: 'Students' },
  { to: '/admin/quizzes', label: 'Quizzes' },
  { to: '/admin/certificates', label: 'Certificates' },
  { to: '/admin/reports', label: 'Reports' },
]

export function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [query, setQuery] = useState('')

  return (
    <div className="flex h-screen overflow-hidden bg-canvas">
      <div className="hidden md:block">
        <Sidebar
          admin
          collapsed={collapsed}
          onToggle={() => setCollapsed((value) => !value)}
          query={query}
          onQuery={setQuery}
        />
      </div>
      <div className="min-w-0 flex-1 overflow-y-auto pb-20 md:pb-0">
        <div className="border-b border-line bg-white">
          <div className="no-scrollbar flex gap-1 overflow-x-auto px-4 py-3">
            {subnav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/admin'}
                className={({ isActive }) =>
                  `shrink-0 rounded-full px-3 py-1.5 text-sm font-semibold ${isActive ? 'bg-navy text-white' : 'text-muted hover:bg-canvas'}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
        <Outlet />
      </div>
      <MobileNavigation admin />
    </div>
  )
}
