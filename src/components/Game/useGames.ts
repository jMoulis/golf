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

import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { app, auth } from 'firebaseConfig/firebase';
import { useFileStorage } from 'hooks/useFileStorage';
import { GamePayloadType, GameType } from '../types';
import { toast } from 'react-toastify';

export const useGames = () => {
  const { deleteFile } = useFileStorage();
  const [games, setGames] = useState<GameType[]>([]);
  const gamesUnsubscribe = useRef<Unsubscribe | null>(null);
  const [user] = useAuthState(auth);
  const [deleteGame, setDeleteGame] = useState<GameType | null>(null);
  const db = useRef<Firestore>(getFirestore(app));

  const handleDeleteGame = () => {
    if (db.current && deleteGame) {
      const deleteRef = doc(db.current, 'games', deleteGame.id);
      deleteDoc(deleteRef).then(() => {
        if (deleteGame.scoreCardPDF) {
          deleteFile(deleteGame.scoreCardPDF)
        }
      }).catch((error) => toast.error(`Delete game: ${error.message}`));
      setDeleteGame(null);
    }
  };

  const getGames = useCallback(async (userId: string) => {
    if (!user) return null;
    const gamesQuery = query(
      collection(db.current, 'games'),
      where('userId', '==', userId),
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
        toast.error(`Get games: ${error.message}`)
      },
    );
  }, [user]);

  useEffect(() => {
    const unsubscribeGames = gamesUnsubscribe.current;
    return () => {
      if (unsubscribeGames) {
        unsubscribeGames();
      }
    };
  }, [getGames]);

  const handleUpdateGame = async (gameID: string, value: any) => {
    const gameRef = doc(db.current, 'games', gameID);
    try {
      await setDoc(
        gameRef,
        value,
        {
          merge: true,
        },
      );
    } catch (error: any) {
      toast.error(`Update game: ${error.message}`)
    }
  }

  return {
    games,
    onDeleteGame: handleDeleteGame,
    selectDeleteGame: setDeleteGame,
    onEditGame: handleUpdateGame,
    deletedGame: deleteGame,
    getGames
  }
}