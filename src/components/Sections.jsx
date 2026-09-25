import { useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion'
import { MapPin, Siren, HeartHandshake, ShieldCheck, Heart, ArrowRight, Star, Download, Smartphone, Moon } from 'lucide-react'
import { FEATURES, STEPS, GUIDE, STATS, PARTNERS, STORIES, LINKS } from '../data/content'
import { SectionHeading, Reveal, Card, Magnetic, CountUp, btn, spring } from './ui'
import { useEmergency } from '../innovations/EmergencyMode'
import { usePrefs } from '../lib/prefs'

const wrap = 'mx-auto max-w-6xl'
const section = 'px-4 py-24 sm:px-6 md:py-28'
const alt = 'border-y border-line/60 bg-ink-2'

function TiltPhone({ src, alt: label }) {
  const reduce = useReducedMotion()
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 150, damping: 18 })
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), { stiffness: 150, damping: 18 })
  return (
    <motion.div
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== 'mouse') return
        const r = e.currentTarget.getBoundingClientRect()
        mx.set((e.clientX - r.left) / r.width - 0.5)
        my.set((e.clientY - r.top) / r.height - 0.5)
      }}
      onPointerLeave={() => {
        mx.set(0)
        my.set(0)
      }}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1000 }}
      className="relative mx-auto w-full max-w-[320px]"
    >
      <img src={src} alt={label} width="592" height="1280" className="aspect-[592/1280] w-full rounded-[2rem] border border-line object-cover shadow-[0_40px_100px_-20px_rgb(220_38_38/0.45)]" />
    </motion.div>
  )
}

export function Hero() {
  const openEmergency = useEmergency()
  const { daypart } = usePrefs()
  const night = daypart === 'night'

  return (
    <section id="home" className="px-4 pt-14 pb-24 sm:px-6 md:pt-20">
      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.15fr_1fr]">
        <div className="flex flex-col items-start gap-7">
          <Reveal>
            {night ? (
              <button onClick={openEmergency} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-calm/40 bg-calm/10 px-4 text-sm font-semibold text-sky-200 hover:bg-calm/20">
                <Moon className="size-4" aria-hidden="true" />
                Late-night emergency? Emergency Mode is one tap away
                <ArrowRight className="size-4" aria-hidden="true" />
              </button>
            ) : (
              <p className="inline-flex min-h-10 items-center gap-2 rounded-full border border-blood/40 bg-blood/10 px-4 text-sm font-semibold text-blood-soft">
                <MapPin className="size-4" aria-hidden="true" />
                Pakistan's #1 Blood Donation App
              </p>
            )}
          </Reveal>

          <Reveal delay={0.05} as="h1" className="text-5xl leading-[1.04] font-extrabold tracking-tight text-balance sm:text-6xl lg:text-7xl">
            Save Lives with a <span className="text-blood-soft">Single Tap</span>
          </Reveal>

          <Reveal delay={0.1} as="p" className="max-w-xl text-lg leading-relaxed text-muted">
            E Blood connects donors and patients instantly through AI-powered, location-based technology. Making blood donation faster, safer, and more accessible across Pakistan.
          </Reveal>

          {/* Intent split: route the two audiences in one tap */}
          <Reveal delay={0.15} className="grid w-full gap-3 sm:grid-cols-2">
            <Magnetic as="button" onClick={openEmergency} strength={0.15} className="group flex min-h-20 items-center gap-4 rounded-2xl bg-blood px-5 text-start text-white shadow-xl shadow-blood/30 hover:bg-blood-deep">
              <Siren className="size-7 shrink-0" aria-hidden="true" />
              <span>
                <span className="block text-lg font-extrabold">I need blood</span>
                <span className="block text-sm text-white/85">Guided help in 3 taps</span>
              </span>
            </Magnetic>
            <Magnetic href="#ready" strength={0.15} className="flex min-h-20 items-center gap-4 rounded-2xl border border-line bg-surface/70 px-5 hover:border-blood/60">
              <HeartHandshake className="size-7 shrink-0 text-blood-soft" aria-hidden="true" />
              <span>
                <span className="block text-lg font-extrabold">I want to donate</span>
                <span className="block text-sm text-muted">60-second readiness check</span>
              </span>
            </Magnetic>
          </Reveal>

          <Reveal delay={0.2}>
            <a href={LINKS.playStore} target="_blank" rel="noopener" className="inline-flex min-h-11 items-center gap-2 font-semibold text-soft underline-offset-4 hover:text-fg hover:underline">
              <Download className="size-4" aria-hidden="true" />
              Download on Google Play
            </a>
          </Reveal>

          <Reveal delay={0.25} as="dl" className="grid w-full max-w-lg grid-cols-3 gap-6 border-t border-line pt-7">
            {STATS.map((s) => (
              <div key={s.label} className="flex flex-col-reverse gap-1">
                <dt className="text-xs font-semibold tracking-[0.12em] text-muted uppercase">{s.label}</dt>
                <dd className="text-3xl font-extrabold sm:text-4xl">
                  <CountUp value={s.value} suffix={s.suffix} />
                </dd>
              </div>
            ))}
          </Reveal>
        </div>

        <div className="relative">
          <TiltPhone src="/images/blood-donor-is-one-step-away-from-you.jpg" alt="Eblood app: Blood donor is one step away from you" />
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...spring, delay: 0.6 }}
            className="absolute top-1/2 -left-6 hidden items-center gap-2 rounded-2xl border border-white/10 bg-ink/70 px-4 py-3 text-sm font-semibold shadow-xl sm:flex"
          >
            <ShieldCheck className="size-5 text-emerald-400" aria-hidden="true" />
            Always free. Never pay for blood.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...spring, delay: 0.8 }}
            className="absolute -right-4 bottom-24 hidden items-center gap-2 rounded-2xl border border-white/10 bg-ink/70 px-4 py-3 text-sm font-semibold shadow-xl sm:flex"
          >
            <MapPin className="size-5 text-blood-soft" aria-hidden="true" />
            Matched by blood group and location
          </motion.p>
        </div>
      </div>
    </section>
  )
}

