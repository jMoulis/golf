import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  Firestore,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  Unsubscribe,
  updateDoc,
  where,
} from 'firebase/firestore';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { app, auth } from '../../../../firebaseConfig/firebase';
import { ThemeType, ThemeTypeInput } from '../../../types';

export const useThemes = () => {
  const [themes, setThemes] = useState<ThemeType[]>([]);
  const themesUnsubscribe = useRef<Unsubscribe | null>(null);
  const db = useRef<Firestore>(getFirestore(app));
  const [user] = useAuthState(auth);
  const COLLECTION = 'themes';

  const getThemes = useCallback(async () => {
    if (!user) return null;

    const themesQuery = query(
      collection(db.current, COLLECTION),
      where('userId', '==', user.uid),
      orderBy('type', 'asc')
    );
    themesUnsubscribe.current = onSnapshot(
      themesQuery,
      (payload) => {
        const incomingThemes = payload.docs.map((incomingDoc) => {
          const theme = incomingDoc.data() as ThemeType;
          return {
            ...theme,
            id: incomingDoc.id,
          };
        });
        setThemes(incomingThemes);
      },
      // eslint-disable-next-line no-console
      (error) => console.error(error)
    );
  }, [user]);

  const onInit = useCallback(() => {
    getThemes();
  }, [getThemes]);

  useEffect(() => {
    const unsubscribeGames = themesUnsubscribe.current;
    return () => {
      if (unsubscribeGames) {
        unsubscribeGames();
      }
    };
  }, [getThemes]);

  const onUpdateTheme = (value: ThemeType) => {
    const themeRef = doc(db.current, 'themes', value.id);
    updateDoc(themeRef, {
      type: value.type,
    });
  };

  const onAddTheme = (theme: ThemeTypeInput) => {
    if (!user) return null;
    addDoc(collection(db.current, COLLECTION), theme).catch((error) =>
      // eslint-disable-next-line no-console
      console.error('AddTheme', error)
    );
  };

  const onDeleteTheme = (themeID: string) => {
    const deleteRef = doc(db.current, COLLECTION, themeID);
    deleteDoc(deleteRef);
  };

  return {
    themes,
    onUpdateTheme,
    onDeleteTheme,
    onInit,
    onAddTheme,
  };
};
