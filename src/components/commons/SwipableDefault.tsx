import { SwipeableDrawer } from '@mui/material';
import React from 'react';
import { theme } from '../../style/theme';
import { iOS } from '../../utils/global.utils';
import { SwipeMenuHeader } from './SwipeMenuHeader';

type Props = {
  children: React.ReactNode;
  open: boolean;
  onClose: () => void;
  onOpen: () => void;
  title: string;
};

export const SwipableDefault = ({
  children,
  open,
  onClose,
  onOpen,
  title,
}: Props) => {
  return (
    <SwipeableDrawer
      disableBackdropTransition={!iOS}
      disableDiscovery={iOS}
      PaperProps={{
        style: theme.swipeable.paper,
      }}
      anchor="bottom"
      open={open}
      onClose={onClose}
      onOpen={onOpen}
    >
      <SwipeMenuHeader title={title} />
      {children}
      {/* <FixedBottomToolbar>
        <ButtonPill
          onSubmit={(event) => {
            event.stopPropagation();
            console.log('click');
          }}
        >
          ENREGISTRER
        </ButtonPill>
      </FixedBottomToolbar> */}
    </SwipeableDrawer>
  );
};
