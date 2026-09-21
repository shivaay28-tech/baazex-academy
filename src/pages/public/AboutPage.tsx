import { Seo } from '@/components/Seo'
import { Disclaimer } from '@/components/ui/Disclaimer'
import { COMPANY_NAME, COMPANY_URL } from '@/utils/constants'
import { Link } from 'react-router-dom'

export function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Seo title="About Academy" description="Baazex Academy is the educational platform of Baazex Financial Services L.L.C." />
      <p className="text-xs font-bold tracking-[0.18em] text-baazex uppercase">About Academy</p>
      <h1 className="mt-2 text-4xl font-extrabold text-navy">Education for a clearer view of the markets</h1>
      <p className="mt-4 text-base leading-relaxed text-muted">
        Baazex Academy is the learning platform of {COMPANY_NAME}. It exists to explain how forex and CFD markets are organised, how platforms such as MetaTrader 5 present information, and why risk belongs at the centre of every conversation about trading.
      </p>
      <p className="mt-4 text-base leading-relaxed text-muted">
        The Academy is not a signal room, a portfolio service, or a promise of income. Courses, quizzes, and certificates record study. They do not qualify anyone to trade, advise others, or expect a particular financial result.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <article className="rounded-2xl bg-white p-5">
          <h2 className="font-bold text-navy">Who it is for</h2>
          <p className="mt-2 text-sm text-muted">New learners, existing clients who want platform literacy, and introducing brokers who need a consistent educational standard.</p>
        </article>
        <article className="rounded-2xl bg-white p-5">
          <h2 className="font-bold text-navy">Who provides it</h2>
          <p className="mt-2 text-sm text-muted">
            Content is published by Baazex Academy. Live trading services, if used, sit on{' '}
            <a href={COMPANY_URL} className="font-semibold text-baazex">
              baazex.com
            </a>{' '}
            and are a separate decision.
          </p>
        </article>
      </div>
      <div className="mt-8 rounded-2xl border border-line bg-white p-5">
        <Disclaimer />
      </div>
      <p className="mt-6 text-sm">
        Ready to study? <Link to="/register" className="font-semibold text-baazex">Create a free account</Link>
      </p>
    </div>
  )
}
