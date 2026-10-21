const covers: Record<string, string> = {
  'cat-forex-basics': '/images/cat-forex.jpg',
  'cat-markets': '/images/cat-markets.jpg',
  'cat-technical': '/images/cat-technical.jpg',
  'cat-fundamental': '/images/cat-fundamental.jpg',
  'cat-risk': '/images/cat-risk.jpg',
  'cat-psychology': '/images/cat-psychology.jpg',
  'cat-mt5': '/images/cat-mt5.jpg',
  'cat-ib': '/images/cat-ib.jpg',
}

export const media = {
  hero: '/images/hero-desk.jpg',
  study: '/images/study-briefing.jpg',
  engine: '/images/engine-chart.jpg',
}

export function courseCover(categoryId: string) {
  return covers[categoryId] ?? media.hero
}
