import { EMAIL, MESSAGES, MESSAGE_MAX, TELEPHONE } from '../lib/demande/regles.ts'

/*
 * Le formulaire de demande, amélioré quand JavaScript est là :
 *   - jeton anti-spam frais (/api/jeton) ;
 *   - présélection depuis l’adresse (?formation=…, ?financement=…) ;
 *   - erreurs affichées sous chaque champ, avec un résumé en tête ;
 *   - envoi sans rechargement, et confirmation SEULEMENT si le serveur
 *     confirme l’envoi de l’e-mail. Sinon, l’erreur est dite telle quelle.
 * Sans JavaScript, le formulaire s’envoie normalement (validation du
 * navigateur, puis page de confirmation ou d’erreur).
 */

type Erreurs = Record<string, string>

function verifier(form: HTMLFormElement): Erreurs {
  const d = new FormData(form)
  const val = (n: string) => String(d.get(n) ?? '').trim()
  const erreurs: Erreurs = {}
  if (val('nom').length < 2) erreurs.nom = MESSAGES.nom
  if (!val('telephone')) erreurs.telephone = MESSAGES.telephoneVide
  else if (!TELEPHONE.test(val('telephone'))) erreurs.telephone = MESSAGES.telephone
  if (!val('email')) erreurs.email = MESSAGES.emailVide
  else if (!EMAIL.test(val('email'))) erreurs.email = MESSAGES.email
  if (!val('formation')) erreurs.formation = MESSAGES.formation
  if (val('message').length > MESSAGE_MAX) erreurs.message = MESSAGES.message
  if (d.get('consentement') !== 'oui') erreurs.consentement = MESSAGES.consentement
  return erreurs
}

function afficherErreurs(form: HTMLFormElement, erreurs: Erreurs, resume: boolean) {
  for (const zone of form.querySelectorAll<HTMLElement>('[data-erreur]')) {
    const nom = zone.dataset.erreur!
    const champ = form.elements.namedItem(nom) as HTMLElement | null
    const message = erreurs[nom] ?? ''
    zone.textContent = message
    if (champ && 'setAttribute' in champ) {
      if (message) champ.setAttribute('aria-invalid', 'true')
      else champ.removeAttribute('aria-invalid')
    }
  }
  const bloc = form.querySelector<HTMLElement>('[data-resume]')
  const liste = form.querySelector<HTMLElement>('[data-resume-liste]')
  if (!bloc || !liste) return
  const noms = Object.keys(erreurs)
  if (noms.length === 0 || !resume) {
    if (noms.length === 0) bloc.hidden = true
    return
  }
  liste.replaceChildren(
    ...noms.map((nom) => {
      const li = document.createElement('li')
      const champ = form.elements.namedItem(nom) as HTMLElement | null
      const lien = document.createElement('a')
      lien.href = champ?.id ? `#${champ.id}` : '#'
      lien.textContent = erreurs[nom]!
      lien.addEventListener('click', (ev) => {
        ev.preventDefault()
        champ?.focus()
      })
      li.append(lien)
      return li
    }),
  )
  bloc.hidden = false
  bloc.focus()
}

async function jetonFrais(form: HTMLFormElement) {
  const champ = form.querySelector<HTMLInputElement>('[data-jeton]')
  if (!champ) return
  try {
    const reponse = await fetch('/api/jeton', { headers: { Accept: 'application/json' }, cache: 'no-store' })
    if (!reponse.ok) return
    const { jeton } = (await reponse.json()) as { jeton?: string }
    if (jeton) champ.value = jeton
  } catch {
    /* Le jeton de la page reste valable. */
  }
}

function preselection(form: HTMLFormElement) {
  const parametres = new URLSearchParams(window.location.search)
  for (const nom of ['formation', 'financement']) {
    const valeur = parametres.get(nom)
    const select = form.elements.namedItem(nom)
    if (!valeur || !(select instanceof HTMLSelectElement)) continue
    if ([...select.options].some((o) => o.value === valeur && !o.disabled)) select.value = valeur
  }
}

for (const form of document.querySelectorAll<HTMLFormElement>('[data-formulaire]')) {
  const bloc = form.closest<HTMLElement>('[data-formulaire-bloc]')
  const succes = bloc?.querySelector<HTMLElement>('[data-succes]')
  const statut = form.querySelector<HTMLElement>('[data-statut]')
  const bouton = form.querySelector<HTMLButtonElement>('[data-envoyer]')
  let tente = false

  form.noValidate = true
  preselection(form)
  void jetonFrais(form)

  // Après une première tentative, les messages se mettent à jour à la saisie.
  form.addEventListener('focusout', () => {
    if (tente) afficherErreurs(form, verifier(form), false)
  })
  form.addEventListener('change', () => {
    if (tente) afficherErreurs(form, verifier(form), false)
  })

  form.addEventListener('submit', async (evenement) => {
    evenement.preventDefault()
    tente = true
    const erreurs = verifier(form)
    afficherErreurs(form, erreurs, true)
    if (Object.keys(erreurs).length > 0) return

    if (bouton) bouton.disabled = true
    if (statut) {
      statut.dataset.etat = ''
      statut.textContent = 'Envoi en cours…'
    }

    try {
      const reponse = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      })
      const resultat = (await reponse.json().catch(() => ({}))) as {
        ok?: boolean
        erreur?: string
        champs?: Erreurs
      }
      if (reponse.ok && resultat.ok) {
        form.hidden = true
        if (succes) {
          succes.hidden = false
          succes.focus()
        }
        return
      }
      if (resultat.erreur === 'champs' && resultat.champs) {
        afficherErreurs(form, resultat.champs, true)
        if (statut) statut.textContent = ''
        return
      }
      throw new Error(resultat.erreur ?? String(reponse.status))
    } catch {
      if (statut) {
        statut.dataset.etat = 'erreur'
        const telephone = form.dataset.telephone
        statut.textContent = `Votre demande n’a pas pu être envoyée. Réessayez dans un instant, ou appelez-nous${
          telephone ? ` au ${telephone}` : ''
        }.`
      }
    } finally {
      if (bouton) bouton.disabled = false
    }
  })
}
