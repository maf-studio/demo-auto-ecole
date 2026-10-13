/**
 * Les avis cités sur le site.
 *
 * DÉMONSTRATION : trois avis d’EXEMPLE (`source: 'Exemple'`), écrits pour
 * montrer la présentation, et annoncés comme tels sur chaque carte. Ils ne
 * viennent d’aucun élève réel.
 *
 * Sur un vrai site : uniquement des avis réels, recopiés de la fiche Google de
 * l’établissement (`source: 'Google'`), avec la note donnée par leur auteur, le
 * nom abrégé (prénom et initiale). Toute coupure est marquée « […] » ; aucun
 * mot n’est changé. Avant mise en ligne, obtenir l’accord de chaque auteur.
 */
export interface Avis {
  auteur: string
  note: 1 | 2 | 3 | 4 | 5
  source: 'Google' | 'Exemple'
  extrait: string
}

export const AVIS: readonly Avis[] = [
  {
    auteur: 'Camille R.',
    note: 5,
    source: 'Exemple',
    extrait:
      'Des moniteurs patients et pédagogues, un planning de leçons qui s’adaptait à mes cours, et un accueil qui répond vite. Permis obtenu, je recommande.',
  },
  {
    auteur: 'Yanis B.',
    note: 5,
    source: 'Exemple',
    extrait:
      'Inscrit en conduite accompagnée à 15 ans : tout m’a été expliqué clairement, du dossier aux rendez-vous pédagogiques. Une équipe à l’écoute du début à la fin.',
  },
  {
    auteur: 'Sophie L.',
    note: 5,
    source: 'Exemple',
    extrait:
      'Formation au permis A2 bien encadrée, sur le plateau comme en circulation. Les conseils de mon moniteur m’ont donné confiance pour le jour de l’examen.',
  },
]

/** Vrai si au moins un avis affiché est un exemple (site de démonstration). */
export const AVIS_D_EXEMPLE = AVIS.some((a) => a.source === 'Exemple')
