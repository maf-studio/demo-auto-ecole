import type { CleSource } from './sources.ts'
import type { Financement } from './financements.ts'

/**
 * ============================================================================
 * LE CATALOGUE DES FORMATIONS : une entrée = une page du site.
 * ============================================================================
 *
 * `statut` :
 *   - `publiee`   : la formation est proposée par l’établissement. Page dans
 *                   les menus, le plan et le sitemap.
 *   - `brouillon` : disponibilité à confirmer. La page existe (pour relecture)
 *                   mais n’est liée de nulle part, porte `noindex` et un
 *                   bandeau « brouillon ». Passer à `publiee` après validation.
 *
 * `tarifs` : les prix TTC de l’établissement (`verifie: true` une fois validés
 * par lui). Un tarif sans prix, ou avec `verifie: false`, s’affiche « Tarif
 * sur demande ». DÉMONSTRATION : prix d’exemple, en chiffres ronds, pour
 * montrer leur présentation ; un vrai site n’affiche que les prix du client.
 *
 * Les règles écrites ici viennent des sources officielles de `sources.ts`
 * (vérifiées le 11 octobre 2026). Une règle modifiée par une réforme se corrige
 * ici, et partout à la fois.
 */

export type Categorie = 'code' | 'auto' | 'moto'
export type Visuel = 'panneau' | 'voiture' | 'automatique' | 'duo' | 'manuelle' | 'moto' | 'scooter'

export interface Tarif {
  libelle: string
  /** Volume du forfait tel qu’annoncé par l’établissement, ou `null`. */
  volume: string | null
  /** Prix TTC en euros, ou `null` : « Tarif sur demande ». */
  prixTTC: number | null
  /** `true` seulement après confirmation par l’établissement. */
  verifie: boolean
}

export interface Formation {
  slug: string
  categorie: Categorie
  statut: 'publiee' | 'brouillon'
  /** Nom complet (titre H1). */
  nom: string
  /** Nom court (menus, cartes, listes). */
  nomCourt: string
  /** Balise <title>, sans le nom de l’établissement (ajouté automatiquement). */
  titreSeo: string
  /** Meta description, de 120 à 160 caractères. */
  descriptionSeo: string
  /** Une phrase pour les cartes. */
  resume: string
  /** Chapô du haut de page. */
  accroche: string
  visuel: Visuel
  /** Les faits clés, en pastilles. */
  enBref: ReadonlyArray<{ libelle: string; valeur: string }>
  pourQui: readonly string[]
  prerequis: readonly string[]
  deroule: ReadonlyArray<{ titre: string; texte: string }>
  programme: ReadonlyArray<{ titre: string; texte: string }>
  duree: readonly string[]
  /** Identifiants de `documents.ts` (filtrés automatiquement par formation). */
  financements: ReadonlyArray<Financement['id']>
  tarifs: readonly Tarif[]
  faq: ReadonlyArray<{ question: string; reponse: string }>
  sources: readonly CleSource[]
  /** Formations voisines, proposées en bas de page. */
  liees: readonly string[]
}

/** Les quatre compétences du référentiel officiel de la formation (REMC). */
const COMPETENCES_B = [
  {
    titre: 'Maîtriser le maniement du véhicule',
    texte:
      'Installation au poste de conduite, démarrage, direction, freinage, changements d’allure : les gestes de base, dans un trafic faible ou nul.',
  },
  {
    titre: 'Appréhender la route',
    texte:
      'Rechercher les indices, adapter sa vitesse, choisir sa position, franchir intersections et ronds-points dans des conditions normales.',
  },
  {
    titre: 'Partager la route',
    texte:
      'Circuler dans des conditions difficiles (nuit, pluie, trafic dense), dépasser, s’insérer, tenir compte des piétons, cyclistes et deux-roues.',
  },
  {
    titre: 'Conduire en autonomie',
    texte:
      'Suivre un itinéraire, anticiper, conduire de façon sûre et économique, et connaître les gestes de premiers secours.',
  },
] as const

const COMPETENCES_MOTO = [
  {
    titre: 'Maniabilité à allure lente',
    texte:
      'Sur plateau, hors circulation : équilibre, regard, embrayage, demi-tours et parcours lents, moto en main.',
  },
  {
    titre: 'Maniabilité à allure normale',
    texte: 'Toujours sur plateau : freinage d’urgence, évitement, trajectoires et inclinaison à allure plus élevée.',
  },
  {
    titre: 'Circuler en sécurité',
    texte:
      'En ville et sur route : position sur la voie, distances de sécurité, angles morts, anticipation des autres usagers.',
  },
  {
    titre: 'Équipement et prévention',
    texte:
      'Choisir et porter un équipement protecteur, entretenir sa moto, connaître les risques propres aux deux-roues motorisés.',
  },
] as const

const DOCUMENTS_ET_EXAMEN_B = [
  {
    titre: 'Évaluation de départ',
    texte:
      'Obligatoire avant la formation pratique : un premier passage au volant qui permet d’estimer le nombre d’heures adapté à votre profil. Son résultat est annexé au contrat.',
  },
  {
    titre: 'Code de la route',
    texte: 'Vous préparez l’épreuve théorique générale (40 questions, 35 bonnes réponses pour réussir).',
  },
  {
    titre: 'Leçons de conduite',
    texte:
      'Vous progressez sur les quatre compétences du programme officiel, du lundi au samedi entre 7 h et 20 h. Vos progrès sont notés dans votre livret d’apprentissage.',
  },
  {
    titre: 'Préparation à l’examen',
    texte:
      'Quand les compétences sont acquises, nous vous présentons à l’examen pratique, avec un inspecteur, sur un parcours en circulation.',
  },
  {
    titre: 'Permis probatoire',
    texte: 'Une fois reçu, vous débutez avec 6 points, sur une période probatoire de 3 ans.',
  },
] as const

