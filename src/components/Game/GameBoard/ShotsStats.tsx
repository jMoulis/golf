import styled from '@emotion/styled';
import React, { useMemo } from 'react';
import { Flexbox } from '../../commons';
import { GameHoleType } from '../../types';
import { shotTypesByTypes } from '../ScoreCard/ShotForm/shotTypes';
import { Stat, Tag } from './stylesComponents';

const CustomTag = styled(Tag)`
  font-size: 20px;
`;
type Props = {
  holes?: Record<string, GameHoleType>;
};

export const ShotsStats = ({ holes }: Props) => {
  const totalScore = useMemo(() => {
    // Green regul if (par && two putt)

    if (!holes)
      return {
        par: 0,
        score: 0,
        diff: 0,
      };
    const parsedHoles = Object.values(holes);

    const regul = parsedHoles.reduce((acc: number, value) => {
      if (
        value.par === value.shots?.length &&
        value.shots?.filter((shot) => shot.type === 'putt')?.length === 2
      ) {
        return (acc += 1);
      }
      return acc;
    }, 0);

    const fairway = parsedHoles.reduce((acc: number, value) => {
      if (!value.shots) return acc;
      const [shot, nextShot] = value.shots;
      if (shot?.type === 'tee' && nextShot?.type === 'fairway')
        return (acc += 1);
      return acc;
    }, 0);

    const putt: any = parsedHoles.reduce((acc: number, hole) => {
      return (
        acc + (hole.shots?.filter((shot) => shot.type === 'putt').length || 0)
      );
    }, 0);
    const bunker: any = parsedHoles.reduce((acc: number, hole) => {
      return (
        acc + (hole.shots?.filter((shot) => shot.type === 'bunker').length || 0)
      );
    }, 0);
    const penalty: any = parsedHoles.reduce((acc: number, hole) => {
      return (
        acc +
        (hole.shots?.filter((shot) => shot.type === 'penalty').length || 0)
      );
    }, 0);

    return {
      regul,
      fairway,
      putt,
      bunker,
      penalty,
    };
  }, [holes]);
  return (
    <Flexbox
      styling={{
        marginBottom: '7px',
        marginLeft: '10px',
      }}>
      {Object.keys(totalScore).map((key) => (
        <Stat key={key}>
          <CustomTag
            scoreColor={{
              bk: '',
              color: shotTypesByTypes[key]?.color,
            }}>
            {shotTypesByTypes[key]?.icon}
          </CustomTag>
          <span>{(totalScore as any)[key]}</span>
        </Stat>
      ))}
    </Flexbox>
  );
};
