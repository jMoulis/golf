import { SwipeableDrawer } from '@mui/material';
import { DocumentReference } from 'firebase/firestore';
import React from 'react';
import { ShotType } from '../../../../game';
import { theme } from '../../../../style/theme';
import { iOS } from '../../../../utils/global.utils';
import { Flexbox } from '../../../commons';
import { ButtonPill } from '../../../commons/ButtonPill';
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
          backgroundColor: theme.colors.backgroundPage,
        },
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
      <Flexbox
        justifyContent='center'
        styling={{
          paddingTop: '10px',
          position: 'fixed',
          paddingBottom: '10px',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: '#fff',
        }}>
        <ButtonPill
          onClick={onClose}
          color='#fff'
          backgroundColor={theme.colors.saveButton}>
          <span>Enregistrer</span>
        </ButtonPill>
      </Flexbox>
    </SwipeableDrawer>
  );
};
