import {
  addDoc,
  collection,
  doc,
  Firestore,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  Unsubscribe,
  updateDoc,
} from 'firebase/firestore';
import { useCallback, useEffect, useRef, useState } from 'react';
import { app } from '../../../../firebase';
import { ThemeType, ThemeTypeInput } from '../../../types';


export const useThemes = () => {
  const [themes, setThemes] = useState<ThemeType[]>([]);
  const [deleteTheme, setDeleteTheme] = useState<ThemeType | null>(null);
  const themesUnsubscribe = useRef<Unsubscribe | null>(null);
  const db = useRef<Firestore>(getFirestore(app));

  const getThemes = useCallback(async () => {
    const themesQuery = query(
      collection(db.current, 'themes'),
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
    });
  }, []);

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
    addDoc(collection(db.current, 'themes'), theme);
  }

  return {
    themes,
    onUpdateTheme,
    onInit,
    onAddTheme
  }
}