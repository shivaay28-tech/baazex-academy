import { media } from '@/data/media'

export function HeroVisual() {
  return (
    <div className="relative mx-auto w-full min-w-0 max-w-lg">
      <div className="relative overflow-hidden rounded-3xl shadow-float">
        <img
          src={media.hero}
          alt="A night trading desk with monitors showing market charts"
          className="aspect-[4/3] w-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-navy via-navy/25 to-navy/10" />
        <div className="absolute inset-x-0 bottom-0 p-4 text-mist sm:p-5">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] font-bold tracking-[0.16em] text-bright uppercase">Learning desk</p>
              <p className="mt-1 text-sm font-semibold text-white">Market literacy, not trade calls</p>
            </div>
            <span className="shrink-0 rounded-full bg-white/15 px-2.5 py-1 text-[11px] text-white">Education</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Modules', value: '8' },
              { label: 'Avg. lesson', value: '14m' },
              { label: 'Pass mark', value: '70%' },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl bg-white/10 p-3 backdrop-blur-sm">
                <p className="text-[11px] text-mist/70">{item.label}</p>
                <p className="mt-1 text-lg font-bold text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
