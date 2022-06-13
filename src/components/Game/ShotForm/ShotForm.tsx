import styled from '@emotion/styled';
import React from 'react';
import { HoleType, ShotType } from '../../../game';
import { shotTypes } from './shotTypes';

const Root = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(70px, 1fr));
  flex: 1;
  flex-wrap: wrap;
  grid-gap: 5px;
`;

const ShotButton = styled.button<{
  color?: string;
  gridColumn: {
    start: string;
    end: string;
  };
}>`
  border: none;
  font-size: 50px;
  color: ${({ color }) => color};
  border-radius: 5px;
  grid-column-start: ${({ gridColumn }) => gridColumn.start};
  grid-column-end: ${({ gridColumn }) => gridColumn.end};
`;

type Props = {
  hole: HoleType | null;
  onAddShot: (shot: any, hole: any) => void;
  shots: any[];
};

export const ShotForm = ({ hole, onAddShot }: Props) => {
  const handleAddShot = (incomingShot: ShotType, hole: any) => {
    if (hole) {
      onAddShot(incomingShot, hole);
    }
  };
  if (!hole) return null;

  return (
    <Root>
      {shotTypes.map((shot, key) => (
        <ShotButton
          type='button'
          key={key}
          onClick={() => handleAddShot({ type: shot.type }, hole)}
          color={shot?.color}
          gridColumn={{
            start: shot.gridColumnStart,
            end: shot.gridColumnEnd,
          }}>
          {shot?.icon}
        </ShotButton>
      ))}
    </Root>
  );
};
