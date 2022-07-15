import { useMemo } from 'react';
import { scoresConfig } from '../../../utils/scoreUtils';
import { Flexbox } from '../../commons';
import { GameHoleType } from '../../types';
import { Stat, Tag } from './stylesComponents';

type Props = {
  holes?: Record<string, GameHoleType>;
};

export const TotalScores = ({ holes }: Props) => {
  const stats = useMemo(() => {
    if (holes) {
      const parsedHoles: any = Object.values(holes);
      // Find how many par;
      const pars = parsedHoles.reduce(
        (acc: number, hole: GameHoleType) =>
          hole.par === hole.shots?.length ? (acc += 1) : acc,
        0,
      );
      const birdies = parsedHoles.reduce(
        (acc: number, hole: GameHoleType) =>
          hole.par - 1 === hole.shots?.length ? (acc += 1) : acc,
        0,
      );
      const eagles = parsedHoles.reduce(
        (acc: number, hole: GameHoleType) =>
          hole.shots?.length && hole.shots?.length <= hole.par - 2
            ? (acc += 1)
            : acc,
        0,
      );
      const boggeys = parsedHoles.reduce(
        (acc: number, hole: GameHoleType) =>
          hole.par + 1 === hole.shots?.length ? (acc += 1) : acc,
        0,
      );
      const double = parsedHoles.reduce(
        (acc: number, hole: GameHoleType) =>
          hole.par + 2 === hole.shots?.length ? (acc += 1) : acc,
        0,
      );
      const triple = parsedHoles.reduce(
        (acc: number, hole: GameHoleType) =>
          hole.shots?.length >= hole.par + 3 ? (acc += 1) : acc,
        0,
      );
      return {
        eagles,
        birdies,
        pars,
        boggeys,
        double,
        triple,
      };
    }
    return {
      eagles: 0,
      birdies: 0,
      pars: 0,
      boggeys: 0,
      double: 0,
      triple: 0,
    };
  }, [holes]);

  return (
    <Flexbox
      flex='1'
      justifyContent='space-around'
      styling={{
        margin: '7px',
      }}>
      {Object.keys(stats).map((key) => (
        <Stat key={key}>
          <Tag scoreColor={(scoresConfig as any)[key]}>
            {(stats as any)[key]}
          </Tag>
          <span>{key}</span>
        </Stat>
      ))}
    </Flexbox>
  );
};
