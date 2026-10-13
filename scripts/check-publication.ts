/**
 * Avant la mise en ligne : ce qui manque ou reste à confirmer.
 *   node --experimental-strip-types scripts/check-publication.ts
 *
 * BLOQUANT : une information légale obligatoire manque (la page des mentions
 * légales l’affiche « À compléter »). Le script sort en erreur.
 * À CONFIRMER : le site fonctionne, mais une donnée attend l’accord du client.
 */
import { readFileSync } from 'node:fs'

const lire = (chemin: string) => readFileSync(new URL(`../${chemin}`, import.meta.url), 'utf-8')
const etablissement = lire('src/data/etablissement.ts')
const formations = lire('src/data/formations.ts')

const bloquants: string[] = []
const aConfirmer: string[] = []

if (/DEMONSTRATION = true/.test(lire('src/data/demonstration.ts')))
  bloquants.push('Mode démonstration actif (src/data/demonstration.ts) : valeurs d’exemple, formulaire sans envoi')
if (/source: 'Exemple'/.test(lire('src/data/avis.ts'))) bloquants.push('Avis d’exemple dans src/data/avis.ts')

const champsLegaux: Array<[string, string]> = [
  ['raisonSociale', 'raison sociale'],
  ['formeJuridique', 'forme juridique'],
  ['siret', 'numéro SIRET'],
  ['rcs', 'immatriculation (RCS ou RM)'],
  ['directeurPublication', 'directeur de la publication'],
  ['mediateur', 'médiateur de la consommation'],
]
for (const [cle, libelle] of champsLegaux) {
  if (new RegExp(`\\b${cle}: null\\b`).test(etablissement)) bloquants.push(`Mentions légales : ${libelle}`)
}

const sansPrix = (formations.match(/prixTTC: null/g) ?? []).length
if (sansPrix > 0) aConfirmer.push(`${sansPrix} formule(s) sans prix connu, affichée(s) « Tarif sur demande »`)
const prixNonVerifies = (formations.match(/prixTTC: \d+, verifie: false/g) ?? []).length
if (prixNonVerifies > 0) aConfirmer.push(`${prixNonVerifies} prix saisi(s) mais non validé(s) (verifie: false)`)

const brouillons = [...formations.matchAll(/slug: '([^']+)',\s*categorie: '[^']+',\s*statut: 'brouillon'/g)].map((m) => m[1])
if (brouillons.length > 0) aConfirmer.push(`Formation(s) en brouillon, invisibles : ${brouillons.join(', ')}`)

if (/logoFichier: null/.test(etablissement)) aConfirmer.push('Logo : fichier à obtenir ; le nom est écrit en lettres')
if (/geo: null/.test(etablissement)) aConfirmer.push('Coordonnées GPS non relevées (données structurées sans géolocalisation)')
if (/garantieFinanciere: \{ garant: null \}/.test(etablissement)) aConfirmer.push('Garantie financière : nom du garant (facultatif)')
const qualite = lire('src/data/qualite.ts')
const docsManquants = (qualite.match(/fichier: null \}/g) ?? []).length
if (docsManquants > 0) aConfirmer.push(`${docsManquants} document(s) qualité du label sans fichier (page Démarche qualité)`)
if (/conditions: null/.test(etablissement)) aConfirmer.push('Modalités exactes du paiement en 3 fois')

const releve = etablissement.match(/releveLe: '(\d{4}-\d{2}-\d{2})'/)?.[1]
if (releve) {
  const mois = (Date.now() - new Date(releve).getTime()) / (30 * 24 * 3600 * 1000)
  if (mois > 6) aConfirmer.push(`Note Google relevée le ${releve} : à mettre à jour`)
}

if (!process.env.SITE_URL) aConfirmer.push('SITE_URL absente : le site reste en « noindex » tant que le domaine n’est pas branché')

console.log('\nSite de l’auto-école : contrôle avant mise en ligne\n')
for (const b of bloquants) console.log(`  BLOQUANT     ${b}`)
for (const a of aConfirmer) console.log(`  À CONFIRMER  ${a}`)
console.log(
  bloquants.length
    ? `\n${bloquants.length} information(s) obligatoire(s) manquante(s) : mise en ligne refusée.\n`
    : '\nAucune information obligatoire ne manque.\n',
)
process.exit(bloquants.length ? 1 : 0)
