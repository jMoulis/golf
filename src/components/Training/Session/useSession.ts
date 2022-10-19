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
  where,
  writeBatch,
} from 'firebase/firestore';
import { useCallback, useRef, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { app, auth } from '../../../firebaseConfig/firebase';
import { ENUM_COLLECTION } from '../../../hooks/enumCollection';
import { SessionPayload, SessionType } from './types';

export const useSession = (dataCollection: ENUM_COLLECTION) => {
  const [documents, setDocuments] = useState<SessionType[]>([]);
  const unsubscribe = useRef<Unsubscribe | null>(null);
  const [user] = useAuthState(auth);

  const db = useRef<Firestore>(getFirestore(app));

  const getList = useCallback(
    async (userId: string) => {
      if (!user) return null;

      const dataQuery = query(
        collection(db.current, dataCollection),
        where('userId', '==', userId),
        orderBy('date', 'desc')
      );

      unsubscribe.current = onSnapshot(
        dataQuery,
        (payload) => {
          const incomingDocuments: SessionType[] = payload.docs.map(
            (prevDoc) => {
              const parsedDoc = prevDoc.data() as SessionPayload;
              return {
                ...parsedDoc,
                id: prevDoc.id,
                date: parsedDoc.date.toDate(),
              };
            }
          );
          setDocuments(incomingDocuments);
        },
        (error) => {
          // eslint-disable-next-line no-console
          console.error(`Get ${dataCollection}`, error.message);
        }
      );
    },
    [user, dataCollection]
  );

  const handleCreateDocument = useCallback(
    async (form: any) => {
      if (!user) return null;
      await addDoc(collection(db.current, dataCollection), form);
    },
    [user, dataCollection]
  );

  const getDocuments = useCallback((userId: string) => {
    getList(userId);
    const unsubscribeGames = unsubscribe.current;
    return () => {
      if (unsubscribeGames) {
        unsubscribeGames();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEditDocument = useCallback(
    async (value: any, docID: string) => {
      const docRef = doc(db.current, dataCollection, docID);
      await setDoc(docRef, value);
      return true;
    },
    [dataCollection]
  );

  const handleDeleteDocument = (docID: string) => {
    if (db.current) {
      const deleteRef = doc(db.current, dataCollection, docID);
      deleteDoc(deleteRef);
    }
  };

  const batchEditDocument = (value: any, docID: string) => {
    const batch = writeBatch(db.current);
    const batchRef = doc(db.current, dataCollection, docID);
    batch.update(batchRef, value);
  };

  return {
    getDocuments,
    documents,
    onDeleteDocument: handleDeleteDocument,
    onCreate: handleCreateDocument,
    onEditDocument: handleEditDocument,
    onBatchEditDocument: batchEditDocument,
  };
};
