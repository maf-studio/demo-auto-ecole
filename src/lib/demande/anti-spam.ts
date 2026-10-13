import { createHmac, timingSafeEqual } from 'node:crypto'

/**
 * L’anti-spam, sans CAPTCHA (pénible pour tous, hostile pour certains) :
 *   1. un champ piège, invisible et hors du parcours clavier ;
 *   2. un délai minimal entre l’affichage du formulaire et l’envoi, mesuré par
 *      un jeton horodaté et SIGNÉ (un horodatage en clair se falsifie) ;
 *   3. un plafond d’envois par adresse IP, à régler dans le pare-feu Vercel.
 *
 * Le jeton écrit dans la page est émis au build : il est toujours « expiré »
 * et reste accepté (sinon tout envoi sans JavaScript serait perdu). Avec
 * JavaScript, la page demande un jeton frais à /api/jeton, et le délai
 * minimal s’applique pleinement.
 */
const DELAI_MINIMAL_MS = 3_000
const VALIDITE_MS = 2 * 60 * 60 * 1000

export type Origine = 'page' | 'api'
export type Verdict = 'valide' | 'trop-rapide' | 'expire' | 'falsifie'

const signer = (origine: Origine, horodatage: string, secret: string) =>
  createHmac('sha256', secret).update(`${origine}.${horodatage}`).digest('hex')

export function emettreJeton(secret: string, maintenant: number, origine: Origine): string {
  const horodatage = String(maintenant)
  return `${origine}.${horodatage}.${signer(origine, horodatage, secret)}`
}

export function verifierJeton(secret: string, jeton: string, maintenant: number): Verdict {
  const [origine, horodatage, signature, ...reste] = jeton.split('.')
  if ((origine !== 'page' && origine !== 'api') || !horodatage || !signature || reste.length > 0) return 'falsifie'
  const a = Buffer.from(signature, 'utf8')
  const b = Buffer.from(signer(origine, horodatage, secret), 'utf8')
  if (a.length !== b.length || !timingSafeEqual(a, b)) return 'falsifie'
  const ecoule = maintenant - Number(horodatage)
  if (!Number.isFinite(ecoule)) return 'falsifie'
  if (ecoule < DELAI_MINIMAL_MS) return 'trop-rapide'
  if (ecoule > VALIDITE_MS) return 'expire'
  return 'valide'
}

/** Une demande à écarter sans le dire (le dire apprendrait au robot à contourner). */
export function estIndesirable(secret: string, piege: string, jeton: string, maintenant: number): boolean {
  if (piege.trim() !== '') return true
  const verdict = verifierJeton(secret, jeton, maintenant)
  return verdict === 'falsifie' || verdict === 'trop-rapide'
}
