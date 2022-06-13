import styled from '@emotion/styled';
import React from 'react';
import { theme } from '../../../style/theme';
import { shotTypesByTypes } from './shotTypes';

const Root = styled.ul`
  flex: 1;
  min-height: 5rem;
  background-color: lightgray;
  margin: 0.5rem;
  border-radius: 3px;
`;

const ShotButton = styled.button<{
  color?: string;
  gridColumn?: {
    start: string;
    end: string;
  };
}>`
  border: none;
  font-size: 30px;
  margin: 0.25rem;
  color: ${({ color }) => color};
  border-radius: 5px;
  grid-column-start: ${({ gridColumn }) => gridColumn?.start};
  grid-column-end: ${({ gridColumn }) => gridColumn?.end};
`;

type Props = {
  shots: any[];
  onShotDelete: (shotID: string) => void;
};

export const Shots = ({ shots, onShotDelete }: Props) => {
  return (
    <Root>
      {shots?.length ? (
        shots?.map((shot, key) => {
          const typedShot = (shotTypesByTypes as any)[shot.type];
          return (
            <ShotButton
              color={typedShot?.color}
              key={key}
              onClick={() => onShotDelete(shot.id)}>
              {typedShot?.icon}
            </ShotButton>
          );
        })
      ) : (
        <span>No shot</span>
      )}
    </Root>
  );
};
