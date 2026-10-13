import type { APIRoute } from 'astro'

import { estIndesirable } from '../../lib/demande/anti-spam.ts'
import { configurationEnvoi } from '../../lib/demande/configuration.ts'
import { envoyerDemande } from '../../lib/demande/envoi.ts'
import { valider } from '../../lib/demande/schema.ts'

/**
 * La réception d’une demande (tous les formulaires du site).
 *
 * Avec JavaScript, le formulaire envoie `Accept: application/json` et lit la
 * réponse. Sans JavaScript, le navigateur suit une redirection vers la page
 * de confirmation ou d’erreur. La confirmation n’est donnée qu’APRÈS l’envoi
 * effectif de l’e-mail : un échec du fournisseur est annoncé comme tel.
 */
export const prerender = false

const TAILLE_MAX = 32_000

export const POST: APIRoute = async ({ request, redirect }) => {
  const enJson = request.headers.get('accept')?.includes('application/json') ?? false
  const repondre = (statut: number, corps: Record<string, unknown>, page: string) =>
    enJson
      ? new Response(JSON.stringify(corps), {
          status: statut,
          headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
        })
      : redirect(page, 303)

  const configuration = configurationEnvoi()
  if (!configuration) return repondre(503, { ok: false, erreur: 'service' }, '/demande-erreur?raison=service')

  if (Number(request.headers.get('content-length') ?? 0) > TAILLE_MAX)
    return repondre(413, { ok: false, erreur: 'taille' }, '/demande-erreur?raison=taille')

  let donnees: FormData
  try {
    donnees = await request.formData()
  } catch {
    return repondre(400, { ok: false, erreur: 'format' }, '/demande-erreur?raison=format')
  }
  const brut = Object.fromEntries([...donnees.entries()].map(([k, v]) => [k, typeof v === 'string' ? v : '']))

  // Un robot repéré reçoit la même réponse qu’un humain, et rien n’est transmis.
  if (estIndesirable(configuration.secret, String(brut.piege ?? ''), String(brut.jeton ?? ''), Date.now()))
    return repondre(200, { ok: true }, '/demande-envoyee')

  const resultat = valider(brut)
  if (!resultat.ok) return repondre(422, { ok: false, erreur: 'champs', champs: resultat.erreurs }, '/demande-erreur?raison=champs')

  try {
    await envoyerDemande(configuration, resultat.demande)
  } catch (erreur) {
    console.error('Envoi de la demande impossible :', erreur instanceof Error ? erreur.message : erreur)
    return repondre(502, { ok: false, erreur: 'envoi' }, '/demande-erreur?raison=envoi')
  }
  return repondre(200, { ok: true }, '/demande-envoyee')
}
