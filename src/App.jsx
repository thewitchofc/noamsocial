import { useEffect, useRef, useState, memo } from 'react'
import { motion, useInView, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom'
import Lenis from 'lenis'

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   CONSTANTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const PHONE = '972501234567'
const IG = 'noamsocial_'

const GALLERY = [
  { url: '/gallery/g1.webp', fallback: '/gallery/g1.jpg', alt: 'כלה עומדת בקשת אבן לפני החתונה, צילום סושיאל של נעם' },
  { url: '/gallery/g2.webp', fallback: '/gallery/g2.jpg', alt: 'כלה בהתארגנות, עוזרות מכניסות את השמלה, צילום ביום החתונה' },
  { url: '/gallery/g3.webp', fallback: '/gallery/g3.jpg', alt: 'כלה עם רעלה לבנה, תאורה דרמטית, רגע לפני החופה' },
  { url: '/gallery/g4.webp', fallback: '/gallery/g4.jpg', alt: 'כלה בשמלת תחרה בגן ירוק, צילום חתונה אלגנטי' },
  { url: '/gallery/g5.webp', fallback: '/gallery/g5.jpg', alt: 'צילום כלה ביום החתונה' },
  { url: '/gallery/g6.webp', fallback: '/gallery/g6.jpg', alt: 'צילום כלה ביום החתונה' },
  { url: '/gallery/g7.webp', fallback: '/gallery/g7.jpg', alt: 'צילום כלה ביום החתונה' },
  { url: '/gallery/g8.webp', fallback: '/gallery/g8.jpg', alt: 'צילום כלה ביום החתונה' },
]

const TESTIMONIALS = [
  {
    quote: 'נעם אהובתי! ואו ואו ואו איזה אישה את, לא יכלתי לבקש יותר טובה ממך באופן האישי והמקצועי! תודה על הכלללל, מעריכה. מחכה לשלישי כבר.',
    name: 'כלה',
  },
  {
    quote: 'היית פשוט מדהימה, עדינה, מבינה עניין, זורמת עם הצלמים, עוזרת לי עם השמלות. היית סופר מקצועית ומהממת ואני כל כך שמחה שבאת!',
    name: 'כלה',
  },
  {
    quote: 'את מוכשרת בטירוף! באמת אין מילים.',
    name: 'כלה',
  },
  {
    quote: 'תודה על הכל! הייתי מושלמת!! איך אני שמחה שהיית איתי ביום הזה, מעבר למקצועיות שלך, הרגעת אותי ועשית לי אווירה כיפית.',
    name: 'כלה',
  },
  {
    quote: 'נעם, לא יודעת מה הייתי עושה בלעדייך ביום הזה. מעבר לזה שאת מצלמת הכי יפה בעולם, נתת תמיכה, עזרה ואת ממש היית שם בשבילי. זה לא מובן מאליו בכלל.',
    name: 'כלה',
  },
  {
    quote: 'הוצאת דברים כל כך מושלמים, תודה לך. אין ספק שלקחת אותך הייתה הבחירה הנכונה.',
    name: 'כלה',
  },
  {
    quote: 'התעלית על כל הציפיות ומעבר. המקצועיות, הרוגע והכיף שהכנסת, היית לגמרי כמו עוד מלווה. אני פשוט לא מפסיקה להודות על הרגע שלא ויתרתי עלייך.',
    name: 'כלה',
  },
  {
    quote: 'סגרתי אותך דקה תשעים כי חשבתי שאני יכולה גם בלי סושיאל, אבל יש גדול. את לא רק בתפקיד הזה, את הרבה מעבר. נתת לי נחת ולא זזת ממני כמו מלווה. מעריכה ואוהבת אותך!',
    name: 'כלה',
  },
]

const PACKAGES = [
  {
    name: 'חבילת התארגנות',
    sub: 'Getting Ready',
    tagline: 'רגע לפני שהקסם מתחיל',
    duration: '5 שעות',
    features: [
      'הגעה ללוקיישן',
      'צילום דיטיילס, אביזרים ושמלה',
      '4 רילס מוכנים לפרסום',
      'סטורי מלא ללא הגבלה',
      'תוכן סטיילס מקצועי',
    ],
    highlight: false,
  },
  {
    name: 'חבילת יום מלא',
    sub: 'Full Day',
    tagline: 'הסיפור המלא של היום',
    duration: 'ללא הגבלת שעות',
    features: [
      'צילום ברציפות מהכנות ועד הכניסה',
      'חופה, ריקודים וכל הרגעים שבינהם',
      'רילס + סטורי ללא הגבלה',
      'תוכן סטיילס ודיטיילס',
      'תוכן מוכן לפרסום באותו לילה',
    ],
    highlight: true,
  },
  {
    name: 'ליווי חינה / הפרשת חלה',
    sub: 'Henna & Challah',
    tagline: 'הלילה שלפני הגדול',
    duration: '5 שעות',
    features: [
      'הגעה לפני האורחות, כלה בלבד',
      'צילום הכנת הכלה במקום ההתארגנות',
      '3 רילס מוכנים לפרסום',
      'סטורי מלא ללא הגבלה',
      'תוכן מוכן תוך 3 ימי עסקים',
    ],
    highlight: false,
  },
]

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   GRAIN OVERLAY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* Static — never changes, no props, no state */
const GrainOverlay = memo(() => (
  <div aria-hidden="true" className="grain-overlay" />
))

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   CUSTOM CURSOR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* Config per cursor mode — defined outside component (no re-alloc) */
const CURSOR_CFG = {
  default: { size: 34, dotSize: 4.5, dotOpacity: 1,   fill: 'rgba(212,175,128,0)',    border: 'rgba(212,175,128,0.55)', glow: 'none' },
  button:  { size: 54, dotSize: 0,   dotOpacity: 0,   fill: 'rgba(212,175,128,0.1)', border: 'rgba(212,175,128,0.85)', glow: '0 0 18px rgba(212,175,128,0.35)' },
  link:    { size: 46, dotSize: 3,   dotOpacity: 0.6, fill: 'rgba(212,175,128,0.06)', border: 'rgba(212,175,128,0.7)', glow: '0 0 12px rgba(212,175,128,0.22)' },
  text:    { size: 14, dotSize: 0,   dotOpacity: 0,   fill: 'rgba(212,175,128,0)',    border: 'rgba(212,175,128,0.3)', glow: 'none' },
  gallery: { size: 78, dotSize: 0,   dotOpacity: 0,   fill: 'rgba(212,175,128,0.07)', border: 'rgba(212,175,128,0.8)', glow: '0 0 28px rgba(212,175,128,0.25)' },
}

/* Zero React re-renders — all state lives in useRef, DOM written directly in rAF */
function CustomCursor() {
  const dotRef   = useRef(null)
  const ringRef  = useRef(null)
  const labelRef = useRef(null)
  const mouse    = useRef({ x: -300, y: -300 })
  const prev     = useRef({ x: -300, y: -300 })
  const ring     = useRef({ x: -300, y: -300 })
  const vel      = useRef({ x: 0, y: 0 })
  const state    = useRef({ mode: 'default', pressed: false, visible: false })
  const rafRef   = useRef(null)

  useEffect(() => {
    const lerp = (a, b, n) => a + (b - a) * n

    /* Apply config to DOM directly — no React state */
    const applyMode = () => {
      const { mode, pressed, visible } = state.current
      const c = CURSOR_CFG[mode] ?? CURSOR_CFG.default
      const dot  = dotRef.current
      const ring = ringRef.current
      const lbl  = labelRef.current
      if (!dot || !ring) return

      dot.style.width   = `${c.dotSize}px`
      dot.style.height  = `${c.dotSize}px`
      dot.style.opacity = visible ? c.dotOpacity : 0
      dot.style.transform = `translate(-50%,-50%) scale(${pressed ? 0.82 : 1})`

      ring.style.width           = `${c.size}px`
      ring.style.height          = `${c.size}px`
      ring.style.borderColor     = c.border
      ring.style.backgroundColor = c.fill
      ring.style.boxShadow       = pressed ? 'none' : c.glow
      ring.style.opacity         = visible ? (pressed ? 0.7 : 1) : 0

      if (lbl) lbl.style.opacity = mode === 'gallery' ? 1 : 0
    }

    const onMove = (e) => {
      vel.current  = { x: e.clientX - prev.current.x, y: e.clientY - prev.current.y }
      prev.current = { x: e.clientX, y: e.clientY }
      mouse.current = { x: e.clientX, y: e.clientY }
      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`
        dotRef.current.style.top  = `${e.clientY}px`
      }
    }

    const onOver = (e) => {
      const t = e.target
      let next = 'default'
      if      (t.closest('[data-cursor="gallery"]'))           next = 'gallery'
      else if (t.closest('button, a, [data-cursor="button"]')) next = 'button'
      else if (t.closest('p, h1, h2, h3, h4, blockquote, li, span')) next = 'text'
      if (next !== state.current.mode) { state.current.mode = next; applyMode() }
    }

    const onDown  = () => { state.current.pressed = true;  applyMode() }
    const onUp    = () => { state.current.pressed = false; applyMode() }
    const onEnter = () => { state.current.visible = true;  applyMode() }
    const onLeave = () => { state.current.visible = false; applyMode() }

    const tick = () => {
      const { mode } = state.current
      const lerpF = mode === 'button' || mode === 'gallery' ? 0.11 : 0.08
      ring.current.x = lerp(ring.current.x, mouse.current.x, lerpF)
      ring.current.y = lerp(ring.current.y, mouse.current.y, lerpF)

      const el = ringRef.current
      if (el) {
        const speed      = Math.sqrt(vel.current.x ** 2 + vel.current.y ** 2)
        const stretchAmt = Math.min(speed / 28, 0.38)
        const angle      = Math.atan2(vel.current.y, vel.current.x) * (180 / Math.PI)
        const sX = 1 + stretchAmt
        const sY = Math.max(1 - stretchAmt * 0.55, 0.6)
        el.style.left      = `${ring.current.x}px`
        el.style.top       = `${ring.current.y}px`
        el.style.transform = `translate(-50%,-50%) rotate(${angle}deg) scaleX(${sX}) scaleY(${sY})`
        vel.current.x *= 0.78
        vel.current.y *= 0.78
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove',    onMove,  { passive: true })
    window.addEventListener('mouseover',    onOver,  { passive: true })
    window.addEventListener('mousedown',    onDown)
    window.addEventListener('mouseup',      onUp)
    document.addEventListener('mouseenter', onEnter)
    document.addEventListener('mouseleave', onLeave)
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove',    onMove)
      window.removeEventListener('mouseover',    onOver)
      window.removeEventListener('mousedown',    onDown)
      window.removeEventListener('mouseup',      onUp)
      document.removeEventListener('mouseenter', onEnter)
      document.removeEventListener('mouseleave', onLeave)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <>
      <div ref={dotRef} style={{
        position: 'fixed', zIndex: 10002, pointerEvents: 'none',
        borderRadius: '50%', backgroundColor: 'rgba(212,175,128,0.95)',
        opacity: 0, willChange: 'transform',
        transition: 'width .28s cubic-bezier(.22,1,.36,1), height .28s cubic-bezier(.22,1,.36,1), opacity .22s ease, transform .14s ease',
      }} />
      <div ref={ringRef} style={{
        position: 'fixed', zIndex: 10001, pointerEvents: 'none',
        borderRadius: '50%', border: '1px solid rgba(212,175,128,0.55)',
        opacity: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        willChange: 'transform',
        transition: 'width .4s cubic-bezier(.22,1,.36,1), height .4s cubic-bezier(.22,1,.36,1), background-color .3s ease, border-color .3s ease, box-shadow .35s ease, opacity .3s ease',
      }}>
        <span ref={labelRef} style={{
          opacity: 0, fontSize: 7.5, letterSpacing: '0.25em', userSelect: 'none',
          color: 'rgba(212,175,128,0.88)', fontFamily: 'Assistant, sans-serif',
          fontWeight: 400, textTransform: 'uppercase',
          transition: 'opacity 0.2s ease',
        }}>VIEW</span>
      </div>
    </>
  )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   UTILITY COMPONENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function FadeUp({ children, delay = 0, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.12 })
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1.1, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

/* Wraps an entire section/footer with a gentle entrance on scroll */
const MOTION_TAGS = {
  section: motion.section,
  footer: motion.footer,
}
function SceneReveal({ children, className = '', as = 'section', id }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.05 })
  const MotionEl = MOTION_TAGS[as] ?? motion.section
  return (
    <MotionEl
      ref={ref}
      id={id}
      className={className}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionEl>
  )
}

function FadeIn({ children, delay = 0, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.1 })
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 1.4, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

function WordReveal({ text, className = '', delay = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })
  const words = text.split(' ')
  return (
    <span ref={ref} className={className}>
      {words.map((word, i) => (
        <span
          key={i}
          style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom', lineHeight: 1.15 }}
        >
          <motion.span
            style={{ display: 'inline-block' }}
            initial={{ y: '115%' }}
            animate={inView ? { y: 0 } : {}}
            transition={{
              duration: 1.1,
              delay: delay + i * 0.08,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {word}{i < words.length - 1 ? '\u00A0' : ''}
          </motion.span>
        </span>
      ))}
    </span>
  )
}

const SectionLabel = memo(function SectionLabel({ children, light = false }) {
  return (
    <p
      className={`text-[10px] tracking-[0.45em] uppercase font-light mb-6 ${
        light ? 'text-[#D4AF80]/50' : 'text-[#C4956A]/80'
      }`}
    >
      {children}
    </p>
  )
})

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   NAV
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); window.scrollTo(0, 0) }, [location.pathname])

  const isHome = location.pathname === '/'

  const links = [
    { label: 'חבילות', to: '/packages' },
    { label: 'גלריה', to: '/gallery' },
    { label: 'ביקורות', to: '/testimonials' },
  ]

  const handleNavClick = (link) => {
    if (link.hash && isHome) {
      document.getElementById(link.hash)?.scrollIntoView({ behavior: 'smooth' })
    } else if (link.hash && !isHome) {
      navigate('/')
      setTimeout(() => document.getElementById(link.hash)?.scrollIntoView({ behavior: 'smooth' }), 300)
    }
    setMenuOpen(false)
  }

  const isActive = (link) => {
    if (link.to && !link.hash) return location.pathname === link.to
    return false
  }

  return (
    <nav
      role="navigation"
      aria-label="ניווט ראשי"
      className={`fixed top-0 inset-x-0 z-[200] transition-all duration-700 ${
        !isHome
          ? 'bg-[#1C1410]/95 backdrop-blur-md border-b border-white/5 py-4'
          : scrolled
            ? 'md:bg-[#1C1410]/95 md:backdrop-blur-md md:border-b md:border-white/5 py-4'
            : 'bg-transparent py-7'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="select-none">
          <img
            src="/logo.webp"
            alt="לוגו נעם סושיאל"
            className="hidden md:block h-14 w-auto"
            style={{ filter: 'invert(1) brightness(1.1)' }}
          />
        </Link>

        <ul className="hidden md:flex gap-9 list-none m-0 p-0">
          {links.map((l) => (
            <li key={l.label}>
              {l.hash ? (
                <button
                  onClick={() => handleNavClick(l)}
                  className={`text-sm transition-colors duration-300 font-light tracking-wide ${
                    isActive(l) ? 'text-[#F5EFE6]' : 'text-[#F5EFE6]/50 hover:text-[#F5EFE6]'
                  }`}
                >
                  {l.label}
                </button>
              ) : (
                <Link
                  to={l.to}
                  className={`link-hover text-sm transition-colors duration-300 font-light tracking-wide ${
                    isActive(l) ? 'text-[#F5EFE6]' : 'text-[#F5EFE6]/50 hover:text-[#F5EFE6]'
                  }`}
                >
                  {l.label}
                </Link>
              )}
            </li>
          ))}
        </ul>

        <Link
          to="/contact"
          className="btn-glow hidden md:block text-sm border border-[#D4AF80]/40 text-[#D4AF80] px-6 py-2.5 rounded-full hover:bg-[#D4AF80]/10 font-light tracking-wide"
        >
          צרי קשר
        </Link>

        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="md:hidden p-3 flex flex-col gap-1.5"
          style={{ mixBlendMode: 'difference' }}
          aria-label="תפריט"
        >
          <motion.div animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 7 : 0 }} className="w-5 h-px bg-white" />
          <motion.div animate={{ opacity: menuOpen ? 0 : 1 }} className="w-5 h-px bg-white" />
          <motion.div animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -7 : 0 }} className="w-5 h-px bg-white" />
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden overflow-hidden bg-[#1C1410] border-t border-white/5"
          >
            <div className="px-6 py-7 flex flex-col gap-5">
              {links.map((l) => (
                l.hash ? (
                  <button
                    key={l.label}
                    onClick={() => handleNavClick(l)}
                    className="text-[#F5EFE6]/65 text-lg font-light text-right"
                  >
                    {l.label}
                  </button>
                ) : (
                  <Link
                    key={l.label}
                    to={l.to}
                    className="link-hover text-[#F5EFE6]/65 text-lg font-light"
                  >
                    {l.label}
                  </Link>
                )
              ))}
              <Link
                to="/contact"
                className="link-hover text-[#D4AF80]/80 text-lg font-light"
              >
                יצירת קשר
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   HERO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* Reusable cinematic line reveal: staggered fade + slide (GPU-only, no blur) */
function CineLine({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 48 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.25, delay, ease: [0.16, 1, 0.3, 1] }}
      style={{ willChange: 'transform, opacity' }}
    >
      {children}
    </motion.div>
  )
}

/* Lazy-loads the hero background video after window.load — desktop only */
const HeroVideo = memo(function HeroVideo() {
  const videoRef = useRef(null)

  useEffect(() => {
    const load = () => {
      if (videoRef.current) {
        videoRef.current.load()
        videoRef.current.play().catch(() => {})
      }
    }
    if (document.readyState === 'complete') {
      // Already loaded — small delay so first paint is done
      setTimeout(load, 200)
    } else {
      window.addEventListener('load', load, { once: true })
    }
    return () => window.removeEventListener('load', load)
  }, [])

  return (
    <video
      ref={videoRef}
      muted
      loop
      playsInline
      preload="none"                     /* don't fetch until we trigger it */
      className="absolute inset-0 w-full h-full object-cover hidden md:block"
      style={{ opacity: 0.52 }}
      aria-hidden="true"
    >
      <source src="/video/hero-bg-compressed.mp4" type="video/mp4" />
      <source src="/video/hero-bg.mp4" type="video/mp4" />
    </video>
  )
})

function Hero() {
  const ease = [0.16, 1, 0.3, 1]

  /* Parallax: video drifts slower than the page, text slightly faster */
  const { scrollY } = useScroll()
  const videoParallax = useTransform(scrollY, [0, 700], [0, 90])
  const textParallax  = useTransform(scrollY, [0, 700], [0, 38])

  return (
    <section
      id="hero"
      className="relative min-h-screen overflow-hidden bg-[#1C1410] flex items-center md:items-end pb-0 md:pb-36"
    >
      {/* ── Cinematic veil: pitch-black curtain that lifts ── */}
      <motion.div
        className="absolute inset-0 z-20 bg-[#080604] pointer-events-none"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 2.2, ease: 'easeOut' }}
      />

      {/* ── Background — desktop: lazy video | mobile: static poster ── */}
      <motion.div
        className="absolute inset-0"
        style={{ y: videoParallax }}
      >
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.09 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 3.2, ease: 'easeOut' }}
        >
          {/* Static poster — shown immediately while video loads, also only background on mobile */}
          <picture className="absolute inset-0">
            <source srcSet="/video/hero-poster.webp" type="image/webp" />
            <img
              src="/video/hero-poster.jpg"
              alt=""
              aria-hidden="true"
              className="w-full h-full object-cover"
              style={{ opacity: 0.52 }}
            />
          </picture>

          {/* Video — hidden on mobile, lazy-loaded on desktop after page load */}
          <HeroVideo />
        </motion.div>
      </motion.div>

      {/* ── Gradient overlays ── */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2.4, delay: 0.6, ease: 'easeOut' }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1410] via-[#1C1410]/25 to-[#1C1410]/5" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1C1410]/55 via-transparent to-transparent" />
      </motion.div>

      {/* ── MOBILE layout ── */}
      <div className="md:hidden relative z-10 w-full flex flex-col items-center justify-center min-h-screen px-6 text-center gap-7">
        <CineLine delay={0.8} className="flex justify-center">
          <img
            src="/logo.webp"
            alt="לוגו נעם סושיאל"
            className="w-60 h-auto"
            style={{ filter: 'invert(1) brightness(1.1)' }}
          />
        </CineLine>

        <CineLine delay={1.2}>
          <h1 className="font-display text-3xl text-[#F5EFE6] leading-snug">
            צילום חתונות וסושיאל<br />
            <span className="text-[#D4AF80]">ברמה אחרת</span>
          </h1>
        </CineLine>

        <CineLine delay={1.6}>
          <p className="font-display text-xl text-[#F5EFE6]/45 font-light italic leading-relaxed">
            כי היום שלך ראוי להיראות כמו חלום
          </p>
        </CineLine>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, delay: 2.0, ease: 'easeOut' }}
          className="text-[#F5EFE6]/38 text-sm font-light leading-relaxed max-w-[260px]"
        >
          תוכן מוכן לפרסום: רילס, סטוריז ותמונות. עוד ביום החתונה.
        </motion.p>

        <motion.a
          href="/contact"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 2.4, ease }}
          className="btn-glow inline-flex items-center text-sm text-[#1C1410] bg-[#D4AF80] px-8 py-4 rounded-full hover:bg-[#C4956A] hover:text-[#F5EFE6] font-medium tracking-wide"
        >
          בדקי זמינות
        </motion.a>
      </div>

      {/* ── DESKTOP layout — parallax on scroll ── */}
      <motion.div
        style={{ y: textParallax }}
        className="hidden md:block relative z-10 max-w-6xl mx-auto px-6 w-full"
      >
        <div className="max-w-3xl">
          {/* H1 — three cinematic lines, each blurring in */}
          <h1 className="font-display text-[4.5rem] lg:text-[6.2rem] text-[#F5EFE6] leading-[1.02] mb-10 tracking-tight">
            <CineLine delay={0.4} className="block mb-1">
              צילום חתונות
            </CineLine>
            <CineLine delay={0.72} className="block mb-1">
              וסושיאל
            </CineLine>
            <CineLine delay={1.04} className="block text-[#D4AF80]">
              ברמה אחרת
            </CineLine>
          </h1>

          {/* Italic tagline */}
          <CineLine delay={1.5}>
            <p className="font-display text-2xl md:text-[1.8rem] text-[#F5EFE6]/48 font-light italic mb-10 leading-relaxed">
              כי היום שלך ראוי להיראות כמו חלום
            </p>
          </CineLine>

          {/* Body copy — pure opacity, no blur (secondary info) */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.4, delay: 1.95, ease: 'easeOut' }}
            className="text-[#F5EFE6]/40 text-lg font-light leading-relaxed mb-14 max-w-sm"
          >
            תוכן מוכן לפרסום: רילס, סטוריז ותמונות. עוד ביום החתונה.
          </motion.p>

          {/* CTA */}
          <motion.a
            href="/contact"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 2.35, ease }}
            className="btn-glow inline-flex items-center gap-3 text-sm text-[#1C1410] bg-[#D4AF80] px-9 py-4 rounded-full hover:bg-[#C4956A] hover:text-[#F5EFE6] font-medium tracking-wide"
          >
            בדקי זמינות
          </motion.a>
        </div>
      </motion.div>

      {/* ── Scroll indicator ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.0, duration: 1.6 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
      >
        <motion.div
          animate={{ scaleY: [1, 0.2, 1] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut', delay: 3.0 }}
          style={{ transformOrigin: 'top' }}
          className="w-px h-14 bg-gradient-to-b from-[#D4AF80]/30 to-transparent"
        />
      </motion.div>
    </section>
  )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   MANIFESTO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function Manifesto() {
  return (
    <SceneReveal id="what" className="py-40 md:py-60 px-6 bg-[#F5EFE6] overflow-hidden">
      <div className="max-w-3xl mx-auto text-center">
        <FadeUp>
          <SectionLabel>הפילוסופיה</SectionLabel>
        </FadeUp>

        <div className="font-display text-[2.8rem] md:text-[3.8rem] lg:text-[4.8rem] text-[#1C1410] leading-[1.15] mb-20 tracking-tight">
          <WordReveal text="אני לא מגיעה לתעד." className="block mb-3" delay={0.1} />
          <WordReveal text="אני מגיעה ליצור." className="block text-[#C4956A]" delay={0.45} />
        </div>

        {/* Ornamental divider */}
        <FadeIn delay={0.6}>
          <div className="flex items-center justify-center gap-4 mb-12">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#C4956A]/40" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#C4956A]/40" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#C4956A]/40" />
          </div>
        </FadeIn>

        <FadeUp delay={0.5}>
          <p className="text-[#1C1410]/50 text-base md:text-[1.1rem] font-light leading-[2] max-w-lg mx-auto mb-12 tracking-wide">
            בעוד כולם מבינים שזה יום אחד, אני מבינה שזה תוכן לנצח.
            כל רגע, כל מבט, כל פרט הופך לסיפור שנשאר ברשת,
            חי ומדובר, זמן רב אחרי שהאורחים חזרו הביתה.
          </p>
        </FadeUp>

        <FadeUp delay={0.65}>
          <a
            href={`https://www.instagram.com/${IG}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="עמוד האינסטגרם של נעם סושיאל"
            className="inline-flex items-center gap-2.5 text-xs text-[#C4956A]/70 font-light tracking-[0.2em] uppercase border-b border-[#C4956A]/25 pb-1 hover:text-[#C4956A] hover:border-[#C4956A]/60 transition-all duration-400"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
            </svg>
            @{IG}
          </a>
        </FadeUp>
      </div>
    </SceneReveal>
  )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   SPECIALTIES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const SPECIALTIES = [
  'אירועי קדם חתונה',
  'הפרשת חלה',
  'חינה',
  'מקווה',
  'סייב דה דייט',
  'הפקות אופנה',
]

function Specialties() {
  return (
    <SceneReveal className="py-16 md:py-20 px-6 bg-[#1C1410] border-t border-white/5">
      <div className="max-w-5xl mx-auto">
        <FadeUp className="text-center mb-10">
          <SectionLabel light>תחומי התמחות</SectionLabel>
        </FadeUp>
        <FadeUp delay={0.1}>
          <div className="flex flex-wrap justify-center gap-3">
            {SPECIALTIES.map((s, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="card-lift text-sm font-light tracking-wide text-[#D4AF80]/70 border border-[#D4AF80]/20 px-5 py-2 rounded-full hover:border-[#D4AF80]/50 hover:text-[#D4AF80] transition-colors duration-300"
              >
                {s}
              </motion.span>
            ))}
          </div>
        </FadeUp>
      </div>
    </SceneReveal>
  )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   HOW IT WORKS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'שיחת טלפון',
      desc: 'לפני החתונה: שיחה קצרה להכיר מי אתן, מה אתן אוהבות, ומה אתן רוצות שהרשת תראה.',
    },
    {
      num: '02',
      title: 'ביום עצמו',
      desc: 'אני שם לב לרגעים שאף אחד אחר לא מתעד, ומייצרת תוכן בזמן אמת, לאורך כל היום.',
    },
    {
      num: '03',
      title: 'עוד בלילה',
      desc: 'רילס, סטוריז ותמונות, מוכנים לפרסום. פותחות את הטלפון ומוצאות את הסיפור שלכן.',
    },
  ]

  return (
    <SceneReveal id="how" className="py-32 md:py-52 px-6 bg-[#EDE5D8]">
      <div className="max-w-6xl mx-auto">
        <FadeUp className="mb-24 md:mb-36">
          <SectionLabel>התהליך</SectionLabel>
          <h2 className="font-display text-5xl md:text-7xl text-[#1C1410] leading-[1.05] tracking-tight">
            איך זה עובד
          </h2>
        </FadeUp>

        <div className="grid md:grid-cols-3 gap-12 md:gap-8 relative">
          {/* Full-width connecting line on desktop */}
          <div className="hidden md:block absolute top-[2.2rem] right-0 left-0 h-px">
            <div className="h-px bg-gradient-to-l from-transparent via-[#C4956A]/30 to-transparent w-2/3 mx-auto" />
          </div>

          {steps.map((step, i) => (
            <FadeUp key={i} delay={i * 0.18}>
              <div className="step-hover relative group">
                {/* Number */}
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-11 h-11 rounded-full border border-[#C4956A]/30 flex items-center justify-center group-hover:border-[#C4956A]/70 transition-colors duration-500">
                    <span className="font-display text-sm text-[#C4956A]/70 group-hover:text-[#C4956A] transition-colors duration-500">
                      {step.num}
                    </span>
                  </div>
                  <div className="flex-1 h-px bg-gradient-to-l from-[#C4956A]/15 to-transparent md:hidden" />
                </div>

                <h3 className="font-display text-2xl md:text-3xl text-[#1C1410] mb-4 leading-tight tracking-tight">
                  {step.title}
                </h3>
                <p className="text-[#1C1410]/45 text-[0.92rem] leading-[1.9] font-light">
                  {step.desc}
                </p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </SceneReveal>
  )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   SHOWREEL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function Showreel() {
  const sectionRef = useRef(null)
  const videoRef   = useRef(null)
  const inView = useInView(sectionRef, { once: true, amount: 0.2 })

  /* Load + play video only when section enters viewport */
  useEffect(() => {
    if (!inView || !videoRef.current) return
    videoRef.current.load()
    videoRef.current.play().catch(() => {})
  }, [inView])

  return (
    <section ref={sectionRef} className="relative bg-[#1C1410] overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 1.04 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full"
      >
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="none"
          className="w-full h-auto max-h-[85vh] object-cover"
        >
          <source src="/video/hero-720.mp4" type="video/mp4" />
          <source src="/video/hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1410]/60 via-transparent to-[#1C1410]/30 pointer-events-none" />
      </motion.div>
    </section>
  )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   PACKAGES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function Packages() {
  return (
    <SceneReveal id="packages" className="py-28 md:py-44 px-6 bg-[#F5EFE6]">
      <div className="max-w-6xl mx-auto">
        <FadeUp className="mb-16 md:mb-20 text-center">
          <SectionLabel>מחירים</SectionLabel>
          <h2 className="font-display text-5xl md:text-6xl text-[#1C1410] leading-tight">
            חבילות
          </h2>
          <p className="text-[#1C1410]/38 text-sm mt-4 font-light">
            לכל שאלה ופרט? צרי קשר ואשלח הצעה מותאמת אישית
          </p>
        </FadeUp>

        <div className="grid md:grid-cols-3 gap-4 md:gap-5">
          {PACKAGES.map((pkg, i) => (
            <FadeUp key={i} delay={i * 0.15}>
              <motion.div
                whileHover={{ y: -10, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }}
                className={`relative h-full flex flex-col rounded-3xl p-8 md:p-10 border transition-all duration-500 ${
                  pkg.highlight
                    ? 'bg-[#1C1410] border-[#D4AF80]/20 shadow-[0_32px_80px_rgba(28,20,16,0.35)]'
                    : 'bg-white/80 backdrop-blur-sm border-[#EDE5D8] hover:border-[#C4956A]/30 hover:shadow-[0_20px_60px_rgba(196,149,106,0.08)]'
                }`}
              >
                {/* Top accent line for highlighted */}
                {pkg.highlight && (
                  <>
                    <div className="absolute inset-x-8 -top-px h-px bg-gradient-to-r from-transparent via-[#D4AF80]/60 to-transparent" />
                    <div className="absolute -top-4 inset-x-0 flex justify-center">
                      <span className="bg-[#D4AF80] text-[#1C1410] text-[10px] font-medium tracking-[0.2em] uppercase px-4 py-1 rounded-full">
                        הכי פופולרי
                      </span>
                    </div>
                  </>
                )}
                {/* Top accent line for regular on hover */}
                {!pkg.highlight && (
                  <div className="absolute inset-x-8 -top-px h-px bg-gradient-to-r from-transparent via-[#C4956A]/0 to-transparent group-hover:via-[#C4956A]/30 transition-all duration-500" />
                )}

                <div className="mb-9">
                  <p className={`text-[10px] tracking-[0.38em] uppercase font-light mb-3 ${pkg.highlight ? 'text-[#D4AF80]/50' : 'text-[#C4956A]/55'}`}>
                    {pkg.sub}
                  </p>
                  <h3 className={`font-display text-3xl md:text-4xl mb-2 leading-tight tracking-tight ${pkg.highlight ? 'text-[#F5EFE6]' : 'text-[#1C1410]'}`}>
                    {pkg.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-3">
                    <div className={`h-px w-8 ${pkg.highlight ? 'bg-[#D4AF80]/30' : 'bg-[#C4956A]/25'}`} />
                    <p className={`text-[11px] font-light tracking-wide ${pkg.highlight ? 'text-[#F5EFE6]/30' : 'text-[#1C1410]/35'}`}>
                      {pkg.duration}
                    </p>
                  </div>
                </div>

                <p className={`font-display text-xl md:text-2xl italic mb-10 leading-[1.4] ${pkg.highlight ? 'text-[#D4AF80]' : 'text-[#C4956A]'}`}>
                  {pkg.tagline}
                </p>

                <ul className="flex-1 space-y-3.5 mb-10">
                  {pkg.features.map((f, fi) => (
                    <li
                      key={fi}
                      className={`text-[0.86rem] font-light flex items-start gap-3 leading-relaxed ${pkg.highlight ? 'text-[#F5EFE6]/50' : 'text-[#1C1410]/55'}`}
                    >
                      <svg className={`flex-shrink-0 mt-0.5 ${pkg.highlight ? 'text-[#D4AF80]/60' : 'text-[#C4956A]/60'}`} width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                        <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  to="/contact"
                  className={`btn-glow block text-center py-4 rounded-2xl text-sm font-light tracking-[0.08em] ${
                    pkg.highlight
                      ? 'bg-[#D4AF80] text-[#1C1410] hover:bg-[#C4956A] hover:text-[#F5EFE6]'
                      : 'border border-[#1C1410]/14 text-[#1C1410]/60 hover:border-[#C4956A]/50 hover:text-[#C4956A] hover:bg-[#C4956A]/4'
                  }`}
                  aria-label={`בחרי את ${pkg.name}`}
                >
                  בדקי זמינות
                </Link>
              </motion.div>
            </FadeUp>
          ))}
        </div>

        {/* Bundle note */}
        <FadeUp delay={0.3} className="mt-10">
          <div className="border border-[#C4956A]/25 rounded-2xl px-8 py-6 text-center max-w-2xl mx-auto">
            <p className="font-display text-xl text-[#1C1410] italic mb-2">
              מזמינות גם ליווי חינה / הפרשת חלה וגם יום מלא?
            </p>
            <p className="text-[#1C1410]/50 text-sm font-light">
              שילוב שתי החבילות מזכה בתמחור מיוחד. צרי קשר לפרטים.
            </p>
          </div>
        </FadeUp>

      </div>
    </SceneReveal>
  )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   GALLERY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function Gallery() {
  return (
    <SceneReveal id="gallery" className="py-28 md:py-44 px-6 bg-[#1C1410]">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end justify-between mb-16 md:mb-20">
          <FadeUp>
            <SectionLabel light>עבודות</SectionLabel>
            <h2 className="font-display text-5xl md:text-6xl text-[#F5EFE6] leading-tight">
              רגעים שנשארים
            </h2>
          </FadeUp>
          <FadeUp delay={0.2} className="hidden md:block">
            <a
              href={`https://www.instagram.com/${IG}`}
              target="_blank"
              rel="noopener noreferrer"
              className="link-hover flex items-center gap-2 text-[#D4AF80]/40 hover:text-[#D4AF80] transition-colors duration-300 text-xs tracking-widest uppercase font-light"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
              @{IG}
            </a>
          </FadeUp>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
          {GALLERY.map((img, i) => (
            <FadeUp key={i} delay={i * 0.06}>
              <div
                data-cursor="gallery"
                className="group relative overflow-hidden rounded-xl aspect-[3/4]"
              >
                <picture className="w-full h-full block">
                  <source srcSet={img.url} type="image/webp" />
                  <img
                    src={img.fallback}
                    alt={img.alt}
                    className="w-full h-full object-cover block transition-transform duration-500 ease-out group-hover:scale-[1.05]"
                    style={{ willChange: 'transform' }}
                    loading="lazy"
                    decoding="async"
                    width="400"
                    height="533"
                  />
                </picture>
                <div className="absolute inset-0 bg-[#1C1410] opacity-0 group-hover:opacity-20 transition-opacity duration-500 ease-out" />
              </div>
            </FadeUp>
          ))}
        </div>

        <FadeUp delay={0.2} className="mt-10 md:hidden text-center">
          <a
            href={`https://www.instagram.com/${IG}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[#D4AF80]/50 text-xs tracking-widest uppercase font-light"
          >
            @{IG}
          </a>
        </FadeUp>
      </div>
    </SceneReveal>
  )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   TESTIMONIALS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const REVIEW_SCREENSHOTS = [
  { webp: '/reviews/r1.webp', fallback: '/reviews/r1.png' },
  { webp: '/reviews/r2.webp', fallback: '/reviews/r2.png' },
  { webp: '/reviews/r3.webp', fallback: '/reviews/r3.png' },
  { webp: '/reviews/r4.webp', fallback: '/reviews/r4.png' },
  { webp: '/reviews/r5.webp', fallback: '/reviews/r5.png' },
  { webp: '/reviews/r6.webp', fallback: '/reviews/r6.png' },
  { webp: '/reviews/r7.webp', fallback: '/reviews/r7.png' },
  { webp: '/reviews/r8.webp', fallback: '/reviews/r8.png' },
]

function Testimonials() {
  const [current, setCurrent] = useState(0)
  const [tab, setTab] = useState('quotes')

  useEffect(() => {
    if (tab !== 'quotes') return
    const id = setInterval(() => {
      setCurrent((c) => (c + 1) % TESTIMONIALS.length)
    }, 6500)
    return () => clearInterval(id)
  }, [tab])

  const t = TESTIMONIALS[current]

  return (
    <SceneReveal id="testimonials" className="py-28 md:py-44 px-6 bg-[#EDE5D8]">
      <div className="max-w-5xl mx-auto">
        <FadeUp className="text-center mb-14">
          <SectionLabel>אמרו עלי</SectionLabel>
        </FadeUp>

        {/* Tab switcher */}
        <FadeUp delay={0.1} className="flex justify-center mb-14">
          <div className="flex gap-1 bg-[#1C1410]/8 rounded-full p-1">
            <button
              onClick={() => setTab('quotes')}
              className={`px-6 py-2 rounded-full text-sm font-light tracking-wide transition-all duration-400 ${
                tab === 'quotes'
                  ? 'bg-[#1C1410] text-[#F5EFE6]'
                  : 'text-[#1C1410]/50 hover:text-[#1C1410]'
              }`}
            >
              ציטוטים
            </button>
            <button
              onClick={() => setTab('screenshots')}
              className={`px-6 py-2 rounded-full text-sm font-light tracking-wide transition-all duration-400 ${
                tab === 'screenshots'
                  ? 'bg-[#1C1410] text-[#F5EFE6]'
                  : 'text-[#1C1410]/50 hover:text-[#1C1410]'
              }`}
            >
              צילומי מסך
            </button>
          </div>
        </FadeUp>

        <AnimatePresence mode="wait">
          {tab === 'quotes' ? (
            <motion.div
              key="quotes"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="relative min-h-[220px] flex flex-col items-center justify-center text-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current}
                    initial={{ opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -28 }}
                    transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="text-[#C4956A]/30 font-display text-6xl leading-none mb-2 select-none" aria-hidden="true">"</div>
                    <blockquote className="font-display text-2xl md:text-3xl lg:text-4xl text-[#1C1410] leading-[1.4] font-light mb-8 max-w-2xl mx-auto">
                      {t.quote}
                    </blockquote>
                    <div className="flex items-center justify-center gap-3">
                      <div className="h-px w-8 bg-[#C4956A]/30" />
                      <p className="text-[#C4956A]/70 text-xs font-light tracking-[0.2em] uppercase">{t.name}</p>
                      <div className="h-px w-8 bg-[#C4956A]/30" />
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="flex items-center justify-center gap-3 mt-14">
                {TESTIMONIALS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    aria-label={`המלצה ${i + 1}`}
                    className={`transition-all duration-400 rounded-full ${
                      i === current
                        ? 'w-7 h-1.5 bg-[#C4956A]'
                        : 'w-1.5 h-1.5 bg-[#C4956A]/25 hover:bg-[#C4956A]/50'
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="screenshots"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3"
            >
              {REVIEW_SCREENSHOTS.map((src, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                  className="break-inside-avoid rounded-2xl overflow-hidden shadow-sm"
                >
                  <picture>
                    <source srcSet={src.webp} type="image/webp" />
                    <img
                      src={src.fallback}
                      alt={`ביקורת כלה ${i + 1} על נעם סושיאל, צלמת סושיאל לחתונות`}
                      className="w-full h-auto block"
                      loading="lazy"
                      decoding="async"
                    />
                  </picture>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </SceneReveal>
  )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   CONTACT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function Contact() {
  return (
    <SceneReveal id="contact" className="py-36 md:py-56 px-6 bg-[#1C1410] relative overflow-hidden">
      {/* Layered decorative rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-[#D4AF80]/5 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] rounded-full border border-[#D4AF80]/3 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full border border-[#D4AF80]/[0.015] pointer-events-none" />
      {/* Radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-[#D4AF80]/[0.04] blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <FadeUp>
          <SectionLabel light>יצירת קשר</SectionLabel>
          <h2 className="font-display text-6xl md:text-8xl text-[#F5EFE6] leading-[1.0] tracking-tight mb-8">
            בואי{' '}
            <em className="text-[#D4AF80] not-italic">נדבר</em>
          </h2>
          <p className="text-[#F5EFE6]/30 text-base md:text-lg font-light leading-[1.9] mb-14 max-w-xs mx-auto">
            ספרי לי על היום הגדול שלכן ואבנה הצעה מותאמת אישית.
          </p>
        </FadeUp>

        <FadeUp delay={0.25}>
          <a
            href={`https://wa.me/${PHONE}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="שלחי הודעה ב-WhatsApp"
            className="btn-glow group inline-flex items-center gap-4 bg-[#D4AF80] text-[#1C1410] px-10 py-5 rounded-full text-[0.95rem] font-medium hover:bg-[#C4956A] hover:text-[#F5EFE6] tracking-[0.05em] shadow-[0_16px_48px_rgba(212,175,128,0.2)]"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="flex-shrink-0" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.135.561 4.14 1.541 5.875L0 24l6.303-1.519A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.001-1.366l-.359-.213-3.722.897.933-3.618-.234-.372A9.796 9.796 0 012.182 12C2.182 6.575 6.575 2.182 12 2.182S21.818 6.575 21.818 12 17.425 21.818 12 21.818z" />
            </svg>
            שלחי הודעה ב-WhatsApp
          </a>
        </FadeUp>

        <FadeUp delay={0.4} className="mt-10">
          <div className="flex items-center justify-center gap-5 text-[#F5EFE6]/18">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#F5EFE6]/10" />
            <a
              href={`https://www.instagram.com/${IG}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="עמוד האינסטגרם של נעם"
              className="link-hover flex items-center gap-2 text-xs text-[#D4AF80]/40 hover:text-[#D4AF80]/70 transition-colors duration-300 tracking-[0.15em]"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
              @{IG}
            </a>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#F5EFE6]/10" />
          </div>
        </FadeUp>
      </div>
    </SceneReveal>
  )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   FOOTER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function Footer() {
  return (
    <SceneReveal as="footer" className="py-10 px-6 bg-[#1C1410] border-t border-white/5">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-5">
        <FadeIn delay={0.1}>
          <a href="/">
            <img
              src="/logo.webp"
              alt="לוגו נעם סושיאל"
              className="h-7 md:h-12 w-auto opacity-60 hover:opacity-90 transition-opacity duration-300"
              style={{ filter: 'invert(1) brightness(1.1)' }}
            />
          </a>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="flex items-center gap-8">
            <a
              href={`https://www.instagram.com/${IG}`}
              target="_blank"
              rel="noopener noreferrer"
              className="link-hover flex items-center gap-2 text-[#D4AF80]/40 hover:text-[#D4AF80] transition-colors duration-300 text-xs tracking-widest uppercase font-light"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
              Instagram
            </a>
            <a
              href={`https://wa.me/${PHONE}`}
              target="_blank"
              rel="noopener noreferrer"
              className="link-hover text-[#D4AF80]/40 hover:text-[#D4AF80] transition-colors duration-300 text-xs tracking-widest uppercase font-light"
            >
              WhatsApp
            </a>
          </div>
        </FadeIn>

        <FadeIn delay={0.3}>
          <div className="flex flex-col items-center md:items-end gap-1">
            <p className="text-[#F5EFE6]/14 text-xs font-light">
              © {new Date().getFullYear()} נעם
            </p>
            <div className="flex gap-4">
              <Link to="/terms" className="link-hover text-[#F5EFE6]/25 hover:text-[#F5EFE6]/60 text-xs font-light transition-colors duration-300">
                תנאי שימוש
              </Link>
              <Link to="/privacy" className="link-hover text-[#F5EFE6]/25 hover:text-[#F5EFE6]/60 text-xs font-light transition-colors duration-300">
                מדיניות פרטיות
              </Link>
            </div>
          </div>
        </FadeIn>
      </div>
    </SceneReveal>
  )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   MUSIC PLAYER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const MUSIC_SRC = '/audio/bg.m4a'

function MusicPlayer() {
  const audioRef = useRef(null)
  const fadeRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [ready, setReady] = useState(false)

  const fadeTo = (target, onDone) => {
    clearInterval(fadeRef.current)
    const audio = audioRef.current
    if (!audio) return
    fadeRef.current = setInterval(() => {
      const diff = target - audio.volume
      if (Math.abs(diff) < 0.015) {
        audio.volume = target
        clearInterval(fadeRef.current)
        onDone?.()
      } else {
        audio.volume += diff * 0.12
      }
    }, 40)
  }

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      fadeTo(0, () => audio.pause())
      setPlaying(false)
    } else {
      audio.volume = 0
      audio.play().then(() => {
        fadeTo(0.32)
        setPlaying(true)
      }).catch(() => {})
    }
  }

  useEffect(() => () => clearInterval(fadeRef.current), [])

  const bars = [0.4, 1, 0.6, 0.85, 0.5]

  return (
    <>
      <audio
        ref={audioRef}
        src={MUSIC_SRC}
        loop
        preload="none"
        onCanPlayThrough={() => setReady(true)}
      />

      <motion.button
        onClick={toggle}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 4, duration: 0.8 }}
        title={playing ? 'עצרי מוזיקה' : 'הפעילי מוזיקה'}
        aria-label={playing ? 'עצרי מוזיקה' : 'הפעילי מוזיקה'}
        className="fixed bottom-8 left-8 z-[300] w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300"
        style={{
          background: 'rgba(28,20,16,0.75)',
          backdropFilter: 'blur(10px)',
          border: `1px solid rgba(212,175,128,${playing ? '0.7' : '0.3'})`,
        }}
      >
        <AnimatePresence mode="wait">
          {playing ? (
            /* animated sound bars */
            <motion.div
              key="bars"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-end gap-[2.5px]"
              style={{ height: 14 }}
            >
              {bars.map((h, i) => (
                <motion.span
                  key={i}
                  animate={{ scaleY: [h, 1, h * 0.6, 0.9, h] }}
                  transition={{
                    duration: 1.1,
                    delay: i * 0.13,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  style={{
                    display: 'block',
                    width: 2.5,
                    height: '100%',
                    borderRadius: 2,
                    backgroundColor: 'rgba(212,175,128,0.9)',
                    transformOrigin: 'bottom',
                  }}
                />
              ))}
            </motion.div>
          ) : (
            /* music note icon */
            <motion.svg
              key="note"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="rgba(212,175,128,0.75)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ACCESSIBILITY WIDGET
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function ToggleRow({ label, value, onChange, ariaLabel }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl mb-2 transition-all duration-200 ${
        value ? 'bg-[#D4AF80]/20 border border-[#D4AF80]/40' : 'border border-white/8 hover:border-[#D4AF80]/20'
      }`}
      aria-pressed={value}
      aria-label={ariaLabel}
    >
      <span className="text-[#F5EFE6]/80 text-xs">{label}</span>
      <div className={`w-9 h-5 rounded-full transition-colors duration-200 flex items-center px-0.5 ${value ? 'bg-[#D4AF80]' : 'bg-white/10'}`}>
        <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ${value ? '-translate-x-4' : ''}`} />
      </div>
    </button>
  )
}

function AccessibilityWidget() {
  const [open, setOpen] = useState(false)
  const [fontSize, setFontSize] = useState(0)
  const [highContrast, setHighContrast] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)
  const [underlineLinks, setUnderlineLinks] = useState(false)

  useEffect(() => {
    document.documentElement.style.fontSize = fontSize === 0 ? '' : `${100 + fontSize * 10}%`
  }, [fontSize])

  useEffect(() => {
    document.documentElement.classList.toggle('high-contrast', highContrast)
  }, [highContrast])

  useEffect(() => {
    document.documentElement.classList.toggle('force-dark', darkMode)
  }, [darkMode])

  useEffect(() => {
    document.documentElement.classList.toggle('reduce-motion', reduceMotion)
  }, [reduceMotion])

  useEffect(() => {
    document.documentElement.classList.toggle('underline-links', underlineLinks)
  }, [underlineLinks])

  const isDirty = fontSize !== 0 || highContrast || darkMode || reduceMotion || underlineLinks

  return (
    <div className="fixed bottom-8 right-6 z-[400] flex flex-col items-end gap-2" role="complementary" aria-label="כלי נגישות">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="bg-[#1C1410] border border-[#D4AF80]/20 rounded-2xl p-5 w-64 shadow-2xl"
            role="dialog"
            aria-modal="false"
            aria-label="הגדרות נגישות"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-[#F5EFE6] text-sm font-medium tracking-wide">נגישות</p>
              <button onClick={() => setOpen(false)} aria-label="סגור תפריט נגישות" className="text-[#F5EFE6]/30 hover:text-[#F5EFE6]/70 transition-colors text-lg leading-none">×</button>
            </div>

            {/* Font size */}
            <fieldset className="mb-4 border-none p-0">
              <legend className="text-[#F5EFE6]/50 text-xs mb-2">גודל טקסט</legend>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFontSize(f => Math.max(-1, f - 1))}
                  disabled={fontSize === -1}
                  className="w-9 h-9 rounded-full border border-[#D4AF80]/30 text-[#D4AF80] hover:bg-[#D4AF80]/10 disabled:opacity-30 transition-colors text-lg flex items-center justify-center"
                  aria-label="הקטן גודל טקסט"
                >א<span className="text-[0.6rem] mr-0.5">−</span></button>
                <div className="flex-1 text-center text-[#F5EFE6]/50 text-xs">
                  {fontSize === 0 ? 'רגיל' : fontSize > 0 ? `+${fontSize * 10}%` : `${fontSize * 10}%`}
                </div>
                <button
                  onClick={() => setFontSize(f => Math.min(3, f + 1))}
                  disabled={fontSize === 3}
                  className="w-9 h-9 rounded-full border border-[#D4AF80]/30 text-[#D4AF80] hover:bg-[#D4AF80]/10 disabled:opacity-30 transition-colors text-lg flex items-center justify-center"
                  aria-label="הגדל גודל טקסט"
                >א<span className="text-[0.85rem] mr-0.5">+</span></button>
              </div>
            </fieldset>

            <div role="group" aria-label="הגדרות תצוגה">
              <ToggleRow label="ניגודיות גבוהה" value={highContrast} onChange={setHighContrast} ariaLabel="הפעל ניגודיות גבוהה" />
              <ToggleRow label="מצב כהה" value={darkMode} onChange={setDarkMode} ariaLabel="הפעל מצב כהה" />
              <ToggleRow label="הפחתת תנועה" value={reduceMotion} onChange={setReduceMotion} ariaLabel="הפחת תנועה ואנימציות" />
              <ToggleRow label="הדגשת קישורים" value={underlineLinks} onChange={setUnderlineLinks} ariaLabel="הדגש קישורים עם קו תחתון" />
            </div>

            {isDirty && (
              <button
                onClick={() => { setFontSize(0); setHighContrast(false); setDarkMode(false); setReduceMotion(false); setUnderlineLinks(false) }}
                className="w-full mt-2 py-2 text-xs text-[#C4956A]/60 hover:text-[#C4956A] transition-colors duration-200 border border-dashed border-[#D4AF80]/15 rounded-xl"
                aria-label="אפס את כל הגדרות הנגישות"
              >
                אפס הכל
              </button>
            )}

            <p className="text-[#F5EFE6]/18 text-[10px] mt-3 text-center">
              נגישות לפי WCAG 2.1
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen(v => !v)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={open ? 'סגור תפריט נגישות' : 'פתח תפריט נגישות'}
        aria-expanded={open}
        aria-haspopup="dialog"
        className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300"
        style={{
          background: open ? 'rgba(212,175,128,0.95)' : 'rgba(28,20,16,0.85)',
          border: `1.5px solid rgba(212,175,128,${open ? '0.95' : '0.4'})`,
          backdropFilter: 'blur(12px)',
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={open ? '#1C1410' : 'rgba(212,175,128,0.95)'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="5" r="1.8" />
          <path d="M5 9.5c2.3-.5 4.5-.8 7-.8s4.7.3 7 .8" />
          <path d="M12 8.7V15" />
          <path d="M9 22l1.5-5M15 22l-1.5-5" />
        </svg>
      </motion.button>
    </div>
  )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   404 PAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function NotFoundPage() {
  usePageMeta('דף לא נמצא', 'הדף המבוקש לא קיים באתר של נעם סושיאל.')
  return (
    <PageTransition>
      <section className="min-h-screen bg-[#1C1410] flex flex-col items-center justify-center px-6 text-center">
        <p className="text-[#D4AF80]/40 text-xs tracking-[0.3em] uppercase font-light mb-6">שגיאה 404</p>
        <h1 className="font-display text-7xl md:text-9xl text-[#F5EFE6] mb-6">404</h1>
        <p className="text-[#F5EFE6]/40 text-lg font-light mb-12 max-w-xs leading-relaxed">
          הדף שחיפשת לא נמצא. אולי הוא מצלם רילס איפשהו.
        </p>
        <Link
          to="/"
          className="btn-glow inline-flex items-center gap-3 text-sm text-[#1C1410] bg-[#D4AF80] px-8 py-4 rounded-full hover:bg-[#C4956A] hover:text-[#F5EFE6] font-medium tracking-wide"
        >
          חזרה לדף הבית
        </Link>
      </section>
    </PageTransition>
  )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   LEGAL PAGE TEMPLATE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function LegalPage({ title, children }) {
  return (
    <PageTransition>
      <section className="pt-36 pb-24 px-6 bg-[#F5EFE6] min-h-screen">
        <div className="max-w-2xl mx-auto">
          <FadeUp>
            <SectionLabel>משפטי</SectionLabel>
            <h1 className="font-display text-4xl md:text-5xl text-[#1C1410] mb-12">{title}</h1>
          </FadeUp>
          <FadeUp delay={0.1}>
            <div className="prose prose-sm text-[#1C1410]/65 leading-relaxed space-y-6 font-light text-base">
              {children}
            </div>
          </FadeUp>
        </div>
      </section>
    </PageTransition>
  )
}

function TermsPage() {
  usePageMeta('תנאי שימוש', 'תנאי השימוש באתר נעם סושיאל — צילום סושיאל לחתונות.')
  return (
    <LegalPage title="תנאי שימוש">
      <p>עדכון אחרון: מאי 2025</p>

      <h2 className="font-display text-xl text-[#1C1410] mt-8 mb-2">1. כללי</h2>
      <p>ברוכה הבאה לאתר של נעם סושיאל. השימוש באתר מהווה הסכמה לתנאים המפורטים להלן. אם אינך מסכימה לתנאים, אנא הפסיקי את השימוש באתר.</p>

      <h2 className="font-display text-xl text-[#1C1410] mt-8 mb-2">2. השירות</h2>
      <p>האתר מספק מידע על שירותי צילום סושיאל לחתונות הניתנים על ידי נעם. כל התמונות והסרטונים באתר שייכים לנעם סושיאל ואין להעתיקם ללא אישור בכתב.</p>

      <h2 className="font-display text-xl text-[#1C1410] mt-8 mb-2">3. קניין רוחני</h2>
      <p>כל התכנים באתר, לרבות תמונות, טקסטים, לוגו ועיצוב, מוגנים בזכויות יוצרים ושייכים לנעם סושיאל. חל איסור מוחלט להעתיק, לשכפל או להפיץ כל תוכן מהאתר ללא אישור מפורש בכתב.</p>

      <h2 className="font-display text-xl text-[#1C1410] mt-8 mb-2">4. הזמנת שירות</h2>
      <p>פנייה דרך האתר אינה מהווה הזמנה מחייבת. ההזמנה תיחשב מאושרת רק לאחר חתימה על הסכם שירות מפורש ותשלום מקדמה.</p>

      <h2 className="font-display text-xl text-[#1C1410] mt-8 mb-2">5. אחריות</h2>
      <p>נעם סושיאל אינה אחראית לנזקים ישירים או עקיפים הנובעים מהשימוש באתר. המידע באתר מסופק "כפי שהוא" ללא אחריות מכל סוג.</p>

      <h2 className="font-display text-xl text-[#1C1410] mt-8 mb-2">6. שינויים</h2>
      <p>נעם סושיאל שומרת לעצמה את הזכות לשנות תנאים אלה בכל עת. שינויים יפורסמו באתר ויכנסו לתוקף מיד עם פרסומם.</p>

      <h2 className="font-display text-xl text-[#1C1410] mt-8 mb-2">7. יצירת קשר</h2>
      <p>לשאלות בנוגע לתנאי השימוש ניתן לפנות דרך WhatsApp או אינסטגרם @{IG}.</p>
    </LegalPage>
  )
}

function PrivacyPage() {
  usePageMeta('מדיניות פרטיות', 'מדיניות הפרטיות של נעם סושיאל — כיצד אנו מגנים על המידע שלך.')
  return (
    <LegalPage title="מדיניות פרטיות">
      <p>עדכון אחרון: מאי 2025</p>

      <h2 className="font-display text-xl text-[#1C1410] mt-8 mb-2">1. מידע שנאסף</h2>
      <p>האתר אינו אוסף מידע אישי באופן אוטומטי. פנייה דרך WhatsApp מהווה מסירה מרצון של מספר הטלפון שלך לצורך יצירת קשר בלבד.</p>

      <h2 className="font-display text-xl text-[#1C1410] mt-8 mb-2">2. שימוש במידע</h2>
      <p>המידע שתמסרי ישמש אך ורק לצורך מתן השירות המבוקש. לא יועבר לצדדים שלישיים ולא ישמש למטרות שיווק ללא הסכמתך.</p>

      <h2 className="font-display text-xl text-[#1C1410] mt-8 mb-2">3. תמונות וסרטונים</h2>
      <p>תמונות וסרטונים שיצולמו במהלך האירוע עשויים לשמש לצרכי שיווק ופורטפוליו, בכפוף להסכמה מפורשת בהסכם השירות.</p>

      <h2 className="font-display text-xl text-[#1C1410] mt-8 mb-2">4. קוקיז</h2>
      <p>האתר עשוי להשתמש בקוקיז טכניים לצורך תפקוד תקין. אין שימוש בקוקיז לצרכי מעקב שיווקי.</p>

      <h2 className="font-display text-xl text-[#1C1410] mt-8 mb-2">5. אבטחת מידע</h2>
      <p>אנו נוקטים אמצעי אבטחה סבירים להגנה על המידע שמסרת. עם זאת, אין אפשרות להבטיח אבטחה מוחלטת של מידע המועבר דרך האינטרנט.</p>

      <h2 className="font-display text-xl text-[#1C1410] mt-8 mb-2">6. זכויותייך</h2>
      <p>יש לך הזכות לעיין במידע שנאסף אודותייך, לבקש תיקון או מחיקתו. לפנייה בנושא: WhatsApp או @{IG} באינסטגרם.</p>
    </LegalPage>
  )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   PAGE TRANSITION WRAPPER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   SEO HOOK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function usePageMeta(title, description) {
  useEffect(() => {
    const fullTitle = title ? `${title} | נעם סושיאל` : 'נעם | צילום סושיאל לחתונות'
    document.title = fullTitle

    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc && description) metaDesc.setAttribute('content', description)

    const ogTitle = document.querySelector('meta[property="og:title"]')
    if (ogTitle) ogTitle.setAttribute('content', fullTitle)

    const ogDesc = document.querySelector('meta[property="og:description"]')
    if (ogDesc && description) ogDesc.setAttribute('content', description)

    return () => {
      document.title = 'נעם | צילום סושיאל לחתונות'
    }
  }, [title, description])
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   PAGES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function HomePage() {
  usePageMeta(
    null,
    'נעם — צלמת סושיאל לחתונות. צילום חתונות וסושיאל ברמה אחרת. רילס, סטוריז ותמונות מוכנות לפרסום עוד ביום החתונה.'
  )
  return (
    <PageTransition>
      <Hero />
      <Manifesto />
      <Specialties />
      <HowItWorks />
      <Showreel />
    </PageTransition>
  )
}

function PackagesPage() {
  usePageMeta(
    'חבילות',
    'חבילות צילום סושיאל לחתונות של נעם — חבילת התארגנות, יום מלא, וליווי חינה/הפרשת חלה. תוכן מוכן לפרסום ביום החתונה.'
  )
  return (
    <PageTransition>
      <div className="pt-24 md:pt-28">
        <Packages />
      </div>
    </PageTransition>
  )
}

function GalleryPage() {
  usePageMeta(
    'גלריה',
    'גלריית עבודות של נעם סושיאל — צילומי חתונות, קדם-חתונה, חינה והפרשת חלה. רגעים שנשארים לנצח.'
  )
  return (
    <PageTransition>
      <div className="pt-24 md:pt-28">
        <Gallery />
      </div>
    </PageTransition>
  )
}

function TestimonialsPage() {
  usePageMeta(
    'ביקורות',
    'מה אומרות כלות על נעם סושיאל — ביקורות אמיתיות מכלות שחוו את השירות ביום החתונה שלהן.'
  )
  return (
    <PageTransition>
      <div className="pt-24 md:pt-28">
        <Testimonials />
      </div>
    </PageTransition>
  )
}

function ContactPage() {
  usePageMeta(
    'צרי קשר',
    'צרי קשר עם נעם לבדיקת זמינות לחתונה שלך. שלחי הודעה ב-WhatsApp או באינסטגרם @noamsocial_'
  )
  return (
    <PageTransition>
      <div className="pt-24 md:pt-28">
        <Contact />
      </div>
    </PageTransition>
  )
}

function AppRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/packages" element={<PackagesPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/testimonials" element={<TestimonialsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AnimatePresence>
  )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   APP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   LUXURY SMOOTH SCROLL — Lenis
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function useLuxuryScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.07,                          // lower = slower / smoother (0.07 = luxury)
      smoothWheel: true,
      smoothTouch: false,                  // native on touch — more comfortable
      wheelMultiplier: 0.9,               // slightly slower wheel
      touchMultiplier: 1.8,
      infinite: false,
    })

    let rafId
    function raf(time) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [])
}

export default function App() {
  useLuxuryScroll()

  return (
    <BrowserRouter>
      <div dir="rtl" lang="he">
        {/* Skip to content — keyboard accessibility */}
        <a href="#main-content" className="skip-link">דלגי לתוכן הראשי</a>

        <GrainOverlay />
        <CustomCursor />
        <MusicPlayer />
        <AccessibilityWidget />
        <Nav />
        <main id="main-content" tabIndex={-1}>
          <AppRoutes />
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
