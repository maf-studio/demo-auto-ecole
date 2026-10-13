import type { APIRoute } from 'astro'

import { emettreJeton } from '../../lib/demande/anti-spam.ts'
import { configurationEnvoi } from '../../lib/demande/configuration.ts'

/** Un jeton anti-spam frais, demandé par le formulaire à l’ouverture de la page. */
export const prerender = false

export const GET: APIRoute = () => {
  const c = configurationEnvoi()
  if (!c) return new Response(null, { status: 404, headers: { 'Cache-Control': 'no-store' } })
  return new Response(JSON.stringify({ jeton: emettreJeton(c.secret, Date.now(), 'api') }), {
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  })
}
