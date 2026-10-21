import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { pageBackgroundStyle } from '@/utils/pageBackground'
import { Outlet, useLocation } from 'react-router-dom'

export function PublicLayout() {
  const { pathname } = useLocation()

  return (
    <div className="atmosphere bg-page flex min-h-dvh flex-col overflow-x-clip" style={pageBackgroundStyle(pathname)}>
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
