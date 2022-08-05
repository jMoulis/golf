export const storageErrors = (error: any, customMessageHeader?: string) => {
  if (!error?.code) return { ERROR: 'Erreur fichier' };
  switch (error.code) {
    case 'storage/object-not-found':
      return { ERROR: `${customMessageHeader || 'Fichier'} introuvable` }
    default:
      return { ERROR: 'Erreur fichier' };
  }
}