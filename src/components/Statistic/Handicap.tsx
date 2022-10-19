import styled from '@emotion/styled';
import { Flexbox } from 'components/commons';
import { UserStatType } from 'components/types';
import React, { useMemo } from 'react';

const Card = styled.div`
  display: flex;
  flex-direction: column;
  /* width: 50px; */
  height: 50px;
  background-color: rgba(255, 255, 255, 0.5);
  padding: 10px;
  margin: 10px;
  border-radius: 3px;
`;

const Title = styled.span`
  font-size: 13px;
`;

const HCP = styled.span`
  font-size: 13px;
`;

type Props = {
  userStats?: UserStatType[];
};

export const Handicap = ({ userStats }: Props) => {
  const handicapIndexes = useMemo(() => {
    const indexHoles = (userStats || []).reduce(
      (
        acc: {
          '18': { score: number; count: number; index: number };
          '9': { score: number; count: number; index: number };
        },
        stat
      ) => {
        const statKey = String(stat.type);
        if (!(acc as any)[statKey]) {
          return {
            ...acc,
            [statKey]: { score: stat.score, count: 1, index: 0 },
          };
        }
        return {
          ...acc,
          [statKey]: {
            score: (acc as any)[statKey].score + stat.score,
            count: (acc as any)[statKey].count + 1,
            index:
              ((acc as any)[statKey].score + stat.score) /
              ((acc as any)[statKey].count + 1),
          },
        };
      },
      {
        '9': {
          score: 0,
          count: 0,
          index: 0,
        },
        '18': {
          score: 0,
          count: 0,
          index: 0,
        },
      }
    );
    const nines = Object.keys(indexHoles)
      .filter((key) => key === '9')
      .reduce(
        (_acc, key) =>
          typeof Math.trunc((indexHoles as any)[key].index) === 'number'
            ? Math.trunc((indexHoles as any)[key].index - 36)
            : 0,
        0
      );
    const eighteens = Object.keys(indexHoles)
      .filter((key) => key === '18')
      .reduce(
        (_acc, key) =>
          typeof Math.trunc((indexHoles as any)[key].index) === 'number'
            ? Math.trunc((indexHoles as any)[key].index - 72)
            : 0,
        0
      );
    const average = (nines + eighteens) / 2;
    return {
      '9': nines,
      '18': eighteens,
      all: average,
    };
  }, [userStats]);

  return (
    <div>
      <Title>Average handicap</Title>
      <Flexbox>
        {Object.keys(handicapIndexes).map((key, index) => {
          const handicapIndex = (handicapIndexes as any)[key];
          return (
            <Card key={index}>
              <Flexbox>
                <HCP>{key} trous</HCP>
              </Flexbox>
              <HCP>{handicapIndex}</HCP>
            </Card>
          );
        })}
      </Flexbox>
    </div>
  );
};
