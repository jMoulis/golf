import { Unsubscribe } from "firebase/auth";
import { addDoc, collection, deleteDoc, doc, Firestore, getFirestore, onSnapshot, orderBy, query, setDoc, where } from "firebase/firestore";
import { useCallback, useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { app, auth } from "../../../firebase";
import { ENUM_COLLECTION } from "../../../hooks/enumCollection";

export const useSession = (dataCollection: ENUM_COLLECTION) => {
  const [documents, setDocuments] = useState<any[]>([]);
  const unsubscribe = useRef<Unsubscribe | null>(null);
  const [user] = useAuthState(auth);

  const db = useRef<Firestore>(getFirestore(app));

  const getList = useCallback(async (userId: string) => {
    if (!user) return null;

    const dataQuery = query(
      collection(db.current, dataCollection),
      where('userId', '==', userId),
      orderBy('date', 'desc')
    );

    unsubscribe.current = onSnapshot(
      dataQuery,
      (payload) => {
        const incomingDocuments = payload.docs.map((doc) => {
          const parsedDoc = doc.data() as any;
          return {
            id: doc.id,
            ...parsedDoc,
          };
        });
        setDocuments(incomingDocuments);
      },
      (error) => {
        console.error(`Get ${dataCollection}`, error.message);
      },
    );
  }, [user]);

  const handleCreateDocument = useCallback(async (form: any) => {
    if (!user) return null;
    await addDoc(
      collection(db.current, dataCollection),
      form,
    );
  }, [user]);

  const getDocuments = useCallback((userId: string) => {
    getList(userId);
    const unsubscribeGames = unsubscribe.current;
    return () => {
      if (unsubscribeGames) {
        unsubscribeGames();
      }
    };
  }, [])

  const handleEditDocument = useCallback(async (value: any, docID: string) => {
    const docRef = doc(db.current, dataCollection, docID);
    await setDoc(
      docRef,
      value,
    );
  }, []);

  const handleDeleteDocument = (docID: string) => {
    if (db.current) {
      const deleteRef = doc(db.current, dataCollection, docID);
      deleteDoc(deleteRef);
    }
  }

  return {
    getDocuments,
    documents,
    onDeleteDocument: handleDeleteDocument,
    onCreate: handleCreateDocument,
    onEditDocument: handleEditDocument
  }
}