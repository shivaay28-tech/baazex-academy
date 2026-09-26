import { DifficultyBadge } from '@/components/ui/DifficultyBadge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { useAcademy } from '@/context/AcademyContext'
import { categories } from '@/data/categories'
import type { Course } from '@/types'
import { getLessonCount } from '@/utils/course'
import { Clock, PlayCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

export function CourseCard({ course }: { course: Course }) {
  const { isEnrolled, courseProgress } = useAcademy()
  const category = categories.find((item) => item.id === course.categoryId)
  const enrolled = isEnrolled(course.id)
  const progress = courseProgress(course.id)

  return (
    <article className="group panel flex h-full flex-col overflow-hidden rounded-2xl transition hover:-translate-y-1 hover:border-bright/40 hover:shadow-float">
      <div className="relative h-32 overflow-hidden bg-linear-to-br from-navy via-navy-700 to-baazex">
        <div className="absolute inset-0 opacity-40 grid-fade" />
        <div className="absolute inset-x-4 bottom-4 flex items-end justify-between">
          <DifficultyBadge level={course.difficulty} />
          {course.popular ? (
            <span className="rounded-full bg-white/75 px-2.5 py-1 text-[11px] font-semibold text-accent">Popular</span>
          ) : null}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-[11px] font-bold tracking-[0.16em] text-accent uppercase">{category?.name}</p>
        <h3 className="mt-1 text-base font-bold text-ink group-hover:text-accent">{course.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-muted">{course.subtitle}</p>
        <div className="mt-4 flex items-center gap-4 text-xs font-medium text-muted">
          <span className="inline-flex items-center gap-1">
            <PlayCircle className="h-3.5 w-3.5" />
            {getLessonCount(course)} lessons
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {course.durationHours}h
          </span>
        </div>
        {enrolled ? (
          <div className="mt-4">
            <ProgressBar value={progress.percent} size="sm" label="Progress" />
          </div>
        ) : null}
        <Link
          to={`/courses/${course.slug}`}
          className="mt-5 inline-flex h-10 items-center justify-center rounded-xl border border-bright/20 bg-navy text-sm font-semibold text-ink transition hover:border-bright/40 hover:bg-baazex hover:shadow-float"
        >
          View Course
        </Link>
      </div>
    </article>
  )
}
