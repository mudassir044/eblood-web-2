import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router'
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion'
import { Search, ArrowLeft, ArrowRight, Share2, Clock, Siren, HeartHandshake, ShieldAlert, BookOpen, Droplet, Users, Info, X } from 'lucide-react'
import { posts, categories, getPost, formatDate } from '../data/posts'
import { LINKS } from '../data/content'
import { Reveal, Card, Magnetic, btn, spring } from '../components/ui'
import { useEmergency } from '../innovations/EmergencyMode'
import { share, haptic } from '../lib/interaction'
import { useMeta } from '../lib/meta'

const ICONS = { Emergency: Siren, 'Donor Guide': HeartHandshake, Basics: Droplet, Community: Users, Safety: ShieldAlert }

function Cover({ post, large = false }) {
  const Icon = ICONS[post.category] || BookOpen
  return (
    <div aria-hidden="true" className={`relative overflow-hidden rounded-2xl border border-white/5 bg-[#2a0c0f] ${large ? 'aspect-[16/9] lg:aspect-auto lg:h-full' : 'aspect-[16/9]'}`}>
      <svg className="absolute inset-0 size-full text-white/[0.04]" preserveAspectRatio="xMidYMid slice" viewBox="0 0 200 120">
        {Array.from({ length: 24 }, (_, i) => (
          <path key={i} transform={`translate(${(i % 8) * 28 - 6} ${Math.floor(i / 8) * 44 + (i % 2) * 14 - 10}) scale(0.7)`} d="M16 2S5 14 5 20.5a11 11 0 0 0 22 0C27 14 16 2 16 2z" fill="currentColor" />
        ))}
      </svg>
      <div className="absolute -right-6 -bottom-8 flex size-40 items-center justify-center rounded-full bg-blood/25 blur-2xl" />
      <Icon className={`absolute right-6 bottom-6 text-blood-soft ${large ? 'size-20 lg:size-28' : 'size-14'}`} strokeWidth={1.5} />
      <span className="absolute top-4 left-4 rounded-full bg-black/40 px-3 py-1 text-xs font-bold tracking-wide">{post.category}</span>
    </div>
  )
}

function Meta({ post }) {
  return (
    <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
      <time dateTime={post.date}>{formatDate(post.date)}</time>
      <span aria-hidden="true">·</span>
      <span className="inline-flex items-center gap-1.5">
        <Clock className="size-3.5" aria-hidden="true" />
        {post.minutes} min read
      </span>
    </p>
  )
}

function PostCard({ post }) {
  return (
    <motion.li layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={spring}>
      <Card className="group h-full">
        <Link to={`/blog/${post.slug}`} className="flex h-full flex-col gap-4 rounded-3xl p-4 pb-6">
          <Cover post={post} />
          <div className="flex flex-1 flex-col gap-3 px-2">
            <Meta post={post} />
            <h3 className="text-xl leading-snug font-bold text-balance group-hover:text-blood-soft">{post.title}</h3>
            <p className="flex-1 leading-relaxed text-muted">{post.excerpt}</p>
            <span className="inline-flex items-center gap-1.5 text-sm font-bold text-blood-soft">
              Read article
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </span>
          </div>
        </Link>
      </Card>
    </motion.li>
  )
}

