import {
  collection,
  deleteDoc,
  doc,
  Firestore,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  Unsubscribe,
  where,
} from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { app, auth, storage } from '../../firebase';
import { GamePayloadType, GameType } from '../types';

export const useGames = () => {
  const [games, setGames] = useState<GameType[]>([]);
  const gamesUnsubscribe = useRef<Unsubscribe | null>(null);
  const [user] = useAuthState(auth);
  const [deleteGame, setDeleteGame] = useState<GameType | null>(null);
  const db = useRef<Firestore>(getFirestore(app));

  const handleDeleteGame = () => {
    if (db.current && deleteGame) {
      console.log(deleteGame);
      const deleteRef = doc(db.current, 'games', deleteGame.id);
      deleteDoc(deleteRef).then(() => {
        if (deleteGame.scoreCardPDF) {
          const fileRef = ref(storage, deleteGame.scoreCardPDF);
          deleteObject(fileRef);
        }
      });
      setDeleteGame(null);
    }
  };

  const getGames = useCallback(async () => {
    if (!user) return null;
    const gamesQuery = query(
      collection(db.current, 'games'),
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

  const handleUpdateGame = async (gameID: string, value: any) => {
    const gameRef = doc(db.current, 'games', gameID);
    await setDoc(
      gameRef,
      value,
      {
        merge: true,
      },
    );
  }

  return {
    games,
    onDeleteGame: handleDeleteGame,
    selectDeleteGame: setDeleteGame,
    onEditGame: handleUpdateGame,
    deletedGame: deleteGame
  }
}