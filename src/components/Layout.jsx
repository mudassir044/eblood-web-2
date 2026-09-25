import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Download, Menu, AlertTriangle, Phone, Mail, MessageCircle, MapPin, Heart } from 'lucide-react'
import { Link, useLocation } from 'react-router'
import { NAV, TICKER, LINKS, SOCIAL } from '../data/content'
import { usePrefs } from '../lib/prefs'
import { Logo, Magnetic, spring } from './ui'

export function Banner() {
  const { bannerClosed, set } = usePrefs()
  const items = [...TICKER, ...TICKER]
  return (
    <AnimatePresence initial={false}>
      {!bannerClosed && (
        <motion.aside
          aria-label="Important notice"
          initial={{ height: 0 }}
          animate={{ height: 'auto' }}
          exit={{ height: 0 }}
          className="group relative overflow-hidden bg-blood-deep text-white"
        >
          <div className="flex items-center gap-3 py-2 pr-2">
            <p className="sr-only">{TICKER.join(' ')}</p>
            <div className="flex-1 overflow-hidden whitespace-nowrap" aria-hidden="true">
              <div className="inline-flex animate-marquee gap-16 pl-6 text-sm font-semibold group-hover:[animation-play-state:paused]">
                {items.map((t, i) => (
                  <span key={i} className="inline-flex items-center gap-2">
                    {i % TICKER.length === 0 && <AlertTriangle className="size-4" />}
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <button onClick={() => set({ bannerClosed: true })} aria-label="Dismiss notice" className="flex size-10 shrink-0 items-center justify-center rounded-lg hover:bg-white/15">
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}

function useScrollSpy(ids, enabled) {
  const [active, setActive] = useState(ids[0])
  useEffect(() => {
    if (!enabled) return
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [ids, enabled])
  return active
}

const NAV_IDS = NAV.filter((n) => n.to.startsWith('/#')).map((n) => n.id)

export function Header() {
  const { pathname } = useLocation()
  const onHome = pathname === '/'
  const spied = useScrollSpy(NAV_IDS, onHome)
  const active = onHome ? spied : pathname.startsWith('/blog') ? 'blog' : null
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-ink/90 backdrop-blur-md">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5" aria-label="Eblood home">
          <Logo />
          <span className="text-xl font-extrabold tracking-wider">EBLOOD</span>
        </Link>

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-1 rounded-full border border-line/70 bg-surface/50 p-1">
            {NAV.map((n) => (
              <li key={n.id}>
                <Link to={n.to} aria-current={active === n.id ? 'page' : undefined} className="relative block rounded-full px-4 py-2 text-sm font-semibold text-soft transition-colors hover:text-fg">
                  {active === n.id && <motion.span layoutId="nav-pill" transition={spring} className="absolute inset-0 rounded-full bg-white/10" />}
                  <span className="relative">{n.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Magnetic href={LINKS.playStore} target="_blank" rel="noopener" className="hidden min-h-11 items-center gap-2 rounded-full bg-blood px-5 text-sm font-bold text-white shadow-lg shadow-blood/30 hover:bg-blood-deep sm:inline-flex">
            <Download className="size-4" aria-hidden="true" />
            Download App
          </Magnetic>
          <button onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="mobile-nav" aria-label="Menu" className="flex size-11 items-center justify-center rounded-xl border border-line md:hidden">
            {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav id="mobile-nav" aria-label="Mobile" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-line md:hidden">
            <ul className="flex flex-col gap-1 p-4">
              {NAV.map((n) => (
                <li key={n.id}>
                  <Link to={n.to} onClick={() => setOpen(false)} className="flex min-h-12 items-center rounded-xl px-4 text-lg font-semibold hover:bg-white/5">
                    {n.label}
                  </Link>
                </li>
              ))}
              <li>
                <a href={LINKS.playStore} target="_blank" rel="noopener" className="mt-2 flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blood font-bold">
                  <Download className="size-5" aria-hidden="true" /> Download App
                </a>
              </li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}

export function Footer() {
  const contact = [
    { icon: Phone, label: LINKS.phoneLabel, href: `tel:${LINKS.phone}` },
    { icon: Mail, label: LINKS.email, href: `mailto:${LINKS.email}` },
    { icon: MessageCircle, label: 'WhatsApp Us', href: `https://wa.me/${LINKS.whatsapp}` },
    { icon: MapPin, label: 'Pakistan' },
  ]
  return (
    <footer className="border-t border-line bg-black/40 px-4 pt-16 pb-28 sm:px-6">
      <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="flex flex-col gap-5">
          <Link to="/" className="flex items-center gap-2.5" aria-label="Eblood home">
            <Logo />
            <span className="text-xl font-extrabold tracking-wider">EBLOOD</span>
          </Link>
          <p className="max-w-sm leading-relaxed text-muted">Pakistan's first AI-powered blood donation app. Connecting donors and patients instantly through smart, location-based technology.</p>
          <ul className="flex flex-wrap gap-2">
            {SOCIAL.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={`Eblood on ${s.label} (opens in new tab)`} className="flex min-h-10 items-center rounded-full border border-line px-4 text-sm font-semibold text-soft hover:border-blood hover:text-fg">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-xs font-bold tracking-[0.16em]">CONTACT US</h2>
          <ul className="mt-5 flex flex-col gap-3">
            {contact.map(({ icon: Icon, label, href }) => (
              <li key={label}>
                {href ? (
                  <a href={href} className="flex min-h-10 items-center gap-3 text-soft hover:text-fg">
                    <Icon className="size-4 text-blood-soft" aria-hidden="true" /> {label}
                  </a>
                ) : (
                  <span className="flex min-h-10 items-center gap-3 text-soft">
                    <Icon className="size-4 text-blood-soft" aria-hidden="true" /> {label}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-xs font-bold tracking-[0.16em]">QUICK LINKS</h2>
          <ul className="mt-5 flex flex-col gap-3">
            {[...NAV, { id: 'download', label: 'Download App', to: '/#download' }].map((n) => (
              <li key={n.id}>
                <Link to={n.to} className="flex min-h-10 items-center text-soft hover:text-fg">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-14 flex max-w-7xl flex-col items-center justify-between gap-3 border-t border-line pt-6 text-sm text-muted sm:flex-row">
        <p className="text-center sm:text-left">
          © {new Date().getFullYear()} Eblood. All rights reserved. Made with <Heart className="inline size-4 -translate-y-px fill-blood text-blood" aria-label="love" /> in Pakistan
        </p>
        <p className="text-center sm:text-right">
          Developed by Muhammad Mudassir, Co-Founder &amp; CTO, SAM Life Savers <span className="mx-2 text-line">|</span> <span className="font-semibold text-blood-soft">#EbloodCares</span>
        </p>
      </div>
    </footer>
  )
}
