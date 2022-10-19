import styled from '@emotion/styled';
import React, { useMemo } from 'react';
import { scoresByType, scoresConfig } from '../../../../utils/scoreUtils';
import { Flexbox } from '../../../commons';
import { GameHoleType } from '../../../types';

const Tag = styled.div<{ backgroundColor: string; styling?: any }>`
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
  ${({ styling }) => styling};
`;

type Props = {
  holes?: GameHoleType[];
  withLabel?: boolean;
  tagStyling?: any;
};

export const Score = ({ holes = [], withLabel, tagStyling }: Props) => {
  const scores: any = useMemo(() => {
    return scoresByType(holes);
  }, [holes]);

  return (
    <>
      {Object.keys(scores).map((hole, key) => (
        <Flexbox key={key} flexDirection="column" alignItems="center">
          <Tag
            styling={tagStyling}
            backgroundColor={(scoresConfig as any)[hole]?.bk}
          >
            {scores[hole]}
          </Tag>
          {withLabel ? <span>{hole}</span> : null}
        </Flexbox>
      ))}
    </>
  );
};
