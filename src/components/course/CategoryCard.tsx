import { DifficultyBadge } from '@/components/ui/DifficultyBadge'
import { courseCover } from '@/data/media'
import type { Category } from '@/types'
import { Link } from 'react-router-dom'

export function CategoryCard({
  category,
  lessonCount,
}: {
  category: Category
  lessonCount: number
}) {
  return (
    <Link
      to={`/categories/${category.slug}`}
      className="group panel flex h-full flex-col overflow-hidden rounded-2xl transition hover:-translate-y-1 hover:shadow-float"
    >
      <div className="relative h-36 overflow-hidden">
        <img
          src={courseCover(category.id)}
          alt=""
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-navy/85 via-navy/20 to-transparent" />
        <h3 className="absolute inset-x-4 bottom-4 text-lg font-semibold text-white">{category.name}</h3>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="flex-1 text-sm leading-relaxed text-muted">{category.description}</p>
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-medium">
          <DifficultyBadge level={category.difficulty} />
          <span className="text-muted">{lessonCount} lessons</span>
          <span className="text-muted">·</span>
          <span className="text-muted">{category.estimatedHours}h estimated</span>
        </div>
      </div>
    </Link>
  )
}
