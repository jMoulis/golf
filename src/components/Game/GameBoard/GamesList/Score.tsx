import styled from '@emotion/styled';
import React, { useMemo } from 'react';
import { scoresByType, scoresConfig } from '../../../../utils/scoreUtils';
import { Flexbox } from '../../../commons';
import { GameHoleType } from '../../../types';

const Tag = styled.div<{ backgroundColor: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ backgroundColor }) => backgroundColor};
  font-size: 12px;
  border-radius: 3px;
  height: 20px;
  width: 20px;
  color: #fff;
  text-align: center;
  margin: 5px 2.5px;
`;

type Props = {
  holes?: GameHoleType[];
};

export const Score = ({ holes = [] }: Props) => {
  const scores: any = useMemo(() => {
    return scoresByType(holes);
  }, [holes]);

  return (
    <Flexbox>
      {Object.keys(scores).map((hole) => (
        <Tag backgroundColor={(scoresConfig as any)[hole]?.bk}>
          {scores[hole]}
        </Tag>
      ))}
    </Flexbox>
  );
};
