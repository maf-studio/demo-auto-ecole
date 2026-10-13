/**
 * Les liens internes du site construit : chaque `href="/…"` doit mener à une
 * page générée (ou à un fichier). À lancer après `pnpm build`.
 *   node --experimental-strip-types scripts/check-liens.ts
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

const racine = new URL('../dist/client/', import.meta.url).pathname
const serveur = ['/api/demande', '/api/jeton']

function pages(dossier: string): string[] {
  return readdirSync(dossier).flatMap((nom) => {
    const chemin = join(dossier, nom)
    return statSync(chemin).isDirectory() ? pages(chemin) : chemin.endsWith('.html') ? [chemin] : []
  })
}

const existe = (lien: string) => {
  const chemin = decodeURIComponent(lien.split(/[?#]/)[0]!)
  if (chemin === '/' || serveur.includes(chemin)) return true
  return [join(racine, chemin), join(racine, chemin, 'index.html'), join(racine, `${chemin}.html`)].some((c) => existsSync(c))
}

let casses = 0
for (const fichier of pages(racine)) {
  const html = readFileSync(fichier, 'utf-8')
  for (const [, lien] of html.matchAll(/(?:href|action)="(\/[^"]*)"/g)) {
    if (lien!.startsWith('//') || existe(lien!)) continue
    casses++
    console.log(`Lien cassé dans ${fichier.replace(racine, '/')} : ${lien}`)
  }
}
console.log(casses ? `${casses} lien(s) cassé(s).` : 'Tous les liens internes mènent à une page.')
process.exit(casses ? 1 : 0)
