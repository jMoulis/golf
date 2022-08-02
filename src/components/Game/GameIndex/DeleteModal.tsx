import React, { useRef } from 'react';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Flexbox } from '../../commons';
import { ButtonPill } from '../../commons/ButtonPill';
import { DeleteButton } from '../../commons/DeleteButton';
import { Modal } from '../../commons/Modal';
import styled from '@emotion/styled';
import { theme } from '../../../style/theme';
import { GameType } from '../../types';

const Footer = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  box-shadow: ${theme.shadows.listItem};
  justify-content: flex-end;
`;

const Text = styled.p`
  font-size: 20px;
  padding: 10px;
`;

type Props = {
  deletedGame: GameType | null;
  onClose: () => void;
  onDeleteGame: () => void;
};

export const DeleteModal = ({ deletedGame, onClose, onDeleteGame }: Props) => {
  const dateFormat = useRef<Intl.DateTimeFormat>(new Intl.DateTimeFormat());
  return (
    <Modal
      title="Supprimer une partie"
      onClose={onClose}
      isOpen={Boolean(deletedGame)}
    >
      <Flexbox flexDirection="column">
        <Text>
          {`Souhaites-tu supprimer la partie à ${deletedGame?.courseRef}
            du
            ${
              deletedGame ? dateFormat.current.format(deletedGame.date) : null
            }`}
        </Text>
        <Footer>
          <ButtonPill type="button" onClick={onDeleteGame}>
            Supprimer
          </ButtonPill>
          <DeleteButton type="button" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </DeleteButton>
        </Footer>
      </Flexbox>
    </Modal>
  );
};
