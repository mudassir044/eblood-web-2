import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, RotateCcw, Download, ClipboardCheck, Info } from 'lucide-react'
import { SectionHeading, Reveal, Magnetic, btn, spring } from '../components/ui'
import { haptic } from '../lib/interaction'
import { LINKS } from '../data/content'

/*
  60-second Readiness Check
  Converts a curious visitor into a committed donor with 4 taps.
  A filling drop visualises progress (goal-gradient effect), and every
  "not yet" answer gives a clear next step instead of a dead end.
*/

const QUESTIONS = [
  { q: 'Are you between 18 and 60 years old?', no: 'Donors in Pakistan are usually 18 to 60 years old. You can still help by sharing requests with your family and friends.' },
  { q: 'Do you weigh 50 kg or more?', no: 'Most blood banks need donors to weigh at least 50 kg. You can still register to help spread urgent requests.' },
  { q: 'Are you feeling healthy and well today?', no: 'Wait until you feel fully well, then take this check again. Your health comes first.' },
  { q: "Has it been 3 months or more since your last blood donation (or you've never donated)?", no: 'Your body needs at least 3 months to recover between whole blood donations. Come back when that time has passed.' },
]

export default function ReadinessCheck() {
  const [answers, setAnswers] = useState([])
  const i = answers.length
  const failed = answers.findIndex((a) => a === false)
  const finished = failed !== -1 || i === QUESTIONS.length
  const fill = (answers.filter(Boolean).length / QUESTIONS.length) * 100

  const answer = (yes) => {
    haptic(yes ? 10 : [10, 30, 10])
    setAnswers((a) => [...a, yes])
  }

  return (
    <section id="ready" aria-labelledby="ready-title" className="border-y border-line/60 bg-ink-2 px-4 py-24 sm:px-6 md:py-28">
      <SectionHeading id="ready-title" eyebrow="60-SECOND CHECK" title="Are You Ready to" accent="Donate?" sub="Four quick questions. No sign-up. Find out if you can become a donor today." />

      <Reveal className="mx-auto grid max-w-4xl items-center gap-10 rounded-[2rem] border border-line bg-surface/70 p-6 md:grid-cols-[180px_1fr] md:p-10">
        {/* Filling drop */}
        <div className="mx-auto" aria-hidden="true">
          <svg viewBox="0 0 100 130" className="w-32 md:w-40">
            <defs>
              <clipPath id="drop-clip">
                <path d="M50 4S10 52 10 80a40 40 0 0 0 80 0C90 52 50 4 50 4z" />
              </clipPath>
            </defs>
            <path d="M50 4S10 52 10 80a40 40 0 0 0 80 0C90 52 50 4 50 4z" fill="var(--color-ink)" stroke="var(--color-line)" strokeWidth="2" />
            <g clipPath="url(#drop-clip)">
              <motion.rect x="0" width="100" height="130" fill="var(--color-blood)" initial={{ y: 130 }} animate={{ y: 130 - (fill / 100) * 126 }} transition={{ type: 'spring', stiffness: 80, damping: 16 }} />
            </g>
          </svg>
          <p className="mt-2 text-center text-sm font-bold text-muted">{Math.round(fill)}% ready</p>
        </div>

        <div className="min-h-64" aria-live="polite">
          <AnimatePresence mode="wait">
            {!finished && (
              <motion.div key={i} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30, transition: { duration: 0.15 } }} transition={spring}>
                <p className="text-sm font-bold text-blood-soft">
                  Question {i + 1} of {QUESTIONS.length}
                </p>
                <h3 className="mt-2 text-2xl leading-snug font-bold md:text-3xl">{QUESTIONS[i].q}</h3>
                <div className="mt-7 grid grid-cols-2 gap-3">
                  <motion.button whileTap={{ scale: 0.95 }} onClick={() => answer(true)} className={btn.primary}>
                    <Check className="size-5" aria-hidden="true" /> Yes
                  </motion.button>
                  <motion.button whileTap={{ scale: 0.95 }} onClick={() => answer(false)} className={btn.ghost}>
                    <X className="size-5" aria-hidden="true" /> No
                  </motion.button>
                </div>
              </motion.div>
            )}

            {finished && failed === -1 && (
              <motion.div key="yes" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={spring}>
                <ClipboardCheck className="size-10 text-emerald-400" aria-hidden="true" />
                <h3 className="mt-3 text-3xl font-extrabold">You're likely ready to donate.</h3>
                <p className="mt-3 text-lg text-muted">One donation can help up to 3 patients. Register in the app so the next person who needs your group can find you.</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Magnetic href={LINKS.playStore} target="_blank" rel="noopener" className={btn.primary}>
                    <Download className="size-5" aria-hidden="true" /> Become a donor
                  </Magnetic>
                  <button onClick={() => setAnswers([])} className={btn.ghost}>
                    <RotateCcw className="size-4" aria-hidden="true" /> Start over
                  </button>
                </div>
              </motion.div>
            )}

            {finished && failed !== -1 && (
              <motion.div key="no" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={spring}>
                <h3 className="text-3xl font-extrabold">Not today, but you can still help.</h3>
                <p className="mt-3 text-lg text-muted">{QUESTIONS[failed].no}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a href={LINKS.playStore} target="_blank" rel="noopener" className={btn.primary}>
                    <Download className="size-5" aria-hidden="true" /> Get the app
                  </a>
                  <button onClick={() => setAnswers([])} className={btn.ghost}>
                    <RotateCcw className="size-4" aria-hidden="true" /> Start over
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <p className="mt-8 flex items-start gap-2 text-sm text-muted">
            <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            General guidance only. The blood bank does the final health screening before any donation.
          </p>
        </div>
      </Reveal>
    </section>
  )
}
