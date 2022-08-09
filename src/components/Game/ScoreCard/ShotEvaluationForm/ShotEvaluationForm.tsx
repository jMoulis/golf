import { SwipeableDrawer } from '@mui/material';
import { DocumentReference } from 'firebase/firestore';
import React from 'react';
import { theme } from '../../../../style/theme';
import { iOS } from '../../../../utils/global.utils';
import { ButtonPill } from '../../../commons/Buttons/ButtonPill';
import { DeleteButton } from '../../../commons/Buttons/DeleteButton';
import { FixedBottomToolbar } from '../../../commons/FixedBottomToolbar';
import { List } from '../../../commons/List';
import { SwipeMenuHeader } from '../../../commons/SwipeMenuHeader';
import { GameHoleType, GameType, ThemeType, ShotType } from '../../../types';
import { EvalShots } from '../ShotForm/EvalShots';
import { ShotEvaluationFormItem } from './ShotEvaluationFormItem';

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
  onEditShot?: (shotType: ShotType) => void;
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
  onEditShot,
}: Props) => {
  return (
    <SwipeableDrawer
      disableBackdropTransition={!iOS}
      disableDiscovery={iOS}
      anchor="bottom"
      open={open}
      onClose={onClose}
      PaperProps={{
        style: theme.swipeable.paper,
      }}
      onOpen={onOpen}
    >
      <SwipeMenuHeader title={`Modifier le shot`}></SwipeMenuHeader>
      <List
        style={{
          padding: '5px',
          borderBottom: `1px solid ${theme.colors.separator}`,
          backgroundColor: '#fff',
          flex: 'unset',
        }}
      >
        <ShotEvaluationFormItem
          hole={hole}
          selectedShot={selectedShot}
          game={game}
          gameRef={gameRef}
          onEditShot={onEditShot}
        >
          {children}
        </ShotEvaluationFormItem>
      </List>
      <EvalShots
        onAddEvaluation={onAddEvaluation}
        onRemoveEvaluation={onRemoveEvaluation}
        selectedShot={selectedShot}
        game={game}
        gameRef={gameRef}
      />
      <FixedBottomToolbar>
        <ButtonPill
          onClick={onClose}
          color="#fff"
          backgroundColor={theme.colors.saveButton}
        >
          <span>Enregistrer</span>
        </ButtonPill>
        {onDeleteShot ? <DeleteButton onClick={onDeleteShot} /> : null}
      </FixedBottomToolbar>
    </SwipeableDrawer>
  );
};
