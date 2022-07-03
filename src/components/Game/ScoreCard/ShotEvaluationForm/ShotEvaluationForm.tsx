import styled from '@emotion/styled';
import { faCheck } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SwipeableDrawer } from '@mui/material';
import { DocumentReference } from 'firebase/firestore';
import React from 'react';
import { ShotType } from '../../../../game';
import { theme } from '../../../../style/theme';
import { iOS } from '../../../../utils/global.utils';
import { Flexbox } from '../../../commons';
import { SwipeMenuHeader } from '../../../commons/SwipeMenuHeader';
import { GameHoleType, GameType } from '../../../types';
import { EvalShots } from '../ShotForm/EvalShots';
import { shotTypesByTypes } from '../ShotForm/shotTypes';

const DeleteButton = styled.button<{
  color?: string;
  backgroundColor?: string;
}>`
  flex: 1;
  border: none;
  font-size: 30px;
  margin: 0.25rem;
  color: ${({ color }) => color};
  border-radius: 5px;
  background-color: ${({ backgroundColor }) => backgroundColor || '#f8d7da'};
`;

type Props = {
  open: boolean;
  onClose: () => void;
  onOpen: () => void;
  onAddEvaluation: (value: 'OK' | 'KO', type: string) => void;
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
}: Props) => {
  return (
    <SwipeableDrawer
      disableBackdropTransition={!iOS}
      disableDiscovery={iOS}
      anchor='bottom'
      open={open}
      onClose={onClose}
      onOpen={onOpen}>
      <SwipeMenuHeader title={`Edit shot`} onClose={onClose}></SwipeMenuHeader>
      <Flexbox
        justifyContent='space-between'
        styling={{ padding: '5px', borderBottom: '1px solid gray' }}>
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
        selectedShot={selectedShot}
        game={game}
        gameRef={gameRef}
      />
      <Flexbox>
        <DeleteButton
          onClick={onClose}
          color={theme.colors.blue}
          backgroundColor={theme.colors.blueGreen}>
          <FontAwesomeIcon icon={faCheck} />
        </DeleteButton>
      </Flexbox>
    </SwipeableDrawer>
  );
};
