export function PhotoBanner({
  image,
  alt,
  eyebrow,
  title,
  text,
}: {
  image: string
  alt: string
  eyebrow?: string
  title: string
  text?: string
}) {
  return (
    <section className="relative isolate overflow-hidden border-b border-white/10 bg-navy">
      <img src={image} alt={alt} className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-linear-to-r from-navy via-navy/85 to-navy/25" />
      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        {eyebrow ? <p className="text-xs font-bold tracking-[0.18em] text-bright uppercase">{eyebrow}</p> : null}
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold text-white sm:text-5xl">{title}</h1>
        {text ? <p className="mt-4 max-w-2xl text-sm leading-relaxed text-mist/80 sm:text-base">{text}</p> : null}
      </div>
    </section>
  )
}
