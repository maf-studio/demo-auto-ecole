import { MOUVEMENT_REDUIT } from '../lib/mouvement.ts'

/*
 * Les comportements communs à toutes les pages. Tout le contenu est en place
 * sans ce script : il n’ajoute que des confort (menus, révélations, retour en
 * haut).
 */

/* ------------------------------------------------ Sous-menus de l’en-tête */

const sousMenus = [...document.querySelectorAll<HTMLElement>('[data-sous-menu]')]

function fermerTout(sauf?: HTMLElement) {
  for (const item of sousMenus) {
    if (item === sauf) continue
    item.removeAttribute('data-ouvert')
    item.querySelector('button')?.setAttribute('aria-expanded', 'false')
  }
}

for (const item of sousMenus) {
  const bouton = item.querySelector('button')
  bouton?.addEventListener('click', () => {
    const ouvert = item.hasAttribute('data-ouvert')
    fermerTout(item)
    item.toggleAttribute('data-ouvert', !ouvert)
    bouton.setAttribute('aria-expanded', String(!ouvert))
  })
  item.addEventListener('focusout', (evenement) => {
    if (!item.contains(evenement.relatedTarget as Node | null)) fermerTout()
  })
}

document.addEventListener('keydown', (evenement) => {
  if (evenement.key !== 'Escape') return
  const ouvert = sousMenus.find((item) => item.hasAttribute('data-ouvert'))
  if (!ouvert) return
  fermerTout()
  ouvert.querySelector('button')?.focus()
})

document.addEventListener('click', (evenement) => {
  if (!sousMenus.some((item) => item.contains(evenement.target as Node))) fermerTout()
})

/* ------------------------------------------------ En-tête et retour en haut */

const entete = document.querySelector<HTMLElement>('[data-entete]')
const haut = document.querySelector<HTMLElement>('[data-haut-de-page]')
let attente = false

function surDefilement() {
  attente = false
  const y = window.scrollY
  entete?.toggleAttribute('data-defile', y > 8)
  haut?.toggleAttribute('data-visible', y > window.innerHeight * 1.2)
}

window.addEventListener(
  'scroll',
  () => {
    if (attente) return
    attente = true
    requestAnimationFrame(surDefilement)
  },
  { passive: true },
)
surDefilement()

haut?.addEventListener('click', () => {
  const reduit = window.matchMedia(MOUVEMENT_REDUIT).matches
  window.scrollTo({ top: 0, behavior: reduit ? 'auto' : 'smooth' })
  document.querySelector<HTMLElement>('#contenu')?.focus({ preventScroll: true })
})

/* ------------------------------------------------ Menu mobile */

const menuMobile = document.querySelector<HTMLElement>('#menu-mobile')
menuMobile?.addEventListener('toggle', (evenement) => {
  const ouvert = (evenement as ToggleEvent).newState === 'open'
  document.documentElement.toggleAttribute('data-menu-ouvert', ouvert)
})
// Un lien d’ancre de la même page referme le menu.
menuMobile?.querySelectorAll('a').forEach((lien) =>
  lien.addEventListener('click', () => menuMobile.hidePopover?.()),
)

/* ------------------------------------------------ Révélations au défilement */

if (!window.matchMedia(MOUVEMENT_REDUIT).matches && 'IntersectionObserver' in window) {
  const observateur = new IntersectionObserver(
    (entrees) => {
      for (const entree of entrees) {
        if (!entree.isIntersecting) continue
        const el = entree.target as HTMLElement
        el.classList.add('anime-apres')
        el.classList.remove('anime-avant')
        observateur.unobserve(el)
      }
    },
    { rootMargin: '0px 0px -6% 0px' },
  )
  const limite = window.innerHeight
  // Seul ce qui est sous la ligne de flottaison est masqué : rien de visible
  // au chargement ne disparaît pour réapparaître.
  for (const el of document.querySelectorAll<HTMLElement>('[data-revele]')) {
    if (el.getBoundingClientRect().top < limite) continue
    el.classList.add('anime-avant')
    observateur.observe(el)
  }
}
