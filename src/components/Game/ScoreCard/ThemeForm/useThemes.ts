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
import { app, auth } from '../../../../firebase';
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
      orderBy('type', 'asc'),

    );
    themesUnsubscribe.current = onSnapshot(themesQuery, (payload) => {
      const incomingThemes = payload.docs.map((doc) => {
        const theme = doc.data() as ThemeType;
        return {
          ...theme,
          id: doc.id,
        };
      });
      setThemes(incomingThemes);
    }, (error) => console.error(error));
  }, [user]);

  const onInit = useCallback(() => {
    getThemes();
  }, [getThemes])

  useEffect(() => {
    const unsubscribeGames = themesUnsubscribe.current;
    return () => {
      if (unsubscribeGames) {
        unsubscribeGames();
      }
    };
  }, [getThemes]);

  const onUpdateTheme = (value: ThemeType) => {
    const themeRef = doc(db.current, "themes", value.id);
    updateDoc(themeRef, {
      type: value.type
    });
  }

  const onAddTheme = (theme: ThemeTypeInput) => {
    if (!user) return null;
    console.log(COLLECTION)
    addDoc(collection(db.current, COLLECTION), theme).catch((error) => console.log('AddTheme', error));
  }

  const onDeleteTheme = (themeID: string) => {
    const deleteRef = doc(db.current, COLLECTION, themeID);
    deleteDoc(deleteRef);
  }

  return {
    themes,
    onUpdateTheme,
    onDeleteTheme,
    onInit,
    onAddTheme
  }
}