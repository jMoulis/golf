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
import { EvaluationForm } from './EvaluationForm/EvaluationForm';
import { MentalCard } from './MentalCard/MentalCard';
import { Tab, TabWrapper } from './StyledComponents/Tab';

export const GameBoard = () => {
  const [game, setGame] = useState<any | null>(null);
  const { gameId } = useParams();
  const gameRef = useRef<DocumentReference<DocumentData> | null>(null);
  const [selectedTab, setSelectedTab] = useState<
    'score' | 'evaluation' | 'mental'
  >('score');

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
    <div>
      <header style={{ display: 'flex' }}>
        <h2>{game.courseRef}</h2>
      </header>
      <TabWrapper>
        <Tab
          selected={selectedTab === 'score'}
          onClick={() => setSelectedTab('score')}>
          Score
        </Tab>
        <Tab
          selected={selectedTab === 'evaluation'}
          onClick={() => setSelectedTab('evaluation')}>
          Evaluation
        </Tab>
        <Tab
          selected={selectedTab === 'mental'}
          onClick={() => setSelectedTab('mental')}>
          Mental
        </Tab>
      </TabWrapper>

      {selectedTab === 'score' ? (
        <ScoreCard game={game} gameRef={gameRef.current} />
      ) : null}
      {selectedTab === 'evaluation' ? (
        <EvaluationForm game={game} gameRef={gameRef.current} />
      ) : null}
      {selectedTab === 'mental' ? (
        <MentalCard game={game} gameRef={gameRef.current} />
      ) : null}
    </div>
  );
};
