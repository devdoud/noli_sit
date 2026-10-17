// Animations de l'accueil (spec 0006, section « Animations »), version « futuriste ».
// Chargé seulement par index.astro, servi comme fichier /_astro/*.js (CSP script-src 'self').
// Sans JavaScript, ou avec prefers-reduced-motion, la page reste complète et immobile.
// Les styles sont posés par le CSSOM (element.style), que la CSP style-src 'self' autorise.
import { gsap } from 'gsap'
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin, SplitText)

const glyphs = '01NOLI#<>/\\░▒▓'
const finePointer = window.matchMedia('(pointer: fine)').matches

const motion = gsap.matchMedia()

motion.add('(prefers-reduced-motion: no-preference)', () => {
  playHeroEntrance()
  animateBackdrop()
  animateScene()
  animateMarquee()
  revealOnScroll()
  cycleScreens()
  if (finePointer) {
    followPointer()
    tiltCards()
    magnetizeButtons()
  }
})

// L'éventail 3D de la galerie ne joue que sur grand écran (sur mobile : carrousel immobile).
motion.add('(prefers-reduced-motion: no-preference) and (min-width: 768px)', () => {
  fanOutGallery()
})

// Entrée du bandeau : les éléments [data-hero] sont masqués par le CSS avant ce script
// (voir global.css) ; on les amène toujours vers un état visible explicite.
function playHeroEntrance(): void {
  const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } })

  timeline
    .fromTo(
      '[data-hero="line"]',
      { opacity: 0, yPercent: 40, filter: 'blur(14px)' },
      { opacity: 1, yPercent: 0, filter: 'blur(0px)', duration: 0.9, stagger: 0.15 },
    )
    .from(
      '[data-scramble]',
      {
        duration: 1.3,
        stagger: 0.2,
        scrambleText: { text: '{original}', chars: glyphs, speed: 0.6, revealDelay: 0.25 },
        ease: 'none',
      },
      0,
    )
    .fromTo(
      '[data-hero="fade"]',
      { opacity: 0, y: 18, filter: 'blur(6px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.7, stagger: 0.08 },
      '-=0.7',
    )
    .fromTo(
      '[data-hero="phone"]',
      { opacity: 0, y: 120, rotateX: 40, rotateY: -25, scale: 0.85, transformPerspective: 1200 },
      { opacity: 1, y: 0, rotateX: 0, rotateY: 0, scale: 1, duration: 1.6, ease: 'expo.out' },
      0.2,
    )
    .from(
      '[data-motion="chip"]',
      {
        opacity: 0,
        scale: 0.6,
        y: 30,
        filter: 'blur(10px)',
        duration: 0.8,
        stagger: 0.12,
        ease: 'back.out(1.8)',
      },
      0.9,
    )

  // Reflet qui balaie l'accroche ambre, en boucle.
  gsap.fromTo(
    '[data-motion="shine"]',
    { backgroundPosition: '200% 0%' },
    { backgroundPosition: '-200% 0%', duration: 4, ease: 'none', repeat: -1, delay: 1.6 },
  )
}

// Décor : grille qui défile, halos qui respirent, particules qui dérivent.
function animateBackdrop(): void {
  gsap.to('[data-motion="grid"]', {
    backgroundPosition: '0px 56px',
    duration: 1.6,
    ease: 'none',
    repeat: -1,
  })

  gsap.to('[data-motion="halo"]', {
    scale: 1.15,
    opacity: 1,
    duration: 4,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
    stagger: 1.3,
  })

  gsap.utils.toArray<HTMLElement>('[data-motion="particle"]').forEach((particle) => {
    gsap.fromTo(
      particle,
      { opacity: 0, y: 0, scale: 0.5 },
      {
        opacity: gsap.utils.random(0.4, 1),
        scale: gsap.utils.random(0.8, 1.8),
        y: gsap.utils.random(-160, -70),
        x: gsap.utils.random(-40, 40),
        duration: gsap.utils.random(3.5, 7),
        delay: gsap.utils.random(0, 3),
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      },
    )
  })
}