export function BlogIndex() {
  useMeta('Blog | Eblood', 'Guides, safety tips and stories about blood donation in Pakistan from the Eblood team.')
  const [query, setQuery] = useState('')
  const [cat, setCat] = useState('All')

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    return posts.filter((p) => (cat === 'All' || p.category === cat) && (!q || `${p.title} ${p.excerpt} ${p.category}`.toLowerCase().includes(q)))
  }, [query, cat])

  const [featured, ...rest] = results
  const filtering = cat !== 'All' || query.trim()

  return (
    <main id="main" className="px-4 pt-16 pb-24 sm:px-6 md:pt-20">
      <div className="mx-auto max-w-6xl">
        <Reveal className="flex flex-col items-center gap-4 text-center">
          <p className="text-xs font-bold tracking-[0.16em] text-blood-soft">EBLOOD BLOG</p>
          <h1 className="text-5xl font-extrabold tracking-tight text-balance md:text-6xl">
            Guides that help you <span className="text-blood-soft">save lives</span>
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-muted">Simple answers about donating blood, finding donors in an emergency, and staying safe.</p>
        </Reveal>

        <Reveal delay={0.08} className="mt-10 flex flex-col items-center gap-5">
          <div className="relative w-full max-w-xl">
            <label htmlFor="blog-search" className="sr-only">
              Search articles
            </label>
            <Search className="pointer-events-none absolute top-1/2 left-4 z-10 size-5 -translate-y-1/2 text-muted" aria-hidden="true" />
            <input
              id="blog-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles"
              className="min-h-14 w-full rounded-2xl border border-line bg-surface/80 pr-12 pl-12 text-base text-fg placeholder:text-muted focus:border-blood/60"
            />
            {query && (
              <button onClick={() => setQuery('')} aria-label="Clear search" className="absolute top-1/2 right-2 flex size-10 -translate-y-1/2 items-center justify-center rounded-xl hover:bg-white/5">
                <X className="size-4" aria-hidden="true" />
              </button>
            )}
          </div>
          <div role="radiogroup" aria-label="Filter by topic" className="flex flex-wrap justify-center gap-2">
            {categories.map((c) => (
              <button
                key={c}
                role="radio"
                aria-checked={cat === c}
                onClick={() => {
                  haptic(6)
                  setCat(c)
                }}
                className="relative min-h-11 rounded-full border border-line px-5 text-sm font-bold"
              >
                {cat === c && <motion.span layoutId="blog-cat" transition={spring} className="absolute inset-0 rounded-full bg-blood" />}
                <span className="relative">{c}</span>
              </button>
            ))}
          </div>
          <p className="sr-only" aria-live="polite">
            {results.length} article{results.length === 1 ? '' : 's'} found
          </p>
        </Reveal>

        {featured && !filtering && (
          <Reveal delay={0.12} className="mt-14">
            <Card className="group">
              <Link to={`/blog/${featured.slug}`} className="grid gap-6 rounded-3xl p-4 lg:grid-cols-[1.2fr_1fr] lg:p-5">
                <Cover post={featured} large />
                <div className="flex flex-col justify-center gap-4 p-2 lg:p-6">
                  <p className="text-xs font-bold tracking-[0.16em] text-blood-soft">LATEST</p>
                  <h2 className="text-3xl leading-tight font-extrabold text-balance group-hover:text-blood-soft md:text-4xl">{featured.title}</h2>
                  <p className="text-lg leading-relaxed text-muted">{featured.excerpt}</p>
                  <Meta post={featured} />
                  <span className={`${btn.primary} mt-2 self-start`}>
                    Read article <ArrowRight className="size-4" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            </Card>
          </Reveal>
        )}

        <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {(filtering ? results : rest).map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </AnimatePresence>
        </ul>

        {results.length === 0 && (
          <div className="mt-6 flex flex-col items-center gap-4 rounded-3xl border border-dashed border-line p-12 text-center">
            <p className="text-lg font-bold">No articles match that search.</p>
            <button
              onClick={() => {
                setQuery('')
                setCat('All')
              }}
              className={btn.ghost}
            >
              Show all articles
            </button>
          </div>
        )}
      </div>
    </main>
  )
}

