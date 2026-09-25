import { useEffect, useRef, useState } from 'react'
import { motion, animate, useInView, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'
import { spotlight } from '../lib/interaction'

export const spring = { type: 'spring', stiffness: 260, damping: 26 }

export function Logo({ className = 'size-9' }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <path d="M16 2S5 14 5 20.5a11 11 0 0 0 22 0C27 14 16 2 16 2z" fill="var(--color-blood)" />
      <path d="M16 12l-5 2v4c0 3.4 2.2 5.4 5 6 2.8-.6 5-2.6 5-6v-4l-5-2z" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  )
}

export function Reveal({ children, delay = 0, className, as = 'div' }) {
  const Tag = motion[as]
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ ...spring, delay }}
    >
      {children}
    </Tag>
  )
}

export function SectionHeading({ eyebrow, title, accent, sub, id }) {
  return (
    <Reveal className="mx-auto mb-14 flex max-w-2xl flex-col items-center gap-3.5 text-center">
      <p className="text-xs font-bold tracking-[0.16em] text-blood-soft">{eyebrow}</p>
      <h2 id={id} className="text-4xl font-extrabold tracking-tight text-balance md:text-5xl">
        {title} <span className="text-blood-soft">{accent}</span>
      </h2>
      {sub && <p className="text-lg leading-relaxed text-pretty text-muted">{sub}</p>}
    </Reveal>
  )
}

export function Card({ children, className = '' }) {
  return (
    <motion.div
      onPointerMove={spotlight}
      whileHover={{ y: -4 }}
      transition={spring}
      className={`spotlight rounded-3xl border border-line bg-surface transition-colors hover:border-blood/60 ${className}`}
    >
      {children}
    </motion.div>
  )
}

// Button that leans toward the cursor with spring physics
export function Magnetic({ as = 'a', className = '', strength = 0.25, children, ...props }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const x = useSpring(useMotionValue(0), { stiffness: 300, damping: 20 })
  const y = useSpring(useMotionValue(0), { stiffness: 300, damping: 20 })
  const Tag = motion[as]

  const move = (e) => {
    if (reduce || e.pointerType !== 'mouse') return
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - r.left - r.width / 2) * strength)
    y.set((e.clientY - r.top - r.height / 2) * strength)
  }
  const reset = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <Tag ref={ref} style={{ x, y }} onPointerMove={move} onPointerLeave={reset} whileTap={{ scale: 0.96 }} className={className} {...props}>
      {children}
    </Tag>
  )
}

export function CountUp({ value, suffix = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const reduce = useReducedMotion()
  const [n, setN] = useState(reduce ? value : 0)

  useEffect(() => {
    if (!inView || reduce) return
    const c = animate(0, value, { duration: 1.6, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setN(Math.round(v)) })
    return () => c.stop()
  }, [inView, value, reduce])

  return (
    <span ref={ref} className="tabular-nums">
      <span aria-hidden="true">
        {n.toLocaleString('en-US')}
        {suffix}
      </span>
      <span className="sr-only">
        {value.toLocaleString('en-US')}
        {suffix}
      </span>
    </span>
  )
}

export const btn = {
  primary:
    'inline-flex min-h-12 items-center justify-center gap-2.5 rounded-2xl bg-blood px-6 py-3.5 font-bold text-white shadow-lg shadow-blood/25 transition-colors hover:bg-blood-deep',
  ghost:
    'inline-flex min-h-12 items-center justify-center gap-2.5 rounded-2xl border border-line bg-surface px-6 py-3.5 font-semibold text-fg transition-colors hover:bg-surface-2',
}
