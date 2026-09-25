import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { SLIDES } from '../data/content'
import { SectionHeading } from './ui'
import { haptic } from '../lib/interaction'

const GAP = 20

// Swipeable, keyboard-driven carousel. No autoplay: moving content
// is a WCAG 2.2.2 issue and steals attention during emergencies.
export default function Preview() {
  const viewport = useRef(null)
  const [width, setWidth] = useState(1116)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width))
    ro.observe(viewport.current)
    return () => ro.disconnect()
  }, [])

  const perView = width >= 1024 ? 4 : width >= 600 ? 2 : 1
  const card = (width - GAP * (perView - 1)) / perView
  const max = SLIDES.length - perView
  const go = (i) => {
    const next = Math.max(0, Math.min(max, i))
    if (next !== index) haptic(6)
    setIndex(next)
  }

  useEffect(() => {
    if (index > max) setIndex(Math.max(0, max))
  }, [max, index])

  return (
    <section className="px-4 py-24 sm:px-6 md:py-28" aria-labelledby="preview-title">
      <SectionHeading id="preview-title" eyebrow="APP PREVIEW" title="See" accent="Eblood in Action" sub="Follow the journey from splash screen to saving lives. Here's how Eblood guides you step by step." />

      <div
        className="mx-auto max-w-6xl"
        role="region"
        aria-roledescription="carousel"
        aria-label="App screens"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') go(index + 1)
          if (e.key === 'ArrowLeft') go(index - 1)
        }}
      >
        <div ref={viewport} className="overflow-hidden">
          <motion.ul
            className="flex cursor-grab active:cursor-grabbing"
            style={{ gap: GAP }}
            drag="x"
            dragConstraints={{ left: -max * (card + GAP), right: 0 }}
            dragElastic={0.12}
            onDragEnd={(_, info) => {
              const shift = Math.round(-info.offset.x / (card + GAP) - Math.sign(info.velocity.x) * Math.min(1, Math.abs(info.velocity.x) / 800))
              go(index + shift)
            }}
            animate={{ x: -index * (card + GAP) }}
            transition={{ type: 'spring', stiffness: 260, damping: 32 }}
          >
            {SLIDES.map((s, i) => (
              <li key={s.src} style={{ width: card }} className="shrink-0" aria-roledescription="slide" aria-label={`${i + 1} of ${SLIDES.length}`}>
                <motion.img
                  src={s.src}
                  alt={s.caption}
                  loading="lazy"
                  draggable="false"
                  width="592"
                  height="1280"
                  animate={{ opacity: i >= index && i < index + perView ? 1 : 0.35, scale: i >= index && i < index + perView ? 1 : 0.94 }}
                  className="aspect-[592/1280] w-full rounded-3xl border border-line object-cover select-none"
                />
                <p className="mt-3 px-2 text-center text-sm text-muted">{s.caption}</p>
              </li>
            ))}
          </motion.ul>
        </div>

        <div className="mt-8 flex items-center justify-center gap-5">
          <button onClick={() => go(index - 1)} disabled={index === 0} aria-label="Previous screens" className="flex size-12 items-center justify-center rounded-full border border-line bg-surface hover:border-blood disabled:opacity-35">
            <ChevronLeft className="size-5" aria-hidden="true" />
          </button>
          <div className="flex gap-2">
            {Array.from({ length: max + 1 }, (_, i) => (
              <button key={i} onClick={() => go(i)} aria-label={`Go to position ${i + 1}`} aria-current={i === index} className="flex h-8 items-center">
                <motion.span animate={{ width: i === index ? 28 : 8, backgroundColor: i === index ? 'var(--color-blood)' : 'var(--color-line)' }} className="block h-2 rounded-full" />
              </button>
            ))}
          </div>
          <button onClick={() => go(index + 1)} disabled={index === max} aria-label="Next screens" className="flex size-12 items-center justify-center rounded-full border border-line bg-surface hover:border-blood disabled:opacity-35">
            <ChevronRight className="size-5" aria-hidden="true" />
          </button>
        </div>
        <p className="sr-only" aria-live="polite">
          Showing screens {index + 1} to {index + perView} of {SLIDES.length}
        </p>
      </div>
    </section>
  )
}
