import { categories } from '@/data/categories'
import { seedCourses } from '@/data/courses'
import { courseCover } from '@/data/media'
import type { CSSProperties } from 'react'

const pages: Record<string, string> = {
  '/': '/images/bg-light-office.jpg',
  '/courses': '/images/bg-courses.jpg',
  '/categories': '/images/bg-categories.jpg',
  '/learning-path': '/images/bg-path.jpg',
  '/about': '/images/bg-about.jpg',
  '/faq': '/images/bg-faq.jpg',
  '/terms': '/images/bg-terms.jpg',
  '/privacy': '/images/bg-privacy.jpg',
  '/login': '/images/bg-light-study.jpg',
  '/register': '/images/bg-register.jpg',
  '/forgot-password': '/images/bg-forgot.jpg',
  '/reset-password': '/images/bg-reset.jpg',
  '/dashboard': '/images/bg-dashboard.jpg',
  '/my-courses': '/images/bg-mycourses.jpg',
  '/certificates': '/images/bg-certificates.jpg',
  '/profile': '/images/bg-profile.jpg',
  '/engine': '/images/bg-engine.jpg',
  '/admin': '/images/cat-forex.jpg',
  '/admin/courses': '/images/cat-markets.jpg',
  '/admin/modules': '/images/cat-technical.jpg',
  '/admin/lessons': '/images/cat-fundamental.jpg',
  '/admin/students': '/images/cat-risk.jpg',
  '/admin/credits': '/images/cat-psychology.jpg',
  '/admin/quizzes': '/images/cat-mt5.jpg',
  '/admin/certificates': '/images/cat-ib.jpg',
  '/admin/reports': '/images/hero-desk.jpg',
}

const courseBackgrounds: Record<string, string> = {
  'introduction-to-forex-trading': '/images/cat-markets.jpg',
  'understanding-currency-pairs': '/images/cat-technical.jpg',
  'how-buy-and-sell-orders-work': '/images/cat-fundamental.jpg',
  'pips-lots-leverage-and-margin': '/images/cat-psychology.jpg',
  'introduction-to-metatrader-5': '/images/cat-forex.jpg',
  'technical-analysis-essentials': '/images/cat-mt5.jpg',
  'risk-management-fundamentals': '/images/cat-ib.jpg',
  'trading-psychology': '/images/cat-risk.jpg',
  'fundamental-market-analysis': '/images/hero-desk.jpg',
  'introducing-broker-fundamentals': '/images/engine-chart.jpg',
  'understanding-financial-markets': '/images/hero-person.jpg',
}

const spare = [
  '/images/study-briefing.jpg',
  '/images/bg-quiz.jpg',
  '/images/bg-path.jpg',
  '/images/bg-about.jpg',
  '/images/bg-faq.jpg',
]

function pick(key: string, pool: string[]) {
  let hash = 0
  for (const char of key) hash = (hash * 33 + char.charCodeAt(0)) >>> 0
  return pool[hash % pool.length]
}

export function pageBackground(pathname: string) {
  const path = pathname.replace(/\/$/, '') || '/'
  if (pages[path]) return pages[path]

  const categorySlug = path.match(/^\/categories\/([^/]+)/)?.[1]
  if (categorySlug) {
    const category = categories.find((item) => item.slug === categorySlug)
    if (category) return courseCover(category.id)
  }

  const courseSlug = path.match(/^\/courses\/([^/]+)/)?.[1]
  if (courseSlug) {
    const course = seedCourses.find((item) => item.slug === courseSlug)
    if (course && courseBackgrounds[course.slug]) return courseBackgrounds[course.slug]
    if (course) return courseCover(course.categoryId)
  }

  if (path.startsWith('/certificates/')) return '/images/study-briefing.jpg'
  if (path.startsWith('/learn/')) return pick(path, spare)
  if (path.startsWith('/quiz/')) return pick(path, ['/images/bg-quiz.jpg', '/images/bg-terms.jpg', '/images/bg-faq.jpg', '/images/cat-technical.jpg'])

  return pick(path, Object.values(pages))
}

export function pageBackgroundStyle(pathname: string): CSSProperties {
  return { '--page-bg': `url("${pageBackground(pathname)}")` } as CSSProperties
}
