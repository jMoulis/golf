import { collection, doc, getFirestore, onSnapshot, query, setDoc, where } from "firebase/firestore";
import { useCallback, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { app, auth } from "../../firebase";
import { UserType } from "../types";

export const useUser = () => {
  const [authUser] = useAuthState(auth);
  const [user, setUser] = useState<UserType | null>(null);
  const [coaches, setCoaches] = useState<UserType[]>([]);

  const getUser = useCallback(async () => {
    if (!authUser) return null;
    if (!user) {
      const db = getFirestore(app);
      const docRef = doc(db, 'users', authUser.uid);
      onSnapshot(docRef, (snap) => {
        const payloadUser: any = snap.data();
        setUser({ ...payloadUser, id: snap.id } || null);
      });
    }
  }, [authUser, user]);

  const getCoaches = useCallback(() => {
    const db = getFirestore(app);
    const userQuery = query(
      collection(db, 'users'),
      where('roles', 'array-contains', 'coach'),
    );
    onSnapshot(
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
      (error) => console.error(error),
    );
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