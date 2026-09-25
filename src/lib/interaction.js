// Short haptic tick on supported phones. Silent everywhere else.
export const haptic = (pattern = 12) => {
  try {
    navigator.vibrate?.(pattern)
  } catch {}
}

// Cursor-follow spotlight: pairs with the .spotlight class in index.css
export const spotlight = (e) => {
  const r = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
  e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
}

export const share = async ({ title, text, url }) => {
  if (navigator.share) {
    try {
      await navigator.share({ title, text, url })
      return 'shared'
    } catch {
      return 'cancelled'
    }
  }
  window.open(`https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`, '_blank', 'noopener')
  return 'whatsapp'
}
