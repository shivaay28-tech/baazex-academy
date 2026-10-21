import { CategoryCard } from '@/components/course/CategoryCard'
import { Seo } from '@/components/Seo'
import { PhotoBanner } from '@/components/ui/PhotoBanner'
import { media } from '@/data/media'
import { useAcademy } from '@/context/AcademyContext'
import { categories } from '@/data/categories'
import { APP_NAME } from '@/utils/constants'
import { getLessonCount } from '@/utils/course'

export function CategoriesPage() {
  const { courses } = useAcademy()

  return (
    <div>
      <Seo title="Course categories" description={`Explore ${APP_NAME} categories covering forex, markets, analysis, risk, psychology, MT5, and introducing brokers.`} />
      <PhotoBanner
        image={media.study}
        alt="A quiet briefing room used for academy study"
        eyebrow="Curriculum map"
        title="Course categories"
        text="Each category lists estimated duration, difficulty, and the number of lessons currently published."
      />
      <div className="mx-auto mt-8 grid max-w-7xl gap-5 px-4 pb-12 sm:grid-cols-2 sm:px-6 xl:grid-cols-4">
        {categories.map((category) => {
          const lessonCount = courses
            .filter((course) => course.categoryId === category.id)
            .reduce((sum, course) => sum + getLessonCount(course), 0)
          return <CategoryCard key={category.id} category={category} lessonCount={lessonCount} />
        })}
      </div>
    </div>
  )
}
