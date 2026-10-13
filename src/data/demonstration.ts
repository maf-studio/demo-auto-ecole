/**
 * Site de démonstration : un site d’auto-école sans client réel, pour le
 * présenter aux auto-écoles.
 *
 * À `true` :
 *   - un bandeau en haut de chaque page dit que nom, coordonnées, avis et prix
 *     sont des exemples ;
 *   - le site n’est jamais indexé (noindex partout, robots.txt fermé), quel
 *     que soit son domaine ;
 *   - le formulaire s’affiche et se remplit normalement, mais rien n’est
 *     envoyé : la confirmation le dit.
 *
 * Pour un vrai client : passer à `false`, remplir `etablissement.ts`, et
 * configurer l’envoi des demandes (README, « Formulaires »).
 */
export const DEMONSTRATION = true

export const AUTEUR_DEMONSTRATION = { nom: 'MAF Studio', site: 'https://www.maf-studio.fr' } as const
