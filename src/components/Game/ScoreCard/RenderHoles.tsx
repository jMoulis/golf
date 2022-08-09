import styled from '@emotion/styled';
import { DocumentReference } from 'firebase/firestore';
import React from 'react';
import { theme } from '../../../style/theme';
import { scoreResult } from '../../../utils/scoreUtils';
import { Flexbox } from '../../commons';
import { HoleCourseType, GameHoleType, GameType } from '../../types';
import { Shots } from './ShotForm/Shots';

const ListItem = styled.div<{ selected: boolean }>`
  display: grid;
  grid-template-columns: 3.5rem 1fr;
  align-items: center;
  border: 1px solid ${({ selected }) => (selected ? '#e2e1e0' : 'transparent')};
  background-color: ${({ selected }) => (selected ? '#e2e1e0' : '#fff')};
  padding: 0.25rem;
  margin: 10px;
  border-radius: ${theme.radius.listItem};
  box-shadow: ${theme.shadows.listItem};
  min-height: 70px;
`;

const DistanceTag = styled.div<{ color: string }>`
  font-size: 13px;
  color: ${({ color }) => color === 'black' && '#fff'};
  letter-spacing: 2px;
  background-color: ${({ color }) => color};
  padding: 3px;
  border-radius: 3px;
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
  box-shadow: ${theme.shadows.flatButton};
`;

type Props = {
  holes: GameHoleType[];
  selectedHole?: GameHoleType | null;
  onSelectHole: (hole: GameHoleType) => void;
  gameRef: DocumentReference | null;
  onOpenForm: (event: React.KeyboardEvent | React.MouseEvent) => void;
  game: GameType;
  courseHoles?: Record<string, HoleCourseType>;
};

export const RenderHoles = ({
  holes,
  selectedHole,
  onSelectHole,
  gameRef,
  onOpenForm,
  game,
  courseHoles,
}: Props) => {
  return (
    <li>
      {holes.map((hole) => (
        <ListItem selected={hole.ref === selectedHole?.ref} key={hole.ref}>
          <HoleHeader onClick={() => onSelectHole(hole)}>
            <Flexbox flexDirection="column">
              <Flexbox alignItems="center">
                <span
                  style={{
                    fontWeight: 'bold',
                    fontSize: '20px',
                    display: 'inline-block',
                    marginRight: '5px',
                  }}
                >
                  {hole.number}
                </span>
                <Tag
                  scoreColor={scoreResult(hole.par, hole.shots?.length || 0)}
                >
                  {hole.shots?.length || 0}
                </Tag>
              </Flexbox>
              <span
                style={{
                  fontSize: '13px',
                  color: 'gray',
                  letterSpacing: '2px',
                }}
              >
                Par {hole.par}
              </span>
              <DistanceTag color={game.start}>
                {`${courseHoles?.[hole.ref]?.distances?.[game.start]}m`}
              </DistanceTag>
            </Flexbox>
          </HoleHeader>
          <Shots
            shots={hole.shots || []}
            hole={hole || null}
            gameRef={gameRef}
            onOpenForm={onOpenForm}
            selectedHole={selectedHole?.ref === hole.ref}
            game={game}
          />
        </ListItem>
      ))}
    </li>
  );
};