// Scène du téléphone : anneaux orbitaux, flottement, balayage et reflet de l'écran,
// capsules qui ondulent, lueur tournante de la carte Premium.
function animateScene(): void {
  gsap.utils.toArray<HTMLElement>('[data-motion="ring"]').forEach((ring, index) => {
    gsap.set(ring, { rotationX: 72, rotationY: index * 18, transformPerspective: 900 })
    gsap.to(ring, {
      rotationZ: index % 2 === 0 ? 360 : -360,
      duration: 14 + index * 6,
      ease: 'none',
      repeat: -1,
    })
  })

  gsap.to('[data-motion="float"]', {
    y: -16,
    duration: 3,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
  })

  gsap.fromTo(
    '[data-motion="scan"]',
    { yPercent: 0 },
    { yPercent: 520, duration: 2.8, ease: 'power1.inOut', repeat: -1, repeatDelay: 0.8 },
  )

  gsap.fromTo(
    '[data-motion="sheen"]',
    { xPercent: 0 },
    { xPercent: 520, duration: 1.6, ease: 'power2.inOut', repeat: -1, repeatDelay: 2.4 },
  )

  gsap.utils.toArray<HTMLElement>('[data-motion="chip"]').forEach((chip, index) => {
    gsap.to(chip, {
      y: index % 2 === 0 ? -10 : 10,
      duration: 2.4 + index * 0.4,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      delay: 1.6,
    })
  })

  gsap.to('[data-motion="aurora"]', {
    rotation: 360,
    duration: 6,
    ease: 'none',
    repeat: -1,
  })
}

// Bande de mots qui défile sans fin (le contenu est écrit deux fois), plus vite quand on défile.
function animateMarquee(): void {
  const track = document.querySelector<HTMLElement>('[data-motion="marquee"]')
  if (!track) return
  const loop = gsap.to(track, { xPercent: -50, duration: 28, ease: 'none', repeat: -1 })
  ScrollTrigger.create({
    onUpdate: (self) => {
      const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 400, 4)
      const direction = self.direction === -1 ? -1 : 1
      gsap.to(loop, { timeScale: direction * boost, duration: 0.3, overwrite: true })
      gsap.to(loop, { timeScale: direction, duration: 1.2, delay: 0.3 })
    },
  })
}

// Titres décomposés en lettres, cartes et étapes qui entrent, compteurs 01 02 03.
function revealOnScroll(): void {
  gsap.utils.toArray<HTMLElement>('[data-split]').forEach((heading) => {
    const split = SplitText.create(heading, { type: 'chars, words', aria: 'auto' })
    gsap.from(split.chars, {
      opacity: 0,
      yPercent: 110,
      rotateX: -90,
      filter: 'blur(6px)',
      transformOrigin: '50% 100%',
      duration: 0.7,
      ease: 'back.out(1.6)',
      stagger: 0.025,
      scrollTrigger: { trigger: heading, start: 'top 88%', once: true },
    })
  })

  gsap.set('[data-reveal]', {
    opacity: 0,
    y: 60,
    rotateX: 12,
    filter: 'blur(10px)',
    transformPerspective: 900,
  })
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 90%',
    once: true,
    onEnter: (elements) =>
      gsap.to(elements, {
        opacity: 1,
        y: 0,
        rotateX: 0,
        filter: 'blur(0px)',
        duration: 0.9,
        ease: 'expo.out',
        stagger: 0.12,
      }),
  })

  gsap.utils.toArray<HTMLElement>('[data-count]').forEach((counter) => {
    gsap.from(counter, {
      duration: 1.1,
      scrambleText: { text: '{original}', chars: '0123456789', speed: 0.4 },
      scrollTrigger: { trigger: counter, start: 'top 90%', once: true },
    })
  })
}

// Le téléphone du bandeau passe d'un écran de l'app au suivant : l'écran suivant se dévoile
// de haut en bas, comme balayé, puis le précédent s'efface.
function cycleScreens(): void {
  const screens = gsap.utils.toArray<HTMLElement>('[data-motion="screen"]')
  if (screens.length < 2) return
  const timeline = gsap.timeline({ repeat: -1, delay: 1.2 })
  screens.forEach((current, index) => {
    const next = screens[(index + 1) % screens.length]
    timeline
      .set(next, { zIndex: 2, opacity: 1, clipPath: 'inset(0% 0% 100% 0%)' }, '+=3.2')
      .set(current, { zIndex: 1 })
      .to(next, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1, ease: 'power3.inOut' })
      .set(current, { opacity: 0, zIndex: 0 })
  })
}

