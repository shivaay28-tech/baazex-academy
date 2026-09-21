import { Disclaimer } from '@/components/ui/Disclaimer'
import { Logo } from '@/components/ui/Logo'
import { COMPANY_NAME, COMPANY_URL } from '@/utils/constants'
import { Link } from 'react-router-dom'

const columns = [
  {
    title: 'Academy',
    links: [
      { to: '/engine', label: 'AI Engine' },
      { to: '/courses', label: 'Courses' },
      { to: '/learning-path', label: 'Learning Path' },
      { to: '/about', label: 'About Academy' },
      { to: '/faq', label: 'FAQ' },
    ],
  },
  {
    title: 'Learn',
    links: [
      { to: '/categories', label: 'Categories' },
      { to: '/courses/introduction-to-forex-trading', label: 'Forex basics' },
      { to: '/courses/introduction-to-metatrader-5', label: 'MetaTrader 5' },
      { to: '/courses/risk-management-fundamentals', label: 'Risk management' },
    ],
  },
  {
    title: 'Account',
    links: [
      { to: '/login', label: 'Login' },
      { to: '/register', label: 'Create account' },
      { to: '/dashboard', label: 'Student dashboard' },
      { to: '/terms', label: 'Terms of use' },
      { to: '/privacy', label: 'Privacy policy' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-navy text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Logo light />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">
            Structured education on forex, CFDs, market analysis, risk, and MetaTrader 5 from {COMPANY_NAME}.
          </p>
          <a href={COMPANY_URL} className="mt-4 inline-block text-sm font-semibold text-bright hover:underline">
            www.baazex.com
          </a>
        </div>
        {columns.map((column) => (
          <div key={column.title} className="lg:col-span-2">
            <p className="text-xs font-bold tracking-[0.18em] text-white/40 uppercase">{column.title}</p>
            <ul className="mt-4 space-y-2">
              {column.links.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-white/75 hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="lg:col-span-2">
          <p className="text-xs font-bold tracking-[0.18em] text-white/40 uppercase">Contact</p>
          <p className="mt-4 text-sm text-white/75">Academy support is educational only and cannot provide personal investment advice.</p>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
          <Disclaimer className="text-white/45" compact />
          <p className="mt-3 text-xs text-white/35">
            © {new Date().getFullYear()} {COMPANY_NAME}. Baazex Academy. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
