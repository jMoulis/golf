import {
  collection,
  doc,
  getDoc,
  getFirestore,
  onSnapshot,
  query,
  setDoc,
  Unsubscribe,
  where,
} from 'firebase/firestore';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import {
  useUserContext,
  signInAction,
  useAuthDispatch,
} from '../../auth/authContext';
import { app, auth } from '../../firebaseConfig/firebase';
import { UserType } from '../types';

export const useUser: () => {
  getConnectedUser: () => Promise<null | undefined>;
  fetchOneUser: (userID: string) => Promise<UserType | null>;
  user: UserType | null;
  coaches: UserType[];
  getCoaches: () => void;
  editUser: (user: UserType) => null | undefined;
  updateUserBagClubDistance: (
    clubId: string,
    distance: number,
    user: UserType
  ) => UserType;
} = () => {
  const dispatch = useAuthDispatch();
  const [userSystem] = useAuthState(auth);
  const [coaches, setCoaches] = useState<UserType[]>([]);
  const coachesSubscribe = useRef<Unsubscribe | null>(null);
  const userUnsbuscribe = useRef<Unsubscribe | null>(null);
  const user = useUserContext();

  const getConnectedUser = useCallback(async () => {
    if (!userSystem) return null;
    const db = getFirestore(app);
    const docRef = doc(db, 'users', userSystem.uid);
    onSnapshot(
      docRef,
      (snap) => {
        const payloadUser: any = snap.data();
        if (payloadUser) {
          dispatch(signInAction(payloadUser));
        } else {
          dispatch(signInAction({ id: userSystem.uid }));
        }
      },
      // eslint-disable-next-line no-console
      (error) => console.error('GetUser', error)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userSystem]);

  const fetchOneUser = useCallback(async (userId: string) => {
    const db = getFirestore(app);
    const docRef = doc(db, 'users', userId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() };
    }
    return null;
  }, []);

  const getCoaches = useCallback(() => {
    const db = getFirestore(app);
    const userQuery = query(
      collection(db, 'users'),
      where('roles', 'array-contains', 'coach')
    );
    coachesSubscribe.current = onSnapshot(
      userQuery,
      (payload) => {
        const incomingCoaches = payload.docs.map((incomingDoc) => {
          const editedUser = incomingDoc.data() as UserType;
          return {
            ...editedUser,
            id: incomingDoc.id,
          };
        });
        setCoaches(incomingCoaches);
      },
      // eslint-disable-next-line no-console
      (error) => console.error('GetCoaches', error)
    );
  }, []);

  useEffect(() => {
    const unsubscribeUsers = coachesSubscribe.current;
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

  const editUser = useCallback((editedUser: UserType) => {
    if (!editedUser?.id) return null;
    const db = getFirestore(app);
    setDoc(doc(db, 'users', editedUser.id), editedUser, { merge: true });
  }, []);

  const updateUserBagClubDistance = (
    clubId: string,
    distance: number,
    editedUser: UserType
  ) => {
    const userBag = (editedUser.bag || [])?.map((club) =>
      club.id === clubId
        ? { ...club, distances: [...(club.distances || []), distance] }
        : club
    );
    return {
      ...editedUser,
      bag: userBag,
    };
  };
  return {
    getConnectedUser,
    user,
    coaches,
    getCoaches,
    editUser,
    fetchOneUser,
    updateUserBagClubDistance,
  };
};
