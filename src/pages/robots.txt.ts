import type { APIRoute } from 'astro'

import { siteIndexable } from '../lib/seo.ts'

/**
 * Sur le vrai domaine : tout est ouvert, et le sitemap est annoncé. Sur une
 * adresse de démonstration (*.vercel.app, local) : tout est fermé.
 */
export const GET: APIRoute = ({ site }) => {
  const corps =
    site && siteIndexable(site)
      ? `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${new URL('/sitemap-index.xml', site).href}\n`
      : 'User-agent: *\nDisallow: /\n'
  return new Response(corps, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
