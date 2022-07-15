import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  doc,
  DocumentData,
  DocumentReference,
  getFirestore,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { app } from '../../../firebase';
import { ScoreCard } from '../ScoreCard/ScoreCard';
import { GameType } from '../../types';
import { GameBoardHeader } from './GameBoardHeader';
import { PageHeader } from '../../commons/Core/PageHeader';
import { theme } from '../../../style/theme';

export const GameBoard = () => {
  const [game, setGame] = useState<GameType | null>(null);
  const { gameId } = useParams();
  const gameRef = useRef<DocumentReference<DocumentData> | null>(null);
  const holeUnsubscribe = useRef<Unsubscribe | null>(null);

  const fetchGame = useCallback(async (id: string) => {
    const db = getFirestore(app);
    gameRef.current = doc(db, 'games', id);
    try {
      holeUnsubscribe.current = onSnapshot(gameRef.current, (data) => {
        if (data.exists()) {
          setGame({ ...data.data(), id: data.id } as any);
        } else {
          console.error('No such document!');
        }
      });
    } catch (error: any) {
      console.error(error.message);
    }
  }, []);

  useEffect(() => {
    if (gameId) {
      fetchGame(gameId);
    }
  }, [gameId, fetchGame]);

  useEffect(() => {
    const shotUnsub = holeUnsubscribe.current;
    return () => {
      if (shotUnsub) shotUnsub();
    };
  }, []);

  if (!game) return null;

  return (
    <>
      <PageHeader backgroundColor={theme.headers.games.linear}>
        <GameBoardHeader
          game={game}
          holes={game?.holes}
          courseName={game.courseRef}
        />
      </PageHeader>
      <ScoreCard game={game} gameRef={gameRef.current} />
    </>
  );
};
