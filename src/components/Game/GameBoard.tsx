import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  doc,
  DocumentData,
  DocumentReference,
  getDoc,
  getFirestore,
} from 'firebase/firestore';
import { app } from '../../firebase';
import { ScoreCard } from './ScoreCard/ScoreCard';
import styled from '@emotion/styled';

const Root = styled.div`
  display: grid;
  grid-template-rows: 2rem 60vh 1fr;
`;
export const GameBoard = () => {
  const [game, setGame] = useState<any | null>(null);
  const { gameId } = useParams();
  const gameRef = useRef<DocumentReference<DocumentData> | null>(null);

  const fetchGame = useCallback(async (id: string) => {
    const db = getFirestore(app);
    gameRef.current = doc(db, 'games', id);
    try {
      const docSnap = await getDoc(gameRef.current);
      if (docSnap.exists()) {
        setGame({ ...docSnap.data(), id: docSnap.id });
      } else {
        console.log('No such document!');
      }
    } catch (error: any) {
      console.log(error.message);
    }
  }, []);

  useEffect(() => {
    if (gameId) {
      fetchGame(gameId);
    }
  }, [gameId, fetchGame]);

  if (!game) return null;

  return (
    <Root>
      <header style={{ display: 'flex' }}>
        <h2>{game.courseRef}</h2>
      </header>

      <ScoreCard game={game} gameRef={gameRef.current} />
    </Root>
  );
};
