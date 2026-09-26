import { COMPANY_URL, DISCLAIMER } from '@/utils/constants'
import { MonitorSmartphone, Shield } from 'lucide-react'
import { Link } from 'react-router-dom'

export function EngineRail() {
  return (
    <aside className="hidden h-full w-[260px] shrink-0 flex-col overflow-y-auto border-l border-baazex/15 bg-white p-4 lg:flex">
      <p className="text-[10px] font-bold tracking-[0.2em] text-muted uppercase">Academy</p>
      <div className="panel mt-3 rounded-2xl p-4">
        <p className="text-lg font-extrabold text-ink">
          Built for learners, not <span className="text-accent">signals</span>
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Ask about structure, sessions, MT5, and risk. The engine will not tell you to buy or sell.
        </p>
        <svg viewBox="0 0 260 90" className="mt-4 h-20 w-full" aria-hidden="true">
          <path d="M0 70 C30 60 50 40 80 48 S130 80 160 50 S210 20 260 35" fill="none" stroke="#7ED0FF" strokeWidth="3" />
          <path d="M0 70 C30 60 50 40 80 48 S130 80 160 50 S210 20 260 35 L260 90 L0 90 Z" fill="url(#railFill)" opacity="0.35" />
          <defs>
            <linearGradient id="railFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7ED0FF" />
              <stop offset="100%" stopColor="#7ED0FF" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-sm font-bold text-accent">11</p>
            <p className="text-[10px] text-muted">Courses</p>
          </div>
          <div>
            <p className="text-sm font-bold text-accent">70%</p>
            <p className="text-[10px] text-muted">Pass mark</p>
          </div>
          <div>
            <p className="text-sm font-bold text-accent">MT5</p>
            <p className="text-[10px] text-muted">Platform</p>
          </div>
        </div>
        <ul className="mt-4 space-y-2 text-sm text-ink">
          <li className="flex gap-2"><Shield className="mt-0.5 h-4 w-4 text-accent" /> Education only — not advice</li>
          <li className="flex gap-2"><MonitorSmartphone className="mt-0.5 h-4 w-4 text-accent" /> Chart and video study tools</li>
        </ul>
        <Link to="/courses" className="mt-5 flex h-11 items-center justify-center rounded-xl bg-baazex text-sm font-bold text-ink hover:bg-baazex-600">
          Open courses
        </Link>
        <a href={COMPANY_URL} className="mt-2 flex h-10 items-center justify-center text-xs font-semibold text-muted hover:text-accent">
          Visit baazex.com
        </a>
        <p className="mt-4 text-[11px] leading-relaxed text-muted">{DISCLAIMER}</p>
      </div>
    </aside>
  )
}
