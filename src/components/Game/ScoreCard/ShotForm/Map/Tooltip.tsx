import styled from '@emotion/styled';
import { ShotType } from 'components/types';
import React, { useMemo } from 'react';
import { scoreResult } from 'utils/scoreUtils';

const Root = styled.div`
  margin-top: 10px;
`;
const Item = styled.span`
  display: block;
  line-height: 15px;
`;
const Distance = styled.span`
  font-weight: bold;
  font-size: 15px;
`;

const Score = styled.div<{ color: string; backgroundColor: string }>`
  background-color: ${({ backgroundColor }) => backgroundColor};
  color: ${({ color }) => color};
  padding: 3px 5px;
  border-radius: 3px;
`;

type Props = {
  selectedShot: ShotType;
  sourceShot?: ShotType;
  isLast: boolean;
  isFirst: boolean;
  turfDistance: string;
  shots: number;
  par: number;
};

export const Tooltip = ({
  selectedShot,
  turfDistance,
  sourceShot,
  isLast,
  isFirst,
  shots,
  par,
}: Props) => {
  const getFinalScore: any = useMemo(() => {
    const score = scoreResult(par, shots);
    return score;
  }, [par, shots]);

  const renderFirstShot = useMemo(() => {
    return (
      <>
        <Item>Départ</Item>
        <Item>{selectedShot?.club?.name}</Item>
      </>
    );
  }, [selectedShot?.club?.name]);

  const renderLastShot = useMemo(() => {
    return (
      <>
        <Item>Dans la boîte</Item>
        <Score backgroundColor={getFinalScore.bk} color={getFinalScore.color}>
          {getFinalScore.label}
        </Score>
      </>
    );
  }, [getFinalScore.bk, getFinalScore.color, getFinalScore.label]);

  const renderShot = useMemo(() => {
    return (
      <>
        <Item>Distance parcourue avec le {sourceShot?.club?.name}</Item>
        <Distance>{`${parseFloat(turfDistance).toFixed(0)}m`}</Distance>
        {isLast ? (
          renderLastShot
        ) : (
          <>
            <Item>Club joué à partir de ce point</Item>
            <Item>{selectedShot?.club?.name}</Item>
          </>
        )}
      </>
    );
  }, [
    isLast,
    renderLastShot,
    selectedShot?.club?.name,
    sourceShot?.club?.name,
    turfDistance,
  ]);

  if (!selectedShot?.id) return null;

  return (
    <Root id={`tooltip-${selectedShot.id}`}>
      <>
        {isFirst ? renderFirstShot : null}
        {!isFirst ? renderShot : null}
      </>
    </Root>
  );
};
