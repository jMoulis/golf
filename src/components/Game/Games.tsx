import {
  collection,
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
  const [confirmationModal, setConfirmationModal] = useState<boolean>(false);
  const dateFormat = useRef<Intl.DateTimeFormat>(new Intl.DateTimeFormat());
  const gamesUnsubscribe = useRef<Unsubscribe | null>(null);
  const db = useRef<Firestore | null>(null);
  const getGames = useCallback(async () => {
    db.current = getFirestore(app);
    const gamesQuery = query(collection(db.current, 'games'));
    gamesUnsubscribe.current = onSnapshot(gamesQuery, (payload) => {
      const incomingGames = payload.docs.map((doc) => {
        const game = doc.data() as GamePayloadType;
        return {
          _id: doc.id,
          courseRef: game.courseRef,
          date: game.date.toDate(),
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

  const handleDeleteGame = (game: GameType) => {
    setConfirmationModal(true);
    // if (db.current) {
    //   const deleteRef = doc(db.current, 'games', game._id);
    //   deleteDoc(deleteRef);
    // }
  };

  return (
    <div>
      <ul>
        <li>
          <Link to='/games/new'>New Game</Link>
        </li>
      </ul>
      <ul>
        {games.map((game) => (
          <li key={game._id}>
            <Flexbox
              justifyContent='space-between'
              alignItems='center'
              styling={{
                padding: '0.5rem',
              }}>
              <Link to={`/games/${game._id}`}>
                <div>
                  <span>{game.courseRef}</span>
                  <div>{dateFormat.current.format(game.date)}</div>
                </div>
              </Link>
              <div>
                <Button type='button' onClick={() => handleDeleteGame(game)}>
                  Delete
                </Button>
              </div>
            </Flexbox>
          </li>
        ))}
      </ul>
      <Modal
        onClose={() => setConfirmationModal(false)}
        isOpen={confirmationModal}>
        <Button type='button'>Delete</Button>
      </Modal>
    </div>
  );
};
