import styled from '@emotion/styled';
import React, { useMemo } from 'react';
import { shotsTypeStat } from '../../../../utils/scoreUtils';
import { Flexbox } from '../../../commons';
import { GameHoleType } from '../../../types';
import { shotTypesByTypes } from '../ShotForm/shotTypes';

const Root = styled(Flexbox)`
  margin: 5px 0;
`;
const ShotWrapper = styled(Flexbox)<{ color: string }>`
  background-color: ${({ color }) => color};
  padding: 5px;
  border-radius: 5px;
  color: #fff;
  div {
    color: #fff;
  }
`;
const ShotType = styled.div`
  margin-right: 5px;
`;

type Props = {
  holes: GameHoleType[];
};

export const ShotTypes = ({ holes }: Props) => {
  const shotStats: {
    [key: string]: any;
  } = useMemo(() => {
    const shots = shotsTypeStat(holes as GameHoleType[]);
    return shots;
  }, [holes]);

  return (
    <Root justifyContent="space-around">
      {Object.keys(shotStats).map((key, index) => {
        const value = shotStats[key];
        return (
          <ShotWrapper key={index} color={shotTypesByTypes[key].color}>
            <ShotType>{key}</ShotType>
            {value}
          </ShotWrapper>
        );
      })}
    </Root>
  );
};
