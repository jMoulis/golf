import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SwipeableDrawer } from '@mui/material';
import { DocumentReference } from 'firebase/firestore';
import React from 'react';
import { ShotType } from '../../../../game';
import { theme } from '../../../../style/theme';
import { iOS } from '../../../../utils/global.utils';
import { Flexbox } from '../../../commons';
import { ButtonPill } from '../../../commons/ButtonPill';
import { DeleteButton } from '../../../commons/DeleteButton';
import { FixedBottomToolbar } from '../../../commons/FixedBottomToolbar';
import { List, ListItem } from '../../../commons/List';
import { SwipeMenuHeader } from '../../../commons/SwipeMenuHeader';
import { GameHoleType, GameType, ThemeType } from '../../../types';
import { EvalShots } from '../ShotForm/EvalShots';
import { shotTypesByTypes } from '../ShotForm/shotTypes';

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
  onDeleteShot?: () => void;
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
  onDeleteShot,
}: Props) => {
  return (
    <SwipeableDrawer
      disableBackdropTransition={!iOS}
      disableDiscovery={iOS}
      anchor='bottom'
      open={open}
      onClose={onClose}
      PaperProps={{
        style: theme.swipeable.paper,
      }}
      onOpen={onOpen}>
      <SwipeMenuHeader title={`Edit shot`}></SwipeMenuHeader>
      <List
        style={{
          padding: '5px',
          borderBottom: `1px solid ${theme.colors.separator}`,
          backgroundColor: '#fff',
          flex: 'unset',
        }}>
        <ListItem
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            margin: '5px',
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
        </ListItem>
      </List>
      <EvalShots
        onAddEvaluation={onAddEvaluation}
        onRemoveEvaluation={onRemoveEvaluation}
        selectedShot={selectedShot}
        game={game}
        gameRef={gameRef}
        hole={hole}
      />
      <FixedBottomToolbar>
        <ButtonPill
          onClick={onClose}
          color='#fff'
          backgroundColor={theme.colors.saveButton}>
          <span>Enregistrer</span>
        </ButtonPill>
        {onDeleteShot ? (
          <DeleteButton onClick={onDeleteShot}>
            <FontAwesomeIcon icon={faTrash} />
          </DeleteButton>
        ) : null}
      </FixedBottomToolbar>
    </SwipeableDrawer>
  );
};
