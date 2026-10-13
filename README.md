# Site d’auto-école : la démonstration

Un site complet d’auto-école et moto-école, sans client réel, pour présenter à des auto-écoles ce que MAF Studio
réalise. Construit à partir d’un site livré, dont il ne garde ni le nom, ni le logo, ni les photos, ni les
coordonnées, ni les avis, ni les prix.

- **Tout ce qui est propre à une école est un exemple** : le nom « Votre Auto-École », l’adresse « 12 rue de
  l’Exemple, 00000 Votre ville », un numéro de la tranche que l’ARCEP réserve à la fiction (01 99 00 …), un e-mail
  sur un domaine réservé (`.example`), trois avis d’exemple annoncés comme tels, une note et des prix d’exemple
  en chiffres ronds, des mentions légales « à compléter ».
- **Le reste est réel et sourcé** : les formations (âges, durées, examens), les financements (CPF, permis à 1 €
  par jour, règles 2026), les documents d’inscription, chacun avec sa source officielle.
- **Mode démonstration** (`src/data/demonstration.ts`) : un bandeau en haut de chaque page dit que nom,
  coordonnées, avis et prix sont des exemples ; le site n’est jamais indexé, quel que soit son domaine ; le
  formulaire s’affiche et se remplit, mais rien n’est envoyé, et la confirmation le dit.
- **Sans photo** : le haut des pages montre une illustration dessinée (route et panneaux, `ui/Scene.astro`), les
  formations leur pictogramme. Une vraie photo se dépose dans `src/assets/photos/` (voir MODIFIER-LE-CONTENU.md).
- **27 pages** : accueil, deux pages rubriques (permis auto, permis moto), 11 pages formations, financement,
  tarifs, documents d’inscription, à propos, démarche qualité, avis, contact, pages légales, plan du site, 404.

## Transformer la démonstration en site client

1. Copier le dépôt pour le client (nouveau dépôt, nouveau projet Vercel).
2. `src/data/demonstration.ts` : `DEMONSTRATION = false`.
3. `src/data/etablissement.ts` : nom, adresse, téléphone, e-mail, fiche Google, note relevée, horaires, réseaux,
   labels, mentions légales. `src/data/avis.ts` : des avis réels recopiés de la fiche Google (`source: 'Google'`).
   `src/data/formations.ts` : les vrais prix, `verifie: true` une fois validés.
4. Logo et photos du client (MODIFIER-LE-CONTENU.md), textes de présentation (`components/accueil/`,
   `pages/a-propos.astro`), aides locales de son territoire (`src/data/financements.ts`, `src/data/faq.ts`).
5. `pnpm check:publication` ne doit plus rien signaler de bloquant, puis configurer l’envoi des demandes.

## Pile

Astro 7 (sortie statique), adaptateur Vercel, CSS sans framework (variables dans `src/styles/global.css`), aucun
framework côté client. Deux routes rendues à la demande : `/api/demande` (envoi du formulaire) et `/api/jeton`
(anti-spam). Polices auto-hébergées (paquets Fontsource) : aucune requête vers Google au chargement.

## Commandes

```bash
pnpm install
pnpm dev                     # serveur de développement (http://localhost:4321)
pnpm dev:essai               # idem, avec un service d’envoi « essai » : les formulaires s’affichent, rien n’est envoyé
pnpm build                   # astro check, puis astro build
pnpm check:liens             # liens internes du site construit (après pnpm build)
pnpm check:publication       # ce qui manque avant la mise en ligne (mentions légales, prix, logo…)
pnpm test:e2e                # formulaire avec et sans JavaScript, menu mobile, liste des documents
node scripts/controle.mjs    # toutes les pages, 360 et 1440 px : statut, débordement, erreurs, accessibilité (axe)
node scripts/captures.mjs /permis-b dossier 360,1440   # captures d’écran
```

Chromium déjà installé ailleurs : `CHROME_PATH=/chemin/vers/chromium` avant les commandes Playwright.

## Où modifier quoi

Tout le contenu est dans `src/data/` : voir **[MODIFIER-LE-CONTENU.md](./MODIFIER-LE-CONTENU.md)**.

| Donnée | Fichier |
|---|---|
| Coordonnées, horaires, note Google, réseaux, labels, logo, mentions légales, WhatsApp, équipe | `src/data/etablissement.ts` |
| Catalogue des formations (une entrée = une page), tarifs, statut publié ou brouillon | `src/data/formations.ts` |
| Solutions de financement | `src/data/financements.ts` |
| Documents d’inscription | `src/data/documents.ts` |
| FAQ de l’accueil et du financement | `src/data/faq.ts` |
| Avis Google cités | `src/data/avis.ts` |
| Sources officielles et date de vérification | `src/data/sources.ts` |
| Photos associées aux formations | `src/data/photos.ts` |
| Menus | `src/data/navigation.ts` |
| Documents qualité du label (PDF) | `src/data/qualite.ts` |

## Composants

