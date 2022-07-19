import styled from '@emotion/styled';
import React, { useMemo } from 'react';
import { sortHoles } from '../../Admin/Course/utils';
import { Flexbox } from '../../commons';
import { GameHoleType } from '../../types';

const Root = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  padding: 10px;
`;

const BoldLabel = styled.span<{ backgroundColor?: string }>`
  font-weight: bold;
`;
const Label = styled.span`
  white-space: nowrap;
  font-weight: bold;
`;

type Props = {
  holes: GameHoleType[];
};

export const RenderTotal = ({ holes }: Props) => {
  const sortedHoles = useMemo(() => {
    return sortHoles(holes);
  }, [holes]);

  const frontNine = useMemo(() => {
    return sortedHoles.slice(0, 9);
  }, [sortedHoles]);

  const backNine = useMemo(() => {
    return sortedHoles.slice(9, 18);
  }, [sortedHoles]);

  return (
    <Root>
      <Flexbox flexDirection='column'>
        <span style={{ fontWeight: 'bold' }}>SCORE</span>
        <span>PAR</span>
        <span style={{ fontWeight: 'bold' }}>BRUT</span>
      </Flexbox>
      <Flexbox flexDirection='column' alignItems='center'>
        <Label>Aller</Label>
        <div>{frontNine.reduce((acc, hole) => acc + hole.par, 0)}</div>
        <BoldLabel>
          {frontNine.reduce(
            (acc, hole: any) => acc + (hole.shots?.length || 0),
            0,
          ) || '-'}
        </BoldLabel>
      </Flexbox>
      <Flexbox flexDirection='column' alignItems='center'>
        <Label>Retour</Label>
        <div>{backNine.reduce((acc, hole) => acc + hole.par, 0)}</div>
        <BoldLabel>
          {backNine.reduce(
            (acc, hole: any) => acc + (hole.shots?.length || 0),
            0,
          ) || '-'}
        </BoldLabel>
      </Flexbox>
      <Flexbox flexDirection='column' alignItems='center'>
        <Label
          style={{
            whiteSpace: 'nowrap',
          }}>
          Aller / Retour
        </Label>
        <div>{sortedHoles.reduce((acc, hole) => acc + hole.par, 0)}</div>
        <BoldLabel>
          {sortedHoles.reduce(
            (acc, hole: any) => acc + (hole.shots?.length || 0),
            0,
          ) || '-'}
        </BoldLabel>
      </Flexbox>
    </Root>
  );
};
