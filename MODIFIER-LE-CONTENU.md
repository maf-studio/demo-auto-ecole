# Modifier le contenu du site

Tout ce qui s’affiche sur le site vient de quelques fichiers du dossier `src/data/`. On n’a jamais besoin de
toucher aux pages elles-mêmes pour changer un horaire, un prix ou une formation. Après chaque modification :
`pnpm build`, puis mise en ligne (un « push » suffit si le projet est relié à Vercel).

Règle d’or : **ne jamais inventer**. Une information inconnue s’écrit `null` ; ce qui en dépend disparaît du site.
Seule exception, la démonstration (`src/data/demonstration.ts`) : ses valeurs d’exemple sont annoncées comme
telles sur chaque page.

## Coordonnées, horaires, note Google : `src/data/etablissement.ts`

- **Téléphone, e-mail, adresse** : `telephone`, `email`, `adresse`.
- **Horaires** : `horairesBureau` (accueil) et `horairesConduite` (leçons). Les jours sont des numéros :
  1 = lundi … 7 = dimanche. Exemple : `{ jours: [1, 2, 3, 4, 5], plages: [['10:00', '12:00'], ['15:00', '20:00']] }`.
  Un jour absent s’affiche « Fermé ».
- **Note Google** : `noteGoogle` (note, nombre d’avis, date du relevé au format `AAAA-MM-JJ`). Mettre les trois à
  jour ensemble. `null` la retire partout.
- **Réseaux sociaux** : `reseaux` (Instagram, Snapchat, Facebook ou TikTok, avec l’adresse complète).
- **WhatsApp** : `whatsapp`, le numéro au format international sans « + » ni espace (`33612345678`).
- **Labels** : `labels` (nom et détail). Une liste vide retire la section.
- **Paiement en plusieurs fois** : `paiementPlusieursFois.conditions`, une phrase sur les modalités exactes.
- **Équipe** : `equipe` (prénom, rôle, photo). La section apparaît dès qu’une personne est ajoutée, avec son accord.
- **Garantie financière** : `garantieFinanciere` (`{ garant: 'Nom du garant' }`). Elle s’affiche sur l’accueil et
  la page Démarche qualité.
- **Taux de réussite** : `tauxReussite`, seulement avec sa source (catégorie, taux, année, source).
- **Mentions légales** : `legal` (raison sociale, SIRET, directeur de la publication, médiateur…).

## Le logo

Déposer les deux versions du logo dans `src/assets/marque/` (une pour les fonds sombres, une pour les fonds
clairs), puis, en haut de `etablissement.ts` :

```ts
import logoSombre from '../assets/marque/logo-sombre.png'
import logoClair from '../assets/marque/logo-clair.png'
```

et remplacer `logoFichier: null` par `logoFichier: { sombre: logoSombre, clair: logoClair }`. Le nom écrit en
lettres disparaît partout.

## Les formations et les prix : `src/data/formations.ts`

Une entrée = une page. Pour chaque formation : nom, textes, prérequis, déroulement, programme, durée, FAQ,
financements possibles, sources.

- **Publier ou masquer une formation** : `statut: 'publiee'` ou `statut: 'brouillon'`. Un brouillon n’apparaît ni
  dans les menus, ni dans le plan, ni dans Google.
- **Afficher un prix** : dans `tarifs`, renseigner `prixTTC` (en euros, sans espace) et passer `verifie: true`.
  Tant que `verifie` vaut `false`, ou sans prix, le site écrit « Tarif sur demande ». Démonstration : les prix
  sont des exemples, à remplacer par ceux du client.
- **Ajouter une formation** : copier une entrée existante, changer le `slug` (l’adresse de la page) et les textes.
  Elle apparaît automatiquement dans les menus, le pied de page, les tarifs, le formulaire et le sitemap.

## Les photos : `src/data/photos.ts`

Déposer la photo dans `src/assets/photos/`, l’importer en haut du fichier, puis l’associer à la formation
(`'permis-b': { src: maPhoto, alt: 'description de la photo' }`). Le texte `alt` décrit ce qu’on voit. La photo
apparaît en haut de la page de la formation ; les cartes des formations gardent leur icône.

## Les financements : `src/data/financements.ts`

Conditions, pour qui, démarche, sources. Ces règles changent souvent (deux réformes en 2026) : relire au moins
une fois par an et mettre à jour `DERNIERE_VERIFICATION` dans `src/data/sources.ts`.

## Les documents d’inscription : `src/data/documents.ts`

Chaque pièce indique à quelles formations elle s’applique (`pour`). La liste à cocher et les pages formations se
mettent à jour seules.

## Les questions fréquentes : `src/data/faq.ts`

Questions de l’accueil et du financement. Les questions propres à une formation sont dans `formations.ts`.

## Les documents qualité : `src/data/qualite.ts`

Déposer le PDF dans `public/documents/`, puis écrire son adresse dans `fichier`
(`'/documents/reglement-interieur.pdf'`). Seuls les documents fournis apparaissent sur la page Démarche qualité.

## Les avis : `src/data/avis.ts`

Uniquement des avis réels, recopiés **sans changer un mot** (une coupure s’écrit « […] »), avec le prénom et
l’initiale du nom. Demander l’accord de l’auteur avant de le publier.