function Block({ block }) {
  const openEmergency = useEmergency()
  const [type, v] = block
  if (type === 'p') return <p>{v}</p>
  if (type === 'h2') return <h2 className="!mt-12 text-2xl font-extrabold text-fg md:text-3xl">{v}</h2>
  if (type === 'ul')
    return (
      <ul className="flex flex-col gap-3">
        {v.map((item) => (
          <li key={item} className="flex gap-3">
            <span className="mt-2.5 size-2 shrink-0 rounded-full bg-blood" aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    )
  if (type === 'callout')
    return (
      <aside className="flex gap-4 rounded-2xl border border-blood/40 bg-blood/10 p-5 text-fg">
        <Info className="mt-1 size-5 shrink-0 text-blood-soft" aria-hidden="true" />
        <p>{v}</p>
      </aside>
    )
  if (type === 'table')
    return (
      <div className="overflow-x-auto rounded-2xl border border-line">
        <table className="w-full min-w-[520px] text-left text-base">
          <thead className="bg-surface-2 text-sm text-fg">
            <tr>
              {v.head.map((h) => (
                <th key={h} scope="col" className="px-5 py-3 font-bold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {v.rows.map(([g, ...cells]) => (
              <tr key={g} className="border-t border-line">
                <th scope="row" className="px-5 py-3 font-extrabold text-blood-soft">
                  {g}
                </th>
                {cells.map((c, i) => (
                  <td key={i} className="px-5 py-3">
                    {c}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  if (type === 'cta')
    return v.action === 'emergency' ? (
      <button onClick={openEmergency} className={btn.primary}>
        <Siren className="size-5" aria-hidden="true" /> {v.label}
      </button>
    ) : (
      <Link to={v.to} className={btn.ghost}>
        {v.label} <ArrowRight className="size-4" aria-hidden="true" />
      </Link>
    )
  return null
}

function ReadingBar() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30 })
  return <motion.div aria-hidden="true" style={{ scaleX }} className="fixed top-0 right-0 left-0 z-50 h-1 origin-left bg-blood" />
}

export function BlogPost() {
  const { slug } = useParams()
  const post = getPost(slug)
  const openEmergency = useEmergency()
  const [shared, setShared] = useState(false)
  useMeta(post ? `${post.title} | Eblood Blog` : 'Article not found | Eblood', post?.excerpt || '')

  if (!post) return <NotFound />

  const related = posts.filter((p) => p.slug !== post.slug).slice(0, 2)
  const url = `${LINKS.site}/blog/${post.slug}`

  return (
    <main id="main" className="px-4 pt-10 pb-24 sm:px-6">
      <ReadingBar />
      <article className="mx-auto max-w-3xl">
        <Link to="/blog" className="inline-flex min-h-11 items-center gap-2 font-semibold text-soft hover:text-fg">
          <ArrowLeft className="size-4" aria-hidden="true" /> All articles
        </Link>

        <Reveal as="header" className="mt-6 flex flex-col gap-5">
          <Link to="/blog" className="self-start rounded-full border border-blood/40 bg-blood/10 px-3 py-1 text-xs font-bold tracking-wide text-blood-soft">
            {post.category}
          </Link>
          <h1 className="text-4xl leading-tight font-extrabold tracking-tight text-balance md:text-5xl">{post.title}</h1>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-full bg-blood text-sm font-extrabold" aria-hidden="true">
                E
              </span>
              <div>
                <p className="font-bold">{post.author}</p>
                <Meta post={post} />
              </div>
            </div>
            <button
              onClick={async () => {
                const r = await share({ title: post.title, text: post.title, url })
                if (r !== 'cancelled') {
                  setShared(true)
                  setTimeout(() => setShared(false), 2000)
                }
              }}
              className={btn.ghost}
            >
              <Share2 className="size-4" aria-hidden="true" /> {shared ? 'Thanks for sharing' : 'Share'}
            </button>
          </div>
        </Reveal>

        <Reveal delay={0.08} className="mt-8">
          <Cover post={post} />
        </Reveal>

        <div className="mt-10 flex flex-col gap-5 text-lg leading-relaxed text-soft">
          {post.body.map((b, i) => (
            <Block key={i} block={b} />
          ))}
        </div>

        <p className="mt-12 border-t border-line pt-6 text-sm text-muted">This article is general information, not medical advice. Always follow the guidance of your doctor and the blood bank.</p>

        <aside className="mt-10 grid gap-4 rounded-3xl border border-line bg-surface/80 p-6 sm:grid-cols-2 md:p-8">
          <div className="sm:col-span-2">
            <h2 className="text-2xl font-extrabold">Ready to help?</h2>
            <p className="mt-1 text-muted">Need blood now, or want to become a donor? Start here.</p>
          </div>
          <Magnetic as="button" onClick={openEmergency} strength={0.15} className={btn.primary}>
            <Siren className="size-5" aria-hidden="true" /> I need blood
          </Magnetic>
          <Magnetic as="a" href={LINKS.playStore} target="_blank" rel="noopener" strength={0.15} className={btn.ghost}>
            <HeartHandshake className="size-5" aria-hidden="true" /> Become a donor
          </Magnetic>
        </aside>
      </article>

      <section aria-labelledby="related-title" className="mx-auto mt-20 max-w-6xl">
        <h2 id="related-title" className="text-2xl font-extrabold">
          Keep reading
        </h2>
        <ul className="mt-6 grid gap-6 md:grid-cols-2">
          {related.map((p) => (
            <PostCard key={p.slug} post={p} />
          ))}
        </ul>
      </section>
    </main>
  )
}

export function NotFound() {
  useMeta('Page not found | Eblood', 'This page could not be found.')
  return (
    <main id="main" className="flex min-h-[60vh] flex-col items-center justify-center gap-5 px-4 py-24 text-center">
      <Droplet className="size-14 text-blood-soft" aria-hidden="true" />
      <h1 className="text-4xl font-extrabold">We couldn't find that page</h1>
      <p className="max-w-md text-lg text-muted">The link may be old or mistyped.</p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link to="/" className={btn.primary}>
          Go to homepage
        </Link>
        <Link to="/blog" className={btn.ghost}>
          Read the blog
        </Link>
      </div>
    </main>
  )
}
