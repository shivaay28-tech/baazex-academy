import { Seo } from '@/components/Seo'
import { faqs } from '@/data/faqs'
import { useState } from 'react'

export function FaqPage() {
  const [open, setOpen] = useState<string | undefined>(faqs[0]?.id)

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Seo title="FAQ" description="Answers to common questions about Baazex Academy courses, quizzes, certificates, and educational boundaries." />
      <p className="text-xs font-bold tracking-[0.18em] text-baazex uppercase">Help</p>
      <h1 className="mt-2 text-4xl font-extrabold text-navy">Frequently asked questions</h1>
      <div className="mt-8 space-y-3">
        {faqs.map((item) => (
          <article key={item.id} className="rounded-2xl border border-line bg-white">
            <button
              type="button"
              className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-bold text-navy"
              onClick={() => setOpen((current) => (current === item.id ? undefined : item.id))}
              aria-expanded={open === item.id}
            >
              {item.question}
            </button>
            {open === item.id ? <p className="px-5 pb-5 text-sm leading-relaxed text-muted">{item.answer}</p> : null}
          </article>
        ))}
      </div>
    </div>
  )
}
