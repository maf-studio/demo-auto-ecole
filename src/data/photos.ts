/**
 * Les photos en haut des pages des formations, par identifiant de formation
 * (`'permis-b': { src: photo, alt: 'ce qu’on voit' }`). Une formation absente
 * d’ici reçoit un visuel dessiné aux couleurs du site : c’est le cas de toutes
 * dans la démonstration. Les cartes des formations montrent toujours ce visuel
 * dessiné (icônes).
 *
 * Pour ajouter une vraie photo : la déposer dans `src/assets/photos/`,
 * l’importer ici, et l’associer au bon identifiant.
 */
export const PHOTOS_FORMATIONS: Record<string, { src: ImageMetadata; alt: string } | undefined> = {}
