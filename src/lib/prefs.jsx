import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { MotionConfig } from 'framer-motion'
import { useDaypart } from './daypart'

const KEY = 'eblood:prefs'
const DEFAULTS = { contrast: 'normal', text: 'md', calm: false, lang: 'en', bannerClosed: false }

const read = () => {
  try {
    return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(KEY) || '{}') }
  } catch {
    return DEFAULTS
  }
}

const PrefsContext = createContext(null)

export function PrefsProvider({ children }) {
  const [prefs, setPrefs] = useState(read)
  const [emergencyContrast, setEmergencyContrast] = useState(false)
  const daypart = useDaypart()

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(prefs))
    } catch {}
  }, [prefs])

  const highContrast = prefs.contrast === 'high' || emergencyContrast

  useEffect(() => {
    const root = document.documentElement
    root.dataset.contrast = highContrast ? 'high' : 'normal'
    root.dataset.text = prefs.text
    root.dataset.calm = String(prefs.calm)
    root.dataset.daypart = daypart
  }, [highContrast, prefs.text, prefs.calm, daypart])

  const value = useMemo(
    () => ({
      ...prefs,
      daypart,
      highContrast,
      set: (patch) => setPrefs((p) => ({ ...p, ...patch })),
      setEmergencyContrast,
    }),
    [prefs, daypart, highContrast],
  )

  return (
    <PrefsContext.Provider value={value}>
      <MotionConfig reducedMotion={prefs.calm ? 'always' : 'user'}>{children}</MotionConfig>
    </PrefsContext.Provider>
  )
}

export const usePrefs = () => useContext(PrefsContext)
