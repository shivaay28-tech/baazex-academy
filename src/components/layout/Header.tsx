import { SocialBar } from '@/components/layout/SocialDock'
import { Logo } from '@/components/ui/Logo'
import { useAuth } from '@/context/AuthContext'
import { APP_NAME } from '@/utils/constants'
import { cn } from '@/utils/cn'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Home' },
  { to: '/engine', label: 'AI Engine' },
  { to: '/courses', label: 'Courses' },
  { to: '/learning-path', label: 'Learning Path' },
  { to: '/about', label: 'About Academy' },
  { to: '/faq', label: 'FAQ' },
]

export function Header() {
  const [open, setOpen] = useState(false)
  const { user } = useAuth()

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-navy/95 text-mist shadow-[0_12px_40px_-24px_rgb(6_21_43_/_0.65)] backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-2 px-3 sm:h-16 lg:px-4 xl:gap-3 xl:px-6">
        <Link to="/" aria-label={`${APP_NAME} home`} className="shrink-0 [&_img]:h-9 xl:[&_img]:h-12">
          <Logo light />
        </Link>
        <nav className="hidden shrink-0 items-center gap-0.5 lg:flex xl:gap-1" aria-label="Primary">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                cn(
                  'whitespace-nowrap rounded-lg px-2 py-1.5 text-[13px] font-semibold transition xl:px-3 xl:py-2 xl:text-sm xl:tracking-wide',
                  isActive ? 'bg-baazex text-white shadow-float' : 'text-mist/75 hover:text-white',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="hidden shrink-0 items-center gap-1.5 lg:flex xl:gap-2">
          <SocialBar compact />
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="inline-flex h-9 items-center rounded-lg border border-white/20 px-3 text-sm font-semibold text-white hover:bg-white/10"
              >
                Dashboard
              </Link>
              <Link
                to="/engine"
                className="inline-flex h-9 items-center rounded-lg bg-baazex px-4 text-sm font-semibold text-on-button shadow-float hover:bg-baazex-600"
              >
                Open AI Engine
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="px-3 text-sm font-semibold text-mist/80 hover:text-white">
                Login
              </Link>
              <Link
                to="/register"
                className="inline-flex h-9 items-center rounded-lg bg-baazex px-4 text-sm font-semibold text-on-button shadow-float hover:bg-baazex-600"
              >
                Start Learning
              </Link>
            </>
          )}
        </div>
        <button
          type="button"
          className="grid h-11 w-11 place-items-center rounded-lg text-white lg:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      {open ? (
        <div className="max-h-[min(80dvh,calc(100dvh-3.5rem))] overflow-y-auto border-t border-white/10 bg-navy px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-semibold text-mist"
              >
                {link.label}
              </NavLink>
            ))}
            <div className="mt-3 flex flex-col items-start gap-2">
              <SocialBar />
              {user ? (
                <Link
                  to="/engine"
                  onClick={() => setOpen(false)}
                  className="rounded-xl bg-baazex px-4 py-3 text-center text-sm font-semibold text-white"
                >
                  Open AI Engine
                </Link>
              ) : (
                <>
                  <Link to="/login" onClick={() => setOpen(false)} className="px-3 py-2 text-sm font-semibold text-mist">
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setOpen(false)}
                    className="rounded-xl bg-baazex px-4 py-3 text-center text-sm font-semibold text-white"
                  >
                    Start Learning
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  )
}
