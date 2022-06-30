import styled from '@emotion/styled';
import { DocumentReference } from 'firebase/firestore';
import React, { useMemo } from 'react';
import { theme } from '../../../style/theme';
import { scoreResult } from '../../../utils/scoreUtils';
import { Flexbox } from '../../commons';
import { GameHoleType } from '../../types';
import { Shots } from './ShotForm/Shots';

const ListItem = styled.div<{ selected: boolean }>`
  display: grid;
  grid-template-columns: 3.5rem 1fr;
  align-items: center;
  border: 1px solid ${({ selected }) => (selected ? '#e2e1e0' : 'transparent')};
  background-color: ${({ selected }) => (selected ? '#e2e1e0' : 'transparent')};
  padding: 0.25rem;
  margin: 0 0.25rem;
  border-radius: 5px;
`;

const HoleHeader = styled.div`
  display: flex;
  align-items: center;
`;

const Tag = styled.div<{ scoreColor?: { bk: string; color: string } }>`
  background-color: ${({ scoreColor }) => scoreColor?.bk};
  color: ${({ scoreColor }) => scoreColor?.color};
  border-radius: 3px;
  font-size: 12px;
  height: 20px;
  width: 20px;
  margin-left: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Footer = styled.footer`
  display: flex;
  justify-content: space-around;
  background-color: ${theme.colors.blueGreen};
  padding: 0.5rem;
  margin: 0.25rem;
  border-radius: 3px;
`;

type Props = {
  holes: GameHoleType[];
  selectedHole?: GameHoleType;
  onSelectHole: (hole: GameHoleType) => void;
  gameRef: DocumentReference | null;
};

export const RenderHoles = ({
  holes,
  selectedHole,
  onSelectHole,
  gameRef,
}: Props) => {
  const totalScore = useMemo(() => {
    const score: any = holes.reduce(
      (acc: any, hole: any) => acc + (hole.shots?.length || 0),
      0,
    );
    const par: any = holes.reduce(
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
    <li>
      {holes.map((hole) => (
        <ListItem selected={hole.ref === selectedHole?.ref} key={hole.ref}>
          <HoleHeader onClick={() => onSelectHole(hole)}>
            <Flexbox flexDirection='column'>
              <Flexbox>
                <span
                  style={{
                    fontWeight: 'bold',
                    fontSize: '20px',
                    display: 'inline-block',
                    marginRight: '5px',
                  }}>
                  {hole.number}
                </span>
                <Tag
                  scoreColor={scoreResult(hole.par, hole.shots?.length || 0)}>
                  {hole.shots?.length || 0}
                </Tag>
              </Flexbox>
              <span style={{ fontSize: '13px', color: 'gray' }}>
                Par {hole.par}
              </span>
            </Flexbox>
          </HoleHeader>
          <Shots
            shots={hole.shots || []}
            hole={hole || null}
            gameRef={gameRef}
          />
        </ListItem>
      ))}
      <Footer>
        <span>PAR: {totalScore.par}</span>
        <span>BRUT: {totalScore.score}</span>
        <span>DIFF: {totalScore.diff}</span>
      </Footer>
    </li>
  );
};
