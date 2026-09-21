import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Outlet } from 'react-router-dom'

export function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-canvas">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