| Fonction demandée | Composant |
|---|---|
| Header, MobileNavigation | `components/layout/EnTete.astro` (sous-menus, menu mobile en `popover`) |
| Barre d’actions mobile | `components/layout/BarreMobile.astro` |
| Footer | `components/layout/PiedDePage.astro` |
| Hero | `components/accueil/HerosAccueil.astro`, `components/sections/HerosPage.astro` |
| TrustBar | `components/accueil/BandeConfiance.astro` |
| FormationCard, FormationDetail | `components/ui/CarteFormation.astro`, `pages/[formation].astro` |
| FinancingCard | `components/sections/CartesFinancement.astro` |
| ReviewSection | `components/sections/AvisGoogle.astro` |
| FAQAccordion | `components/sections/Questions.astro` |
| ContactForm, QuoteForm | `components/formulaire/FormulaireDemande.astro` (un seul formulaire, trois variantes) |
| CTASection | `components/sections/AppelFinal.astro` |
| OpeningHours | `components/ui/Horaires.astro` (avec « ouvert / fermé » à l’heure de Paris) |
| LocationMap, CookieConsent | `components/ui/CarteGoogle.astro` (carte chargée seulement après accord) et `pages/cookies.astro` |
| DocumentChecklist | `pages/documents-inscription.astro` |
| Breadcrumbs | `components/ui/FilAriane.astro` (+ données structurées) |

## Formulaires

Un seul formulaire pour tout le site (contact, devis, financement), la formation choisie est transmise
automatiquement (`?formation=permis-b` dans l’adresse la présélectionne).

- Envoi réel par **Resend** ou **Brevo**, à l’adresse `CONTACT_TO`, avec « Répondre à » sur l’adresse du demandeur.
- **Jamais d’envoi simulé** : sans service configuré, les formulaires sont remplacés par les moyens directs
  (téléphone, e-mail prérempli avec la formation). En cas d’échec du fournisseur, le visiteur voit une erreur, pas
  une confirmation. Seule exception, la démonstration : le formulaire s’affiche, rien n’est envoyé, et la
  confirmation le dit au visiteur.
- Anti-spam sans CAPTCHA : champ piège, jeton horodaté signé (3 s minimum), vérification d’origine. Ajouter une
  limite de requêtes sur `/api/demande` dans le pare-feu Vercel.
- Fonctionne sans JavaScript (redirection vers `/demande-envoyee` ou `/demande-erreur`).

## Mise en ligne sur Vercel (pas à pas)

Le site a son propre dépôt GitHub, privé : `maf-studio/demo-auto-ecole`, le site à la racine. Les réglages de
build sont dans `vercel.json` (Astro, pnpm, fonctions à Paris : `cdg1`).

Compte Vercel Hobby et dépôt privé : Vercel ne déploie que si l’auteur du dernier commit est le propriétaire du
projet, le compte GitHub `maf-studio`. L’identité git du dépôt est donc
`maf-studio <279308962+maf-studio@users.noreply.github.com>`.

1. Vercel → **Add New… → Project** → importer `maf-studio/demo-auto-ecole`. S’il n’apparaît pas :
   **Adjust GitHub App Permissions**, et cocher ce dépôt.
2. **Root Directory** : laisser la racine. Framework : Astro (détecté). Ne rien changer aux commandes.
3. **Deploy**. Aucune variable d’environnement n’est nécessaire à la démonstration : le formulaire fonctionne
   sans rien envoyer, et toutes les pages sont en `noindex`. Les étapes suivantes concernent un site client.
4. Pour activer les formulaires, **Settings → Environment Variables** (voir `.env.example`) : `EMAIL_PROVIDER`,
   `RESEND_API_KEY` (ou `BREVO_API_KEY`), `CONTACT_TO`, `CONTACT_FROM`, `FORM_SECRET` (`openssl rand -hex 32`).
   Chez Resend (ou Brevo), vérifier d’abord le domaine d’expédition, puis renseigner `CONTACT_FROM` sur ce domaine.
5. Les pages sont statiques : **après tout ajout de variable, redéployer** (Deployments → ⋯ → Redeploy) pour que
   les formulaires apparaissent.
6. Domaine : l’ajouter dans **Settings → Domains**, puis renseigner `SITE_URL=https://www.le-domaine.fr` et
   redéployer. Tant que le site tourne sur `*.vercel.app`, toutes les pages sont en `noindex` et `robots.txt`
   ferme l’accès : une maquette présentée au client n’entre jamais dans Google.
7. **Firewall** → règle de limite de requêtes sur `/api/demande` (par exemple 5 par minute et par IP).
8. Avant d’ouvrir au public : `pnpm check:publication` ne doit plus rien signaler de bloquant.

## SEO local

- Titre, description, `canonical`, Open Graph et image de partage par page ; un seul `h1` ; sitemap (sans les
  pages légales ni les brouillons) ; `robots.txt` selon le domaine.
- Données structurées `DrivingSchool` + `LocalBusiness` (nom, adresse, téléphone, horaires du bureau, agrément,
  catalogue des formations) et `BreadcrumbList`. **Aucune note ni avis** en données structurées (Google refuse
  les avis qu’un établissement publie sur lui-même) ; pas de géolocalisation tant qu’elle n’est pas relevée.
- Sur un site client, les communes voisines sont citées une fois, dans un texte vrai ; aucune fausse page locale.

## Accessibilité et performance

- Contrôle axe (WCAG 2.2 AA) sans violation sur toutes les adresses, à 360 et 1440 px ; aucun débordement
  horizontal.
- Navigation au clavier, lien d’évitement, anneau de focus visible, sous-menus au clavier (Échap), menu mobile
  natif (`popover`), FAQ en `details`, contrastes calculés (voir l’en-tête de `global.css`).
- Mouvement : révélations jouées une fois sous la ligne de flottaison, transitions de page natives, tout coupé
  avec « réduire les animations ». Aucun contenu n’attend un script.
- Images en AVIF et WebP, aux dimensions utiles ; polices préchargées avec métriques de repli.
