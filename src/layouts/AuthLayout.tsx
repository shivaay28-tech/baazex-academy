import { Logo } from '@/components/ui/Logo'
import { Disclaimer } from '@/components/ui/Disclaimer'
import { media } from '@/data/media'
import { APP_NAME } from '@/utils/constants'
import { pageBackgroundStyle } from '@/utils/pageBackground'
import { Link, Outlet, useLocation } from 'react-router-dom'

export function AuthLayout() {
  const { pathname } = useLocation()

  return (
    <div className="atmosphere bg-page min-h-dvh overflow-x-clip" style={pageBackgroundStyle(pathname)}>
      <div className="grid min-h-screen lg:grid-cols-2">
        <div className="relative hidden overflow-hidden border-r border-white/10 bg-navy lg:flex lg:flex-col lg:justify-between lg:p-10">
          <img src={media.study} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-linear-to-t from-navy via-navy/75 to-navy/35" />
          <Link to="/" className="relative">
            <Logo light />
          </Link>
          <div className="relative max-w-md">
            <p className="text-sm font-semibold tracking-[0.2em] text-bright uppercase">Education only</p>
            <h1 className="mt-3 text-4xl font-semibold text-white">Build market knowledge before you act.</h1>
            <p className="mt-4 text-sm leading-relaxed text-mist/80">
              Create a {APP_NAME} account to enrol in structured courses on forex, CFDs, analysis, risk, and MetaTrader 5.
            </p>
          </div>
          <Disclaimer className="relative text-mist/55" compact />
        </div>
        <div className="flex flex-col px-4 py-8 sm:px-8">
          <div className="mb-8 flex items-center justify-between lg:hidden">
            <Link to="/">
              <Logo />
            </Link>
          </div>
          <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
            <div className="glass rounded-3xl p-6 sm:p-8">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
