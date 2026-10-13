// Contrôle de toutes les pages : statut, erreurs console, débordement horizontal, accessibilité (axe).
// node scripts/controle.mjs  (serveur lancé sur BASE, par défaut http://localhost:4321)
import { chromium } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const base = process.env.BASE ?? 'http://localhost:4321'
const routes = [
  '/', '/permis-auto', '/permis-moto', '/code-de-la-route', '/permis-b', '/permis-automatique',
  '/conduite-accompagnee', '/conduite-supervisee', '/passerelle-boite-manuelle', '/permis-a1', '/permis-a2',
  '/passerelle-a2-a', '/formation-125', '/permis-am', '/financement', '/tarifs', '/documents-inscription',
  '/a-propos', '/avis-clients', '/demarche-qualite', '/contact', '/demande-envoyee', '/demande-erreur', '/mentions-legales',
  '/confidentialite', '/cookies', '/plan-du-site', '/page-inexistante',
]
const navigateur = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {})
let problemes = 0
for (const largeur of [360, 1440]) {
  const contexte = await navigateur.newContext({ viewport: { width: largeur, height: 900 } })
  for (const route of routes) {
    const page = await contexte.newPage()
    const erreurs = []
    page.on('console', (m) => m.type() === 'error' && !m.text().includes('404') && erreurs.push(m.text()))
    page.on('pageerror', (e) => erreurs.push(String(e)))
    const reponse = await page.goto(base + route, { waitUntil: 'networkidle' })
    const statut = reponse?.status()
    const debordement = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
    const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze()
    const violations = axe.violations.map((v) => `${v.id} (${v.nodes.length}) ${v.nodes[0]?.target.join(' ')}`)
    const attendu = route === '/page-inexistante' ? 404 : 200
    const ok = statut === attendu && debordement <= 0 && erreurs.length === 0 && violations.length === 0
    if (!ok) problemes++
    console.log(`${ok ? 'ok ' : 'KO '} ${largeur} ${route} ${statut}${debordement > 0 ? ` débordement ${debordement}px` : ''}${erreurs.length ? ' console: ' + erreurs.join(' | ') : ''}${violations.length ? ' axe: ' + violations.join(' ; ') : ''}`)
    await page.close()
  }
  await contexte.close()
}
await navigateur.close()
console.log(problemes ? `${problemes} page(s) à corriger` : 'Tout est bon.')
process.exit(problemes ? 1 : 0)
