import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { Dialog } from '@mui/material';
import React from 'react';
import { theme } from '../../../style/theme';
import { ButtonPill } from '../Buttons/ButtonPill';
import { DeleteButton } from '../Buttons/DeleteButton';
import { DialogHeader } from '../Dialog/DialogHeader';
import { Flexbox } from '../Flexbox';

type Props = {
  open: boolean;
  onReset: () => void;
  onResume: () => void;
};

export const DialogConfirmation = ({ open, onReset, onResume }: Props) => {
  return (
    <Dialog open={open}>
      <DialogHeader title="Confirmation" onClose={onReset} />
      <p>Un fichier est en cours de téléchargement</p>
      <p>Souhaites-tu annuler le téléchargement</p>
      <Flexbox alignItems="center">
        <ButtonPill
          style={{
            flex: 1,
            backgroundColor: theme.colors.deleteButton,
          }}
          onClick={onReset}
        >
          CONFIRMER
        </ButtonPill>
        <DeleteButton onClick={onResume} icon={faPlay} />
      </Flexbox>
    </Dialog>
  );
};
