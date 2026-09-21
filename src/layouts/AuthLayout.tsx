import { Logo } from '@/components/ui/Logo'
import { Disclaimer } from '@/components/ui/Disclaimer'
import { Link, Outlet } from 'react-router-dom'

export function AuthLayout() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-canvas">
      <div className="grid min-h-screen lg:grid-cols-2">
        <div className="relative hidden gradient-hero lg:flex lg:flex-col lg:justify-between lg:p-10">
          <div className="grid-fade absolute inset-0" />
          <Link to="/" className="relative">
            <Logo light />
          </Link>
          <div className="relative max-w-md">
            <p className="text-sm font-semibold tracking-[0.2em] text-bright uppercase">Education only</p>
            <h1 className="mt-3 text-4xl font-extrabold text-white">Build market knowledge before you act.</h1>
            <p className="mt-4 text-sm leading-relaxed text-white/70">
              Create a Baazex Academy account to enrol in structured courses on forex, CFDs, analysis, risk, and MetaTrader 5.
            </p>
          </div>
          <Disclaimer className="relative text-white/40" compact />
        </div>
        <div className="flex flex-col px-4 py-8 sm:px-8">
          <div className="mb-8 flex items-center justify-between lg:hidden">
            <Link to="/">
              <Logo />
            </Link>
          </div>
          <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}
