import { Seo } from '@/components/Seo'
import { Disclaimer } from '@/components/ui/Disclaimer'
import { PhotoBanner } from '@/components/ui/PhotoBanner'
import { media } from '@/data/media'
import { APP_NAME, COMPANY_HOST, COMPANY_NAME, COMPANY_URL } from '@/utils/constants'
import { Link } from 'react-router-dom'

export function AboutPage() {
  return (
    <div>
      <Seo title="About Academy" description={`${APP_NAME} is the educational platform of ${COMPANY_NAME}.`} />
      <PhotoBanner
        image={media.study}
        alt="A briefing room where academy material is prepared"
        eyebrow="About Academy"
        title="Education for a clearer view of the markets"
      />
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <p className="text-base leading-relaxed text-muted">
        {APP_NAME} is the learning platform of {COMPANY_NAME}. It exists to explain how forex and CFD markets are organised, how platforms such as MetaTrader 5 present information, and why risk belongs at the centre of every conversation about trading.
      </p>
      <p className="mt-4 text-base leading-relaxed text-muted">
        The Academy is not a signal room, a portfolio service, or a promise of income. Courses, quizzes, and certificates record study. They do not qualify anyone to trade, advise others, or expect a particular financial result.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <article className="panel rounded-2xl p-5">
          <h2 className="font-bold text-ink">Who it is for</h2>
          <p className="mt-2 text-sm text-muted">New learners, existing clients who want platform literacy, and introducing brokers who need a consistent educational standard.</p>
        </article>
        <article className="panel rounded-2xl p-5">
          <h2 className="font-bold text-ink">Who provides it</h2>
          <p className="mt-2 text-sm text-muted">
            Content is published by {APP_NAME}. Live trading services, if used, sit on{' '}
            <a href={COMPANY_URL} className="font-semibold text-accent">
              {COMPANY_HOST}
            </a>{' '}
            and are a separate decision.
          </p>
        </article>
      </div>
      <div className="mt-8 rounded-2xl panel p-5">
        <Disclaimer />
      </div>
      <p className="mt-6 text-sm">
        Ready to study? <Link to="/register" className="font-semibold text-accent">Create a free account</Link>
      </p>
      </div>
    </div>
  )
}
