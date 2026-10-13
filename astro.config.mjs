// @ts-check
import { existsSync, readFileSync, writeFileSync } from 'node:fs'

import { defineConfig, envField, fontProviders } from 'astro/config'
import sitemap from '@astrojs/sitemap'
import vercel from '@astrojs/vercel'

import { DIRECTIVES_CSP, ENTETES_ROUTES_SERVEUR, ENTETES_SECURITE } from './src/data/securite.ts'
import { CHEMINS_HORS_SITEMAP } from './src/data/navigation.ts'

/**
 * L’adresse publique du site.
 *
 * Le nom de domaine définitif n’est pas encore connu : il se règle par la
 * variable `SITE_URL` (ex. `https://www.mon-domaine.fr`). Sans elle, Vercel
 * fournit l’adresse de production du projet, et en local on retombe sur le
 * serveur de développement. Tant que `SITE_URL` est absente, le site se
 * déclare « en préparation » : `noindex` sur toutes les pages et robots.txt
 * fermé (`src/lib/seo.ts`), pour qu’une maquette ne soit jamais indexée.
 */
const BARLOW = './node_modules/@fontsource/barlow-condensed/files/'

const SITE =
  process.env.SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:4321')

/**
 * Les en-têtes de sécurité, écrits dans la configuration produite pour Vercel.
 *
 * L’adaptateur écrit `.vercel/output/config.json` ; ce greffon passe après lui
 * et place en tête des routes qui n’arrêtent pas le routage (`continue`) : les
 * en-têtes de `src/data/securite.ts` sur toutes les réponses, et ceux des
 * routes serveur. Ils sont ainsi dans la sortie du build, sans dépendre de la
 * fusion de `vercel.json`.
 *
 * La CSP est coupée sur le serveur de développement : Vite y injecte des
 * `<style>` sans empreinte, qui seraient bloqués.
 *
 * @returns {import('astro').AstroIntegration}
 */
function entetesSecurite() {
  /** @type {URL | undefined} */
  let racine
  return {
    name: 'site:entetes-securite',
    hooks: {
      'astro:config:setup': ({ command, updateConfig }) => {
        if (command === 'dev') updateConfig({ security: { csp: false } })
      },
      'astro:config:done': ({ config }) => {
        racine = config.root
      },
      'astro:build:done': ({ logger }) => {
        if (!racine) return
        const fichier = new URL('./.vercel/output/config.json', racine)
        if (!existsSync(fichier)) {
          logger.warn('config.json de Vercel absent : en-têtes de sécurité non écrits.')
          return
        }
        const configuration = JSON.parse(readFileSync(fichier, 'utf-8'))
        /** @type {Array<Record<string, any>>} */
        const routes = configuration.routes ?? []

        // La page 404 servie par le repli de l’adaptateur reçoit la CSP de /404.
        const csp404 = routes.find((r) => r.src === '/404' && r.headers)?.headers
        const repli = routes.find((r) => r.dest === '/404.html' && r.status === 404)
        if (csp404 && repli) repli.headers = { ...repli.headers, ...csp404 }

        configuration.routes = [
          { src: '/(.*)', headers: ENTETES_SECURITE, continue: true },
          { src: '/api/(.*)', headers: ENTETES_ROUTES_SERVEUR, continue: true },
          {
            src: '/_astro/(.*)',
            headers: { 'Cache-Control': 'public, max-age=31536000, immutable' },
            continue: true,
          },
          ...routes,
        ]
        writeFileSync(fichier, JSON.stringify(configuration, null, 2))
        logger.info('En-têtes de sécurité écrits dans .vercel/output/config.json.')
      },
    },
  }
}

