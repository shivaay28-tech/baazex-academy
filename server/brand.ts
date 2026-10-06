export const BRAND = {
  id: 'baazex',
  name: 'Baazex Academy',
  shortName: 'Baazex',
  engineName: 'Baazex Engine',
  company: 'Baazex Financial Services L.L.C',
  url: 'https://www.baazex.com',
  host: 'baazex.com',
  storagePrefix: 'baazex.academy',
  demoStudentEmail: 'student@baazex.com',
  demoAdminEmail: 'admin@baazex.com',
  colors: {
    navy: '#06152B',
    baazex: '#0066FF',
    bright: '#00A3FF',
    canvas: '#F4F8FC',
    ink: '#172033',
  },
} as const

export type Brand = typeof BRAND
