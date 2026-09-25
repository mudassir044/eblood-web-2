import { useEffect, useState } from 'react'

const daypartOf = (h) => (h >= 5 && h < 8 ? 'dawn' : h >= 8 && h < 17 ? 'day' : h >= 17 && h < 21 ? 'dusk' : 'night')

export function useDaypart() {
  const [part, setPart] = useState(() => daypartOf(new Date().getHours()))
  useEffect(() => {
    const id = setInterval(() => setPart(daypartOf(new Date().getHours())), 60_000)
    return () => clearInterval(id)
  }, [])
  return part
}
