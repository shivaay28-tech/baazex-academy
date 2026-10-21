import { LessonList } from '@/components/course/LessonList'
import { Seo } from '@/components/Seo'
import { Button } from '@/components/ui/Button'
import { DifficultyBadge } from '@/components/ui/DifficultyBadge'
import { Disclaimer } from '@/components/ui/Disclaimer'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { useAcademy } from '@/context/AcademyContext'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { categories } from '@/data/categories'
import { courseCover } from '@/data/media'
import { catalogService } from '@/services/catalog'
import { progressService } from '@/services/progress'
import { getCourseDuration, getCourseLessons, getLessonCount } from '@/utils/course'
import { Bookmark, Clock, GraduationCap, PlayCircle } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

export function CourseDetailsPage() {
  const { slug } = useParams()
  const course = catalogService.getCourse(slug ?? '')
  const { user } = useAuth()
  const { enroll, isEnrolled, isSaved, toggleSaved, courseProgress, refresh } = useAcademy()
  const { push } = useToast()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  if (!course) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-ink">Course not found</h1>
        <Link to="/courses" className="mt-4 inline-block text-sm font-semibold text-accent">
          Back to courses
        </Link>
      </div>
    )
  }

  const currentCourse = course
  const category = categories.find((item) => item.id === currentCourse.categoryId)
  const enrolled = isEnrolled(currentCourse.id)
  const progress = courseProgress(currentCourse.id)
  const lessons = getCourseLessons(currentCourse)
  const firstLesson = lessons[0]
  const completedIds = user ? progressService.completedLessonIds(user.id, currentCourse.id) : []

  async function onEnroll() {
    if (!user) {
      navigate('/login', { state: { from: `/courses/${currentCourse.slug}` } })
      return
    }
    setLoading(true)
    try {
      await enroll(currentCourse.id)
      push('success', 'You are enrolled', 'Your progress is saved to your account.')
      refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Seo title={course.title} description={course.description} />
      <section className="relative isolate h-64 overflow-hidden bg-navy sm:h-80">
        <img src={courseCover(course.categoryId)} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-linear-to-t from-navy via-navy/55 to-navy/20" />
        <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-8 sm:px-6">
          <p className="text-xs font-bold tracking-[0.16em] text-bright uppercase">{category?.name}</p>
          <h1 className="mt-2 max-w-3xl text-3xl font-semibold text-white sm:text-5xl">{course.title}</h1>
        </div>
      </section>
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 sm:py-12 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <p className="text-base text-muted">{course.description}</p>
          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-muted">
            <DifficultyBadge level={course.difficulty} />
            <span className="inline-flex items-center gap-1">
              <Clock className="h-4 w-4" /> {Math.round(getCourseDuration(course) / 60)}h {getCourseDuration(course) % 60}m
            </span>
            <span className="inline-flex items-center gap-1">
              <PlayCircle className="h-4 w-4" /> {getLessonCount(course)} lessons
            </span>
            <span className="inline-flex items-center gap-1">
              <GraduationCap className="h-4 w-4" /> {course.instructor}
            </span>
          </div>

          {enrolled ? (
            <div className="mt-6 rounded-2xl panel p-4">
              <ProgressBar value={progress.percent} label="Your progress" />
            </div>
          ) : null}

          <section className="mt-10">
            <h2 className="text-xl font-bold text-ink">Course objectives</h2>
            <ul className="mt-4 space-y-2">
              {course.objectives.map((objective) => (
                <li key={objective} className="panel rounded-xl px-4 py-3 text-sm text-ink">
                  {objective}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-10">
            <h2 className="text-xl font-bold text-ink">Lessons and modules</h2>
            <div className="mt-4">
              <LessonList course={course} completedIds={completedIds} enrolled={enrolled} />
            </div>
          </section>

          <div className="mt-8 rounded-2xl panel p-5">
            <Disclaimer />
          </div>
        </div>

        <aside className="lg:col-span-4">
          <div className="sticky top-24 rounded-3xl panel p-6 shadow-card">
            <p className="text-sm font-semibold text-muted">Educational enrolment</p>
            <p className="mt-1 text-2xl font-extrabold text-ink">Free enrolment</p>
            <p className="mt-2 text-sm text-muted">
              Enrolment stores lesson progress, notes, and quiz results with your Academy account.
            </p>
            <div className="mt-5 space-y-2">
              {enrolled && firstLesson ? (
                <Button className="w-full" onClick={() => navigate(`/learn/${course.slug}/${firstLesson.slug}`)}>
                  Continue learning
                </Button>
              ) : (
                <Button className="w-full" loading={loading} onClick={onEnroll}>
                  {user ? 'Enrol in this course' : 'Login to enrol'}
                </Button>
              )}
              <Button
                className="w-full"
                variant="secondary"
                icon={<Bookmark className="h-4 w-4" />}
                onClick={() => {
                  if (!user) {
                    navigate('/login')
                    return
                  }
                  const currentlySaved = isSaved(course.id)
                  toggleSaved(course.id)
                  push('info', currentlySaved ? 'Removed from saved' : 'Saved for later')
                }}
              >
                {isSaved(course.id) ? 'Saved' : 'Save course'}
              </Button>
            </div>
            {enrolled ? (
              <Link to={`/quiz/${course.slug}/${course.quizId}`} className="mt-4 block text-center text-sm font-semibold text-accent">
                Open course quiz
              </Link>
            ) : null}
          </div>
        </aside>
      </div>
    </div>
  )
}