export const FORMATIONS: readonly Formation[] = [
  /* ------------------------------------------------------------------ CODE */
  {
    slug: 'code-de-la-route',
    categorie: 'code',
    statut: 'publiee',
    nom: 'Code de la route',
    nomCourt: 'Code de la route',
    titreSeo: 'Code de la route : préparer l’examen',
    descriptionSeo:
      'Préparez l’examen du code de la route avec Votre Auto-École : inscription, entraînement et passage de l’examen. Code voiture et code moto.',
    resume: 'Préparez l’examen théorique à votre rythme, et présentez-vous au bon moment.',
    accroche:
      'L’épreuve théorique est la première étape de tout permis. Nous constituons votre dossier, vous vous entraînez, et vous passez l’examen quand vos résultats sont réguliers.',
    visuel: 'panneau',
    enBref: [
      { libelle: 'Âge', valeur: 'Dès 15 ans en conduite accompagnée, 16 ans sinon' },
      { libelle: 'Examen', valeur: '40 questions, 35 bonnes réponses' },
      { libelle: 'Validité', valeur: '5 ans' },
      { libelle: 'Redevance d’examen', valeur: '30 €, payés au centre agréé' },
    ],
    pourQui: [
      'Toute personne qui prépare un premier permis voiture doit réussir l’épreuve théorique générale, le « code ». Le permis moto demande une épreuve spécifique, l’épreuve théorique moto (ETM).',
      'Le code est aussi à repasser quand le résultat a plus de cinq ans sans que le permis ait été obtenu, ou après une annulation de permis.',
    ],
    prerequis: [
      'Avoir 15 ans pour se présenter dans le cadre de la conduite accompagnée, 16 ans dans les autres cas.',
      'Être inscrit auprès de l’ANTS (numéro NEPH) : nous faisons la démarche avec vous.',
      'Réserver une place d’examen auprès d’un organisme agréé.',
    ],
    deroule: [
      {
        titre: 'Inscription',
        texte: 'Nous constituons votre dossier et demandons votre numéro NEPH auprès de l’ANTS.',
      },
      {
        titre: 'Apprentissage',
        texte:
          'Vous découvrez les thèmes de l’examen : circulation, route, conducteur, autres usagers, réglementation, secours, mécanique, sécurité et environnement.',
      },
      {
        titre: 'Entraînement',
        texte: 'Vous vous exercez sur des séries de questions de type examen, jusqu’à obtenir des résultats réguliers.',
      },
      {
        titre: 'Examen',
        texte:
          'Dans un centre agréé : 40 questions, et 35 bonnes réponses au moins pour réussir. Le résultat se consulte en ligne.',
      },
    ],
    programme: [
      {
        titre: 'La circulation et la route',
        texte: 'Priorités, signalisation, vitesses, dépassements, croisements, conduite selon le type de route et la météo.',
      },
      {
        titre: 'Le conducteur et les autres usagers',
        texte:
          'Vigilance, alcool, fatigue, téléphone ; piétons, cyclistes, deux-roues motorisés et véhicules lourds.',
      },
      {
        titre: 'Réglementation et premiers secours',
        texte: 'Documents, infractions, permis probatoire ; protéger, alerter et secourir en cas d’accident.',
      },
      {
        titre: 'Véhicule, sécurité, environnement',
        texte:
          'Éléments mécaniques liés à la sécurité, équipements, précautions en quittant le véhicule, conduite économe.',
      },
    ],
    duree: [
      'Aucune durée minimale n’est imposée pour le code : tout dépend de votre disponibilité et de votre régularité.',
      'Mieux vaut se présenter quand les résultats d’entraînement sont réguliers, et pas avant.',
    ],
    financements: ['paiement-3-fois', 'autres-aides'],
    tarifs: [{ libelle: 'Préparation au code de la route', volume: null, prixTTC: 250, verifie: true }],
    faq: [
      {
        question: 'À partir de quel âge peut-on passer le code ?',
        reponse: 'Dès 15 ans si vous êtes inscrit en conduite accompagnée, dès 16 ans dans les autres cas.',
      },
      {
        question: 'Combien coûte l’examen du code ?',
        reponse:
          'La redevance de l’examen est de 30 €, payée à l’organisme agréé qui le fait passer. Elle s’ajoute au prix de la préparation.',
      },
      {
        question: 'Combien de temps le code reste-t-il valable ?',
        reponse:
          'Cinq ans, dans la limite de cinq présentations à l’examen pratique. Au-delà, il faut le repasser.',
      },
      {
        question: 'Faut-il passer un autre code pour la moto ?',
        reponse:
          'Oui. Les permis A1 et A2 demandent l’épreuve théorique moto (ETM), même si vous avez déjà le code voiture.',
      },
      {
        question: 'Que se passe-t-il en cas d’échec ?',
        reponse:
          'Vous pouvez vous réinscrire à une nouvelle session. Chaque passage donne lieu à une nouvelle redevance.',
      },
    ],
    sources: ['code', 'facons'],
    liees: ['permis-b', 'permis-automatique', 'conduite-accompagnee'],
  },

  /* ------------------------------------------------------------------ AUTO */
  {
    slug: 'permis-b',
    categorie: 'auto',
    statut: 'publiee',
    nom: 'Permis B boîte manuelle',
    nomCourt: 'Permis B',
    titreSeo: 'Permis B : formation en boîte manuelle',
    descriptionSeo:
      'Passez le permis B en boîte manuelle : évaluation de départ, code, leçons du lundi au samedi de 7 h à 20 h, préparation à l’examen pratique.',
    resume: 'Apprenez à conduire sur boîte manuelle, avec un accompagnement progressif.',
    accroche:
      'La formation classique au permis voiture, sur boîte manuelle. Après une évaluation de départ, vous progressez leçon après leçon jusqu’à l’examen, avec des créneaux du lundi au samedi.',
    visuel: 'voiture',
    enBref: [
      { libelle: 'Âge', valeur: 'Examen dès 17 ans' },
      { libelle: 'Formation minimale', valeur: '20 heures de conduite' },
      { libelle: 'Examen', valeur: 'Code, puis épreuve pratique' },
      { libelle: 'Leçons', valeur: 'Du lundi au samedi, 7 h – 20 h' },
    ],
    pourQui: [
      'Le permis B permet de conduire une voiture ou une camionnette de moins de 3,5 tonnes.',
      'Appris sur boîte manuelle, il vous laisse conduire tous les véhicules de la catégorie, à boîte manuelle comme automatique.',
    ],
    prerequis: [
      'Avoir 17 ans pour passer l’examen pratique (inscription possible dès 16 ans).',
      'Réussir le code de la route avant l’examen pratique.',
      'Avoir l’ASSR 2 ou l’ASR si vous avez moins de 21 ans et qu’il s’agit de votre premier permis.',
      'Avoir effectué la JDC si vous êtes de nationalité française et avez moins de 25 ans.',
    ],
    deroule: DOCUMENTS_ET_EXAMEN_B,
    programme: COMPETENCES_B,
    duree: [
      'La réglementation impose au moins 20 heures de conduite, dont 15 heures au moins sur des voies ouvertes à la circulation.',
      'C’est un minimum : l’évaluation de départ donne une première estimation du volume adapté à votre profil, ajustée ensuite selon vos progrès.',
      'Les leçons ont lieu du lundi au samedi, de 7 h à 20 h.',
    ],
    financements: ['permis-1-euro', 'paiement-3-fois', 'cpf', 'autres-aides'],
    tarifs: [{ libelle: 'Permis B boîte manuelle', volume: '20 leçons', prixTTC: 1190, verifie: true }],
    faq: [
      {
        question: 'Combien d’heures faut-il pour obtenir le permis ?',
        reponse:
          'La loi fixe un minimum de 20 heures. Le nombre réel dépend de chacun : l’évaluation de départ en donne une première estimation.',
      },
      {
        question: 'Qu’est-ce que l’évaluation de départ ?',
        reponse:
          'Un premier passage au volant, obligatoire avant la formation pratique. Il permet d’estimer le nombre de leçons nécessaires ; son résultat est annexé au contrat de formation.',
      },
      {
        question: 'Avec un permis obtenu en boîte manuelle, puis-je conduire une automatique ?',
        reponse: 'Oui. Le permis B obtenu sur boîte manuelle permet de conduire les deux.',
      },
      {
        question: 'Combien dure la période probatoire ?',
        reponse:
          'Trois ans après une formation classique, deux ans après une conduite accompagnée. Vous débutez avec 6 points.',
      },
      {
        question: 'Quels sont les horaires des leçons ?',
        reponse: 'Du lundi au samedi, de 7 h à 20 h, selon les créneaux disponibles.',
      },
    ],
    sources: ['permisB', 'permis17', 'facons'],
    liees: ['permis-automatique', 'conduite-accompagnee', 'code-de-la-route'],
  },
  {
    slug: 'permis-automatique',
    categorie: 'auto',
    statut: 'publiee',
    nom: 'Permis B boîte automatique',
    nomCourt: 'Permis boîte automatique',
    titreSeo: 'Permis boîte automatique',
    descriptionSeo:
      'Passez le permis B en boîte automatique : 13 heures de conduite au minimum, une prise en main simplifiée, et une passerelle possible vers la manuelle.',
    resume: 'Sans embrayage ni levier de vitesses : concentrez-vous sur la route.',
    accroche:
      'Sans embrayage ni levier de vitesses, vous vous concentrez sur la circulation. Une formation plus courte au minimum, et la boîte manuelle possible ensuite en 7 heures.',
    visuel: 'automatique',
    enBref: [
      { libelle: 'Âge', valeur: 'Examen dès 17 ans' },
      { libelle: 'Formation minimale', valeur: '13 heures de conduite' },
      { libelle: 'Permis obtenu', valeur: 'B limité à la boîte automatique' },
      { libelle: 'Passerelle', valeur: 'Boîte manuelle en 7 heures' },
    ],
    pourQui: [
      'C’est un vrai permis B, avec une mention qui limite la conduite aux véhicules à boîte automatique.',
      'Il convient bien à qui veut se concentrer sur l’observation et l’anticipation, ou conduira surtout des voitures automatiques ou électriques.',
    ],
    prerequis: [
      'Avoir 17 ans pour passer l’examen pratique (inscription possible dès 16 ans).',
      'Réussir le code de la route avant l’examen pratique.',
      'Avoir l’ASSR 2 ou l’ASR si vous avez moins de 21 ans et qu’il s’agit de votre premier permis.',
      'Avoir effectué la JDC si vous êtes de nationalité française et avez moins de 25 ans.',
    ],
    deroule: DOCUMENTS_ET_EXAMEN_B,
    programme: COMPETENCES_B,
    duree: [
      'La réglementation impose au moins 13 heures de conduite, dont 10 heures au moins sur des voies ouvertes à la circulation.',
      'Comme en boîte manuelle, l’évaluation de départ estime le volume réellement adapté à votre profil.',
      'Les leçons ont lieu du lundi au samedi, de 7 h à 20 h.',
    ],
    financements: ['permis-1-euro', 'paiement-3-fois', 'cpf', 'autres-aides'],
    tarifs: [{ libelle: 'Permis B boîte automatique', volume: '13 leçons', prixTTC: 890, verifie: true }],
    faq: [
      {
        question: 'Puis-je conduire une voiture manuelle avec ce permis ?',
        reponse:
          'Non, pas sans la formation passerelle de 7 heures. Après elle, vous pouvez conduire une boîte manuelle, sans nouvel examen.',
      },
      {
        question: 'Faut-il attendre avant de faire la passerelle ?',
        reponse:
          'Non. Le délai de trois mois qui existait a été supprimé le 1er mars 2024 : la formation peut se faire dès l’obtention du permis.',
      },
      {
        question: 'Le permis automatique est-il moins cher ?',
        reponse:
          'Le minimum réglementaire est plus court (13 heures au lieu de 20). Le prix dépend du nombre d’heures dont vous aurez besoin : demandez un devis.',
      },
      {
        question: 'La période probatoire est-elle la même ?',
        reponse: 'Oui : trois ans, ou deux ans après une conduite accompagnée.',
      },
    ],
    sources: ['permisB', 'passerelleB'],
    liees: ['passerelle-boite-manuelle', 'permis-b', 'conduite-accompagnee'],
  },
  {
    slug: 'conduite-accompagnee',
    categorie: 'auto',
    statut: 'publiee',
    nom: 'Conduite accompagnée (AAC)',
    nomCourt: 'Conduite accompagnée',
    titreSeo: 'Conduite accompagnée (AAC) dès 15 ans',
    descriptionSeo:
      'Conduite accompagnée dès 15 ans : formation initiale, au moins 3 000 km avec un accompagnateur, rendez-vous pédagogiques, examen dès 17 ans.',
    resume: 'Dès 15 ans, gagnez de l’expérience avec un proche avant l’examen.',
    accroche:
      'Commencez dès 15 ans, roulez au moins un an avec un proche, et passez l’examen dès 17 ans. À la clé : plus d’expérience, et une période probatoire réduite à 2 ans.',
    visuel: 'duo',
    enBref: [
      { libelle: 'Inscription', valeur: 'Dès 15 ans' },
      { libelle: 'Formation initiale', valeur: '20 h minimum (13 h en automatique)' },
      { libelle: 'Avec l’accompagnateur', valeur: '1 an et 3 000 km minimum' },
      { libelle: 'Examen', valeur: 'Dès 17 ans' },
    ],
    pourQui: [
      'L’apprentissage anticipé de la conduite (AAC) s’adresse aux jeunes dès 15 ans. Après une formation initiale à l’auto-école, l’élève conduit avec un accompagnateur pendant au moins un an.',
      'Cette expérience, dans des situations variées, prépare à l’examen et réduit la période probatoire à deux ans au lieu de trois.',
    ],
    prerequis: [
      'Avoir au moins 15 ans.',
      'Pour un mineur, l’accord de son représentant légal.',
      'L’accord écrit de l’assureur du véhicule utilisé.',
      'Un ou plusieurs accompagnateurs titulaires du permis B depuis au moins 5 ans sans interruption.',
      'L’ASSR 2 ou l’ASR.',
    ],
    deroule: [
      {
        titre: 'Formation initiale',
        texte:
          'Évaluation de départ, code, puis au moins 20 heures de conduite (13 heures en boîte automatique) à l’auto-école.',
      },
      {
        titre: 'Attestation et rendez-vous préalable',
        texte:
          'Quand le niveau est atteint, nous délivrons l’attestation de fin de formation initiale. Un rendez-vous réunit l’élève, l’accompagnateur et l’enseignant avant le départ.',
      },
      {
        titre: 'Conduite accompagnée',
        texte: 'Au moins un an et 3 000 km avec l’accompagnateur, sur des trajets et dans des conditions variés.',
      },
      {
        titre: 'Rendez-vous pédagogiques',
        texte:
          'Deux rendez-vous à l’auto-école, en cours de période puis à son terme, pour faire le point sur la conduite et corriger ce qui doit l’être.',
      },
      {
        titre: 'Examen pratique',
        texte: 'Dès 17 ans, avec une période probatoire de deux ans une fois le permis obtenu.',
      },
    ],
    programme: [
      ...COMPETENCES_B.slice(0, 3),
      {
        titre: 'Le rôle de l’accompagnateur',
        texte:
          'Assurer la sécurité, faire varier les trajets, échanger après chaque sortie : l’accompagnateur est préparé lors du rendez-vous préalable.',
      },
    ],
    duree: [
      'Formation initiale : au moins 20 heures de conduite en boîte manuelle, 13 heures en boîte automatique.',
      'Conduite avec l’accompagnateur : au moins un an et 3 000 km.',
      'Examen pratique : dès 17 ans.',
    ],
    financements: ['permis-1-euro', 'paiement-3-fois', 'cpf', 'autres-aides'],
    tarifs: [{ libelle: 'Conduite accompagnée', volume: '20 leçons', prixTTC: 1290, verifie: true }],
    faq: [
      {
        question: 'Qui peut être accompagnateur ?',
        reponse:
          'Une personne titulaire du permis B depuis au moins 5 ans sans interruption, avec l’accord de l’assureur du véhicule. Il peut y avoir plusieurs accompagnateurs.',
      },
      {
        question: 'Peut-on conduire seul avant l’examen ?',
        reponse: 'Non. Jusqu’au permis, l’élève ne conduit qu’avec un accompagnateur déclaré.',
      },
      {
        question: 'Quel avantage par rapport à la formation classique ?',
        reponse: 'Beaucoup plus d’expérience avant l’examen, et une période probatoire de deux ans au lieu de trois.',
      },
      {
        question: 'Faut-il prévenir l’assurance ?',
        reponse: 'Oui, son accord écrit est obligatoire avant de commencer la conduite accompagnée.',
      },
      {
        question: 'La conduite accompagnée est-elle possible en boîte automatique ?',
        reponse: 'Oui. La formation initiale compte alors au moins 13 heures de conduite.',
      },
    ],
    sources: ['aac', 'facons'],
    liees: ['permis-b', 'permis-automatique', 'code-de-la-route'],
  },
  {
    slug: 'conduite-supervisee',
    categorie: 'auto',
    statut: 'publiee',
    nom: 'Conduite supervisée',
    nomCourt: 'Conduite supervisée',
    titreSeo: 'Conduite supervisée dès 18 ans',
    descriptionSeo:
      'Conduite supervisée dès 18 ans : après la formation initiale, conduisez avec un accompagnateur pour gagner de l’expérience avant l’examen du permis B.',
    resume: 'Dès 18 ans, roulez avec un accompagnateur après la formation initiale.',
    accroche:
      'Pour les adultes qui veulent gagner en expérience avant l’examen : une fois la formation initiale terminée, vous conduisez avec un proche, sans durée ni distance minimales imposées.',
    visuel: 'duo',
    enBref: [
      { libelle: 'Âge', valeur: 'Dès 18 ans' },
      { libelle: 'Condition', valeur: 'Formation initiale terminée' },
      { libelle: 'Accompagnateur', valeur: 'Permis B depuis 5 ans' },
      { libelle: 'Durée', valeur: 'Ni durée ni distance minimales' },
    ],
    pourQui: [
      'La conduite supervisée complète la formation initiale suivie à l’auto-école. Elle s’adresse aux candidats d’au moins 18 ans qui veulent davantage de pratique avant l’examen pratique.',
      'Contrairement à la conduite accompagnée, elle ne réduit pas la période probatoire : elle reste de 3 ans.',
    ],
    prerequis: [
      'Avoir au moins 18 ans.',
      'Avoir réussi le code et terminé la formation initiale, attestée par l’attestation de fin de formation initiale.',
      'Un ou plusieurs accompagnateurs titulaires du permis B depuis au moins 5 ans, sans suspension ni annulation de permis au cours des 5 dernières années.',
      'L’accord écrit de l’assureur du véhicule.',
    ],
    deroule: [
      {
        titre: 'Formation initiale',
        texte: 'Évaluation de départ, code, puis au moins 20 heures de conduite à l’auto-école (13 en boîte automatique).',
      },
      {
        titre: 'Attestation de fin de formation',
        texte: 'Quand le niveau est atteint, nous délivrons l’attestation de fin de formation initiale, à transmettre à l’assureur.',
      },
      {
        titre: 'Rendez-vous préalable',
        texte: 'Au moins 2 heures avec l’enseignant et l’accompagnateur, pour préparer la conduite supervisée.',
      },
      { titre: 'Conduite supervisée', texte: 'Vous roulez avec votre accompagnateur, à votre rythme, pour gagner en aisance.' },
      { titre: 'Examen pratique', texte: 'Vous vous présentez quand vous êtes prêt, avec une période probatoire de 3 ans.' },
    ],
    programme: COMPETENCES_B,
    duree: [
      'Formation initiale : au moins 20 heures de conduite en boîte manuelle, 13 heures en boîte automatique.',
      'Conduite supervisée : aucune durée ni distance minimales ne sont imposées. Plus vous roulez, plus vous gagnez en expérience.',
    ],
    financements: ['permis-1-euro', 'paiement-3-fois', 'cpf', 'autres-aides'],
    tarifs: [{ libelle: 'Conduite supervisée', volume: null, prixTTC: null, verifie: false }],
    faq: [
      {
        question: 'Quelle différence avec la conduite accompagnée ?',
        reponse:
          'La conduite accompagnée commence dès 15 ans, dure au moins un an et 3 000 km, et réduit la période probatoire à 2 ans. La conduite supervisée s’adresse aux 18 ans et plus, sans durée ni distance minimales, et la période probatoire reste de 3 ans.',
      },
      {
        question: 'Qui peut être accompagnateur ?',
        reponse:
          'Une personne titulaire du permis B depuis au moins 5 ans, sans suspension ni annulation au cours des 5 dernières années, avec l’accord de l’assureur du véhicule.',
      },
      {
        question: 'Combien de temps dure la conduite supervisée ?',
        reponse: 'Aucune durée minimale n’est imposée : vous vous présentez à l’examen quand vous êtes prêt.',
      },
    ],
    sources: ['supervisee', 'superviseeSR', 'facons'],
    liees: ['conduite-accompagnee', 'permis-b'],
  },
  {
    slug: 'passerelle-boite-manuelle',
    categorie: 'auto',
    statut: 'publiee',
    nom: 'Passerelle boîte automatique vers boîte manuelle',
    nomCourt: 'Passerelle boîte manuelle',
    titreSeo: 'Passerelle boîte automatique vers manuelle',
    descriptionSeo:
      'Titulaire du permis B en boîte automatique ? Conduisez aussi une boîte manuelle après une formation de 7 heures, sans nouvel examen.',
    resume: 'Passez de la boîte automatique à la manuelle en 7 heures, sans examen.',
    accroche:
      'Vous avez le permis en boîte automatique et voulez conduire une manuelle ? Une formation de 7 heures suffit, sans repasser l’examen.',
    visuel: 'manuelle',
    enBref: [
      { libelle: 'Pour qui', valeur: 'Titulaires du permis B automatique' },
      { libelle: 'Durée', valeur: '7 heures minimum' },
      { libelle: 'Examen', valeur: 'Aucun' },
      { libelle: 'Délai', valeur: 'Dès l’obtention du permis' },
    ],
    pourQui: [
      'Cette formation lève la restriction « boîte automatique » de votre permis B.',
      'Elle s’adresse à ceux qui ont appris sur boîte automatique et ont besoin d’une voiture manuelle, pour le travail, une location ou un véhicule familial.',
    ],
    prerequis: [
      'Être titulaire du permis B limité à la boîte automatique.',
      'Restriction non liée à une raison médicale.',
    ],
    deroule: [
      { titre: 'Prise de contact', texte: 'Nous fixons ensemble les créneaux de la formation.' },
      {
        titre: 'Formation de 7 heures',
        texte: 'Embrayage, passage des rapports, démarrages en côte : d’abord à faible allure, puis en circulation.',
      },
      { titre: 'Attestation', texte: 'Nous vous remettons l’attestation de suivi de la formation.' },
      {
        titre: 'Mise à jour du permis',
        texte: 'Vous demandez la modification de votre permis sur le site de l’ANTS, attestation à l’appui.',
      },
    ],
    programme: [
      { titre: 'L’embrayage', texte: 'Trouver le point de patinage, démarrer sans caler, s’arrêter en douceur.' },
      { titre: 'Les rapports', texte: 'Choisir le bon rapport selon la vitesse et la situation, rétrograder.' },
      { titre: 'Les situations délicates', texte: 'Démarrage en côte, manœuvres à faible allure, circulation dense.' },
      { titre: 'En circulation', texte: 'Combiner tous ces gestes en conduisant, sans perdre l’attention de la route.' },
    ],
    duree: [
      'La formation dure 7 heures au minimum.',
      'Depuis le 1er mars 2024, aucun délai n’est exigé après l’obtention du permis automatique.',
    ],
    financements: ['paiement-3-fois', 'autres-aides'],
    tarifs: [{ libelle: 'Passerelle boîte manuelle', volume: '7 heures', prixTTC: 450, verifie: true }],
    faq: [
      { question: 'Faut-il repasser l’examen ?', reponse: 'Non, la passerelle ne comporte aucun examen.' },
      {
        question: 'Quand peut-on la faire ?',
        reponse: 'Dès l’obtention du permis B automatique : le délai de trois mois a été supprimé en 2024.',
      },
      {
        question: 'Le CPF peut-il la financer ?',
        reponse: 'Non, cette formation n’est pas finançable par le compte personnel de formation.',
      },
    ],
    sources: ['permisB', 'passerelleB'],
    liees: ['permis-automatique', 'permis-b'],
  },

  /* ------------------------------------------------------------------ MOTO */
  {
    slug: 'permis-a1',
    categorie: 'moto',
    statut: 'publiee',
    nom: 'Permis A1 : moto légère 125 cm³',
    nomCourt: 'Permis A1',
    titreSeo: 'Permis A1 : moto 125 dès 16 ans',
    descriptionSeo:
      'Permis A1 : conduisez une moto légère de 125 cm³ dès 16 ans. Code moto, 20 heures de formation au minimum, examen sur plateau et en circulation.',
    resume: 'La moto dès 16 ans : les motos légères jusqu’à 125 cm³.',
    accroche:
      'La moto dès 16 ans. Le permis A1 ouvre les motos légères jusqu’à 125 cm³ et 11 kW, et prépare la suite vers le A2.',
    visuel: 'moto',
    enBref: [
      { libelle: 'Âge', valeur: 'Dès 16 ans' },
      { libelle: 'Code', valeur: 'Épreuve théorique moto (ETM)' },
      { libelle: 'Formation minimale', valeur: '20 heures, dont 8 sur plateau' },
      { libelle: 'Véhicules', valeur: '125 cm³ et 11 kW au plus' },
    ],
    pourQui: [
      'Le permis A1 permet de conduire une moto légère : 125 cm³ au plus, 11 kW au plus, et un rapport puissance/poids de 0,1 kW/kg au plus.',
      'C’est la première marche vers les motos plus puissantes, dès 16 ans.',
    ],
    prerequis: [
      'Avoir au moins 16 ans.',
      'Réussir l’épreuve théorique moto (ETM).',
      'Avoir l’ASSR 2 ou l’ASR si vous avez moins de 21 ans et qu’il s’agit de votre premier permis.',
      'Un équipement adapté pour la formation et l’examen : casque homologué, gants homologués, blouson, pantalon, chaussures montantes.',
    ],
    deroule: [
      { titre: 'Code moto', texte: 'Vous préparez et réussissez l’épreuve théorique moto (ETM).' },
      { titre: 'Plateau', texte: 'Hors circulation, vous apprenez à manier la moto, à allure lente puis normale.' },
      { titre: 'Circulation', texte: 'En ville et sur route, vous apprenez à circuler en sécurité parmi les autres usagers.' },
      { titre: 'Examen', texte: 'Une épreuve sur plateau, puis une épreuve en circulation.' },
    ],
    programme: COMPETENCES_MOTO,
    duree: ['Au moins 20 heures de formation pratique : 8 heures sur plateau et 12 heures en circulation.'],
    financements: ['permis-1-euro', 'paiement-3-fois', 'cpf', 'autres-aides'],
    tarifs: [{ libelle: 'Permis A1, boîte manuelle', volume: '20 leçons', prixTTC: 990, verifie: true }],
    faq: [
      {
        question: 'Faut-il avoir le permis B ?',
        reponse: 'Non. Le permis A1 se passe dès 16 ans, sans autre permis.',
      },
      {
        question: 'Faut-il passer le code moto si j’ai déjà le code voiture ?',
        reponse: 'Oui. L’épreuve théorique moto (ETM) est demandée pour le permis A1.',
      },
      {
        question: 'Puis-je passer le A2 ensuite ?',
        reponse: 'Oui, à partir de 18 ans. Parlez-nous de votre projet pour choisir le bon parcours.',
      },
    ],
    sources: ['permisA1', 'ageDeuxRoues', 'code'],
    liees: ['permis-a2', 'formation-125', 'permis-am'],
  },
  {
    slug: 'permis-a2',
    categorie: 'moto',
    statut: 'publiee',
    nom: 'Permis moto A2',
    nomCourt: 'Permis A2',
    titreSeo: 'Permis moto A2, dès 18 ans',
    descriptionSeo:
      'Permis moto A2 dès 18 ans : code moto, 20 heures de formation au minimum sur plateau et en circulation, puis passerelle vers le permis A.',
    resume: 'Des motos jusqu’à 35 kW dès 18 ans, puis le permis A après deux ans.',
    accroche:
      'Le permis moto le plus demandé : des motos jusqu’à 35 kW dès 18 ans, puis l’accès au permis A après deux ans, par une formation de 7 heures.',
    visuel: 'moto',
    enBref: [
      { libelle: 'Âge', valeur: 'Dès 18 ans' },
      { libelle: 'Code', valeur: 'Épreuve théorique moto (ETM)' },
      { libelle: 'Formation minimale', valeur: '20 heures, dont 8 sur plateau' },
      { libelle: 'Véhicules', valeur: 'Motos jusqu’à 35 kW' },
    ],
    pourQui: [
      'Le permis A2 permet de conduire une moto de 35 kW au plus, avec un rapport puissance/poids de 0,2 kW/kg au plus.',
      'Après deux ans de permis A2, une formation de 7 heures donne accès au permis A, sans limite de puissance.',
    ],
    prerequis: [
      'Avoir au moins 18 ans.',
      'Réussir l’épreuve théorique moto (ETM).',
      'Avoir l’ASSR 2 ou l’ASR si vous avez moins de 21 ans et qu’il s’agit de votre premier permis.',
      'Un équipement adapté pour la formation et l’examen : casque homologué, gants homologués, blouson, pantalon, chaussures montantes.',
    ],
    deroule: [
      { titre: 'Code moto', texte: 'Vous préparez et réussissez l’épreuve théorique moto (ETM).' },
      { titre: 'Plateau', texte: 'Hors circulation : maniabilité à allure lente, puis freinage et évitement à allure normale.' },
      { titre: 'Circulation', texte: 'En ville et sur route : placement, anticipation, sécurité parmi les autres usagers.' },
      { titre: 'Examen', texte: 'Une épreuve sur plateau, puis une épreuve en circulation.' },
    ],
    programme: COMPETENCES_MOTO,
    duree: ['Au moins 20 heures de formation pratique : 8 heures sur plateau et 12 heures en circulation.'],
    financements: ['permis-1-euro', 'paiement-3-fois', 'cpf', 'autres-aides'],
    tarifs: [
      { libelle: 'Permis A2, boîte manuelle', volume: '20 leçons', prixTTC: 990, verifie: true },
      { libelle: 'Permis A2, boîte automatique', volume: '13 leçons', prixTTC: 790, verifie: true },
    ],
    faq: [
      {
        question: 'Puis-je passer le A2 si j’ai déjà le permis B ?',
        reponse: 'Oui. L’épreuve théorique moto (ETM) reste à passer, puis la formation pratique.',
      },
      {
        question: 'Comment passer ensuite au permis A ?',
        reponse: 'Après deux ans de permis A2, par une formation de 7 heures, sans examen.',
      },
      {
        question: 'Qu’est-ce que le plateau ?',
        reponse:
          'Une piste fermée à la circulation, où l’on apprend à manier la moto avant de rouler en ville. L’examen comporte aussi une épreuve sur plateau.',
      },
    ],
    sources: ['permisA2', 'code', 'ageDeuxRoues'],
    liees: ['passerelle-a2-a', 'permis-a1', 'formation-125'],
  },
  {
    slug: 'passerelle-a2-a',
    categorie: 'moto',
    statut: 'publiee',
    nom: 'Passerelle A2 vers permis A',
    nomCourt: 'Passerelle A2 vers A',
    titreSeo: 'Passerelle A2 vers permis A (7 heures)',
    descriptionSeo:
      'Titulaire du permis A2 depuis 2 ans ? Accédez au permis A, toutes motos, avec une formation de 7 heures et sans examen, à Votre Auto-École.',
    resume: 'Après deux ans de A2, 7 heures de formation pour accéder à toutes les motos.',
    accroche:
      'Après deux ans de permis A2, une formation de 7 heures suffit pour accéder au permis A, sans limite de puissance, et sans examen.',
    visuel: 'moto',
    enBref: [
      { libelle: 'Pour qui', valeur: 'Permis A2 depuis 2 ans' },
      { libelle: 'Durée', valeur: '7 heures' },
      { libelle: 'Examen', valeur: 'Aucun' },
      { libelle: 'Inscription', valeur: 'Jusqu’à 3 mois avant les 2 ans' },
    ],
    pourQui: ['La passerelle transforme votre permis A2 en permis A : toutes les motos, sans limitation de puissance.'],
    prerequis: [
      'Être titulaire du permis A2 depuis au moins 2 ans.',
      'La formation peut être suivie dans les 3 mois qui précèdent les deux ans de permis A2.',
    ],
    deroule: [
      { titre: 'Théorie (2 heures)', texte: 'Risques propres aux motos puissantes, comportement, équipement.' },
      { titre: 'Hors circulation (2 heures)', texte: 'Maniabilité et freinage sur plateau.' },
      { titre: 'Circulation (3 heures)', texte: 'Conduite sur route et évaluation des acquis.' },
      {
        titre: 'Attestation',
        texte: 'Nous vous remettons l’attestation de formation, à joindre à votre demande de permis A sur le site de l’ANTS.',
      },
    ],
    programme: [
      { titre: 'Puissance et risques', texte: 'Ce qui change avec une moto plus puissante : accélérations, distances, vitesse.' },
      { titre: 'Maniabilité', texte: 'Freinage appuyé, évitement, trajectoires, sur plateau.' },
      { titre: 'Circulation', texte: 'Anticipation, placement et dépassements sur route.' },
      { titre: 'Évaluation', texte: 'Un point complet sur votre conduite en fin de formation.' },
    ],
    duree: ['7 heures : 2 heures de théorie, 2 heures hors circulation et 3 heures en circulation.'],
    financements: ['paiement-3-fois', 'autres-aides'],
    tarifs: [{ libelle: 'Passerelle A2 vers A', volume: '7 heures', prixTTC: 320, verifie: true }],
    faq: [
      { question: 'Y a-t-il un examen ?', reponse: 'Non. La formation se valide par l’attestation remise à la fin.' },
      {
        question: 'Quand puis-je m’inscrire ?',
        reponse: 'La formation peut commencer dans les 3 mois qui précèdent vos deux ans de permis A2.',
      },
      {
        question: 'Que faire après la formation ?',
        reponse: 'Demander votre permis A sur le site de l’ANTS, en joignant l’attestation de formation.',
      },
    ],
    sources: ['permisA'],
    liees: ['permis-a2', 'formation-125'],
  },
  {
    slug: 'formation-125',
    categorie: 'moto',
    statut: 'publiee',
    nom: 'Formation 125 cm³ avec le permis B',
    nomCourt: 'Formation 125',
    titreSeo: 'Formation 125 cm³ avec le permis B',
    descriptionSeo:
      'Conduisez une moto ou un scooter 125 avec votre permis B : formation de 7 heures, sans examen, après 2 ans de permis B. Votre Auto-École.',
    resume: 'Avec deux ans de permis B, 7 heures pour conduire un 125.',
    accroche:
      'Avec deux ans de permis B, une formation de 7 heures suffit pour conduire une moto ou un scooter de 125 cm³. Sans examen.',
    visuel: 'scooter',
    enBref: [
      { libelle: 'Pour qui', valeur: 'Permis B depuis 2 ans' },
      { libelle: 'Durée', valeur: '7 heures' },
      { libelle: 'Examen', valeur: 'Aucun' },
      { libelle: 'Véhicules', valeur: '125 cm³ et 11 kW au plus' },
    ],
    pourQui: [
      'La formation 125 permet aux titulaires du permis B de conduire une moto légère ou un scooter de 125 cm³, de 11 kW au plus.',
      'Une solution pratique pour se déplacer en ville sans passer de nouveau permis.',
    ],
    prerequis: [
      'Être titulaire du permis B depuis au moins 2 ans.',
      'Un équipement adapté : casque homologué et gants homologués au minimum.',
    ],
    deroule: [
      { titre: 'Théorie', texte: 'Les risques propres aux deux-roues, l’équipement, la place sur la route.' },
      { titre: 'Hors circulation', texte: 'Prise en main du 125 : équilibre, freinage, maniabilité.' },
      { titre: 'En circulation', texte: 'Conduite en ville, avec l’enseignant.' },
      {
        titre: 'Attestation',
        texte: 'Nous vous remettons une attestation, à garder avec votre permis B : elle se présente en cas de contrôle.',
      },
    ],
    programme: COMPETENCES_MOTO,
    duree: ['7 heures de formation, sans examen à la fin.'],
    financements: ['paiement-3-fois', 'autres-aides'],
    tarifs: [{ libelle: 'Formation 125 cm³', volume: '7 heures', prixTTC: 320, verifie: true }],
    faq: [
      { question: 'Faut-il passer un examen ?', reponse: 'Non. La formation se valide par une attestation.' },
      {
        question: 'Que présenter en cas de contrôle ?',
        reponse: 'Votre permis B et l’attestation de formation.',
      },
      {
        question: 'J’ai mon permis B depuis moins de 2 ans : que faire ?',
        reponse: 'Attendre les deux ans, ou passer le permis A1. Nous pouvons vous conseiller selon votre projet.',
      },
    ],
    sources: ['vehiculesB', 'permisA1'],
    liees: ['permis-a1', 'permis-a2', 'permis-am'],
  },
  {
    slug: 'permis-am',
    categorie: 'moto',
    statut: 'publiee',
    nom: 'Permis AM : scooter 50 cm³ dès 14 ans',
    nomCourt: 'Permis AM',
    titreSeo: 'Permis AM (ex-BSR) dès 14 ans',
    descriptionSeo:
      'Permis AM : conduisez un scooter de 50 cm³ ou une voiturette dès 14 ans, après une formation de 8 heures, sans examen. Votre Auto-École.',
    resume: 'Dès 14 ans, le scooter 50 cm³ après 8 heures de formation.',
    accroche:
      'Dès 14 ans, le permis AM, l’ancien BSR, permet de conduire un scooter de 50 cm³ après une formation de 8 heures, sans examen.',
    visuel: 'scooter',
    enBref: [
      { libelle: 'Âge', valeur: 'Dès 14 ans' },
      { libelle: 'Durée', valeur: '8 heures' },
      { libelle: 'Examen', valeur: 'Aucun' },
      { libelle: 'Prérequis', valeur: 'ASSR 1, ASSR 2 ou ASR' },
    ],
    pourQui: [
      'Le permis AM permet de conduire un cyclomoteur (scooter de 50 cm³) ou une voiturette.',
      'Il s’adresse notamment aux collégiens et lycéens, dès 14 ans.',
    ],
    prerequis: [
      'Avoir au moins 14 ans.',
      'Avoir l’ASSR 1, l’ASSR 2 ou l’ASR.',
      'Pour un mineur, l’accord de son représentant légal.',
      'Un casque homologué et des gants homologués.',
    ],
    deroule: [
      { titre: 'Inscription', texte: 'Nous constituons le dossier avec l’élève et son représentant légal.' },
      { titre: 'Formation de 8 heures', texte: 'Règles de circulation, maniement hors circulation, puis conduite en ville.' },
      { titre: 'Attestation', texte: 'À la fin de la formation, le titre est demandé auprès de l’ANTS.' },
    ],
    programme: [
      { titre: 'Les règles', texte: 'Ce que dit le code de la route pour un cyclomoteur, et les risques de la route.' },
      { titre: 'Le maniement', texte: 'Équilibre, freinage, regard, sur une zone hors circulation.' },
      { titre: 'La circulation', texte: 'Une première expérience accompagnée de la conduite en ville.' },
      { titre: 'L’équipement', texte: 'Casque, gants, vêtements : se protéger à chaque trajet.' },
    ],
    duree: ['8 heures de formation, sans examen.'],
    financements: ['paiement-3-fois', 'autres-aides'],
    tarifs: [{ libelle: 'Permis AM', volume: '8 heures', prixTTC: 350, verifie: true }],
    faq: [
      { question: 'Y a-t-il un examen ?', reponse: 'Non. Le permis AM s’obtient après la formation de 8 heures.' },
      {
        question: 'Quels véhicules peut-on conduire ?',
        reponse: 'Un cyclomoteur (scooter de 50 cm³) ou une voiturette.',
      },
      {
        question: 'Quelle attestation faut-il ?',
        reponse: 'L’ASSR 1 ou l’ASSR 2, passées au collège, ou à défaut l’ASR.',
      },
    ],
    sources: ['ageDeuxRoues'],
    liees: ['formation-125', 'permis-a1'],
  },
]

export const FORMATIONS_PUBLIEES = FORMATIONS.filter((f) => f.statut === 'publiee')

export function formation(slug: string): Formation {
  const trouvee = FORMATIONS.find((f) => f.slug === slug)
  if (!trouvee) throw new Error(`Formation inconnue : ${slug}`)
  return trouvee
}

export function formationsDe(categorie: Categorie): Formation[] {
  return FORMATIONS_PUBLIEES.filter((f) => f.categorie === categorie)
}

/** Le tarif à afficher : le prix seulement s’il est confirmé. */
export function prixAffiche(t: Tarif): number | null {
  return t.verifie ? t.prixTTC : null
}

/**
 * Les autres formules annoncées par l’établissement, sans page dédiée tant que
 * leurs modalités ne sont pas connues.
 */
export const AUTRES_FORMULES_AUTO = [
  {
    nom: 'Formation accélérée',
    texte: 'Une formule intensive pour le permis B. Modalités et planning sur demande.',
  },
] as const
