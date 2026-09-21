import { Logo } from '@/components/ui/Logo'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/utils/cn'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'

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
  const location = useLocation()
  const darkHero = location.pathname === '/'

  return (
    <header
      className={cn(
        'sticky top-0 z-40 border-b',
        darkHero ? 'border-white/10 bg-navy/80 backdrop-blur-xl' : 'border-line/80 bg-white/85 backdrop-blur-xl',
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" aria-label="Baazex Academy home">
          <Logo light={darkHero} />
        </Link>
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                cn(
                  'rounded-lg px-3 py-2 text-sm font-semibold transition',
                  darkHero
                    ? isActive
                      ? 'bg-white/10 text-white'
                      : 'text-white/70 hover:text-white'
                    : isActive
                      ? 'bg-canvas text-baazex'
                      : 'text-muted hover:text-navy',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className={cn(
                  'inline-flex h-9 items-center rounded-lg px-3 text-sm font-semibold',
                  darkHero ? 'border border-white/20 text-white hover:bg-white/10' : 'border border-line text-navy hover:border-baazex/40',
                )}
              >
                Dashboard
              </Link>
              <Link to="/engine" className="inline-flex h-9 items-center rounded-lg bg-baazex px-4 text-sm font-semibold text-white hover:bg-baazex-600">
                Open AI Engine
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={cn('px-3 text-sm font-semibold', darkHero ? 'text-white/80 hover:text-white' : 'text-navy')}
              >
                Login
              </Link>
              <Link to="/register" className="inline-flex h-9 items-center rounded-lg bg-baazex px-4 text-sm font-semibold text-white hover:bg-baazex-600">
                Start Learning
              </Link>
            </>
          )}
        </div>
        <button
          type="button"
          className={cn('rounded-lg p-2 lg:hidden', darkHero ? 'text-white' : 'text-navy')}
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      {open ? (
        <div className={cn('border-t px-4 py-4 lg:hidden', darkHero ? 'border-white/10 bg-navy' : 'border-line bg-white')}>
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={cn('rounded-lg px-3 py-3 text-sm font-semibold', darkHero ? 'text-white' : 'text-navy')}
              >
                {link.label}
              </NavLink>
            ))}
            <div className="mt-3 flex flex-col gap-2">
              {user ? (
                <Link to="/engine" onClick={() => setOpen(false)} className="rounded-xl bg-baazex px-4 py-3 text-center text-sm font-semibold text-white">
                  Open AI Engine
                </Link>
              ) : (
                <>
                  <Link to="/login" onClick={() => setOpen(false)} className={cn('px-3 py-2 text-sm font-semibold', darkHero ? 'text-white' : 'text-navy')}>
                    Login
                  </Link>
                  <Link to="/register" onClick={() => setOpen(false)} className="rounded-xl bg-baazex px-4 py-3 text-center text-sm font-semibold text-white">
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
