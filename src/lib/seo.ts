import { DEMONSTRATION } from '../data/demonstration.ts'
import { ETABLISSEMENT } from '../data/etablissement.ts'

/**
 * Le site est-il indexable ? Seulement sous son vrai nom de domaine.
 *
 * Tant que le site tourne sur une adresse de démonstration (`*.vercel.app`,
 * serveur local), toutes les pages portent `noindex` et robots.txt ferme
 * l’accès : une maquette présentée au client ne doit jamais entrer dans
 * Google. Le jour où le domaine est branché (variable `SITE_URL`, ou domaine
 * de production rattaché au projet Vercel), l’indexation s’ouvre seule.
 * Un site de démonstration n’est jamais indexé, quel que soit son domaine.
 */
export function siteIndexable(site: URL | undefined): boolean {
  if (DEMONSTRATION || !site) return false
  return !/(^|\.)vercel\.app$|^localhost$|^127\.0\.0\.1$/.test(site.hostname)
}

/** « Permis B » → « Permis B | Votre Auto-École ». */
export function titreComplet(titre: string | null): string {
  if (!titre) return `${ETABLISSEMENT.nom} | Auto-école à ${ETABLISSEMENT.adresse.ville}`
  const complet = `${titre} | ${ETABLISSEMENT.nom}`
  return complet.length <= 70 ? complet : titre
}
