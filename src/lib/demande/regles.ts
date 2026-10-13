/**
 * Les règles de saisie, sans aucune dépendance : importées à la fois par le
 * serveur (`schema.ts`) et par le script du navigateur, qui reste léger.
 */
export const TELEPHONE = /^(?:(?:\+|00)33[\s.-]?|0)[1-9](?:[\s.-]?\d{2}){4}$/
export const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
export const MESSAGE_MAX = 2000

export const MESSAGES = {
  nom: 'Indiquez votre nom et votre prénom.',
  telephoneVide: 'Indiquez un numéro de téléphone pour que nous puissions vous rappeler.',
  telephone: 'Ce numéro ne semble pas valide. Exemple : 06 12 34 56 78.',
  emailVide: 'Indiquez votre adresse e-mail.',
  email: 'Cette adresse e-mail ne semble pas valide. Exemple : nom@exemple.fr.',
  formation: 'Choisissez la formation qui vous intéresse.',
  financement: 'Choisissez une solution dans la liste, ou laissez vide.',
  message: `Votre message dépasse ${MESSAGE_MAX} caractères.`,
  consentement: 'Cochez cette case pour que nous puissions traiter votre demande.',
} as const
