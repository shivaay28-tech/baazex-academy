import { CategoryCard } from '@/components/course/CategoryCard'
import { CourseCard } from '@/components/course/CourseCard'
import { HeroVisual } from '@/components/home/HeroVisual'
import { Seo } from '@/components/Seo'
import { Button } from '@/components/ui/Button'
import { Disclaimer } from '@/components/ui/Disclaimer'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { useAcademy } from '@/context/AcademyContext'
import { categories } from '@/data/categories'
import { faqs } from '@/data/faqs'
import { DISCLAIMER } from '@/utils/constants'
import { getLessonCount } from '@/utils/course'
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  LineChart,
  Shield,
  Sparkles,
  Waypoints,
} from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const levels = [
  {
    title: 'Beginner',
    text: 'Market structure, pairs, order types, and a first look at MetaTrader 5.',
    items: ['Forex basics', 'Currency pairs', 'MT5 layout'],
  },
  {
    title: 'Intermediate',
    text: 'Analysis methods, product math, and the language of risk.',
    items: ['Technical analysis', 'Fundamentals', 'Pips and margin'],
  },
  {
    title: 'Advanced',
    text: 'Psychology, partner education, and more complete decision checklists.',
    items: ['Trading psychology', 'IB fundamentals', 'Process journals'],
  },
]

const why = [
  {
    icon: GraduationCap,
    title: 'Structured, not scattered',
    text: 'Courses are sequenced so vocabulary, platform skills, and risk sit in a logical order.',
  },
  {
    icon: Shield,
    title: 'Risk-first language',
    text: 'Leverage, margin, and loss are explained plainly. Nothing here promises a trading result.',
  },
  {
    icon: LineChart,
    title: 'Platform literacy',
    text: 'MetaTrader 5 is taught as a professional terminal: layout, tickets, history, and journals.',
  },
  {
    icon: Sparkles,
    title: 'Progress you can see',
    text: 'Enrolment, lesson completion, quizzes, and certificates are tracked in your dashboard.',
  },
]

const steps = [
  { step: '01', title: 'Create a free account', text: 'Register with your name, email, mobile, and country.' },
  { step: '02', title: 'Choose a learning path', text: 'Start with forex basics or jump to a labelled intermediate topic.' },
  { step: '03', title: 'Study lessons and notes', text: 'Watch the media placeholder, read the material, and keep private notes.' },
  { step: '04', title: 'Check understanding', text: 'Pass the quiz at 70% to complete the course and receive a sample certificate.' },
]

const features = [
  'Educational AI Engine',
  'Searchable course catalogue',
  'Category and difficulty filters',
  'Lesson completion tracking',
  'Knowledge-check quizzes',
  'Downloadable lesson resources',
  'Printable certificates',
]

