/**
 * En-têtes de sécurité HTTP et directives de la politique de contenu (CSP).
 * Lus par `astro.config.mjs`, qui les écrit dans la sortie Vercel.
 *
 *   Strict-Transport-Security   pas de retour en HTTP non chiffré
 *   X-Content-Type-Options      pas d’interprétation d’un fichier sous un autre type
 *   X-Frame-Options             pas d’intégration du site dans un cadre tiers
 *   Referrer-Policy             pas de fuite du chemin complet vers un site tiers
 *                               (jamais `no-referrer` : le POST du formulaire
 *                               partirait avec `Origin: null` et serait refusé)
 *   Permissions-Policy          ni caméra, ni micro, ni position…
 */
export const ENTETES_SECURITE: Record<string, string> = {
  'Strict-Transport-Security': 'max-age=63072000',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()',
  'Cross-Origin-Opener-Policy': 'same-origin',
}

/** Les routes serveur ne servent que du JSON ou des redirections. */
export const ENTETES_ROUTES_SERVEUR: Record<string, string> = {
  'Cache-Control': 'no-store',
  'X-Robots-Tag': 'noindex',
}

/**
 * Directives ajoutées à `script-src` et `style-src`, qu’Astro calcule page par
 * page. Seul domaine tiers : Google Maps, chargé dans un cadre UNIQUEMENT après
 * l’accord du visiteur (`components/ui/CarteGoogle.astro`).
 */
export const DIRECTIVES_CSP = [
  "default-src 'self'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  'frame-src https://www.google.com https://maps.google.com',
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  'upgrade-insecure-requests',
] as const
