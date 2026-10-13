import { ETABLISSEMENT } from './etablissement.ts'

/**
 * Les questions générales (accueil) et celles du financement.
 * Les questions propres à chaque formation sont dans `formations.ts`.
 * Réponses vérifiées le 11 octobre 2026 (sources : `sources.ts`).
 */
export interface Question {
  question: string
  reponse: string
  /** Lien facultatif pour aller plus loin. */
  lien?: { libelle: string; href: string }
}

export const FAQ_ACCUEIL: readonly Question[] = [
  {
    question: 'À partir de quel âge peut-on passer le permis B ?',
    reponse:
      'Depuis le 1er janvier 2024, le permis B peut être obtenu dès 17 ans. L’inscription est possible dès 16 ans, et dès 15 ans en conduite accompagnée.',
    lien: { libelle: 'Le permis B', href: '/permis-b' },
  },
  {
    question: 'Quelle différence entre le permis manuel et le permis automatique ?',
    reponse:
      'Le permis automatique demande au moins 13 heures de conduite au lieu de 20, mais il limite la conduite aux boîtes automatiques. Une formation de 7 heures permet ensuite de conduire une boîte manuelle, sans nouvel examen.',
    lien: { libelle: 'Le permis boîte automatique', href: '/permis-automatique' },
  },
  {
    question: 'Comment s’inscrire dans votre auto-école ?',
    reponse:
      'Passez nous voir aux horaires du bureau, appelez-nous, ou envoyez une demande depuis le site. Nous faisons le point sur votre projet, préparons votre dossier, et commençons par l’évaluation de départ.',
    lien: { libelle: 'Nous contacter', href: '/contact' },
  },
  {
    question: 'Quels documents faut-il fournir ?',
    reponse:
      'Une pièce d’identité, une e-photo, un justificatif de domicile, et selon votre situation l’ASSR 2 (ou ASR) et le justificatif de JDC. La liste complète est sur la page dédiée, avec une liste à cocher.',
    lien: { libelle: 'Les documents d’inscription', href: '/documents-inscription' },
  },
  {
    question: 'Proposez-vous le paiement en plusieurs fois ?',
    reponse:
      'Oui, le paiement en 3 fois sans frais. Nous vous en précisons les modalités à l’inscription. Le permis à 1 € par jour est aussi possible pour les 15 à 25 ans.',
    lien: { libelle: 'Les solutions de financement', href: '/financement' },
  },
  {
    question: 'Peut-on utiliser son CPF pour le permis ?',
    reponse:
      'Depuis février 2026, le CPF finance le permis voiture ou moto légère pour les demandeurs d’emploi, ou pour les salariés avec un cofinancement. Appelez-nous : nous vérifions votre cas.',
    lien: { libelle: 'Le CPF en détail', href: '/financement#cpf' },
  },
  {
    question: 'Quels sont les horaires de conduite ?',
    reponse:
      'Les leçons ont lieu du lundi au samedi, de 7 h à 20 h. L’accueil, lui, est ouvert du lundi au vendredi de 10 h à 12 h et de 15 h à 20 h, et le samedi de 10 h à 12 h.',
  },
  {
    question: 'Comment connaître le prix de ma formation ?',
    reponse:
      'Le prix dépend de la formation et du nombre d’heures dont vous aurez besoin, estimé lors de l’évaluation de départ. Demandez un devis : il détaille chaque prestation et son prix TTC.',
    lien: { libelle: 'Demander un devis', href: '/contact' },
  },
  {
    question: 'Combien de temps faut-il pour obtenir son permis ?',
    reponse:
      'Cela dépend de votre disponibilité et de votre progression : le code d’abord, puis au moins 20 heures de conduite (13 en boîte automatique), et l’examen pratique selon les places attribuées. L’évaluation de départ donne une première estimation.',
  },
  {
    question: 'Quels permis préparez-vous ?',
    reponse:
      'Le code de la route ; le permis B en boîte manuelle ou automatique, la conduite accompagnée et la passerelle vers la boîte manuelle ; côté moto, les permis A1 et A2, la passerelle A2 vers A, la formation 125 cm³ et le permis AM.',
    lien: { libelle: 'Les permis moto', href: '/permis-moto' },
  },
]

export const FAQ_FINANCEMENT: readonly Question[] = [
  {
    question: 'Peut-on cumuler plusieurs solutions ?',
    reponse:
      'Souvent, oui : le permis à 1 € par jour se cumule par exemple avec le CPF. Chaque dispositif a ses règles ; nous regardons votre situation avec vous.',
  },
  {
    question: 'L’aide au permis de France Travail existe-t-elle encore ?',
    reponse:
      'Non. L’aide au permis B que versait France Travail a été supprimée le 1er avril 2026. Les demandeurs d’emploi peuvent en revanche utiliser leur CPF.',
  },
  {
    question: 'Le CPF peut-il financer toute ma formation ?',
    reponse:
      'Pas toujours : la part prise sur le CPF est plafonnée pour les permis B, A1 et A2, et elle dépend des droits acquis. Le reste peut être réglé autrement, en plusieurs fois par exemple.',
  },
  {
    question: 'Qui contacter pour le permis à 1 € par jour ?',
    reponse:
      'Commencez par nous : nous établissons le contrat de formation. Vous le présentez ensuite à une banque partenaire du dispositif, qui décide d’accorder le prêt.',
  },
  {
    question: 'Existe-t-il des aides de la Région ou du Département ?',
    reponse:
      'Selon l’endroit où vous habitez, la Région ou le Département peuvent proposer une aide au permis, souvent réservée aux jeunes en formation ou en recherche d’emploi. Leurs conditions changent souvent : le simulateur « Mes aides » de France Travail les recense selon votre profil, et nous préparons les pièces que l’organisme demande à l’auto-école.',
    lien: { libelle: 'Le simulateur Mes aides', href: 'https://mes-aides.francetravail.fr/' },
  },
  {
    question: 'Comment savoir à quelles aides j’ai droit ?',
    reponse:
      'Le simulateur « Mes aides » de France Travail recense les aides selon votre âge, votre situation et votre commune. Apportez-nous le résultat : nous vous aidons à constituer le dossier.',
    lien: { libelle: 'Ouvrir le simulateur « Mes aides »', href: 'https://mes-aides.francetravail.fr/' },
  },
]

/** Phrase réutilisée : où et quand nous trouver. */
export const PHRASE_ACCUEIL = `${ETABLISSEMENT.adresse.rue}, ${ETABLISSEMENT.adresse.codePostal} ${ETABLISSEMENT.adresse.ville}`
