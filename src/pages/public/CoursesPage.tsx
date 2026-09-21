import { CourseCard } from '@/components/course/CourseCard'
import { SearchAndFilters } from '@/components/course/SearchAndFilters'
import { Seo } from '@/components/Seo'
import { EmptyState } from '@/components/ui/EmptyState'
import { useAcademy } from '@/context/AcademyContext'
import type { Difficulty } from '@/types'
import { Search } from 'lucide-react'
import { useMemo, useState } from 'react'

export function CoursesPage() {
  const { courses } = useAcademy()
  const [query, setQuery] = useState('')
  const [categoryId, setCategoryId] = useState('all')
  const [difficulty, setDifficulty] = useState<Difficulty | 'All'>('All')

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return courses.filter((course) => {
      const matchesQuery =
        !needle ||
        course.title.toLowerCase().includes(needle) ||
        course.subtitle.toLowerCase().includes(needle) ||
        course.description.toLowerCase().includes(needle)
      const matchesCategory = categoryId === 'all' || course.categoryId === categoryId
      const matchesDifficulty = difficulty === 'All' || course.difficulty === difficulty
      return matchesQuery && matchesCategory && matchesDifficulty && course.status === 'published'
    })
  }, [courses, query, categoryId, difficulty])

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <Seo title="Courses" description="Browse Baazex Academy courses on forex, CFDs, analysis, risk, MetaTrader 5, and introducing broker education." />
      <p className="text-xs font-bold tracking-[0.18em] text-baazex uppercase">Catalogue</p>
      <h1 className="mt-2 text-4xl font-extrabold text-navy">Course listing</h1>
      <p className="mt-3 max-w-2xl text-sm text-muted">
        Filter by category and level. Enrolment, progress, and quizzes are stored locally in this demonstration environment.
      </p>
      <div className="mt-8">
        <SearchAndFilters
          query={query}
          onQuery={setQuery}
          categoryId={categoryId}
          onCategory={setCategoryId}
          difficulty={difficulty}
          onDifficulty={setDifficulty}
        />
      </div>
      {filtered.length ? (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="mt-8">
          <EmptyState
            icon={Search}
            title="No courses match those filters"
            description="Try a different search term or reset the category and difficulty filters."
          />
        </div>
      )}
    </div>
  )
}