export function Mission() {
  const cards = [
    { icon: ShieldCheck, title: 'Our Mission', body: 'To build a digital blood donation network that saves lives by instantly connecting donors and recipients across Pakistan. We leverage AI and location-based technology to make every second count in emergencies.' },
    { icon: Heart, title: 'Our Vision', body: 'A Pakistan where no life is lost due to lack of blood, powered by technology, community, and compassion. We envision a future where every patient finds a donor within minutes, regardless of location.' },
  ]
  return (
    <section id="about" className={section}>
      <SectionHeading eyebrow="WHO WE ARE" title="Our" accent="Mission & Vision" sub="Building a digital blood donation network powered by technology, community, and compassion." />
      <div className={`${wrap} grid gap-6 md:grid-cols-2`}>
        {cards.map(({ icon: Icon, title, body }, i) => (
          <Reveal key={title} delay={i * 0.08}>
            <Card className="flex h-full flex-col gap-4 p-8 md:p-10">
              <span className="flex size-14 items-center justify-center rounded-2xl bg-blood/15 text-blood-soft">
                <Icon className="size-7" aria-hidden="true" />
              </span>
              <h3 className="text-2xl font-bold">{title}</h3>
              <p className="leading-relaxed text-muted">{body}</p>
            </Card>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

export function About() {
  const flow = ['Recipient posts a request', 'Smart matching by blood group and location', 'Nearby donor accepts']
  return (
    <section className={`${section} ${alt}`}>
      <SectionHeading eyebrow="ABOUT EBLOOD" title="What is" accent="EBLOOD?" sub="EBLOOD is a source to save lives by facilitating a seamless connection between recipients and donors, when it is needed most during an emergency." />
      <Reveal className={`${wrap} flex flex-col items-center gap-10`}>
        <div className="w-full max-w-3xl rounded-3xl bg-white p-6 md:p-10">
          <img src="/images/navigation-mock.jpg" alt="Diagram: a recipient connected to nearby donors through Eblood" width="714" height="251" className="mx-auto w-full max-w-[714px]" />
        </div>
        <ol className="flex flex-col items-center gap-3 md:flex-row">
          {flow.map((f, i) => (
            <li key={f} className="flex items-center gap-3">
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ ...spring, delay: 0.2 + i * 0.25 }}
                className="flex min-h-12 items-center gap-2.5 rounded-full border border-line bg-surface px-5 font-semibold"
              >
                <span className="flex size-6 items-center justify-center rounded-full bg-blood text-xs font-extrabold">{i + 1}</span>
                {f}
              </motion.span>
              {i < flow.length - 1 && <ArrowRight className="hidden size-5 text-muted md:block" aria-hidden="true" />}
            </li>
          ))}
        </ol>
      </Reveal>
    </section>
  )
}

export function Features() {
  return (
    <section id="features" className={section}>
      <SectionHeading eyebrow="APP FEATURES" title="Everything You Need to" accent="Save Lives" sub="Powerful features designed to connect blood donors and recipients as quickly as possible." />
      <div className={`${wrap} grid gap-6 md:grid-cols-2`}>
        {FEATURES.map(({ icon: Icon, title, body }, i) => (
          <Reveal key={title} delay={(i % 2) * 0.08}>
            <Card className="flex h-full gap-6 p-8">
              <motion.span whileHover={{ rotate: -8, scale: 1.08 }} transition={spring} className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-blood text-white">
                <Icon className="size-7" aria-hidden="true" />
              </motion.span>
              <div>
                <h3 className="text-xl font-bold">{title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{body}</p>
              </div>
            </Card>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

export function HowItWorks() {
  return (
    <section id="how-it-works" className={`${section} ${alt}`}>
      <SectionHeading eyebrow="SIMPLE PROCESS" title="How" accent="Eblood Works" sub="Three simple steps to become a lifesaver." />
      <ol className={`${wrap} relative grid gap-6 md:grid-cols-3`}>
        <motion.span
          aria-hidden="true"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-[72px] right-[17%] left-[17%] hidden h-0.5 origin-left bg-blood/50 md:block"
        />
        {STEPS.map((s, i) => (
          <Reveal as="li" key={s.title} delay={i * 0.12}>
            <Card className="flex h-full flex-col items-center gap-4 p-8 text-center">
              <span className="flex size-16 items-center justify-center rounded-full bg-blood text-2xl font-extrabold ring-8 ring-blood/15">{i + 1}</span>
              <h3 className="mt-2 text-xl font-bold">{s.title}</h3>
              <p className="leading-relaxed text-muted">{s.body}</p>
            </Card>
          </Reveal>
        ))}
      </ol>
    </section>
  )
}

function Callout({ item, side, i }) {
  const right = side === 'right'
  return (
    <Reveal delay={i * 0.06} as="li" className={`flex items-center gap-4 ${right ? '' : 'lg:flex-row-reverse lg:text-right'}`}>
      <span aria-hidden="true" className="hidden items-center lg:flex">
        <span className="size-3 rounded-full bg-blood-soft ring-4 ring-blood/20" />
        <span className={`h-0.5 w-14 bg-blood/50 ${right ? '' : 'order-first'}`} />
      </span>
      <div className="rounded-2xl border border-line bg-surface/60 p-4 lg:border-0 lg:bg-transparent lg:p-0">
        <h3 className="text-lg font-bold">{item.title}</h3>
        <p className="text-sm leading-relaxed text-muted">{item.body}</p>
      </div>
    </Reveal>
  )
}

export function Guide() {
  return (
    <section className={section} aria-labelledby="guide-title">
      <SectionHeading id="guide-title" eyebrow="USER GUIDE" title="Explore the" accent="App Interface" sub="Get familiar with every feature of the Eblood app. Here's your complete guide to the interface." />
      <div className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-[1fr_340px_1fr]">
        <ul className="order-2 flex flex-col gap-4 lg:order-1 lg:gap-14">
          {GUIDE.left.map((item, i) => (
            <Callout key={item.title} item={item} side="left" i={i} />
          ))}
        </ul>
        <div className="order-1 lg:order-2">
          <TiltPhone src="/images/app-mock-home.jpg" alt="Eblood app home screen" />
        </div>
        <ul className="order-3 flex flex-col gap-4 lg:gap-10">
          {GUIDE.right.map((item, i) => (
            <Callout key={item.title} item={item} side="right" i={i} />
          ))}
        </ul>
      </div>
    </section>
  )
}

export function Impact() {
  return (
    <section className={`${section} ${alt}`}>
      <SectionHeading eyebrow="OUR IMPACT" title="Making a" accent="Real Difference" sub="Every number represents a life touched by the Eblood community." />
      <dl className={`${wrap} grid gap-6 md:grid-cols-3`}>
        {STATS.map(({ icon: Icon, value, suffix, label }, i) => (
          <Reveal key={label} delay={i * 0.08}>
            <Card className="flex items-center gap-6 p-8">
              <span className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-blood">
                <Icon className="size-8" aria-hidden="true" />
              </span>
              <div className="flex flex-col-reverse gap-1">
                <dt className="text-xs font-semibold tracking-[0.12em] text-muted uppercase">{label}</dt>
                <dd className="text-5xl leading-none font-extrabold">
                  <CountUp value={value} suffix={suffix} />
                </dd>
              </div>
            </Card>
          </Reveal>
        ))}
      </dl>
    </section>
  )
}

export function Partners() {
  return (
    <section className={`${section} ${alt}`}>
      <SectionHeading eyebrow="OUR ALLIES" title="Supporting" accent="Partners" sub="We're proud to collaborate with organizations that share our vision of saving lives through technology and community." />
      <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
        {PARTNERS.map((p, i) => (
          <Reveal as="li" key={p.name} delay={i * 0.05} className="flex flex-col items-center gap-3">
            <motion.div whileHover={{ y: -6, rotate: -1.5 }} transition={spring} className="flex aspect-square w-full items-center justify-center rounded-3xl bg-white p-4">
              <img src={p.src} alt={`${p.name} logo`} loading="lazy" className="size-full object-contain" />
            </motion.div>
            <span className="text-center text-sm font-semibold text-soft">{p.name}</span>
          </Reveal>
        ))}
      </ul>
    </section>
  )
}

function Story({ s, i }) {
  const [open, setOpen] = useState(false)
  return (
    <Reveal as="li" delay={i * 0.08}>
      <Card className="flex h-full flex-col gap-5 p-8">
        <div className="flex gap-1 text-amber-400" role="img" aria-label="Rated 5 out of 5">
          {Array.from({ length: 5 }, (_, k) => (
            <Star key={k} className="size-5 fill-current" aria-hidden="true" />
          ))}
        </div>
        <blockquote className={`flex-1 text-lg leading-relaxed text-soft ${open ? '' : 'line-clamp-3'}`}>"{s.quote}"</blockquote>
        <button onClick={() => setOpen((o) => !o)} aria-expanded={open} className="self-start text-sm font-bold text-blood-soft hover:underline">
          {open ? 'Show less' : 'Read more'}
        </button>
        <div className="flex items-center gap-3 border-t border-line pt-5">
          <span className="flex size-11 items-center justify-center rounded-full bg-blood text-lg font-extrabold" aria-hidden="true">
            {s.name[0]}
          </span>
          <span>
            <span className="block font-bold">{s.name}</span>
            <span className="block text-sm text-muted">{s.city}, Pakistan</span>
          </span>
        </div>
      </Card>
    </Reveal>
  )
}

export function Stories() {
  return (
    <section id="reviews" className={section}>
      <SectionHeading eyebrow="USER STORIES" title="Real Stories," accent="Real Lives Saved" sub="Hear from the people whose lives were changed by the Eblood community." />
      <ul className={`${wrap} grid gap-6 md:grid-cols-3`}>
        {STORIES.map((s, i) => (
          <Story key={s.name} s={s} i={i} />
        ))}
      </ul>
    </section>
  )
}

export function CTA() {
  return (
    <section id="download" className="px-4 py-20 sm:px-6">
      <Reveal className="relative mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] border border-blood-deep bg-[#7f1d1d] px-6 py-16 text-center md:px-16 md:py-20">
        <motion.svg
          viewBox="0 0 32 32"
          aria-hidden="true"
          className="absolute -top-10 -right-20 size-[420px] text-white/10"
          animate={{ y: [0, -14, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <path d="M16 2S5 14 5 20.5a11 11 0 0 0 22 0C27 14 16 2 16 2z" fill="currentColor" />
        </motion.svg>
        <h2 className="relative text-4xl font-extrabold tracking-tight md:text-6xl">
          Ready to <span className="text-red-200">Save Lives?</span>
        </h2>
        <p className="relative mx-auto mt-5 max-w-2xl text-lg text-red-50">Download Eblood today and join Pakistan's largest blood donation community. Your one donation can save up to three lives.</p>
        <div className="relative mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Magnetic href={LINKS.playStore} target="_blank" rel="noopener" className="flex min-h-16 min-w-56 items-center gap-3 rounded-2xl border border-white/15 bg-ink px-6 text-start">
            <Download className="size-7" aria-hidden="true" />
            <span>
              <span className="block text-xs tracking-wider text-soft">GET IT ON</span>
              <span className="block text-xl font-bold">Google Play</span>
            </span>
          </Magnetic>
          <p className="flex min-h-16 min-w-56 items-center gap-3 rounded-2xl border border-dashed border-red-300/60 bg-black/30 px-6 text-start">
            <Smartphone className="size-7" aria-hidden="true" />
            <span>
              <span className="block text-xs tracking-wider text-red-100">COMING SOON ON</span>
              <span className="block text-xl font-bold">App Store</span>
            </span>
          </p>
        </div>
      </Reveal>
    </section>
  )
}