export default defineConfig({
  site: SITE,
  trailingSlash: 'never',
  output: 'static',

  adapter: vercel({
    webAnalytics: { enabled: false },
    // La CSP part en en-tête HTTP : `frame-ancestors` n’a d’effet qu’ainsi.
    staticHeaders: true,
  }),

  /**
   * Les variables du service d’envoi des demandes (README, « Formulaires »).
   * Toutes facultatives : sans elles, le site se construit, et les formulaires
   * laissent place aux moyens de contact directs. Jamais d’envoi simulé.
   */
  env: {
    schema: {
      EMAIL_PROVIDER: envField.enum({
        context: 'server',
        access: 'secret',
        values: ['resend', 'brevo', 'essai'],
        optional: true,
      }),
      RESEND_API_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      BREVO_API_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      CONTACT_TO: envField.string({ context: 'server', access: 'secret', optional: true }),
      CONTACT_FROM: envField.string({ context: 'server', access: 'secret', optional: true }),
      FORM_SECRET: envField.string({ context: 'server', access: 'secret', optional: true }),
    },
  },

  security: {
    checkOrigin: true,
    csp: {
      directives: [...DIRECTIVES_CSP],
      styleDirective: {
        resources: ["'self'", { resource: "'unsafe-inline'", kind: 'attribute' }],
      },
    },
  },

  integrations: [
    entetesSecurite(),
    sitemap({
      filter: (page) => !CHEMINS_HORS_SITEMAP.includes(new URL(page).pathname.replace(/\/$/, '') || '/'),
    }),
  ],

  /**
   * Polices auto-hébergées, depuis les paquets Fontsource (npm) : aucune
   * requête vers Google au chargement d’une page, donc aucune adresse IP de
   * visiteur transmise, et un build qui ne dépend d’aucun service tiers.
   * Barlow Condensed pour les titres (comme le dépliant), Manrope pour le
   * texte, Kaushan Script pour la signature manuscrite. Sous-ensemble latin.
   */
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Barlow Condensed',
      cssVariable: '--font-titre',
      fallbacks: ['Arial Narrow', 'Arial', 'sans-serif'],
      optimizedFallbacks: true,
      options: {
        variants: [
          { src: [BARLOW + 'barlow-condensed-latin-600-normal.woff2'], weight: '600', style: 'normal' },
          { src: [BARLOW + 'barlow-condensed-latin-700-normal.woff2'], weight: '700', style: 'normal' },
          { src: [BARLOW + 'barlow-condensed-latin-800-normal.woff2'], weight: '800', style: 'normal' },
        ],
      },
    },
    {
      // L’italique sportif d’un mot par titre : une graisse, un style.
      provider: fontProviders.local(),
      name: 'Barlow Condensed Italique',
      cssVariable: '--font-titre-italique',
      fallbacks: ['Arial Narrow', 'Arial', 'sans-serif'],
      optimizedFallbacks: true,
      options: {
        variants: [{ src: [BARLOW + 'barlow-condensed-latin-800-italic.woff2'], weight: '800', style: 'italic' }],
      },
    },
    {
      // La signature du dépliant (« depuis 2010 », « Suivez-nous ! ») : quelques mots, jamais de texte courant.
      provider: fontProviders.local(),
      name: 'Kaushan Script',
      cssVariable: '--font-signature',
      fallbacks: ['cursive'],
      options: {
        variants: [
          {
            src: ['./node_modules/@fontsource/kaushan-script/files/kaushan-script-latin-400-normal.woff2'],
            weight: '400',
            style: 'normal',
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: 'Manrope',
      cssVariable: '--font-texte',
      fallbacks: ['Helvetica Neue', 'Arial', 'sans-serif'],
      optimizedFallbacks: true,
      options: {
        variants: [
          {
            src: ['./node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2'],
            weight: '200 800',
            style: 'normal',
          },
        ],
      },
    },
  ],

  prefetch: false,
  devToolbar: { enabled: false },
  // Aucune coloration de code : Shiki écrirait des attributs style= que la CSP refuse.
  markdown: { syntaxHighlight: false },
  build: { inlineStylesheets: 'auto' },
  image: { responsiveStyles: false },
})
