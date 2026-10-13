import { FORMATIONS_PUBLIEES } from '../../data/formations.ts'
import { FINANCEMENTS } from '../../data/financements.ts'
import { EMAIL, MESSAGES, MESSAGE_MAX, TELEPHONE } from './regles.ts'

/**
 * Les règles du formulaire de demande, partagées par le navigateur (messages
 * immédiats) et par le serveur (qui ne fait jamais confiance au navigateur).
 * Un seul formulaire pour tout le site : contact, devis, financement.
 */

export const AUTRE_FORMATION = 'autre'
export const FINANCEMENT_INCONNU = 'je-ne-sais-pas'

export const OPTIONS_FORMATION = [
  ...FORMATIONS_PUBLIEES.map((f) => ({ valeur: f.slug, libelle: f.nom, groupe: f.categorie })),
  { valeur: AUTRE_FORMATION, libelle: 'Autre, ou je ne sais pas encore', groupe: 'autre' as const },
]

export const OPTIONS_FINANCEMENT = [
  ...FINANCEMENTS.map((f) => ({ valeur: f.id, libelle: f.titre })),
  { valeur: FINANCEMENT_INCONNU, libelle: 'Je ne sais pas encore' },
]

export const LIMITES = { nom: 100, telephone: 25, email: 160, message: MESSAGE_MAX } as const

export interface Demande {
  nom: string
  telephone: string
  email: string
  formation: string
  financement: string | null
  message: string | null
  depuis: string | null
}

export type Champ = 'nom' | 'telephone' | 'email' | 'formation' | 'financement' | 'message' | 'consentement'
export type Erreurs = Partial<Record<Champ, string>>


const nettoyer = (v: unknown, max: number) =>
  typeof v === 'string' ? v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim().slice(0, max) : ''

export function libelleFormation(valeur: string): string {
  return OPTIONS_FORMATION.find((o) => o.valeur === valeur)?.libelle ?? 'Non précisée'
}

export function libelleFinancement(valeur: string | null): string | null {
  if (!valeur) return null
  return OPTIONS_FINANCEMENT.find((o) => o.valeur === valeur)?.libelle ?? null
}

/** Valide les champs reçus ; renvoie la demande propre ou les erreurs, champ par champ. */
export function valider(
  brut: Record<string, unknown>,
): { ok: true; demande: Demande } | { ok: false; erreurs: Erreurs } {
  const erreurs: Erreurs = {}
  const nom = nettoyer(brut.nom, LIMITES.nom)
  const telephone = nettoyer(brut.telephone, LIMITES.telephone)
  const email = nettoyer(brut.email, LIMITES.email).toLowerCase()
  const formation = nettoyer(brut.formation, 60)
  const financement = nettoyer(brut.financement, 60)
  const message = nettoyer(brut.message, LIMITES.message + 1)
  const depuis = nettoyer(brut.depuis, 200)

  if (nom.length < 2) erreurs.nom = MESSAGES.nom
  if (!telephone) erreurs.telephone = MESSAGES.telephoneVide
  else if (!TELEPHONE.test(telephone)) erreurs.telephone = MESSAGES.telephone
  if (!email) erreurs.email = MESSAGES.emailVide
  else if (!EMAIL.test(email)) erreurs.email = MESSAGES.email
  if (!OPTIONS_FORMATION.some((o) => o.valeur === formation)) erreurs.formation = MESSAGES.formation
  if (financement && !OPTIONS_FINANCEMENT.some((o) => o.valeur === financement)) erreurs.financement = MESSAGES.financement
  if (message.length > LIMITES.message) erreurs.message = MESSAGES.message
  if (brut.consentement !== 'oui') erreurs.consentement = MESSAGES.consentement

  if (Object.keys(erreurs).length > 0) return { ok: false, erreurs }
  return {
    ok: true,
    demande: {
      nom,
      telephone,
      email,
      formation,
      financement: financement || null,
      message: message || null,
      depuis: depuis.startsWith('/') ? depuis : null,
    },
  }
}
