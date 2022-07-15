import { collection, doc, getFirestore, onSnapshot, query, setDoc, Unsubscribe, where } from "firebase/firestore";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { app, auth } from "../../firebase";
import { UserType } from "../types";

export const useUser = () => {
  const [authUser] = useAuthState(auth);
  const [user, setUser] = useState<UserType | null>(null);
  const [coaches, setCoaches] = useState<UserType[]>([]);
  const usersUnsbuscribe = useRef<Unsubscribe | null>(null);
  const userUnsbuscribe = useRef<Unsubscribe | null>(null);

  const getUser = useCallback(async () => {
    if (!authUser) return null;
    if (!user) {
      const db = getFirestore(app);
      const docRef = doc(db, 'users', authUser.uid);
      userUnsbuscribe.current = onSnapshot(docRef, (snap) => {
        const payloadUser: any = snap.data();
        setUser({ ...payloadUser, id: snap.id } || null);
      }, (error) => console.error('GetUser', error));
    }
  }, [authUser, user]);

  const getCoaches = useCallback(() => {
    const db = getFirestore(app);
    const userQuery = query(
      collection(db, 'users'),
      where('roles', 'array-contains', 'coach'),
    );
    usersUnsbuscribe.current = onSnapshot(
      userQuery,
      (payload) => {
        const incomingCoaches = payload.docs.map((doc) => {
          const user = doc.data() as UserType;
          return {
            ...user,
            id: doc.id,
          };
        });
        setCoaches(incomingCoaches);
      },
      (error) => console.error('GetCoaches', error),
    );
  }, []);

  useEffect(() => {
    const unsubscribeUsers = usersUnsbuscribe.current;
    return () => {
      if (unsubscribeUsers) {
        unsubscribeUsers();
      }
    };
  }, []);
  useEffect(() => {
    const unsubscribeUser = userUnsbuscribe.current;
    return () => {
      if (unsubscribeUser) {
        unsubscribeUser();
      }
    };
  }, []);

  const editUser = useCallback((user: UserType) => {
    if (!user?.id) return null;
    const db = getFirestore(app);
    setDoc(
      doc(db, 'users', user.id),
      user,
      { merge: true },
    );
  }, []);

  return {
    getUser,
    user,
    coaches,
    getCoaches,
    editUser
  }
}