import {
  collection,
  deleteDoc,
  doc,
  Firestore,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  Unsubscribe,
  where,
} from 'firebase/firestore';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { app, auth } from '../../firebase';
import { GamePayloadType, GameType } from '../types';

export const useGames = () => {
  const [games, setGames] = useState<GameType[]>([]);
  const gamesUnsubscribe = useRef<Unsubscribe | null>(null);
  const [user] = useAuthState(auth);
  const [deleteGame, setDeleteGame] = useState<GameType | null>(null);
  const db = useRef<Firestore>(getFirestore(app));

  const handleDeleteGame = () => {
    if (db.current && deleteGame) {
      const deleteRef = doc(db.current, 'games', deleteGame.id);
      deleteDoc(deleteRef);
      setDeleteGame(null);
    }
  };

  const getGames = useCallback(async () => {
    if (!user) return null;
    const gamesQuery = query(
      collection(db.current, 'games'),
      // where('userId', '==', user.uid),
      where('users', 'array-contains', user.uid),
      orderBy('date', 'desc')
    );


    gamesUnsubscribe.current = onSnapshot(
      gamesQuery,
      (payload) => {
        const incomingGames = payload.docs.map((doc) => {
          const game = doc.data() as GamePayloadType;
          return {
            id: doc.id,
            ...game,
            date: game.date?.toDate(),
          };
        });
        setGames(incomingGames);
      },
      (error) => {
        console.log(error)
        console.error('Get games', error.message);
      },
    );
  }, [user]);

  useEffect(() => {
    getGames();
    const unsubscribeGames = gamesUnsubscribe.current;
    return () => {
      if (unsubscribeGames) {
        unsubscribeGames();
      }
    };
  }, [getGames]);
  return {
    games,
    onDeleteGame: handleDeleteGame,
    selectDeleteGame: setDeleteGame,
    deletedGame: deleteGame
  }
}