import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, ArrowRight, ChevronLeft, MessageCircle, Phone, Download, Share2, Check, Siren, Languages } from 'lucide-react'
import { GROUPS, canReceiveFrom } from '../lib/blood'
import { CITIES, LINKS } from '../data/content'
import { usePrefs } from '../lib/prefs'
import { haptic, share } from '../lib/interaction'

/*
  Emergency Mode
  A panic-proof path for someone who needs blood right now.
  - One decision per screen, huge targets, auto-advance on tap
  - Forces high contrast and calm motion while open
  - Paced breathing ring as an ambient stress regulator
  - Bilingual: English / Urdu with RTL
  - Ends in a ready-to-send request, not a form submission
*/

const T = {
  en: {
    title: 'Need blood now?',
    calm: 'Breathe with the circle. We will do this together.',
    step: (n) => `Step ${n} of 3`,
    q1: 'Which blood group does the patient need?',
    unsure: 'Not sure yet',
    donors: 'These donor groups can help:',
    q2: 'Which city is the patient in?',
    other: 'Other city',
    otherPh: 'Type city name',
    q3: 'How urgent is it?',
    urgency: { now: 'Right now', today: 'Today', week: 'This week' },
    ready: 'Your request is ready',
    wa: 'Send to Eblood on WhatsApp',
    call: 'Call Eblood',
    app: 'Post it in the Eblood app',
    shareMine: 'Share with my contacts',
    wait: 'While you wait',
    checklist: [
      "Keep the hospital's blood request slip ready",
      "Confirm the hospital blood bank's location",
      'Ask family and friends with a matching group',
    ],
    free: 'Blood donation is always free. Never pay anyone for blood.',
    back: 'Back',
    close: 'Close emergency mode',
    msg: (g, c, u) => `URGENT: ${g} blood needed in ${c} (${u}). Please help. Sent via Eblood.`,
    anyGroup: 'Any group',
  },
  ur: {
    title: 'ابھی خون چاہیے؟',
    calm: 'دائرے کے ساتھ آہستہ سانس لیں۔ ہم مل کر یہ کریں گے۔',
    step: (n) => `مرحلہ ${n} از 3`,
    q1: 'مریض کو کون سا بلڈ گروپ چاہیے؟',
    unsure: 'ابھی معلوم نہیں',
    donors: 'یہ ڈونر گروپ مدد کر سکتے ہیں:',
    q2: 'مریض کس شہر میں ہے؟',
    other: 'دوسرا شہر',
    otherPh: 'شہر کا نام لکھیں',
    q3: 'کتنی جلدی چاہیے؟',
    urgency: { now: 'ابھی فوراً', today: 'آج', week: 'اس ہفتے' },
    ready: 'آپ کی درخواست تیار ہے',
    wa: 'واٹس ایپ پر ای بلڈ کو بھیجیں',
    call: 'ای بلڈ کو کال کریں',
    app: 'ای بلڈ ایپ میں درخواست دیں',
    shareMine: 'اپنے رابطوں کو بھیجیں',
    wait: 'انتظار کے دوران',
    checklist: [
      'ہسپتال کی خون کی درخواست والی پرچی تیار رکھیں',
      'ہسپتال کے بلڈ بینک کا پتہ کنفرم کریں',
      'ملتے بلڈ گروپ والے رشتہ داروں اور دوستوں سے پوچھیں',
    ],
    free: 'خون کا عطیہ ہمیشہ مفت ہے۔ خون کے لیے کسی کو پیسے نہ دیں۔',
    back: 'واپس',
    close: 'ایمرجنسی موڈ بند کریں',
    msg: (g, c, u) => `فوری ضرورت: ${c} میں ${g} خون چاہیے (${u})۔ براہ کرم مدد کریں۔ ای بلڈ کے ذریعے۔`,
    anyGroup: 'کوئی بھی گروپ',
  },
}

const EmergencyContext = createContext(() => {})
export const useEmergency = () => useContext(EmergencyContext)

