import type { Instrument } from '@/types'

export const instruments: Instrument[] = [
  {
    symbol: 'EURUSD',
    name: 'Euro / US Dollar',
    sessionNote: 'Often most active during the London–New York overlap. Spreads can widen around CPI, NFP, and ECB or Fed decisions.',
  },
  {
    symbol: 'XAUUSD',
    name: 'Gold vs US Dollar',
    sessionNote: 'Gold can move quickly around real-yield and USD narratives. Contract size and tick value differ from FX pairs — always read the specification.',
  },
  {
    symbol: 'GBPUSD',
    name: 'Pound / US Dollar',
    sessionNote: 'Sensitive to UK data and BoE communication, and to USD events. Liquidity typically improves in the London session.',
  },
  {
    symbol: 'US30',
    name: 'US 30 cash CFD',
    sessionNote: 'Index CFDs follow US equity-hours more than the FX calendar. Gaps around cash-session opens are a risk topic, not a signal.',
  },
  {
    symbol: 'NAS100',
    name: 'US 100 cash CFD',
    sessionNote: 'Tech-heavy index CFDs can be more volatile around US hours and mega-cap news. Product specs differ from FX pip values.',
  },
  {
    symbol: 'USOIL',
    name: 'US Crude oil CFD',
    sessionNote: 'Energy CFDs react to inventory data, OPEC headlines, and USD moves. Overnight financing and contract months belong in the product document.',
  },
]
