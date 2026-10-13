/**
 * Les documents de la démarche qualité (label « École conduite qualité »),
 * publiés en téléchargement sur la page /demarche-qualite.
 *
 * `fichier` : `null` tant que l’établissement ne l’a pas fourni ; seuls les
 * documents fournis sont listés (jamais de document inventé). Pour en publier
 * un : déposer le PDF dans `public/documents/`, puis écrire son adresse, par
 * exemple `fichier: '/documents/reglement-interieur.pdf'`.
 */
export interface DocumentQualite {
  titre: string
  fichier: string | null
}

export const DOCUMENTS_QUALITE: readonly DocumentQualite[] = [
  { titre: 'Règlement intérieur', fichier: null },
  { titre: 'Procédure d’évaluation préalable, permis B', fichier: null },
  { titre: 'Procédure d’évaluation préalable, permis A', fichier: null },
  { titre: 'Modalités d’organisation de la formation théorique et pratique', fichier: null },
  { titre: 'Enjeux, déroulement et conditions de l’examen, permis B', fichier: null },
  { titre: 'Enjeux, déroulement et conditions de l’examen, permis A', fichier: null },
  { titre: 'Prise en compte du handicap', fichier: null },
  { titre: 'Gestion des réclamations', fichier: null },
]

export const DOCUMENTS_PUBLIES = DOCUMENTS_QUALITE.filter((d) => d.fichier !== null)
