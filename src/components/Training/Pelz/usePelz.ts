import { Unsubscribe } from 'firebase/auth';
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
  setDoc,
  Timestamp,
  where,
} from 'firebase/firestore';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { app, auth } from '../../../firebaseConfig/firebase';
import { useUser } from '../../User/useUser';
import { ENUM_PELZ_THEME } from './enums';
import { PelzPayload, PelzTestInput, PelzType } from './types';
import { buildDefaultTest, getGlobalHCP, sortTestsObjects } from './utils';

export const usePelz = () => {
  const COLLECTION = 'pelz';
  const [pelzs, setPelzs] = useState<PelzType[]>([]);
  const gamesUnsubscribe = useRef<Unsubscribe | null>(null);
  const [user] = useAuthState(auth);
  const { user: fullUser } = useUser();

  const db = useRef<Firestore>(getFirestore(app));

  const getTests = useCallback(
    async (userId: string) => {
      if (!user) return null;

      const gamesQuery = query(
        collection(db.current, COLLECTION),
        where('userId', '==', userId),
        orderBy('date', 'desc')
      );

      gamesUnsubscribe.current = onSnapshot(
        gamesQuery,
        (payload) => {
          const incomingPelz = payload.docs.map((incomingDoc) => {
            const pelz = incomingDoc.data() as PelzPayload;
            return {
              ...pelz,
              tests: sortTestsObjects(pelz.tests),
              id: incomingDoc.id,
              date: pelz.date?.toDate(),
            };
          });
          setPelzs(incomingPelz);
        },
        (error) => {
          // eslint-disable-next-line no-console
          console.error('Get pelz', error.message);
        }
      );
    },
    [user]
  );

  const createTest = useCallback(
    async (theme: ENUM_PELZ_THEME) => {
      if (!user) return null;
      if (!fullUser) return null;

      const date = new Date();
      const defaultTest: PelzTestInput = {
        theme,
        date: Timestamp.fromDate(date),
        tests: buildDefaultTest(theme),
        userId: user.uid,
      };
      const docRef = await addDoc(
        collection(db.current, COLLECTION),
        defaultTest
      );
      const newPelz: PelzType = {
        ...defaultTest,
        id: docRef.id,
        date,
      };
      return newPelz;
    },
    [fullUser, user]
  );

  const loadTests = useCallback((userId: string) => {
    getTests(userId);
    const unsubscribeGames = gamesUnsubscribe.current;
    return () => {
      if (unsubscribeGames) {
        unsubscribeGames();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEditPelz = useCallback(async (value: any, pelzID: string) => {
    const testRef = doc(db.current, COLLECTION, pelzID);
    await setDoc(testRef, value, { merge: true });
  }, []);

  const handleDeletePelz = (pelzID: string) => {
    if (db.current) {
      const deleteRef = doc(db.current, COLLECTION, pelzID);
      deleteDoc(deleteRef);
    }
  };
  const globalStat = useMemo(
    () => (pelz: PelzType | null) => {
      if (!pelz)
        return {
          hcp: 0,
          total: 0,
        };
      return getGlobalHCP(pelz.theme, pelz.tests);
    },
    []
  );

  return {
    pelzs,
    loadTests,
    createTest,
    onEditPelz: handleEditPelz,
    onDeletePelz: handleDeletePelz,
    globalStat,
  };
};
