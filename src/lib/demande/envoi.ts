import { ETABLISSEMENT } from '../../data/etablissement.ts'
import type { ConfigurationEnvoi } from './configuration.ts'
import { libelleFinancement, libelleFormation, type Demande } from './schema.ts'

/**
 * L’envoi de la demande à l’établissement, par Resend ou Brevo (un POST avec
 * une clé). Un seul e-mail : la notification, avec « Répondre à » sur
 * l’adresse du demandeur. Aucun accusé automatique n’est envoyé à l’adresse
 * saisie : le formulaire ne doit pas pouvoir servir à écrire à un tiers.
 */
const surUneLigne = (t: string) => t.replace(/[\p{Cc}\u2028\u2029]+/gu, ' ').trim()

function corps(d: Demande): string {
  return [
    'Nouvelle demande envoyée depuis le site internet.',
    '',
    `Nom          ${d.nom}`,
    `Téléphone    ${d.telephone}`,
    `E-mail       ${d.email}`,
    `Formation    ${libelleFormation(d.formation)}`,
    `Financement  ${libelleFinancement(d.financement) ?? 'Non précisé'}`,
    d.depuis ? `Page         ${d.depuis}` : null,
    '',
    'Message',
    '───────',
    d.message ?? '(aucun message)',
    '',
    'Pour répondre : utilisez « Répondre », ou rappelez le numéro indiqué.',
  ]
    .filter((l) => l !== null)
    .join('\n')
}

export async function envoyerDemande(c: ConfigurationEnvoi, d: Demande): Promise<void> {
  const objet = surUneLigne(`Demande site : ${libelleFormation(d.formation)} — ${d.nom}`)
  const texte = corps(d)

  if (c.fournisseur === 'demonstration') return

  if (c.fournisseur === 'essai') {
    if (!import.meta.env.DEV) throw new Error('fournisseur d’essai refusé en production')
    console.info(`[essai] demande non envoyée (développement) :\n${objet}\n${texte}`)
    return
  }

  if (c.fournisseur === 'resend') {
    const reponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${c.cle}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: c.expediteur, to: [c.destinataire], subject: objet, text: texte, reply_to: d.email }),
    })
    if (!reponse.ok) throw new Error(`Resend a répondu ${reponse.status}`)
    return
  }

  const reponse = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'api-key': c.cle ?? '', 'Content-Type': 'application/json', accept: 'application/json' },
    body: JSON.stringify({
      sender: { email: c.expediteur, name: `Site ${ETABLISSEMENT.nom}` },
      to: [{ email: c.destinataire }],
      replyTo: { email: d.email, name: surUneLigne(d.nom) },
      subject: objet,
      textContent: texte,
    }),
  })
  if (!reponse.ok) throw new Error(`Brevo a répondu ${reponse.status}`)
}
