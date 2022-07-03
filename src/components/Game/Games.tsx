import {
  collection,
  deleteDoc,
  doc,
  Firestore,
  getFirestore,
  onSnapshot,
  query,
  Unsubscribe,
} from 'firebase/firestore';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { app } from '../../firebase';
import { Button, Flexbox } from '../commons';
import { Modal } from '../commons/Modal';
import { GamePayloadType, GameType } from '../types';

type Props = {};

export const Games = (props: Props) => {
  const [games, setGames] = useState<GameType[]>([]);
  const [deleteGame, setDeleteGame] = useState<GameType | null>(null);
  const dateFormat = useRef<Intl.DateTimeFormat>(new Intl.DateTimeFormat());
  const gamesUnsubscribe = useRef<Unsubscribe | null>(null);
  const db = useRef<Firestore>(getFirestore(app));

  const getGames = useCallback(async () => {
    const gamesQuery = query(collection(db.current, 'games'));
    gamesUnsubscribe.current = onSnapshot(gamesQuery, (payload) => {
      const incomingGames = payload.docs.map((doc) => {
        const game = doc.data() as GamePayloadType;
        return {
          id: doc.id,
          courseRef: game.courseRef,
          date: game.date.toDate(),
          holes: {},
          themes: game.themes,
        };
      });
      setGames(incomingGames);
    });
  }, []);

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
      <ul>
        {games.map((game) => (
          <li key={game.id}>
            <Flexbox
              justifyContent='space-between'
              alignItems='center'
              styling={{
                padding: '0.5rem',
              }}>
              <Link to={`${game.id}`}>
                <div>
                  <span>{game.courseRef}</span>
                  <div>{dateFormat.current.format(game.date)}</div>
                </div>
              </Link>
              <div>
                <Button type='button' onClick={() => setDeleteGame(game)}>
                  Delete
                </Button>
              </div>
            </Flexbox>
          </li>
        ))}
      </ul>
      <Modal onClose={() => setDeleteGame(null)} isOpen={Boolean(deleteGame)}>
        <Button type='button' onClick={handleDeleteGame}>
          Delete
        </Button>
      </Modal>
    </div>
  );
};
