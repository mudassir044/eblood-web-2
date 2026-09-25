import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useScroll, useSpring, useMotionValue, useReducedMotion } from 'framer-motion'
import { Accessibility, Contrast, Type, Wind, Languages, X } from 'lucide-react'
import { usePrefs } from '../lib/prefs'
import { haptic } from '../lib/interaction'

/*
  Ambient layer
  - AmbientLight: a soft blood-red glow that follows the cursor with spring lag
    and dims itself at night (time-of-day aware, set in prefs.jsx)
  - LifelineProgress: scroll progress drawn as a filling vein
  - AccessDock: instant high contrast, text size, calm motion, Urdu
*/

export function AmbientLight() {
  const reduce = useReducedMotion()
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const x = useSpring(mx, { stiffness: 40, damping: 20 })
  const y = useSpring(my, { stiffness: 40, damping: 20 })

  useEffect(() => {
    if (reduce || !window.matchMedia('(pointer: fine)').matches) return
    const move = (e) => {
      mx.set((e.clientX / window.innerWidth - 0.5) * 240)
      my.set((e.clientY / window.innerHeight - 0.5) * 160)
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => window.removeEventListener('pointermove', move)
  }, [reduce, mx, my])

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <motion.div
        style={{ x, y, opacity: 'var(--glow)' }}
        className="absolute top-[-20%] right-[-10%] size-[900px] rounded-full bg-[radial-gradient(circle,var(--color-blood)_0%,transparent_65%)] will-change-transform"
      />
      <div style={{ opacity: 'var(--glow-2)' }} className="absolute -bottom-40 -left-40 size-[700px] rounded-full bg-[radial-gradient(circle,#7f1d1d_0%,transparent_70%)]" />
    </div>
  )
}

export function LifelineProgress() {
  const { scrollYProgress } = useScroll()
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })
  return (
    <div aria-hidden="true" className="fixed top-1/2 right-3 z-40 hidden h-[40vh] w-1 -translate-y-1/2 rounded-full bg-line/60 lg:block">
      <motion.div style={{ scaleY }} className="h-full w-full origin-top rounded-full bg-gradient-to-b from-blood-soft to-blood" />
    </div>
  )
}

const TEXT_STEPS = [
  ['md', 'A'],
  ['lg', 'A+'],
  ['xl', 'A++'],
]

export function AccessDock() {
  const p = usePrefs()
  const [open, setOpen] = useState(false)

  const Toggle = ({ on, onClick, icon: Icon, label, hint }) => (
    <button role="switch" aria-checked={on} onClick={() => { haptic(8); onClick() }} className="flex min-h-14 w-full items-center gap-3 rounded-2xl px-3 text-start hover:bg-white/5">
      <Icon className="size-5 shrink-0 text-blood-soft" aria-hidden="true" />
      <span className="flex-1">
        <span className="block font-bold">{label}</span>
        <span className="block text-sm text-muted">{hint}</span>
      </span>
      <span className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${on ? 'bg-blood' : 'bg-line'}`}>
        <motion.span layout transition={{ type: 'spring', stiffness: 500, damping: 30 }} className={`absolute top-1 size-5 rounded-full bg-white ${on ? 'right-1' : 'left-1'}`} />
      </span>
    </button>
  )

  return (
    <div className="fixed bottom-4 left-4 z-50 sm:bottom-6 sm:left-6">
      <AnimatePresence>
        {open && (
          <motion.div
            id="access-panel"
            role="dialog"
            aria-label="Accessibility settings"
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}
            className="absolute bottom-16 left-0 w-[min(340px,calc(100vw-2rem))] origin-bottom-left rounded-3xl border border-line bg-surface/95 p-3 shadow-2xl"
          >
            <div className="flex items-center justify-between px-3 pt-1 pb-2">
              <p className="font-extrabold">Make it easier</p>
              <button onClick={() => setOpen(false)} aria-label="Close accessibility settings" className="flex size-10 items-center justify-center rounded-xl hover:bg-white/5">
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>
            <Toggle on={p.contrast === 'high'} onClick={() => p.set({ contrast: p.contrast === 'high' ? 'normal' : 'high' })} icon={Contrast} label="High contrast" hint="Pure black and white, bolder red" />
            <Toggle on={p.calm} onClick={() => p.set({ calm: !p.calm })} icon={Wind} label="Calm motion" hint="Stops animation and movement" />
            <Toggle on={p.lang === 'ur'} onClick={() => p.set({ lang: p.lang === 'ur' ? 'en' : 'ur' })} icon={Languages} label="Emergency in Urdu" hint="اردو میں ایمرجنسی مدد" />
            <div className="flex min-h-14 items-center gap-3 px-3">
              <Type className="size-5 shrink-0 text-blood-soft" aria-hidden="true" />
              <span className="flex-1 font-bold" id="text-size-label">
                Text size
              </span>
              <div role="radiogroup" aria-labelledby="text-size-label" className="flex rounded-xl border border-line p-1">
                {TEXT_STEPS.map(([k, l]) => (
                  <button key={k} role="radio" aria-checked={p.text === k} onClick={() => p.set({ text: k })} className={`min-h-9 min-w-11 rounded-lg px-2 text-sm font-extrabold ${p.text === k ? 'bg-blood text-white' : 'text-muted hover:text-fg'}`}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="access-panel"
        aria-label="Accessibility settings"
        whileTap={{ scale: 0.92 }}
        className="flex size-14 items-center justify-center rounded-full border border-line bg-surface/90 shadow-xl hover:border-blood/60"
      >
        <Accessibility className="size-6" aria-hidden="true" />
      </motion.button>
    </div>
  )
}
