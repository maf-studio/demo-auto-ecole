import { ETABLISSEMENT } from '../data/etablissement.ts'
import { FORMATIONS_PUBLIEES, prixAffiche } from '../data/formations.ts'
import { horairesSchema } from './horaires.ts'

/**
 * Les données structurées de l’établissement (schema.org), sur toutes les
 * pages. Uniquement des informations réelles : pas de coordonnées GPS tant
 * qu’elles ne sont pas relevées, et AUCUNE note ni avis (Google refuse les
 * avis qu’un établissement publie sur lui-même).
 */
export function ecoleJsonLd(site: URL, image: string | null) {
  const e = ETABLISSEMENT
  return {
    '@context': 'https://schema.org',
    '@type': ['DrivingSchool', 'LocalBusiness'],
    '@id': new URL('/#ecole', site).href,
    name: e.nom,
    alternateName: e.nomCourt,
    ...(e.legal.raisonSociale ? { legalName: e.legal.raisonSociale } : {}),
    ...(e.legal.tva ? { vatID: e.legal.tva } : {}),
    url: new URL('/', site).href,
    telephone: e.telephone.international,
    email: e.email,
    foundingDate: String(e.anneeCreation),
    ...(image ? { image } : {}),
    address: {
      '@type': 'PostalAddress',
      streetAddress: e.adresse.rue,
      postalCode: e.adresse.codePostal,
      addressLocality: e.adresse.ville,
      addressCountry: e.adresse.pays,
    },
    ...(e.geo
      ? { geo: { '@type': 'GeoCoordinates', latitude: e.geo.latitude, longitude: e.geo.longitude } }
      : {}),
    areaServed: { '@type': 'City', name: e.adresse.ville },
    openingHoursSpecification: horairesSchema(e.horairesBureau),
    identifier: { '@type': 'PropertyValue', name: 'Numéro d’agrément préfectoral', value: e.agrement },
    ...(e.reseaux.length > 0 ? { sameAs: e.reseaux.map((r) => r.url) } : {}),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Formations à la conduite',
      itemListElement: FORMATIONS_PUBLIEES.map((f) => {
        const prix = f.tarifs.map(prixAffiche).find((p) => p !== null) ?? null
        return {
          '@type': 'Offer',
          itemOffered: { '@type': 'Service', name: f.nom, url: new URL(`/${f.slug}`, site).href },
          ...(prix !== null ? { price: String(prix), priceCurrency: 'EUR' } : {}),
        }
      }),
    },
  }
}

export function filArianeJsonLd(site: URL, etapes: ReadonlyArray<{ libelle: string; href: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: etapes.map((etape, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: etape.libelle,
      item: new URL(etape.href, site).href,
    })),
  }
}
