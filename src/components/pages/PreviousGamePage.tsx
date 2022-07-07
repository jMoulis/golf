import {
  collection,
  deleteDoc,
  doc,
  Firestore,
  getFirestore,
  onSnapshot,
  query,
  Unsubscribe,
  where,
} from 'firebase/firestore';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { app, auth } from '../../firebase';
import { GamesList } from '../Game/GameBoard/GamesList';
import { GamePayloadType, GameType } from '../types';
import { Button } from '../commons';
import { Modal } from '../commons/Modal';

export const PreviousGamePage = () => {
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
      where(`roles.${user.uid}`, 'in', ['owner', 'coach']),
    );

    gamesUnsubscribe.current = onSnapshot(
      gamesQuery,
      (payload) => {
        const incomingGames = payload.docs.map((doc) => {
          const game = doc.data() as GamePayloadType;
          return {
            id: doc.id,
            courseRef: game.courseRef,
            date: game.date?.toDate(),
            holes: {},
            themes: game.themes,
            userId: game.userId,
          };
        });
        setGames(incomingGames);
      },
      (error) => {
        console.error('Get games', error.code);
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

  return (
    <>
      <GamesList onDeleteGame={setDeleteGame} games={games} />
      <Modal onClose={() => setDeleteGame(null)} isOpen={Boolean(deleteGame)}>
        <Button type='button' onClick={handleDeleteGame}>
          Delete
        </Button>
      </Modal>
    </>
  );
};