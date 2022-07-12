import styled from '@emotion/styled';
import { SwipeableDrawer } from '@mui/material';
import { DocumentReference } from 'firebase/firestore';
import React from 'react';
import { ShotType } from '../../../../game';
import { theme } from '../../../../style/theme';
import { iOS } from '../../../../utils/global.utils';
import { Flexbox } from '../../../commons';
import { SwipeMenuHeader } from '../../../commons/SwipeMenuHeader';
import { GameHoleType, GameType, ThemeType } from '../../../types';
import { EvalShots } from '../ShotForm/EvalShots';
import { shotTypesByTypes } from '../ShotForm/shotTypes';

const DeleteButton = styled.button<{
  color?: string;
  backgroundColor?: string;
}>`
  padding: 10px 30px;
  box-shadow: ${theme.shadows.button};
  font-size: 20px;
  text-transform: uppercase;
  border: none;
  margin: 0.25rem;
  color: ${({ color }) => color};
  border-radius: 30px;
  background-color: ${({ backgroundColor }) => backgroundColor || '#f8d7da'};
`;

type Props = {
  open: boolean;
  onClose: () => void;
  onOpen: () => void;
  onAddEvaluation: (value: 'OK' | 'KO', type: string) => void;
  onRemoveEvaluation: (theme: ThemeType) => void;
  selectedShot: ShotType | null;
  children?: React.ReactNode;
  hole: GameHoleType | null;
  game: GameType;
  gameRef: DocumentReference | null;
};

export const ShotEvaluationForm = ({
  open,
  onClose,
  onOpen,
  onAddEvaluation,
  selectedShot,
  hole,
  children,
  game,
  gameRef,
  onRemoveEvaluation,
}: Props) => {
  return (
    <SwipeableDrawer
      disableBackdropTransition={!iOS}
      disableDiscovery={iOS}
      anchor='bottom'
      open={open}
      onClose={onClose}
      PaperProps={{
        style: {
          borderRadius: '10px 10px 0 0',
          height: '90vh',
        },
      }}
      onOpen={onOpen}>
      <SwipeMenuHeader title={`Edit shot`}></SwipeMenuHeader>
      <Flexbox
        justifyContent='space-between'
        styling={{
          padding: '5px',
          borderBottom: `1px solid ${theme.colors.separator}`,
        }}>
        <Flexbox flexDirection='column'>
          <span>{`Hole: ${hole?.number}`}</span>
          {selectedShot ? (
            <Flexbox>
              <span>Type:</span>
              <span
                style={{
                  color: shotTypesByTypes[selectedShot?.type]?.color,
                  marginLeft: '5px',
                  fontSize: '20px',
                }}>
                {shotTypesByTypes[selectedShot?.type]?.icon}
              </span>
            </Flexbox>
          ) : null}
        </Flexbox>
        {children}
      </Flexbox>
      <EvalShots
        onAddEvaluation={onAddEvaluation}
        onRemoveEvaluation={onRemoveEvaluation}
        selectedShot={selectedShot}
        game={game}
        gameRef={gameRef}
        hole={hole}
      />
      <Flexbox
        justifyContent='center'
        styling={{
          paddingTop: '10px',
          position: 'fixed',
          paddingBottom: '10px',
          bottom: 0,
          left: 0,
          right: 0,
        }}>
        <DeleteButton
          onClick={onClose}
          color='#fff'
          backgroundColor={theme.colors.saveButton}>
          <span>Enregistrer</span>
        </DeleteButton>
      </Flexbox>
    </SwipeableDrawer>
  );
};
