import styled from '@emotion/styled';
import React, { useMemo } from 'react';
import { Flexbox } from '../../commons';
import { GameHoleType } from '../../types';

const Stat = styled.span`
  margin-right: 10px;
  font-size: 12px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;

type Props = {
  holes?: Record<string, GameHoleType>;
};

export const CourseStats = ({ holes }: Props) => {
  const totalScore = useMemo(() => {
    if (!holes)
      return {
        par: 0,
        score: 0,
        diff: 0,
      };
    const parsedHoles = Object.values(holes);
    const score: any = parsedHoles.reduce(
      (acc: any, hole: any) => acc + (hole.shots?.length || 0),
      0,
    );
    const par: any = parsedHoles.reduce(
      (acc: any, hole: any) => acc + (hole.par || 0),
      0,
    );
    return {
      score,
      par,
      diff: score - par,
    };
  }, [holes]);

  return (
    <Flexbox>
      <Stat>PAR: {totalScore.par}</Stat>
      <Stat>BRUT: {totalScore.score}</Stat>
      <Stat>DIFF: {totalScore.diff}</Stat>
    </Flexbox>
  );
};
