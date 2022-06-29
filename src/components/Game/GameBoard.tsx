import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  doc,
  DocumentData,
  DocumentReference,
  getFirestore,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { app } from '../../firebase';
import { ScoreCard } from './ScoreCard/ScoreCard';
import styled from '@emotion/styled';
import { Flexbox } from '../commons';
import { theme } from '../../style/theme';
import { GameHoleType } from '../types';
import { scores } from '../../utils/scoreUtils';

const Root = styled.div`
  display: flex;
  flex-direction: column;
`;
const Stat = styled.span`
  margin-right: 10px;
  font-size: 12px;
  display: flex;
  justify-content: center;
  flex-direction: column;
`;
const Tag = styled.div<{ scoreColor?: { bk: string; color: string } }>`
  background-color: ${({ scoreColor }) => scoreColor?.bk};
  color: ${({ scoreColor }) => scoreColor?.color};
  border-radius: 3px;
  font-size: 12px;
  height: 20px;
  width: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Header = styled.header`
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
  background-color: ${theme.colors.lightPink};
  box-shadow: 0px 3px 7px -2px rgba(0, 0, 0, 0.25);
  z-index: 1;
  & h2 {
    font-weight: 300;
  }
`;

export const GameBoard = () => {
  const [game, setGame] = useState<any | null>(null);
  const { gameId } = useParams();
  const gameRef = useRef<DocumentReference<DocumentData> | null>(null);
  const holeUnsubscribe = useRef<Unsubscribe | null>(null);

  const fetchGame = useCallback(async (id: string) => {
    const db = getFirestore(app);
    gameRef.current = doc(db, 'games', id);
    try {
      holeUnsubscribe.current = onSnapshot(gameRef.current, (data) => {
        if (data.exists()) {
          setGame({ ...data.data(), id: data.id });
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

  const totalScore = useMemo(() => {
    if (!game)
      return {
        par: 0,
        score: 0,
        diff: 0,
      };
    const holes = Object.values(game.holes);
    const score: any = holes.reduce(
      (acc: any, hole: any) => acc + (hole.shots?.length || 0),
      0,
    );
    const par: any = holes.reduce(
      (acc: any, hole: any) => acc + (hole.par || 0),
      0,
    );
    return {
      score,
      par,
      diff: score - par,
    };
  }, [game]);

  const stats = useMemo(() => {
    if (game?.holes) {
      const holes: any = Object.values(game.holes);
      // Find how many par;
      const pars = holes.reduce(
        (acc: number, hole: GameHoleType) =>
          hole.par === hole.shots?.length ? (acc += 1) : acc,
        0,
      );
      const birdies = holes.reduce(
        (acc: number, hole: GameHoleType) =>
          hole.par - 1 === hole.shots?.length ? (acc += 1) : acc,
        0,
      );
      const eagles = holes.reduce(
        (acc: number, hole: GameHoleType) =>
          hole.shots?.length <= hole.par - 2 ? (acc += 1) : acc,
        0,
      );
      const boggeys = holes.reduce(
        (acc: number, hole: GameHoleType) =>
          hole.par + 1 === hole.shots?.length ? (acc += 1) : acc,
        0,
      );
      const doubleBoggeys = holes.reduce(
        (acc: number, hole: GameHoleType) =>
          hole.par + 2 === hole.shots?.length ? (acc += 1) : acc,
        0,
      );
      const trippleBoggeys = holes.reduce(
        (acc: number, hole: GameHoleType) =>
          hole.shots?.length >= hole.par + 3 ? (acc += 1) : acc,
        0,
      );
      return {
        pars,
        birdies,
        eagles,
        boggeys,
        doubleBoggeys,
        trippleBoggeys,
      };
    }
    return {
      pars: 0,
      birdies: 0,
      eagles: 0,
      boggeys: 0,
      doubleBoggeys: 0,
      trippleBoggeys: 0,
    };
  }, [game?.holes]);

  console.log(stats);
  if (!game) return null;

  return (
    <Root>
      <Header style={{ display: 'flex' }}>
        <Flexbox flexDirection='column'>
          <h2>{game.courseRef}</h2>
          <Flexbox>
            <Stat>PAR: {totalScore.par}</Stat>
            <Stat>BRUT: {totalScore.score}</Stat>
            <Stat>DIFF: {totalScore.diff}</Stat>
          </Flexbox>
        </Flexbox>
        <Flexbox
          styling={{
            marginTop: '10px',
          }}>
          <Stat>
            Eagles ou -<Tag scoreColor={scores.eagles}>{stats.eagles}</Tag>
          </Stat>
          <Stat>
            Birdies <Tag scoreColor={scores.birdies}>{stats.birdies}</Tag>
          </Stat>
          <Stat>
            Pars<Tag scoreColor={scores.pars}> {stats.pars}</Tag>
          </Stat>
          <Stat>
            Boggeys <Tag scoreColor={scores.boggeys}>{stats.boggeys}</Tag>
          </Stat>
          <Stat>
            Double <Tag scoreColor={scores.double}>{stats.doubleBoggeys}</Tag>
          </Stat>
          <Stat>
            Triple et +
            <Tag scoreColor={scores.triple}>{stats.trippleBoggeys}</Tag>
          </Stat>
        </Flexbox>
      </Header>
      <ScoreCard game={game} gameRef={gameRef.current} />
    </Root>
  );
};
