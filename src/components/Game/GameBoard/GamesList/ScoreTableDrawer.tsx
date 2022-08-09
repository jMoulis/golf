import { SwipeableDrawer } from '@mui/material';
import React from 'react';
import { theme } from '../../../../style/theme';
import { iOS } from '../../../../utils/global.utils';
import { SwipeMenuHeader } from '../../../commons/SwipeMenuHeader';
import { GameType } from '../../../types';
import { RenderHolesTable } from '../../ScoreCard/RenderHolesTables/RenderHolesTable';

type Props = {
  open: boolean;
  onClose: () => void;
  onOpen: () => void;
  game: GameType | null;
};

export const ScoreTableDrawer = ({ open, onOpen, onClose, game }: Props) => {
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
      <SwipeMenuHeader title="Résumé" />
      <RenderHolesTable
        game={game}
        holes={game?.holes ? Object.values(game.holes) : []}
      />
    </SwipeableDrawer>
  );
};
