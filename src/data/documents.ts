/**
 * Les pièces d’un dossier d’inscription (page /documents-inscription et pages
 * formations). Elle reprend la liste du dépliant de l’établissement
 * (« Documents à fournir »). `pour` : `'toutes'`, ou la liste des formations
 * concernées (identifiants de `formations.ts`). La liste définitive se vérifie
 * à l’inscription, selon la formation et la situation de l’élève.
 */
export interface Piece {
  id: string
  titre: string
  detail: string
  /** `true` : seulement dans certains cas (écrit dans `detail`). */
  selonCas: boolean
  pour: 'toutes' | readonly string[]
}

const PREMIER_PERMIS = [
  'code-de-la-route',
  'permis-b',
  'permis-automatique',
  'conduite-accompagnee',
  'conduite-supervisee',
  'permis-a1',
  'permis-a2',
] as const

export const PIECES: readonly Piece[] = [
  {
    id: 'identite',
    titre: 'Copie de votre pièce d’identité',
    detail:
      'Carte d’identité, passeport ou titre de séjour en cours de validité. Pour un élève mineur, la copie de la pièce d’identité de son représentant légal en plus.',
    selonCas: false,
    pour: 'toutes',
  },
  {
    id: 'ephoto',
    titre: 'E-photo d’identité homologuée ANTS',
    detail:
      'Faite dans une cabine ou chez un photographe agréé par l’ANTS. Vous recevez un code photo-signature à nous transmettre.',
    selonCas: false,
    pour: 'toutes',
  },
  {
    id: 'domicile',
    titre: 'Justificatif de domicile de moins de 3 mois',
    detail: 'De moins de 3 mois à sa date d’édition : facture d’électricité, de gaz, d’eau ou de téléphone, quittance de loyer…',
    selonCas: false,
    pour: 'toutes',
  },
  {
    id: 'hebergement',
    titre: 'Attestation d’hébergement',
    detail:
      'Si vous êtes hébergé (chez vos parents par exemple) : l’attestation signée, la photocopie recto verso de la pièce d’identité de la personne qui vous héberge, et son justificatif de domicile.',
    selonCas: true,
    pour: 'toutes',
  },
  {
    id: 'assr',
    titre: 'ASSR 2 ou ASR',
    detail: 'Si vous avez moins de 21 ans et qu’il s’agit de votre premier permis.',
    selonCas: true,
    pour: PREMIER_PERMIS,
  },
  {
    id: 'assr-am',
    titre: 'ASSR 1, ASSR 2 ou ASR',
    detail: 'L’attestation de sécurité routière demandée pour la formation AM.',
    selonCas: false,
    pour: ['permis-am'],
  },
  {
    id: 'jdc',
    titre: 'Attestation de recensement ou de JDC',
    detail:
      'Si vous êtes de nationalité française : l’attestation de recensement à 16 ans, puis le certificat de participation à la Journée défense et citoyenneté de 17 à 25 ans.',
    selonCas: true,
    pour: [...PREMIER_PERMIS, 'permis-am'],
  },
  {
    id: 'permis-existant',
    titre: 'Copie de votre permis de conduire',
    detail: 'Si vous avez déjà un permis en cours de validité. Obligatoire pour une passerelle et pour la formation 125 cm³.',
    selonCas: true,
    pour: 'toutes',
  },
  {
    id: 'code-obtenu',
    titre: 'Résultat de votre code',
    detail: 'Si vous avez déjà obtenu le code de la route et qu’il est toujours valable (5 ans).',
    selonCas: true,
    pour: PREMIER_PERMIS,
  },
  {
    id: 'accompagnateur',
    titre: 'Pièces de l’accompagnateur',
    detail:
      'Pour la conduite accompagnée ou supervisée : la copie du permis de chaque accompagnateur, et l’accord écrit de l’assureur du véhicule.',
    selonCas: false,
    pour: ['conduite-accompagnee', 'conduite-supervisee'],
  },
  {
    id: 'annulation',
    titre: 'Après une annulation de permis',
    detail:
      'L’avis de la visite médicale et du test psychotechnique, un relevé d’information du solde de points nul (référence 44), et l’attestation d’inscription au permis de conduire (cerfa 02).',
    selonCas: true,
    pour: ['code-de-la-route', 'permis-b', 'permis-automatique', 'permis-a1', 'permis-a2'],
  },
]

export function piecesPour(formation: string | null): readonly Piece[] {
  if (!formation) return PIECES
  return PIECES.filter((p) => p.pour === 'toutes' || p.pour.includes(formation))
}
