import { SwipeableDrawer } from '@mui/material';
import { DocumentReference } from 'firebase/firestore';
import React from 'react';
import { ShotType } from '../../../game';
import { theme } from '../../../style/theme';
import { iOS } from '../../../utils/global.utils';
import { ShotForm } from '../../Game/ScoreCard/ShotForm/ShotForm';
import { GameHoleType, GameType } from '../../types';
import { SwipeMenuHeader } from '../SwipeMenuHeader';

type Props = {
  open: boolean;
  onClose: () => void;
  onOpen: () => void;
  gameRef: DocumentReference | null;
  onAddShot?: (shot: ShotType, hole: GameHoleType) => void;
  onEditShot?: (shot: ShotType) => void;
  hole: GameHoleType | null;
  game: GameType;
  withEvaluationForm: boolean;
};

export const SwipeShotForm = ({
  open,
  onClose,
  onOpen,
  gameRef,
  hole,
  onAddShot,
  onEditShot,
  game,
  withEvaluationForm,
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
      <SwipeMenuHeader title='Edit shot type' />
      <ShotForm
        gameRef={gameRef}
        onAddShot={onAddShot}
        onEditShot={onEditShot}
        hole={hole}
        onCloseDrawerParent={onClose}
        game={game}
        withEvaluationForm={withEvaluationForm}
      />
    </SwipeableDrawer>
  );
};
