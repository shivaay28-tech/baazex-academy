const socials = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/baazex/',
    icon: InstagramIcon,
  },
  {
    label: 'YouTube',
    href: 'https://youtube.com/@baazexmarketing',
    icon: YouTubeIcon,
  },
  {
    label: 'Telegram',
    href: 'https://t.me/+lU9uP7cbR2JjNjM0',
    icon: TelegramIcon,
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/BAAZEX.GLOBAL/',
    icon: FacebookIcon,
  },
] as const

export function SocialBar({ compact = false }: { compact?: boolean }) {
  return (
    <nav
      aria-label="Baazex social and offers"
      className="flex shrink-0 items-center gap-1 rounded-full bg-[#0c0c0e] px-1 py-1 ring-1 ring-white/10"
    >
        {socials.map((item) => (
          <a
            key={item.label}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={item.label}
            className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-[#1a1a1e] transition hover:bg-[#26262c]"
          >
            <item.icon />
          </a>
        ))}
        <span className="mx-0.5 h-4 w-px shrink-0 bg-white/15" aria-hidden />
        <a
          href="https://wa.link/baazex"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-6 shrink-0 items-center gap-1 rounded-full bg-[#3DDC6A] px-2 text-[11px] font-semibold leading-none text-white shadow-[0_0_12px_rgb(61_220_106/0.4)] transition hover:bg-[#32c85e]"
        >
          <WhatsAppIcon />
          <span className={compact ? 'sr-only xl:not-sr-only' : undefined}>WhatsApp</span>
        </a>
        <a
          href="https://baazex.com/promotions"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-6 shrink-0 items-center rounded-full bg-linear-to-b from-[#f6d78a] to-[#c9962c] px-2.5 text-[11px] font-semibold leading-none text-[#1c1408] shadow-[0_0_12px_rgb(212_168_74/0.4)] transition hover:from-[#ffe3a3] hover:to-[#d4a43a]"
        >
          Offers
      </a>
    </nav>
  )
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden>
      <defs>
        <linearGradient id="ig-dock" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#f9ce34" />
          <stop offset="45%" stopColor="#ee2a7b" />
          <stop offset="100%" stopColor="#6228d7" />
        </linearGradient>
      </defs>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" fill="none" stroke="url(#ig-dock)" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="3.6" fill="none" stroke="url(#ig-dock)" strokeWidth="1.8" />
      <circle cx="17.2" cy="6.8" r="1" fill="url(#ig-dock)" />
    </svg>
  )
}

function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden>
      <rect x="2" y="5.5" width="20" height="13" rx="3.5" fill="#FF0033" />
      <path fill="#fff" d="M10.2 9.2v5.6l4.8-2.8-4.8-2.8z" />
    </svg>
  )
}

function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden>
      <circle cx="12" cy="12" r="10" fill="#2AABEE" />
      <path
        fill="#fff"
        d="M17.1 7.7 15.2 16.4c-.14.62-.5.77-1.02.48l-2.82-2.08-1.36 1.31c-.15.15-.28.28-.57.28l.21-2.9 5.27-4.76c.23-.2-.05-.32-.35-.12l-6.51 4.1-2.8-.88c-.61-.19-.62-.61.13-.9l10.95-4.22c.51-.19.96.12.77 1z"
      />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden>
      <circle cx="12" cy="12" r="10" fill="#1877F2" />
      <path
        fill="#fff"
        d="M13.3 18.4v-5.9h2l.3-2.3h-2.3V8.8c0-.66.18-1.1 1.14-1.1H16V5.6c-.2 0-.9-.08-1.72-.08-1.7 0-2.86 1.04-2.86 2.95v1.73H9.2v2.3h2.22v5.9h1.88z"
      />
    </svg>
  )
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden>
      <path
        fill="currentColor"
        d="M12.04 3.2A8.78 8.78 0 0 0 3.3 12a8.7 8.7 0 0 0 1.16 4.32L3.2 20.8l4.6-1.2A8.8 8.8 0 0 0 12.04 20.8 8.78 8.78 0 0 0 20.8 12a8.78 8.78 0 0 0-8.76-8.8zm5.1 12.35c-.22.62-1.28 1.18-1.78 1.26-.46.07-1.03.1-1.66-.1-.38-.13-.87-.28-1.5-.55-2.63-1.14-4.35-3.78-4.48-3.96-.13-.17-1.06-1.41-1.06-2.7 0-1.28.67-1.9.91-2.16.22-.25.58-.36.78-.36h.55c.18 0 .41-.07.64.49.24.58.8 2.02.87 2.16.08.15.12.32.02.51-.1.2-.14.31-.28.48-.14.17-.3.38-.43.51-.14.15-.29.3-.13.59.17.29.76 1.25 1.63 2.03 1.12 1 2.06 1.31 2.35 1.46.3.15.46.12.63-.07.17-.2.73-.85.92-1.15.2-.29.39-.25.64-.15.26.1 1.67.79 1.95.93.29.15.48.22.55.34.08.12.08.7-.15 1.32z"
      />
    </svg>
  )
}
