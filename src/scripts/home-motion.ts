// Animations de l'accueil (spec 0006, section « Animations »). Chargé seulement par index.astro,
// servi comme fichier /_astro/*.js (CSP script-src 'self'). Sans JavaScript, ou avec
// prefers-reduced-motion, la page reste complète et immobile.
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const motion = gsap.matchMedia()

motion.add('(prefers-reduced-motion: no-preference)', () => {
  playHeroEntrance()
  animateBackdrop()
  followPointer()
  revealOnScroll()
  scrubPlayback()
})

// Entrée du bandeau : les éléments [data-hero] sont masqués par le CSS avant ce script
// (voir global.css), on les amène donc toujours vers un état visible explicite.
function playHeroEntrance(): void {
  const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } })

  timeline
    .fromTo(
      '[data-hero="line"]',
      { opacity: 0, yPercent: 60, filter: 'blur(12px)' },
      { opacity: 1, yPercent: 0, filter: 'blur(0px)', duration: 0.9, stagger: 0.12 },
    )
    .fromTo(
      '[data-hero="fade"]',
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.7, stagger: 0.08 },
      '-=0.55',
    )
    .fromTo(
      '[data-hero="phone"]',
      { opacity: 0, y: 80, rotateX: 28, rotateY: -14, scale: 0.92, transformPerspective: 1200 },
      { opacity: 1, y: 0, rotateX: 0, rotateY: 0, scale: 1, duration: 1.2, ease: 'expo.out' },
      0.25,
    )
}

// Décor vivant : grille qui défile, halos qui respirent, particules qui dérivent, téléphone qui flotte.
function animateBackdrop(): void {
  gsap.to('[data-motion="grid"]', {
    backgroundPosition: '0px 64px',
    duration: 3,
    ease: 'none',
    repeat: -1,
  })

  gsap.to('[data-motion="halo"]', {
    scale: 1.12,
    opacity: 0.75,
    duration: 4.5,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
    stagger: 1.5,
  })

  gsap.utils.toArray<HTMLElement>('[data-motion="particle"]').forEach((particle) => {
    gsap.fromTo(
      particle,
      { opacity: 0, y: 0 },
      {
        opacity: gsap.utils.random(0.35, 0.9),
        y: gsap.utils.random(-120, -60),
        x: gsap.utils.random(-30, 30),
        duration: gsap.utils.random(4, 8),
        delay: gsap.utils.random(0, 4),
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      },
    )
  })

  gsap.to('[data-motion="float"]', {
    y: -14,
    duration: 3.2,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
  })
}

// Le téléphone s'incline légèrement vers la souris (seulement avec un pointeur précis).
function followPointer(): void {
  const hero = document.querySelector<HTMLElement>('[data-motion="hero"]')
  const tilt = document.querySelector<HTMLElement>('[data-motion="tilt"]')
  if (!hero || !tilt || !window.matchMedia('(pointer: fine)').matches) return

  gsap.set(tilt, { transformPerspective: 900 })
  const toRotateX = gsap.quickTo(tilt, 'rotationX', { duration: 0.8, ease: 'power3.out' })
  const toRotateY = gsap.quickTo(tilt, 'rotationY', { duration: 0.8, ease: 'power3.out' })

  hero.addEventListener('pointermove', (event) => {
    const bounds = hero.getBoundingClientRect()
    const x = (event.clientX - bounds.left) / bounds.width - 0.5
    const y = (event.clientY - bounds.top) / bounds.height - 0.5
    toRotateY(x * 14)
    toRotateX(-y * 10)
  })
  hero.addEventListener('pointerleave', () => {
    toRotateX(0)
    toRotateY(0)
  })
}

// Les sections, cartes et étapes entrent quand on descend.
function revealOnScroll(): void {
  gsap.set('[data-reveal]', { opacity: 0, y: 40, filter: 'blur(8px)' })
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 88%',
    once: true,
    onEnter: (elements) =>
      gsap.to(elements, {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.1,
      }),
  })
}

// La barre de lecture du téléphone avance avec le défilement du bandeau.
function scrubPlayback(): void {
  gsap.fromTo(
    '[data-motion="progress"]',
    { width: '40%' },
    {
      width: '92%',
      ease: 'none',
      scrollTrigger: {
        trigger: '[data-motion="hero"]',
        start: 'top top',
        end: 'bottom top',
        scrub: 0.6,
      },
    },
  )
}
