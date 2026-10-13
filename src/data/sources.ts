/**
 * Les sources officielles citées par le site. Chaque règle écrite sur une page
 * formation renvoie à l’une d’elles. À relire au moins une fois par an, et à
 * chaque réforme : la date de dernière vérification s’affiche sous les pages.
 */
export const DERNIERE_VERIFICATION = '2026-10-11'

export const SOURCES = {
  permisB: {
    titre: 'Permis B : voiture ou camionnette (Service-Public.fr)',
    url: 'https://www.service-public.gouv.fr/particuliers/vosdroits/F2828',
  },
  facons: {
    titre: 'Quelles sont les différentes façons de passer le permis B ? (Service-Public.fr)',
    url: 'https://www.service-public.gouv.fr/particuliers/vosdroits/F31901',
  },
  permis17: {
    titre: 'Le permis de conduire possible à partir de 17 ans (Service-Public.fr)',
    url: 'https://www.service-public.gouv.fr/particuliers/actualites/A17009',
  },
  aac: {
    titre: 'Apprentissage anticipé de la conduite dès 15 ans (Service-Public.fr)',
    url: 'https://www.service-public.gouv.fr/particuliers/vosdroits/F2826',
  },
  passerelleB: {
    titre: 'Accès immédiat à la formation boîte manuelle pour les titulaires du permis B automatique (ministère de l’Intérieur)',
    url: 'https://www.interieur.gouv.fr/actualites/communiques-de-presse/acces-immediat-a-formation-boite-manuelle-pour-titulaire-du-permis',
  },
  supervisee: {
    titre: 'Conduite supervisée à partir de 18 ans (Service-Public.fr)',
    url: 'https://www.service-public.gouv.fr/particuliers/vosdroits/F21012',
  },
  superviseeSR: {
    titre: 'Conduite supervisée (Sécurité routière)',
    url: 'https://www.securite-routiere.gouv.fr/passer-son-permis-de-conduire/conduite-accompagnee/conduite-supervisee',
  },
  code: {
    titre: 'Comment passer le code : l’épreuve théorique générale (Service-Public.fr)',
    url: 'https://www.service-public.gouv.fr/particuliers/vosdroits/F33694',
  },
  permisA1: {
    titre: 'Permis A1 ou permis 125 (Service-Public.fr)',
    url: 'https://www.service-public.gouv.fr/particuliers/vosdroits/F2832',
  },
  permisA2: {
    titre: 'Permis A2 : moto de puissance intermédiaire (Service-Public.fr)',
    url: 'https://www.service-public.gouv.fr/particuliers/vosdroits/F31083',
  },
  permisA: {
    titre: 'Permis A : moto (Service-Public.fr)',
    url: 'https://www.service-public.gouv.fr/particuliers/vosdroits/F2830',
  },
  vehiculesB: {
    titre: 'Quels véhicules peut-on conduire avec le permis B ? (Service-Public.fr)',
    url: 'https://www.service-public.gouv.fr/particuliers/vosdroits/F2827',
  },
  ageDeuxRoues: {
    titre: 'À quel âge peut-on conduire une moto ou un scooter ? (Service-Public.fr)',
    url: 'https://www.service-public.gouv.fr/particuliers/vosdroits/F12789',
  },
  aides: {
    titre: 'Quelles aides pour financer le permis de conduire ? (Service-Public.fr)',
    url: 'https://www.service-public.gouv.fr/particuliers/vosdroits/F13609',
  },
  cpf: {
    titre: 'Mon Compte Formation (site officiel du CPF)',
    url: 'https://www.moncompteformation.gouv.fr/',
  },
  mesAides: {
    titre: 'Mes aides, le simulateur de France Travail',
    url: 'https://mes-aides.francetravail.fr/',
  },
  economie: {
    titre: 'Comment financer votre permis de conduire ? (economie.gouv.fr, 2 mars 2026)',
    url: 'https://www.economie.gouv.fr/particuliers/comment-financer-permis-conduire',
  },
  ants: {
    titre: 'ANTS : permis de conduire, demande d’inscription (numéro NEPH)',
    url: 'https://permisdeconduire.ants.gouv.fr/',
  },
  inscriptionEnLigne: {
    titre: 'Inscription à l’examen en ligne : attribution du numéro NEPH (Service-Public.fr)',
    url: 'https://www.service-public.gouv.fr/particuliers/vosdroits/R49186',
  },
} as const

export type CleSource = keyof typeof SOURCES
