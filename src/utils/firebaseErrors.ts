export const firebaseErrors = (error: any, customMessageHeader?: string) => {
  if (!error?.code) return { ERROR: 'Erreur fichier' };
  switch (error.code) {
    case 'permission-denied':
      return { ERROR: customMessageHeader || `Tu n'as pas l'autorisation` };
    default:
      return { ERROR: 'Erreur fichier' };
  }
};