export function HomePage() {
  const { courses } = useAcademy()
  const popular = courses.filter((course) => course.popular).slice(0, 4)
  const navigate = useNavigate()
  const [openFaq, setOpenFaq] = useState(faqs[0]?.id)

  return (
    <>
      <Seo
        title="Learn Forex and Market Analysis"
        description="Baazex Academy offers structured education on forex, CFDs, analysis, risk management, and MetaTrader 5. Educational content only."
      />
      <section className="gradient-hero relative overflow-hidden">
        <div className="grid-fade absolute inset-0" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-bright">
              Baazex Financial Services L.L.C
            </p>
            <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-[56px] lg:leading-[1.05]">
              Learn the Markets. <span className="text-gradient">Trade with Greater Understanding.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
              Build your knowledge of forex, CFDs, market analysis, risk management, and the MT5 trading platform through structured educational courses.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" onClick={() => navigate('/engine')} icon={<Sparkles className="h-4 w-4" />}>
                Open AI Engine
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/courses')} icon={<BookOpen className="h-4 w-4" />}>
                Explore Courses
              </Button>
            </div>
            <p className="mt-6 max-w-xl text-xs leading-relaxed text-white/40">{DISCLAIMER}</p>
          </div>
          <HeroVisual />
        </div>
      </section>

      <section className="bg-navy pb-16 text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2">
          <div>
            <p className="text-xs font-bold tracking-[0.18em] text-bright uppercase">AI Engine</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Study charts with an educational assistant
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/65">
              Share a screen, upload a screenshot, or send a short clip. The engine comments on structure, sessions, liquidity, and risk. It will not give a buy or sell call.
            </p>
            <Button className="mt-6" size="lg" onClick={() => navigate('/engine')} icon={<Sparkles className="h-4 w-4" />}>
              Try the AI Engine
            </Button>
          </div>
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <p className="text-sm font-semibold text-white/80">What are we studying today?</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {['Share my screen', 'Upload a chart', "Today's brief", 'Instrument notes'].map((item) => (
                <p key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
                  {item}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <SectionHeading
          kicker="Popular courses"
          title="Start with a clear foundation"
          action={<Link to="/courses" className="text-sm font-semibold text-baazex">View all courses</Link>}
        />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {popular.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading kicker="Learning levels" title="A path that grows with your knowledge" />
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {levels.map((level) => (
              <article key={level.title} className="rounded-2xl border border-line p-6">
                <p className="text-xs font-bold tracking-[0.16em] text-baazex uppercase">{level.title}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted">{level.text}</p>
                <ul className="mt-4 space-y-2">
                  {level.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm font-medium text-navy">
                      <CheckCircle2 className="h-4 w-4 text-baazex" />
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <SectionHeading kicker="Why Baazex Academy" title="Why learn with Baazex Academy?" />
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {why.map((item) => (
            <article key={item.title} className="flex gap-4 rounded-2xl border border-line bg-white p-6">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-canvas text-baazex">
                <item.icon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-lg font-bold text-navy">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-navy py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading kicker="How it works" title="Four steps from account to certificate" light />
          <div className="mt-10 grid gap-6 md:grid-cols-4">
            {steps.map((item) => (
              <article key={item.step}>
                <p className="text-3xl font-extrabold text-bright/80">{item.step}</p>
                <h3 className="mt-3 text-lg font-bold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/65">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading kicker="Platform features" title="Built as a learning product, ready for CRM later" />
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-medium text-navy">
                  <Waypoints className="h-4 w-4 text-baazex" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-line bg-white p-6 shadow-card">
            <p className="text-xs font-bold tracking-[0.16em] text-baazex uppercase">Learning progress preview</p>
            <h3 className="mt-2 text-xl font-bold text-navy">A quieter dashboard for serious study</h3>
            <p className="mt-2 text-sm text-muted">
              After you enrol, the student workspace keeps recent courses, completion, and recommended next lessons in one place.
            </p>
            <div className="mt-6 space-y-4">
              <ProgressBar value={72} label="Introduction to Forex Trading" />
              <ProgressBar value={40} label="Understanding Currency Pairs" />
              <ProgressBar value={18} label="Introduction to MetaTrader 5" />
            </div>
            <Link to="/register" className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-baazex">
              Create an account to save progress <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading kicker="Categories" title="Eight focused learning areas" action={<Link to="/categories" className="text-sm font-semibold text-baazex">Browse categories</Link>} />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {categories.map((category) => {
              const lessonCount = courses
                .filter((course) => course.categoryId === category.id)
                .reduce((sum, course) => sum + getLessonCount(course), 0)
              return <CategoryCard key={category.id} category={category} lessonCount={lessonCount} />
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <SectionHeading kicker="FAQ" title="Frequently asked questions" />
        <div className="mt-8 space-y-3">
          {faqs.slice(0, 5).map((item) => (
            <article key={item.id} className="rounded-2xl border border-line bg-white">
              <button
                type="button"
                className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-bold text-navy"
                onClick={() => setOpenFaq((current) => (current === item.id ? undefined : item.id))}
              >
                {item.question}
              </button>
              {openFaq === item.id ? <p className="px-5 pb-5 text-sm leading-relaxed text-muted">{item.answer}</p> : null}
            </article>
          ))}
        </div>
        <div className="mt-4 text-center">
          <Link to="/faq" className="text-sm font-semibold text-baazex">
            View all questions
          </Link>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl gradient-hero px-6 py-14 text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Study the markets with a professional standard of care.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/70">
            Enrol in Baazex Academy to follow a structured curriculum. Education first. No profit claims. No personalised advice.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" onClick={() => navigate('/register')}>
              Create Free Account
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/courses')}>
              Explore Courses
            </Button>
          </div>
          <Disclaimer className="mx-auto mt-8 max-w-3xl text-white/40" compact />
        </div>
      </section>
    </>
  )
}

function SectionHeading({
  kicker,
  title,
  action,
  light,
}: {
  kicker: string
  title: string
  action?: ReactNode
  light?: boolean
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className={`text-xs font-bold tracking-[0.18em] uppercase ${light ? 'text-bright' : 'text-baazex'}`}>{kicker}</p>
        <h2 className={`mt-2 text-3xl font-extrabold tracking-tight ${light ? 'text-white' : 'text-navy'}`}>{title}</h2>
      </div>
      {action}
    </div>
  )
}
