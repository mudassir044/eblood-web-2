import { useLayoutEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation, useNavigationType } from 'react-router'
import { PrefsProvider } from './lib/prefs'
import { EmergencyProvider, EmergencyTrigger } from './innovations/EmergencyMode'
import { AmbientLight, LifelineProgress, AccessDock } from './innovations/Ambient'
import { Banner, Header, Footer } from './components/Layout'
import Home from './pages/Home'
import { BlogIndex, BlogPost, NotFound } from './pages/Blog'

// Scroll to top on page change, or to the #section in the link
function ScrollManager() {
  const { pathname, hash } = useLocation()
  const type = useNavigationType()
  useLayoutEffect(() => {
    if (type === 'POP') return
    if (!hash) return window.scrollTo({ top: 0, behavior: 'instant' })
    const id = requestAnimationFrame(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'instant' }))
    return () => cancelAnimationFrame(id)
  }, [pathname, hash, type])
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <PrefsProvider>
        <EmergencyProvider>
          <ScrollManager />
          <a href="#main" className="sr-only z-[200] rounded-xl bg-blood px-4 py-3 font-bold focus:not-sr-only focus:fixed focus:top-3 focus:left-3">
            Skip to content
          </a>
          <AmbientLight />
          <LifelineProgress />
          <Banner />
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blog" element={<BlogIndex />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
          <AccessDock />
          <EmergencyTrigger />
        </EmergencyProvider>
      </PrefsProvider>
    </BrowserRouter>
  )
}
