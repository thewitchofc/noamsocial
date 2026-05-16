import { useEffect, useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   CONSTANTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const PHONE = '972501234567'
const IG = 'noamsocial_'

const GALLERY = [
  { url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=700&auto=format&fit=crop&q=80', alt: 'חופה' },
  { url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=700&auto=format&fit=crop&q=80', alt: 'פרחים' },
  { url: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=700&auto=format&fit=crop&q=80', alt: 'כלה' },
  { url: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=700&auto=format&fit=crop&q=80', alt: 'ריקוד' },
  { url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=700&auto=format&fit=crop&q=80', alt: 'אווירה' },
  { url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=700&auto=format&fit=crop&q=80', alt: 'זוג' },
  { url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=700&auto=format&fit=crop&q=80', alt: 'פרטים' },
  { url: 'https://images.unsplash.com/photo-1550005809-91ad75fb315f?w=700&auto=format&fit=crop&q=80', alt: 'רגע' },
]

const TESTIMONIALS = [
  {
    quote: 'בלילה של החתונה כבר היה לנו רילס שגרם לכולם לבכות. לא האמנו שזה אפשרי.',
    name: 'שירה ואבי',
    date: 'מרץ 2024',
  },
  {
    quote: 'נועם הפכה את היום שלנו לסיפור שכולם רצו לראות. לא רק לתעד — ליצור.',
    name: 'ליאור ומיטל',
    date: 'ינואר 2024',
  },
  {
    quote: 'קמנו בבוקר שאחרי עם תוכן מוכן, ערוך ומושלם. כאילו מישהו חי את היום שלנו.',
    name: 'תמר וגיא',
    date: 'נובמבר 2023',
  },
]

const PACKAGES = [
  {
    name: 'חבילת הכנות',
    sub: 'Getting Ready',
    tagline: 'רגע לפני שהקסם מתחיל',
    duration: '5 שעות',
    features: [
      'הגעה לקלוקיישן ההכנות',
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
    duration: 'מהכנות ועד הכניסה',
    features: [
      'צילום ברציפות — מהכנות ועד הכניסה',
      'חופה, ריקודים וכל הרגעים שבינהם',
      'רילס + סטורי ללא הגבלה',
      'תוכן סטיילס ודיטיילס',
      'תוכן מוכן לפרסום באותו לילה',
    ],
    highlight: true,
  },
  {
    name: 'ציוני ליוני',
    sub: 'Bachelorette',
    tagline: 'הלילה שלפני הגדול',
    duration: '5 שעות',
    features: [
      'הגעה לפני האורחות — כלה בלבד',
      'צילום הכנת הכלה בבית',
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
function GrainOverlay() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9998,
        pointerEvents: 'none',
        opacity: 0.045,
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '256px 256px',
      }}
    />
  )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   CUSTOM CURSOR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function CustomCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const mouse = useRef({ x: -300, y: -300 })
  const ring = useRef({ x: -300, y: -300 })
  const raf = useRef(null)
  const [mode, setMode] = useState('default')

  useEffect(() => {
    const onMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY }
      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`
        dotRef.current.style.top = `${e.clientY}px`
      }
    }

    const onOver = (e) => {
      const t = e.target
      if (t.closest('[data-cursor="gallery"]')) setMode('gallery')
      else if (t.closest('button, a, [data-cursor="button"]')) setMode('button')
      else if (t.closest('p, h1, h2, h3, h4, blockquote, li')) setMode('text')
      else setMode('default')
    }

    const lerp = (a, b, n) => a + (b - a) * n
    const tick = () => {
      ring.current.x = lerp(ring.current.x, mouse.current.x, 0.1)
      ring.current.y = lerp(ring.current.y, mouse.current.y, 0.1)
      if (ringRef.current) {
        ringRef.current.style.left = `${ring.current.x}px`
        ringRef.current.style.top = `${ring.current.y}px`
      }
      raf.current = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseover', onOver)
    raf.current = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      cancelAnimationFrame(raf.current)
    }
  }, [])

  return (
    <>
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          zIndex: 10001,
          pointerEvents: 'none',
          width: mode === 'text' ? 2 : 5,
          height: mode === 'text' ? 20 : 5,
          borderRadius: mode === 'text' ? 2 : '50%',
          backgroundColor: 'rgba(212,175,128,0.95)',
          transform: 'translate(-50%, -50%)',
          transition: 'width 0.2s ease, height 0.2s ease, border-radius 0.2s ease',
        }}
      />
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          zIndex: 10000,
          pointerEvents: 'none',
          width: mode === 'gallery' ? 80 : mode === 'button' ? 56 : 36,
          height: mode === 'gallery' ? 80 : mode === 'button' ? 56 : 36,
          borderRadius: '50%',
          border: `1px solid rgba(212,175,128,${mode === 'gallery' ? '0.9' : '0.7'})`,
          backgroundColor: mode === 'button' ? 'rgba(212,175,128,0.12)' : 'transparent',
          transform: 'translate(-50%, -50%)',
          transition: 'width 0.35s cubic-bezier(0.25,1,0.5,1), height 0.35s cubic-bezier(0.25,1,0.5,1), background-color 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {mode === 'gallery' && (
          <span
            style={{
              fontSize: 8,
              letterSpacing: '0.2em',
              color: 'rgba(212,175,128,0.9)',
              fontFamily: 'DM Sans, sans-serif',
              textTransform: 'uppercase',
              userSelect: 'none',
            }}
          >
            VIEW
          </span>
        )}
      </div>
    </>
  )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   UTILITY COMPONENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function FadeUp({ children, delay = 0, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.15 })
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

function WordReveal({ text, className = '', delay = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })
  const words = text.split(' ')
  return (
    <span ref={ref} className={className}>
      {words.map((word, i) => (
        <span
          key={i}
          style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }}
        >
          <motion.span
            style={{ display: 'inline-block' }}
            initial={{ y: '110%', opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : {}}
            transition={{
              duration: 0.9,
              delay: delay + i * 0.075,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {word}{i < words.length - 1 ? '\u00A0' : ''}
          </motion.span>
        </span>
      ))}
    </span>
  )
}

function SectionLabel({ children, light = false }) {
  return (
    <p
      className={`text-xs tracking-[0.32em] uppercase font-light mb-5 ${
        light ? 'text-[#D4AF80]/60' : 'text-[#C4956A]'
      }`}
    >
      {children}
    </p>
  )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   NAV
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { label: 'הפילוסופיה', href: '#what' },
    { label: 'תהליך', href: '#how' },
    { label: 'חבילות', href: '#packages' },
    { label: 'גלריה', href: '#gallery' },
    { label: 'יצירת קשר', href: '#contact' },
  ]

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-[200] transition-all duration-700 ${
        scrolled
          ? 'bg-[#1C1410]/95 backdrop-blur-md py-4 border-b border-white/5'
          : 'bg-transparent py-7'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        <a href="#hero" className="font-display text-2xl italic text-[#F5EFE6] tracking-wide select-none">
          נועם
        </a>

        <ul className="hidden md:flex gap-9 list-none m-0 p-0">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-sm text-[#F5EFE6]/50 hover:text-[#F5EFE6] transition-colors duration-300 font-light tracking-wide"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href={`https://wa.me/${PHONE}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:block text-sm border border-[#D4AF80]/40 text-[#D4AF80] px-6 py-2.5 rounded-full hover:bg-[#D4AF80]/10 transition-all duration-300 font-light tracking-wide"
        >
          צרו קשר
        </a>

        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="md:hidden p-2 flex flex-col gap-1.5"
          aria-label="תפריט"
        >
          <motion.div animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 7 : 0 }} className="w-5 h-px bg-[#F5EFE6]" />
          <motion.div animate={{ opacity: menuOpen ? 0 : 1 }} className="w-5 h-px bg-[#F5EFE6]" />
          <motion.div animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -7 : 0 }} className="w-5 h-px bg-[#F5EFE6]" />
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
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-[#F5EFE6]/65 text-lg font-light"
                >
                  {l.label}
                </a>
              ))}
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
function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-end pb-24 md:pb-36 overflow-hidden bg-[#1C1410]"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=1800&auto=format&fit=crop&q=80"
          alt=""
          className="w-full h-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1410] via-[#1C1410]/40 to-[#1C1410]/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1C1410]/70 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 w-full">
        <div className="max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.4 }}
            className="text-[#D4AF80]/60 text-xs tracking-[0.4em] uppercase font-light mb-10"
          >
            צלמת סושיאל עילית לחתונות
          </motion.p>

          <h1 className="font-display text-6xl sm:text-7xl md:text-[5.5rem] lg:text-[7rem] text-[#F5EFE6] leading-[1] mb-10">
            <WordReveal text="כי הרגעים" delay={0.6} className="block mb-1" />
            <WordReveal text="הכי יפים —" delay={0.95} className="block text-[#D4AF80] mb-1" />
            <WordReveal text="מגיעים לחיות" delay={1.3} className="block mb-1" />
            <WordReveal text="פעמיים." delay={1.65} className="block" />
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.4, delay: 2.4 }}
            className="text-[#F5EFE6]/45 text-base md:text-lg font-light leading-relaxed mb-12 max-w-sm"
          >
            תוכן מוכן לפרסום — רילס, סטוריז ותמונות — עוד ביום החתונה.
          </motion.p>

          <motion.a
            href="#contact"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 2.8 }}
            className="inline-flex items-center gap-3 text-sm text-[#1C1410] bg-[#D4AF80] px-9 py-4 rounded-full hover:bg-[#C4956A] hover:text-[#F5EFE6] transition-all duration-400 font-medium tracking-wide"
          >
            בואו נדבר
          </motion.a>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.5, duration: 1.2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ scaleY: [1, 0.3, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: 'top' }}
          className="w-px h-12 bg-gradient-to-b from-[#D4AF80]/40 to-transparent"
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
    <section id="what" className="py-36 md:py-52 px-6 bg-[#F5EFE6]">
      <div className="max-w-4xl mx-auto text-center">
        <FadeUp>
          <SectionLabel>הפילוסופיה</SectionLabel>
        </FadeUp>

        <div className="font-display text-4xl md:text-5xl lg:text-[4rem] text-[#1C1410] leading-[1.2] mb-16">
          <WordReveal text="אני לא מגיעה לתעד." className="block mb-2" delay={0.1} />
          <WordReveal text="אני מגיעה ליצור." className="block text-[#C4956A] mb-2" delay={0.5} />
          <WordReveal text="כי היום הזה — ראוי לחיות שוב." className="block mb-2" delay={0.95} />
          <WordReveal text="ושוב." className="block text-[#C4956A]" delay={1.4} />
        </div>

        <FadeUp delay={0.3}>
          <p className="text-[#1C1410]/55 text-base md:text-lg font-light leading-[1.8] max-w-xl mx-auto mb-10">
            בעוד כולם מבינים שזה יום אחד — אני מבינה שזה תוכן לנצח.
            כל רגע, כל מבט, כל פרט — הופך לסיפור שנשאר ברשת,
            חי ומדובר, זמן רב אחרי שהאורחים חזרו הביתה.
          </p>
        </FadeUp>

        <FadeUp delay={0.45}>
          <a
            href={`https://www.instagram.com/${IG}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-[#C4956A] font-light tracking-wide border-b border-[#C4956A]/30 pb-0.5 hover:border-[#C4956A] transition-colors duration-300"
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
    </section>
  )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   HOW IT WORKS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'נפגשים',
      desc: 'לפני החתונה — שיחה קצרה להכיר מי אתם, מה אתם אוהבים, ומה אתם רוצים שהרשת תראה.',
    },
    {
      num: '02',
      title: 'ביום עצמו',
      desc: 'אני שם לב לרגעים שאף אחד אחר לא מתעד — ומייצרת תוכן בזמן אמת, לאורך כל היום.',
    },
    {
      num: '03',
      title: 'עוד בלילה',
      desc: 'רילס, סטוריז ותמונות — מוכנים לפרסום. פותחים את הטלפון ומוצאים את הסיפור שלכם.',
    },
  ]

  return (
    <section id="how" className="py-28 md:py-44 px-6 bg-[#EDE5D8]">
      <div className="max-w-6xl mx-auto">
        <FadeUp className="mb-20 md:mb-28">
          <SectionLabel>התהליך</SectionLabel>
          <h2 className="font-display text-5xl md:text-6xl text-[#1C1410] leading-tight max-w-xs">
            איך זה עובד
          </h2>
        </FadeUp>

        <div className="grid md:grid-cols-3 gap-10 md:gap-16 relative">
          {/* Divider lines */}
          <div className="hidden md:block absolute top-8 right-[33.33%] left-[33.33%] h-px bg-[#C4956A]/20" />

          {steps.map((step, i) => (
            <FadeUp key={i} delay={i * 0.14}>
              <div className="relative">
                <div className="font-display text-7xl text-[#C4956A]/18 mb-5 leading-none select-none">
                  {step.num}
                </div>
                <h3 className="font-display text-3xl text-[#1C1410] mb-4">{step.title}</h3>
                <p className="text-[#1C1410]/50 text-sm leading-relaxed font-light">{step.desc}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   PACKAGES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function Packages() {
  return (
    <section id="packages" className="py-28 md:py-44 px-6 bg-[#F5EFE6]">
      <div className="max-w-6xl mx-auto">
        <FadeUp className="mb-16 md:mb-20 text-center">
          <SectionLabel>מחירים</SectionLabel>
          <h2 className="font-display text-5xl md:text-6xl text-[#1C1410] leading-tight">
            חבילות
          </h2>
          <p className="text-[#1C1410]/38 text-sm mt-4 font-light">
            לכל שאלה ופרט — צרי קשר ואשלח הצעה מותאמת אישית
          </p>
        </FadeUp>

        <div className="grid md:grid-cols-3 gap-5">
          {PACKAGES.map((pkg, i) => (
            <FadeUp key={i} delay={i * 0.13}>
              <motion.div
                whileHover={{ y: -8 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className={`relative h-full flex flex-col rounded-2xl p-9 border transition-colors duration-300 ${
                  pkg.highlight
                    ? 'bg-[#1C1410] border-[#1C1410]'
                    : 'bg-white border-[#EDE5D8] hover:border-[#C4956A]/25'
                }`}
              >
                {pkg.highlight && (
                  <div className="absolute inset-x-10 -top-px h-px bg-gradient-to-r from-transparent via-[#D4AF80]/70 to-transparent" />
                )}

                <div className="mb-8">
                  <p className={`text-xs tracking-[0.28em] uppercase font-light mb-2 ${pkg.highlight ? 'text-[#D4AF80]/55' : 'text-[#C4956A]/60'}`}>
                    {pkg.sub}
                  </p>
                  <h3 className={`font-display text-4xl mb-1.5 ${pkg.highlight ? 'text-[#F5EFE6]' : 'text-[#1C1410]'}`}>
                    {pkg.name}
                  </h3>
                  <p className={`text-xs font-light ${pkg.highlight ? 'text-[#F5EFE6]/28' : 'text-[#1C1410]/35'}`}>
                    {pkg.duration}
                  </p>
                </div>

                <p className={`font-display text-2xl italic mb-9 leading-snug ${pkg.highlight ? 'text-[#D4AF80]' : 'text-[#C4956A]'}`}>
                  {pkg.tagline}
                </p>

                <ul className="flex-1 space-y-4 mb-10">
                  {pkg.features.map((f, fi) => (
                    <li
                      key={fi}
                      className={`text-sm font-light flex items-start gap-3 ${pkg.highlight ? 'text-[#F5EFE6]/55' : 'text-[#1C1410]/55'}`}
                    >
                      <span className={`mt-[5px] w-1 h-1 rounded-full flex-shrink-0 ${pkg.highlight ? 'bg-[#D4AF80]/70' : 'bg-[#C4956A]/70'}`} />
                      {f}
                    </li>
                  ))}
                </ul>

                <a
                  href="#contact"
                  className={`block text-center py-3.5 rounded-full text-sm font-light tracking-wide transition-all duration-300 ${
                    pkg.highlight
                      ? 'bg-[#D4AF80] text-[#1C1410] hover:bg-[#C4956A] hover:text-[#F5EFE6]'
                      : 'border border-[#1C1410]/18 text-[#1C1410]/70 hover:border-[#C4956A] hover:text-[#C4956A]'
                  }`}
                >
                  בחרו חבילה
                </a>
              </motion.div>
            </FadeUp>
          ))}
        </div>

        {/* Bundle note */}
        <FadeUp delay={0.3} className="mt-10">
          <div className="border border-[#C4956A]/25 rounded-2xl px-8 py-6 text-center max-w-2xl mx-auto">
            <p className="font-display text-xl text-[#1C1410] italic mb-2">
              מזמינות גם ציוני ליוני וגם יום מלא?
            </p>
            <p className="text-[#1C1410]/50 text-sm font-light">
              שילוב שתי החבילות מזכה בתמחור מיוחד — צרי קשר לפרטים.
            </p>
          </div>
        </FadeUp>

      </div>
    </section>
  )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   GALLERY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function Gallery() {
  return (
    <section id="gallery" className="py-28 md:py-44 px-6 bg-[#1C1410]">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end justify-between mb-16 md:mb-20">
          <FadeUp>
            <SectionLabel light>עבודות</SectionLabel>
            <h2 className="font-display text-5xl md:text-6xl text-[#F5EFE6] leading-tight">
              מה שיוצא
              <br />
              מהיום שלכם
            </h2>
          </FadeUp>
          <FadeUp delay={0.2} className="hidden md:block">
            <a
              href={`https://www.instagram.com/${IG}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[#D4AF80]/40 hover:text-[#D4AF80] transition-colors duration-300 text-xs tracking-widest uppercase font-light"
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

        <div className="columns-2 md:columns-3 gap-3 md:gap-4 [column-fill:balance]">
          {GALLERY.map((img, i) => (
            <FadeUp key={i} delay={i * 0.06} className="break-inside-avoid mb-3 md:mb-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                data-cursor="gallery"
                className="relative overflow-hidden rounded-xl"
              >
                <img
                  src={img.url}
                  alt={img.alt}
                  className="w-full h-auto block"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-[#1C1410]/15 opacity-0 hover:opacity-100 transition-opacity duration-500" />
              </motion.div>
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
    </section>
  )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   TESTIMONIALS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function Testimonials() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setCurrent((c) => (c + 1) % TESTIMONIALS.length)
    }, 6500)
    return () => clearInterval(id)
  }, [])

  const t = TESTIMONIALS[current]

  return (
    <section id="testimonials" className="py-28 md:py-44 px-6 bg-[#EDE5D8]">
      <div className="max-w-4xl mx-auto">
        <FadeUp className="text-center mb-20">
          <SectionLabel>אמרו עלי</SectionLabel>
        </FadeUp>

        <div className="relative min-h-[220px] flex flex-col items-center justify-center text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -28 }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            >
              <blockquote className="font-display text-3xl md:text-4xl lg:text-5xl text-[#1C1410] leading-[1.25] italic mb-8">
                "{t.quote}"
              </blockquote>
              <p className="text-[#C4956A] text-sm font-light tracking-wide">{t.name}</p>
              <p className="text-[#1C1410]/30 text-xs font-light mt-1">{t.date}</p>
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
      </div>
    </section>
  )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   CONTACT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function Contact() {
  return (
    <section id="contact" className="py-28 md:py-44 px-6 bg-[#1C1410] relative overflow-hidden">
      {/* Decorative circle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-[#D4AF80]/6 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-[#D4AF80]/3 pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <FadeUp>
          <SectionLabel light>יצירת קשר</SectionLabel>
          <h2 className="font-display text-6xl md:text-7xl text-[#F5EFE6] leading-tight mb-6">
            בואו{' '}
            <em className="text-[#D4AF80]">נדבר</em>
          </h2>
          <p className="text-[#F5EFE6]/35 text-base md:text-lg font-light leading-relaxed mb-14 max-w-sm mx-auto">
            ספרו לי על היום הגדול שלכם — ואבנה לכם הצעה שתרגיש כמו בית.
          </p>
        </FadeUp>

        <FadeUp delay={0.2}>
          <a
            href={`https://wa.me/${PHONE}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-4 bg-[#D4AF80] text-[#1C1410] px-10 py-5 rounded-full text-base font-medium hover:bg-[#C4956A] hover:text-[#F5EFE6] transition-all duration-300 tracking-wide"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="flex-shrink-0">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.135.561 4.14 1.541 5.875L0 24l6.303-1.519A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.001-1.366l-.359-.213-3.722.897.933-3.618-.234-.372A9.796 9.796 0 012.182 12C2.182 6.575 6.575 2.182 12 2.182S21.818 6.575 21.818 12 17.425 21.818 12 21.818z" />
            </svg>
            שלחו הודעה ב-WhatsApp
          </a>
        </FadeUp>

        <FadeUp delay={0.35} className="mt-8">
          <p className="text-[#F5EFE6]/22 text-sm font-light">
            או ב{' '}
            <a
              href={`https://www.instagram.com/${IG}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#D4AF80]/55 hover:text-[#D4AF80] transition-colors duration-200"
            >
              @{IG}
            </a>
          </p>
        </FadeUp>
      </div>
    </section>
  )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   FOOTER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function Footer() {
  return (
    <footer className="py-10 px-6 bg-[#1C1410] border-t border-white/5">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-5">
        <a href="#hero" className="font-display text-2xl italic text-[#F5EFE6]/60 tracking-wide">
          נועם
        </a>

        <div className="flex items-center gap-8">
          <a
            href={`https://www.instagram.com/${IG}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[#D4AF80]/40 hover:text-[#D4AF80] transition-colors duration-200 text-xs tracking-widest uppercase font-light"
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
            className="text-[#D4AF80]/40 hover:text-[#D4AF80] transition-colors duration-200 text-xs tracking-widest uppercase font-light"
          >
            WhatsApp
          </a>
        </div>

        <p className="text-[#F5EFE6]/14 text-xs font-light">
          © {new Date().getFullYear()} נועם
        </p>
      </div>
    </footer>
  )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   APP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function App() {
  return (
    <div dir="rtl">
      <GrainOverlay />
      <CustomCursor />
      <Nav />
      <Hero />
      <Manifesto />
      <HowItWorks />
      <Packages />
      <Gallery />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  )
}
