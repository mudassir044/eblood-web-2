import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Share2, Droplet } from 'lucide-react'
import { GROUPS, CAN_GIVE_TO, canReceiveFrom } from '../lib/blood'
import { SectionHeading, Reveal, spring, Magnetic, btn } from '../components/ui'
import { haptic, share } from '../lib/interaction'
import { LINKS } from '../data/content'

/*
  Compatibility Constellation
  Turns "what's my blood group worth?" into a personal, visual answer.
  Pick a group, watch the lines reach every person you could save,
  then share a Lifeline Card: the donor recruitment growth loop.
*/

const SIZE = 400
const C = SIZE / 2
const R = 150
const pos = (i) => {
  const a = (i / GROUPS.length) * Math.PI * 2 - Math.PI / 2
  return { x: C + R * Math.cos(a), y: C + R * Math.sin(a) }
}

export default function Constellation() {
  const [group, setGroup] = useState('O+')
  const [mode, setMode] = useState('give')
  const targets = mode === 'give' ? CAN_GIVE_TO[group] : canReceiveFrom(group)
  const from = pos(GROUPS.indexOf(group))

  const headline =
    mode === 'give'
      ? targets.length === 8
        ? `${group} can give to every blood group. You're a universal donor.`
        : `${group} blood can reach ${targets.length} of 8 blood groups.`
      : targets.length === 8
        ? `${group} can receive from every blood group.`
        : `${group} patients depend on ${targets.length} donor group${targets.length > 1 ? 's' : ''}.`

  const cardText = `I'm a ${group} blood donor. My blood can reach ${CAN_GIVE_TO[group].length} of 8 blood groups. Join me on Eblood and be someone's lifeline.`

  return (
    <section id="compatibility" aria-labelledby="constellation-title" className="px-4 py-24 sm:px-6 md:py-28">
      <SectionHeading
        id="constellation-title"
        eyebrow="YOUR BLOOD, YOUR REACH"
        title="Who Can Your"
        accent="Blood Save?"
        sub="Pick your blood group and see exactly who you could help. Most people have never seen this."
      />

      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        <Reveal className="flex flex-col items-center gap-6">
          <div role="radiogroup" aria-label="Show compatibility" className="inline-flex rounded-2xl border border-line bg-surface p-1">
            {[
              ['give', 'I can give to'],
              ['receive', 'I can receive from'],
            ].map(([k, label]) => (
              <button
                key={k}
                role="radio"
                aria-checked={mode === k}
                onClick={() => setMode(k)}
                className="relative min-h-11 rounded-xl px-5 text-sm font-bold"
              >
                {mode === k && <motion.span layoutId="mode-pill" transition={spring} className="absolute inset-0 rounded-xl bg-blood" />}
                <span className="relative">{label}</span>
              </button>
            ))}
          </div>

          <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full max-w-[420px]" role="img" aria-label={headline}>
            <circle cx={C} cy={C} r={R} fill="none" stroke="var(--color-line)" strokeDasharray="4 8" />
            {GROUPS.map((g, i) => {
              if (!targets.includes(g) || g === group) return null
              const to = pos(i)
              const [a, b] = mode === 'give' ? [from, to] : [to, from]
              return (
                <motion.path
                  key={`${group}-${mode}-${g}`}
                  d={`M${a.x} ${a.y} Q${C} ${C} ${b.x} ${b.y}`}
                  fill="none"
                  stroke="var(--color-blood)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.85 }}
                  transition={{ duration: 0.7, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                />
              )
            })}
            <AnimatePresence>
              <motion.circle key={group} cx={from.x} cy={from.y} r="44" fill="var(--color-blood)" initial={{ opacity: 0.5, scale: 0.6 }} animate={{ opacity: 0, scale: 1.6 }} transition={{ duration: 1 }} style={{ transformOrigin: `${from.x}px ${from.y}px` }} />
            </AnimatePresence>
            {GROUPS.map((g, i) => {
              const p = pos(i)
              const self = g === group
              const hit = targets.includes(g)
              return (
                <g key={g}>
                  <circle cx={p.x} cy={p.y} r={self ? 34 : 28} style={{ transition: 'fill 0.25s, stroke 0.25s' }} fill={self ? 'var(--color-blood)' : hit ? 'var(--color-surface-2)' : 'var(--color-ink)'} stroke={hit || self ? 'var(--color-blood-soft)' : 'var(--color-line)'} strokeWidth="2" />
                  <text x={p.x} y={p.y + 6} textAnchor="middle" fontSize="17" fontWeight="800" fill={hit || self ? '#fff' : 'var(--color-muted)'}>
                    {g}
                  </text>
                </g>
              )
            })}
            <text x={C} y={C - 4} textAnchor="middle" fontSize="44" fontWeight="800" fill="#fff">
              {targets.length}
            </text>
            <text x={C} y={C + 22} textAnchor="middle" fontSize="13" fontWeight="600" fill="var(--color-muted)">
              of 8 groups
            </text>
          </svg>

          <div className="grid grid-cols-4 gap-2" role="radiogroup" aria-label="Your blood group">
            {GROUPS.map((g) => (
              <motion.button
                key={g}
                role="radio"
                aria-checked={group === g}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  haptic(8)
                  setGroup(g)
                }}
                className={`min-h-12 min-w-16 rounded-xl border text-base font-extrabold transition-colors ${group === g ? 'border-blood bg-blood text-white' : 'border-line bg-surface hover:border-blood/60'}`}
              >
                {g}
              </motion.button>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.1} className="flex flex-col gap-6">
          <p aria-live="polite" className="text-3xl leading-tight font-extrabold text-balance md:text-4xl">
            {headline}
          </p>
          <p className="text-lg leading-relaxed text-muted">
            {mode === 'give'
              ? 'Every donation is separated into parts that can help up to three patients. Your group decides who those patients can be.'
              : 'When a patient needs blood, only these donor groups are safe. That is why every registered donor matters.'}
          </p>

          {/* Lifeline Card: shareable identity artifact */}
          <motion.div
            key={group}
            initial={{ rotateX: -12, opacity: 0, y: 12 }}
            animate={{ rotateX: 0, opacity: 1, y: 0 }}
            transition={spring}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-blood-deep to-[#4c0d0d] p-7 shadow-2xl shadow-blood/20"
            style={{ transformPerspective: 800 }}
          >
            <Droplet className="absolute -top-6 -right-6 size-40 text-white/10" aria-hidden="true" />
            <p className="text-xs font-bold tracking-[0.2em] text-white/80">EBLOOD LIFELINE CARD</p>
            <div className="mt-3 flex items-end gap-4">
              <span className="text-7xl leading-none font-extrabold">{group}</span>
              <span className="pb-2 text-base font-semibold text-white/90">
                Can reach {CAN_GIVE_TO[group].length} of 8 blood groups
              </span>
            </div>
            <p className="mt-4 text-sm text-white/85">One donation can help up to 3 patients. Always free.</p>
          </motion.div>

          <Magnetic as="button" onClick={() => share({ title: 'My Eblood Lifeline Card', text: cardText, url: LINKS.site })} className={`${btn.primary} self-start`}>
            <Share2 className="size-5" aria-hidden="true" />
            Share my Lifeline Card
          </Magnetic>
        </Reveal>
      </div>
    </section>
  )
}
