// Captures d’écran de contrôle : node scripts/captures.mjs <chemin> [dossier] [largeurs]
import { chromium } from '@playwright/test'

const chemin = process.argv[2] ?? '/'
const dossier = process.argv[3] ?? 'captures'
const largeurs = (process.argv[4] ?? '360,1440').split(',').map(Number)
const base = process.env.BASE ?? 'http://localhost:4321'

const navigateur = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {})
for (const largeur of largeurs) {
  const page = await navigateur.newPage({ viewport: { width: largeur, height: 900 }, deviceScaleFactor: 1 })
  const erreurs = []
  page.on('console', (m) => m.type() === 'error' && erreurs.push(m.text()))
  page.on('pageerror', (e) => erreurs.push(String(e)))
  await page.goto(base + chemin, { waitUntil: 'networkidle' })
  // Fait défiler pour déclencher les révélations, puis revient en haut.
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) {
      window.scrollTo({ top: y, behavior: 'instant' })
      await new Promise((r) => setTimeout(r, 60))
    }
    window.scrollTo({ top: 0, behavior: 'instant' })
    await new Promise((r) => setTimeout(r, 900))
  })
  const nom = `${dossier}/${chemin.replace(/\//g, '_') || 'accueil'}-${largeur}.png`
  await page.screenshot({ path: nom, fullPage: true })
  const debordement = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  console.log(nom, debordement > 0 ? `DÉBORDEMENT ${debordement}px` : 'ok', erreurs.length ? erreurs : '')
  await page.close()
}
await navigateur.close()
