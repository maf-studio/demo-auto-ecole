import { FORMATIONS } from './formations.ts'

/**
 * Menus du site. Les formations en brouillon n’y figurent jamais
 * (`statut: 'brouillon'` dans `formations.ts`).
 */
export interface LienMenu {
  libelle: string
  href: string
  description?: string
}

export interface EntreeMenu {
  libelle: string
  href: string
  sousMenu?: readonly LienMenu[]
}

const lienFormation = (slug: string, description: string): LienMenu[] => {
  const f = FORMATIONS.find((x) => x.slug === slug)
  return f && f.statut === 'publiee' ? [{ libelle: f.nomCourt, href: `/${f.slug}`, description }] : []
}

export const MENU: readonly EntreeMenu[] = [
  { libelle: 'Accueil', href: '/' },
  {
    libelle: 'Permis auto',
    href: '/permis-auto',
    sousMenu: [
      ...lienFormation('permis-b', 'Boîte manuelle, dès 17 ans'),
      ...lienFormation('permis-automatique', '13 heures minimum'),
      ...lienFormation('conduite-accompagnee', 'Dès 15 ans, avec un proche'),
      ...lienFormation('conduite-supervisee', 'Dès 18 ans'),
      ...lienFormation('passerelle-boite-manuelle', 'De l’automatique à la manuelle'),
      { libelle: 'Tous les permis auto', href: '/permis-auto' },
    ],
  },
  {
    libelle: 'Permis moto',
    href: '/permis-moto',
    sousMenu: [
      ...lienFormation('permis-a1', 'Moto 125 dès 16 ans'),
      ...lienFormation('permis-a2', 'Jusqu’à 35 kW dès 18 ans'),
      ...lienFormation('passerelle-a2-a', 'Toutes motos, en 7 heures'),
      ...lienFormation('formation-125', 'Avec le permis B'),
      ...lienFormation('permis-am', 'Scooter 50 cm³ dès 14 ans'),
      { libelle: 'Tous les permis moto', href: '/permis-moto' },
    ],
  },
  { libelle: 'Code de la route', href: '/code-de-la-route' },
  {
    libelle: 'Financement',
    href: '/financement',
    sousMenu: [
      { libelle: 'Financer son permis', href: '/financement', description: '1 € par jour, 3 fois, CPF' },
      { libelle: 'Tarifs et devis', href: '/tarifs', description: 'Nos formules' },
      { libelle: 'Documents d’inscription', href: '/documents-inscription', description: 'La liste à cocher' },
    ],
  },
  {
    libelle: 'À propos',
    href: '/a-propos',
    sousMenu: [
      { libelle: 'L’auto-école', href: '/a-propos', description: 'Notre histoire, nos locaux' },
      { libelle: 'Avis des élèves', href: '/avis-clients', description: 'Notre note Google' },
      { libelle: 'Démarche qualité', href: '/demarche-qualite', description: 'Label, certification, agrément' },
    ],
  },
  { libelle: 'Contact', href: '/contact' },
]

/** Pages tenues hors du sitemap : techniques, légales, ou en brouillon. */
export const CHEMINS_HORS_SITEMAP: readonly string[] = [
  '/demande-envoyee',
  '/demande-erreur',
  '/mentions-legales',
  '/confidentialite',
  '/cookies',
  ...FORMATIONS.filter((f) => f.statut === 'brouillon').map((f) => `/${f.slug}`),
]