export function EmergencyProvider({ children }) {
  const [open, setOpen] = useState(false)
  const openMode = useCallback(() => {
    haptic([20, 40, 20])
    setOpen(true)
  }, [])
  return (
    <EmergencyContext.Provider value={openMode}>
      {children}
      <AnimatePresence>{open && <EmergencyDialog onClose={() => setOpen(false)} />}</AnimatePresence>
    </EmergencyContext.Provider>
  )
}

const slide = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 320, damping: 30 } },
  exit: { opacity: 0, x: -40, transition: { duration: 0.15 } },
}

function EmergencyDialog({ onClose }) {
  const { lang, set, setEmergencyContrast } = usePrefs()
  const t = T[lang]
  const rtl = lang === 'ur'
  const [step, setStep] = useState(0)
  const [group, setGroup] = useState(null)
  const [city, setCity] = useState('')
  const [other, setOther] = useState('')
  const [urgency, setUrgency] = useState(null)
  const [done, setDone] = useState([])
  const dialogRef = useRef(null)
  const headingRef = useRef(null)
  const returnFocus = useRef(document.activeElement)

  useEffect(() => {
    setEmergencyContrast(true)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const focusBack = returnFocus.current
    return () => {
      setEmergencyContrast(false)
      document.body.style.overflow = prev
      focusBack?.focus?.()
    }
  }, [setEmergencyContrast])

  useEffect(() => {
    headingRef.current?.focus()
  }, [step])

  const onKeyDown = (e) => {
    if (e.key === 'Escape') onClose()
    if (e.key !== 'Tab') return
    const nodes = dialogRef.current.querySelectorAll('button, a[href], input')
    const first = nodes[0]
    const last = nodes[nodes.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }

  const advance = (fn) => {
    haptic()
    fn()
    setTimeout(() => setStep((s) => s + 1), 220)
  }

  const groupLabel = group === 'unknown' ? t.anyGroup : group
  const urgencyLabel = urgency ? t.urgency[urgency] : ''
  const message = t.msg(groupLabel, city, urgencyLabel)
  const donors = group && group !== 'unknown' ? canReceiveFrom(group) : []

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-stretch justify-center bg-black/95 sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="em-title"
        dir={rtl ? 'rtl' : 'ltr'}
        onKeyDown={onKeyDown}
        initial={{ scale: 0.96, y: 24 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.98, y: 12 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`relative w-full max-w-2xl overflow-y-auto border-white bg-black px-5 pt-5 pb-8 text-white sm:max-h-[92vh] sm:rounded-3xl sm:border-2 sm:px-10 ${rtl ? 'urdu' : ''}`}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {step > 0 && (
              <button onClick={() => setStep((s) => s - 1)} className="flex min-h-12 items-center gap-1 rounded-xl px-3 font-bold text-white hover:bg-white/10">
                <ChevronLeft className={`size-5 ${rtl ? 'rotate-180' : ''}`} aria-hidden="true" />
                {t.back}
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => set({ lang: rtl ? 'en' : 'ur' })}
              className="flex min-h-12 items-center gap-2 rounded-xl border border-white/40 px-4 font-bold hover:bg-white/10"
              lang={rtl ? 'en' : 'ur'}
            >
              <Languages className="size-5" aria-hidden="true" />
              {rtl ? 'English' : 'اردو'}
            </button>
            <button onClick={onClose} aria-label={t.close} className="flex size-12 items-center justify-center rounded-xl hover:bg-white/10">
              <X className="size-6" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Breathing ring + title */}
        <div className="mt-4 flex items-center gap-5">
          <div className="relative flex size-16 shrink-0 items-center justify-center" aria-hidden="true">
            <span className="absolute inset-0 animate-breathe rounded-full border-2 border-calm bg-calm/15" />
            <Siren className="relative size-6 text-blood-soft" />
          </div>
          <div>
            <h1 id="em-title" className="text-3xl font-extrabold sm:text-4xl">
              {t.title}
            </h1>
            <p className="mt-1 text-base text-white/85">{t.calm}</p>
          </div>
        </div>

        {step < 3 && (
          <div className="mt-6 flex items-center gap-3" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <motion.span key={i} className="h-2 rounded-full" animate={{ width: i === step ? 40 : 16, backgroundColor: i <= step ? '#ff6b6b' : '#444' }} />
            ))}
            <span className="text-sm font-semibold text-white/80">{t.step(step + 1)}</span>
          </div>
        )}

        <div className="mt-6 min-h-[360px]" aria-live="polite">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="g" {...slide}>
                <h2 ref={headingRef} tabIndex={-1} className="text-2xl font-bold">
                  {t.q1}
                </h2>
                <div className="mt-5 grid grid-cols-4 gap-3" dir="ltr">
                  {GROUPS.map((g) => (
                    <motion.button
                      key={g}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => advance(() => setGroup(g))}
                      aria-pressed={group === g}
                      className={`flex h-20 items-center justify-center rounded-2xl border-2 text-2xl font-extrabold sm:h-24 sm:text-3xl ${group === g ? 'border-blood-soft bg-blood' : 'border-white/60 hover:bg-white/10'}`}
                    >
                      {g}
                    </motion.button>
                  ))}
                </div>
                <button onClick={() => advance(() => setGroup('unknown'))} className="mt-3 min-h-14 w-full rounded-2xl border-2 border-dashed border-white/60 text-lg font-bold hover:bg-white/10">
                  {t.unsure}
                </button>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="c" {...slide}>
                {donors.length > 0 && (
                  <p className="mb-4 rounded-2xl border border-calm/60 bg-calm/10 p-4 text-base">
                    {t.donors}{' '}
                    <strong dir="ltr" className="font-sans">
                      {donors.join(', ')}
                    </strong>
                  </p>
                )}
                <h2 ref={headingRef} tabIndex={-1} className="text-2xl font-bold">
                  {t.q2}
                </h2>
                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {CITIES.map((c) => (
                    <motion.button
                      key={c.en}
                      whileTap={{ scale: 0.94 }}
                      onClick={() => advance(() => setCity(c[lang]))}
                      className="min-h-16 rounded-2xl border-2 border-white/60 px-2 text-lg font-bold hover:bg-white/10"
                    >
                      {c[lang]}
                    </motion.button>
                  ))}
                </div>
                <form
                  className="mt-3 flex gap-3"
                  onSubmit={(e) => {
                    e.preventDefault()
                    if (other.trim()) advance(() => setCity(other.trim()))
                  }}
                >
                  <label htmlFor="em-city" className="sr-only">
                    {t.other}
                  </label>
                  <input
                    id="em-city"
                    value={other}
                    onChange={(e) => setOther(e.target.value)}
                    placeholder={t.otherPh}
                    className="min-h-14 flex-1 rounded-2xl border-2 border-white/60 bg-black px-4 text-lg text-white placeholder:text-white/60"
                  />
                  <button aria-label={t.other} className="flex min-h-14 w-14 items-center justify-center rounded-2xl bg-blood">
                    <ArrowRight className={`size-6 ${rtl ? 'rotate-180' : ''}`} aria-hidden="true" />
                  </button>
                </form>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="u" {...slide}>
                <h2 ref={headingRef} tabIndex={-1} className="text-2xl font-bold">
                  {t.q3}
                </h2>
                <div className="mt-5 flex flex-col gap-3">
                  {['now', 'today', 'week'].map((u, i) => (
                    <motion.button
                      key={u}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => advance(() => setUrgency(u))}
                      className={`min-h-20 rounded-2xl border-2 px-6 text-start text-2xl font-extrabold ${i === 0 ? 'border-blood-soft bg-blood hover:bg-blood-deep' : 'border-white/60 hover:bg-white/10'}`}
                    >
                      {t.urgency[u]}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="r" {...slide}>
                <h2 ref={headingRef} tabIndex={-1} className="flex items-center gap-3 text-2xl font-bold">
                  <span className="flex size-9 items-center justify-center rounded-full bg-emerald-500 text-black">
                    <Check className="size-5" aria-hidden="true" />
                  </span>
                  {t.ready}
                </h2>
                <blockquote className="mt-4 rounded-2xl border-2 border-white/60 p-5 text-xl leading-relaxed font-semibold">{message}</blockquote>

                <div className="mt-5 grid gap-3">
                  <a
                    href={`https://wa.me/${LINKS.whatsapp}?text=${encodeURIComponent(message)}`}
                    target="_blank"
                    rel="noopener"
                    onClick={() => haptic()}
                    className="flex min-h-16 items-center justify-center gap-3 rounded-2xl bg-emerald-500 text-xl font-extrabold text-black hover:bg-emerald-400"
                  >
                    <MessageCircle className="size-6" aria-hidden="true" />
                    {t.wa}
                  </a>
                  <div className="grid grid-cols-2 gap-3">
                    <a href={`tel:${LINKS.phone}`} className="flex min-h-14 items-center justify-center gap-2 rounded-2xl border-2 border-white/60 text-lg font-bold hover:bg-white/10">
                      <Phone className="size-5" aria-hidden="true" />
                      {t.call}
                    </a>
                    <button
                      onClick={() => share({ title: 'Eblood', text: message, url: LINKS.site })}
                      className="flex min-h-14 items-center justify-center gap-2 rounded-2xl border-2 border-white/60 text-lg font-bold hover:bg-white/10"
                    >
                      <Share2 className="size-5" aria-hidden="true" />
                      {t.shareMine}
                    </button>
                  </div>
                  <a href={LINKS.playStore} target="_blank" rel="noopener" className="flex min-h-14 items-center justify-center gap-2 rounded-2xl border-2 border-white/60 text-lg font-bold hover:bg-white/10">
                    <Download className="size-5" aria-hidden="true" />
                    {t.app}
                  </a>
                </div>

                <h3 className="mt-7 text-lg font-bold">{t.wait}</h3>
                <ul className="mt-3 grid gap-2">
                  {t.checklist.map((item, i) => {
                    const on = done.includes(i)
                    return (
                      <li key={i}>
                        <button
                          role="checkbox"
                          aria-checked={on}
                          onClick={() => {
                            haptic(8)
                            setDone((d) => (on ? d.filter((x) => x !== i) : [...d, i]))
                          }}
                          className="flex min-h-14 w-full items-center gap-3 rounded-xl px-2 text-start text-lg hover:bg-white/10"
                        >
                          <motion.span
                            animate={{ backgroundColor: on ? '#10b981' : 'rgba(0,0,0,0)', scale: on ? [1, 1.2, 1] : 1 }}
                            className="flex size-7 shrink-0 items-center justify-center rounded-lg border-2 border-white"
                          >
                            {on && <Check className="size-4 text-black" aria-hidden="true" />}
                          </motion.span>
                          <span className={on ? 'text-white/60 line-through' : ''}>{item}</span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="mt-6 rounded-2xl bg-blood/25 p-4 text-center text-base font-bold">{t.free}</p>
      </motion.div>
    </motion.div>
  )
}

// Floating, always-reachable entry point
export function EmergencyTrigger() {
  const open = useEmergency()
  return (
    <motion.button
      onClick={open}
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22, delay: 1 }}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.95 }}
      className="fixed right-4 bottom-4 z-50 flex min-h-14 items-center gap-2.5 rounded-full bg-blood py-3 pr-6 pl-4 font-extrabold text-white shadow-2xl shadow-blood/40 sm:right-6 sm:bottom-6"
    >
      <span className="relative flex size-8 items-center justify-center" aria-hidden="true">
        <span className="absolute inset-0 animate-ping rounded-full bg-white/30 motion-reduce:hidden" />
        <Siren className="relative size-5" />
      </span>
      Need blood now
    </motion.button>
  )
}
