import type { CleSource } from './sources.ts'

/**
 * Les solutions de financement présentées sur le site.
 *
 * Règle : aucune aide n’est présentée comme acquise. Chaque carte dit pour qui
 * elle est faite, sous quelles conditions, et renvoie vers la source officielle.
 * Règles vérifiées le 11 octobre 2026 (voir `sources.ts`).
 *
 * Aides locales (Région, Département) : présentées sans les nommer dans la
 * démonstration. Sur un vrai site, citer celles du territoire du client, avec
 * leur source et leur date de vérification.
 *
 * Retirées du site, et à NE PAS remettre sans vérification :
 *   - l’aide au permis B de France Travail (jusqu’à 1 200 €) : supprimée le
 *     1er avril 2026 (economie.gouv.fr) ;
 *   - l’aide de 500 € aux apprentis majeurs : supprimée pour les contrats
 *     conclus à partir de 2026.
 */
export interface Financement {
  id: 'permis-1-euro' | 'paiement-3-fois' | 'cpf' | 'autres-aides'
  titre: string
  /** Une phrase, sur les cartes. */
  resume: string
  /** Mention courte affichée en pastille. */
  mention: string
  pourQui: string
  points: readonly string[]
  demarche: string
  sources: readonly CleSource[]
  /** Formations concernées (identifiants de `formations.ts`), ou `null` : toutes. */
  formations: readonly string[] | null
}

export const FINANCEMENTS: readonly Financement[] = [
  {
    id: 'permis-1-euro',
    titre: 'Le permis à 1 € par jour',
    resume:
      'Un prêt à taux zéro pour les 15 à 25 ans : l’État paie les intérêts, vous remboursez par petites mensualités.',
    mention: '15 à 25 ans',
    pourQui:
      'Les jeunes de 15 à 25 ans qui s’inscrivent pour la première fois à une formation au permis B, A1 ou A2, dans une auto-école partenaire du dispositif.',
    points: [
      'Prêt sans intérêts, accordé par une banque ou un établissement financier partenaire de l’État.',
      'Montants proposés : 600, 800, 1 000 ou 1 200 €, selon le coût de la formation.',
      'Un complément peut être demandé après un échec à l’examen pratique.',
      'Le prêt reste soumis à l’accord de l’organisme prêteur.',
    ],
    demarche:
      'Nous vous remettons le contrat de formation ; vous le présentez à une banque partenaire, qui étudie votre demande.',
    sources: ['aides'],
    formations: ['permis-b', 'permis-automatique', 'conduite-accompagnee', 'conduite-supervisee', 'permis-a1', 'permis-a2'],
  },
  {
    id: 'paiement-3-fois',
    titre: 'Le paiement en 3 fois sans frais',
    resume: 'Répartissez le prix de votre formation en trois règlements, sans frais supplémentaires.',
    mention: 'Proposé par l’auto-école',
    pourQui: 'Tous les élèves qui le souhaitent, pour leur formation.',
    points: [
      'Trois règlements au lieu d’un seul.',
      'Aucun frais ajouté pour ce paiement échelonné.',
      'Les modalités (dates et montants des règlements) vous sont précisées à l’inscription.',
    ],
    demarche: 'Demandez-le à l’accueil ou par téléphone : nous vous expliquons les modalités.',
    sources: [],
    formations: null,
  },
  {
    id: 'cpf',
    titre: 'Le compte personnel de formation (CPF)',
    resume:
      'Depuis février 2026, le CPF finance le permis voiture ou moto légère pour les demandeurs d’emploi, ou avec un cofinancement.',
    mention: 'Selon votre situation',
    pourQui:
      'Les demandeurs d’emploi inscrits à France Travail, et les salariés dont la formation est aussi financée par un tiers (employeur, région, opérateur de compétences…).',
    points: [
      'La loi de finances pour 2026 a restreint le CPF pour les permis B, A1 et A2 : il ne suffit plus d’avoir des droits pour l’utiliser.',
      'Pour un salarié, un cofinancement d’au moins 100 € est demandé (décret du 24 février 2026).',
      'La part prise sur le CPF est plafonnée à 900 € pour ces permis.',
      'La formation doit être proposée sur Mon Compte Formation par l’auto-école.',
      'La passerelle de la boîte automatique vers la boîte manuelle n’est pas finançable par le CPF.',
    ],
    demarche:
      'Consultez vos droits sur moncompteformation.gouv.fr, puis appelez-nous : nous vérifions avec vous si la formation visée peut être financée ainsi.',
    sources: ['cpf', 'economie'],
    formations: [
      'code-de-la-route',
      'permis-b',
      'permis-automatique',
      'conduite-accompagnee',
      'conduite-supervisee',
      'permis-a1',
      'permis-a2',
    ],
  },
  {
    id: 'autres-aides',
    titre: 'Les autres aides possibles',
    resume:
      'Selon votre âge et votre situation, d’autres aides existent : Région, Département, employeur.',
    mention: 'À étudier au cas par cas',
    pourQui: 'Toute personne qui prépare un permis, selon les dispositifs ouverts là où elle habite.',
    points: [
      'Région et Département : selon l’endroit où vous habitez, une aide au permis peut exister, souvent pour les jeunes en formation ou en recherche d’emploi.',
      'Un employeur peut participer au financement, notamment avec le CPF.',
      'Le simulateur « Mes aides » de France Travail recense les aides selon votre profil.',
      'L’aide au permis B que versait France Travail a été supprimée le 1er avril 2026.',
    ],
    demarche:
      'Faites une simulation sur « Mes aides », puis venez nous voir avec le résultat : nous préparons les pièces que l’organisme demande à l’auto-école.',
    sources: ['mesAides', 'economie'],
    formations: null,
  },
]

export function financement(id: Financement['id']): Financement {
  const trouve = FINANCEMENTS.find((f) => f.id === id)
  if (!trouve) throw new Error(`Financement inconnu : ${id}`)
  return trouve
}
