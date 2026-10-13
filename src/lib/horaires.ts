import type { Horaires } from '../data/etablissement.ts'

const JOURS = ['', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'] as const
const JOURS_SCHEMA = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const

const majuscule = (t: string) => t.charAt(0).toUpperCase() + t.slice(1)

/** « lundi au vendredi », « samedi », « lundi, mercredi ». */
export function libelleJours(jours: readonly number[]): string {
  if (jours.length === 1) return majuscule(JOURS[jours[0]!]!)
  const continus = jours.every((j, i) => i === 0 || j === jours[i - 1]! + 1)
  if (continus) return `${majuscule(JOURS[jours[0]!]!)} au ${JOURS[jours[jours.length - 1]!]}`
  return majuscule(jours.map((j) => JOURS[j]).join(', '))
}

/** « 10:00 » → « 10 h », « 07:30 » → « 7 h 30 ». */
export function heure(h: string): string {
  const [hh, mm] = h.split(':')
  const heures = String(Number(hh))
  return mm === '00' ? `${heures} h` : `${heures} h ${mm}`
}

/** Les jours absents des horaires : fermés. */
export function joursFermes(horaires: Horaires): number[] {
  const ouverts = new Set(horaires.flatMap((h) => h.jours))
  return [1, 2, 3, 4, 5, 6, 7].filter((j) => !ouverts.has(j))
}

/** Les horaires au format schema.org (OpeningHoursSpecification). */
export function horairesSchema(horaires: Horaires) {
  return horaires.flatMap((h) =>
    h.plages.map(([debut, fin]) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: h.jours.map((j) => JOURS_SCHEMA[j]),
      opens: debut,
      closes: fin,
    })),
  )
}

/** Version texte, pour les lecteurs d’écran et les descriptions. */
export function horairesEnTexte(horaires: Horaires): string {
  return horaires
    .map((h) => `${libelleJours(h.jours)} : ${h.plages.map(([d, f]) => `${heure(d)} à ${heure(f)}`).join(' et ')}`)
    .join(' ; ')
}
