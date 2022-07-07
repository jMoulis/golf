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
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Link } from 'react-router-dom';
import { app, auth } from '../../firebase';
import { Button } from '../commons';
import { Modal } from '../commons/Modal';
import { GamesList } from '../Game/GameBoard/GamesList';
import { GamePayloadType, GameType } from '../types';

export const GamePage = () => {
  const [games, setGames] = useState<GameType[]>([]);
  const [deleteGame, setDeleteGame] = useState<GameType | null>(null);
  const gamesUnsubscribe = useRef<Unsubscribe | null>(null);
  const db = useRef<Firestore>(getFirestore(app));
  const [user] = useAuthState(auth);

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
        console.log('Get games', error.code);
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

  const handleDeleteGame = () => {
    if (db.current && deleteGame) {
      const deleteRef = doc(db.current, 'games', deleteGame.id);
      deleteDoc(deleteRef);
      setDeleteGame(null);
    }
  };

  return (
    <div>
      <ul>
        <li>
          <Link to='new'>New Game</Link>
        </li>
      </ul>
      <GamesList onDeleteGame={setDeleteGame} games={games} />
      <Modal onClose={() => setDeleteGame(null)} isOpen={Boolean(deleteGame)}>
        <Button type='button' onClick={handleDeleteGame}>
          Delete
        </Button>
      </Modal>
    </div>
  );
};
