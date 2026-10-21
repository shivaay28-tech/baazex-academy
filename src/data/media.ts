const covers: Record<string, string> = {
  'cat-forex-basics': '/images/cat-forex.gif',
  'cat-markets': '/images/cat-markets.gif',
  'cat-technical': '/images/cat-technical.gif',
  'cat-fundamental': '/images/cat-fundamental.gif',
  'cat-risk': '/images/cat-risk.gif',
  'cat-psychology': '/images/cat-psychology.gif',
  'cat-mt5': '/images/cat-mt5.gif',
  'cat-ib': '/images/cat-ib.gif',
}

export const media = {
  hero: '/images/hero-desk.jpg',
  study: '/images/study-briefing.jpg',
  engine: '/images/engine-chart.jpg',
}

export function courseCover(categoryId: string) {
  return covers[categoryId] ?? media.hero
}
