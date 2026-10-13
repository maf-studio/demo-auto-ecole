/**
 * ============================================================================
 * L’ÉTABLISSEMENT : la seule source des coordonnées, horaires, avis, labels…
 * ============================================================================
 *
 * SITE DE DÉMONSTRATION : toutes les valeurs ci-dessous sont des EXEMPLES,
 * pour présenter le site à une auto-école. Le nom est « Votre Auto-École »,
 * le numéro est dans la tranche réservée à la fiction par l’ARCEP
 * (01 99 00 …), l’e-mail est sur un domaine réservé (.example). Pour un vrai
 * client : remplacer chaque valeur par la sienne, et passer DEMONSTRATION à
 * `false` (src/data/demonstration.ts).
 *
 * Règle d’un vrai site : RIEN D’INVENTÉ. Une information inconnue vaut `null`,
 * et ce qui en dépend disparaît du site. `pnpm check:publication` liste tout
 * ce qui reste à compléter.
 *
 * Guide de modification en français simple : MODIFIER-LE-CONTENU.md
 */

export const ETABLISSEMENT = {
  nom: 'Votre Auto-École',
  nomCourt: 'Votre Auto-École',
  /** Écrit dans les titres de page (balise <title>) après le nom de la page. */
  nomTitre: 'Votre Auto-École',
  anneeCreation: 2010,
  agrement: 'E 00 000 00000',

  adresse: {
    rue: '12 rue de l’Exemple',
    codePostal: '00000',
    ville: 'Votre ville',
    pays: 'FR',
  },

  telephone: {
    affiche: '01 99 00 12 34',
    lien: 'tel:+33199001234',
    international: '+33 1 99 00 12 34',
  },

  email: 'contact@votre-auto-ecole.example',

  /**
   * WhatsApp : `null` tant qu’aucun numéro n’est fourni avec l’accord de
   * l’établissement. Renseigné (ex. '33612345678', sans + ni espace), un
   * bouton WhatsApp apparaît sur la page Contact.
   */
  whatsapp: null as string | null,

  /**
   * Coordonnées GPS : `null` tant qu’elles n’ont pas été relevées sur place ou
   * dans la Base Adresse Nationale (adresse.data.gouv.fr). Les données
   * structurées ne les publient que si elles sont renseignées.
   */
  geo: null as { latitude: number; longitude: number } | null,

  /**
   * Lien vers la fiche Google de l’établissement. Démonstration : Google Maps
   * sans adresse précise, et une carte de Paris.
   */
  google: {
    fiche: 'https://www.google.com/maps',
    itineraire: 'https://www.google.com/maps',
    /** Carte intégrée, chargée seulement après accord du visiteur. */
    carte: 'https://www.google.com/maps?q=Paris&output=embed',
  },

  /**
   * La note Google (démonstration : valeurs d’exemple), relevée à la main.
   * Elle s’affiche toujours avec sa date de relevé. Mettez les trois valeurs à
   * jour ensemble, ou passez `note` à `null` pour la retirer partout.
   *
   * Elle n’est PAS publiée en données structurées : Google n’accepte pas les
   * avis qu’un établissement publie sur lui-même.
   */
  noteGoogle: {
    note: 4.9,
    nombreAvis: 120,
    releveLe: '2026-10-13',
  } as { note: number; nombreAvis: number; releveLe: string } | null,

  /** Horaires du bureau (accueil, inscriptions). Jour : 1 = lundi … 7 = dimanche. */
  horairesBureau: [
    { jours: [1, 2, 3, 4, 5], plages: [['10:00', '12:00'], ['15:00', '20:00']] },
    { jours: [6], plages: [['10:00', '12:00']] },
  ] as Horaires,

  /** Créneaux des leçons de conduite (distincts de l’accueil). */
  horairesConduite: [{ jours: [1, 2, 3, 4, 5, 6], plages: [['07:00', '20:00']] }] as Horaires,

  /**
   * Réseaux sociaux (Instagram, Snapchat, Facebook, TikTok). Une liste vide
   * retire les liens du site : vide dans la démonstration.
   */
  identifiantReseaux: null as string | null,
  reseaux: [] as ReadonlyArray<{ nom: 'Instagram' | 'Snapchat' | 'Facebook' | 'TikTok'; url: string }>,

  /**
   * L’équipe : vide tant que les présentations (prénom, rôle, photo) et
   * l’accord de chacun ne sont pas fournis. La section « L’équipe » de la page
   * À propos n’apparaît qu’avec au moins une personne.
   */
  equipe: [] as ReadonlyArray<{ prenom: string; role: string; photo: ImageMetadata | null }>,

  /**
   * Le logo de l’établissement : `sombre` pour les fonds nuit, `clair` pour
   * les fonds clairs. `null` (démonstration) : le nom, écrit en lettres par le
   * composant `ui/Logo.astro`.
   */
  logoFichier: null as { sombre: ImageMetadata; clair: ImageMetadata } | null,

  /**
   * Labels et certifications de l’établissement (démonstration : les deux
   * labels les plus courants, pour montrer leur présentation). Affichés en texte (pas de logo officiel sans le fichier
   * et la charte d’usage). Qualiopi : vérifier la catégorie d’action certifiée
   * (« actions de formation »), mention que sa charte demande d’écrire.
   */
  labels: [
    {
      nom: 'École conduite qualité',
      detail: 'Le label qualité de l’État pour les écoles de conduite.',
      explication:
        'Créé par l’arrêté du 26 février 2018, il est accordé aux écoles agréées qui respectent des critères de qualité : objectifs de formation adaptés à chaque élève, accueil, suivi et évaluation, moyens pédagogiques, formation des enseignants, information du public et prise en compte de l’avis des élèves.',
      lien: 'https://www.centre-inffo.fr/site-droit-formation/actualites-droit/creation-d-un-label-qualite-pour-les-formations-au-sein-des-auto-ecoles',
    },
    {
      nom: 'Qualiopi',
      detail: 'Processus certifié, au titre des actions de formation.',
      explication:
        'La certification qualité des organismes de formation, exigée pour qu’une formation puisse être financée par le compte personnel de formation (CPF).',
      lien: null,
    },
  ] as ReadonlyArray<{ nom: string; detail: string; explication: string; lien: string | null }>,

  /**
   * La garantie financière : remboursement des prestations payées d’avance et
   * non consommées si l’école ne peut plus exécuter ses contrats (fermeture
   * définitive ou d’au moins 3 mois). `garant` : le nom du garant, s’il est
   * communiqué.
   * `null` la retire du site.
   */
  garantieFinanciere: { garant: null } as { garant: string | null } | null,

  /**
   * Un taux de réussite, UNIQUEMENT s’il est fourni par l’établissement avec
   * sa source (l’État ne publie plus de taux par école). `null` : rien ne
   * s’affiche. Exemple de forme : { categorie: 'B', taux: 70, annee: 2025,
   * source: 'Bilan transmis par la préfecture' }.
   */
  tauxReussite: null as { categorie: string; taux: number; annee: number; source: string } | null,

  /**
   * Le paiement en plusieurs fois. `conditions` : `null` tant que les
   * modalités exactes ne sont pas communiquées (le site renvoie alors vers
   * l’accueil pour les connaître).
   */
  paiementPlusieursFois: {
    libelle: 'Paiement en 3 fois sans frais',
    conditions:
      'Le prix de la formation est réparti en trois règlements, sans frais ni intérêts. Le calendrier des règlements est fixé avec vous à l’inscription.' as
        | string
        | null,
  },

  /**
   * Mentions légales : à compléter avec les informations réelles. Tant qu’une
   * valeur obligatoire vaut `null`, la page l’indique « à compléter » et
   * `pnpm check:publication` refuse la mise en ligne. Démonstration : toutes
   * à `null`, la page montre ce qu’il faudra fournir.
   */
  legal: {
    raisonSociale: null as string | null,
    formeJuridique: null as string | null,
    capital: null as string | null,
    siren: null as string | null,
    siret: null as string | null,
    rcs: null as string | null,
    tva: null as string | null,
    siegeSocial: null as string | null,
    directeurPublication: null as string | null,
    /** Hébergeur du site, si le site est mis en ligne sur Vercel. */
    hebergeur: {
      nom: 'Vercel Inc.',
      adresse: '440 N Barranca Ave #4133, Covina, CA 91723, États-Unis',
      site: 'https://vercel.com',
    },
    /** Conception et réalisation du site. */
    realisation: { nom: 'MAF Studio', site: 'https://www.maf-studio.fr' } as { nom: string; site: string } | null,
    /** Médiateur de la consommation (obligatoire pour un professionnel qui vend à des particuliers). */
    mediateur: null as { nom: string; site: string } | null,
  },
} as const

export type Plage = readonly [string, string]
export type Horaires = ReadonlyArray<{ jours: readonly number[]; plages: readonly Plage[] }>