// Les captures arrivent en éventail incliné et se redressent avec le défilement.
function fanOutGallery(): void {
  const gallery = document.querySelector<HTMLElement>('[data-motion="gallery"]')
  if (!gallery) return
  gsap.utils.toArray<HTMLElement>('[data-shot]').forEach((shot) => {
    const angle = Number(shot.dataset.angle ?? '0')
    gsap.fromTo(
      shot,
      {
        rotationY: angle,
        rotationX: 18,
        y: 140,
        scale: 0.86,
        filter: 'blur(4px) brightness(0.6)',
        transformPerspective: 1400,
      },
      {
        rotationY: 0,
        rotationX: 0,
        y: 0,
        scale: 1,
        filter: 'blur(0px) brightness(1)',
        ease: 'none',
        scrollTrigger: { trigger: gallery, start: 'top 95%', end: 'center 60%', scrub: 0.8 },
      },
    )
  })
}

// Le projecteur et le téléphone suivent la souris ; les capsules bougent selon leur profondeur.
function followPointer(): void {
  const hero = document.querySelector<HTMLElement>('[data-motion="hero"]')
  const tilt = document.querySelector<HTMLElement>('[data-motion="tilt"]')
  const spotlight = document.querySelector<HTMLElement>('[data-motion="spotlight"]')
  if (!hero || !tilt || !spotlight) return

  gsap.set(tilt, { transformPerspective: 900 })
  const toRotateX = gsap.quickTo(tilt, 'rotationX', { duration: 0.8, ease: 'power3.out' })
  const toRotateY = gsap.quickTo(tilt, 'rotationY', { duration: 0.8, ease: 'power3.out' })
  const chips = gsap.utils.toArray<HTMLElement>('[data-motion="chip"]').map((chip) => ({
    depth: Number(chip.dataset.depth ?? '1'),
    toX: gsap.quickTo(chip, 'x', { duration: 1, ease: 'power3.out' }),
  }))

  hero.addEventListener('pointermove', (event) => {
    const bounds = hero.getBoundingClientRect()
    const x = (event.clientX - bounds.left) / bounds.width - 0.5
    const y = (event.clientY - bounds.top) / bounds.height - 0.5
    toRotateY(x * 22)
    toRotateX(-y * 16)
    for (const chip of chips) chip.toX(x * 40 * chip.depth)
    spotlight.style.setProperty('--spot-x', `${String(event.clientX - bounds.left)}px`)
    spotlight.style.setProperty('--spot-y', `${String(event.clientY - bounds.top)}px`)
  })
  hero.addEventListener('pointerleave', () => {
    toRotateX(0)
    toRotateY(0)
    for (const chip of chips) chip.toX(0)
  })
}

// Les cartes s'inclinent en 3D au survol, avec une lueur qui suit le curseur.
function tiltCards(): void {
  gsap.utils.toArray<HTMLElement>('[data-card]').forEach((card) => {
    gsap.set(card, { transformPerspective: 800 })
    const toRotateX = gsap.quickTo(card, 'rotationX', { duration: 0.5, ease: 'power3.out' })
    const toRotateY = gsap.quickTo(card, 'rotationY', { duration: 0.5, ease: 'power3.out' })
    card.addEventListener('pointermove', (event) => {
      const bounds = card.getBoundingClientRect()
      const x = (event.clientX - bounds.left) / bounds.width
      const y = (event.clientY - bounds.top) / bounds.height
      toRotateY((x - 0.5) * 14)
      toRotateX(-(y - 0.5) * 14)
      card.style.setProperty('--card-x', `${String(x * 100)}%`)
      card.style.setProperty('--card-y', `${String(y * 100)}%`)
    })
    card.addEventListener('pointerleave', () => {
      toRotateX(0)
      toRotateY(0)
    })
  })
}

// Les boutons des stores sont attirés par la souris.
function magnetizeButtons(): void {
  gsap.utils.toArray<HTMLElement>('[data-magnetic]').forEach((button) => {
    const toX = gsap.quickTo(button, 'x', { duration: 0.4, ease: 'power3.out' })
    const toY = gsap.quickTo(button, 'y', { duration: 0.4, ease: 'power3.out' })
    button.addEventListener('pointermove', (event) => {
      const bounds = button.getBoundingClientRect()
      toX((event.clientX - bounds.left - bounds.width / 2) * 0.25)
      toY((event.clientY - bounds.top - bounds.height / 2) * 0.35)
    })
    button.addEventListener('pointerleave', () => {
      toX(0)
      toY(0)
    })
  })
}
