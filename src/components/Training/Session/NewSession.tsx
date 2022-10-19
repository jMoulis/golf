import React, { useState } from 'react';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SwipeableDrawer } from '@mui/material';
import { FloatingButton } from '../../commons/Buttons/FloatingButton';
import { iOS } from '../../../utils/global.utils';
import { SwipeMenuHeader } from '../../commons/SwipeMenuHeader';
import { theme } from '../../../style/theme';
import { NewSessionForm } from './NewSessionForm';

export const NewSession = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <FloatingButton
        onClick={() => setOpen(true)}
        backgroundColor="#000"
        color="#fff"
      >
        <FontAwesomeIcon icon={faPlus} size="3x" />
      </FloatingButton>

      <SwipeableDrawer
        disableBackdropTransition={!iOS}
        disableDiscovery={iOS}
        PaperProps={{
          style: theme.swipeable.paper,
        }}
        anchor="bottom"
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
      >
        <SwipeMenuHeader title="Créer une session d'entraînement" />
        <NewSessionForm onClose={() => setOpen(false)} />
      </SwipeableDrawer>
    </>
  );
};
