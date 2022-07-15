import styled from '@emotion/styled';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRef } from 'react';
import { theme } from '../../../style/theme';
import { Flexbox } from '../../commons';
import { ButtonPill } from '../../commons/ButtonPill';
import { DeleteButton } from '../../commons/DeleteButton';
import { Modal } from '../../commons/Modal';
import { GamesList } from '../GameBoard/GamesList';
import { useGames } from '../useGames';
import { GameIndexHeader } from './GameIndexHeader';

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
export const GameIndex = () => {
  const { games, onDeleteGame, selectDeleteGame, deletedGame } = useGames();
  const dateFormat = useRef<Intl.DateTimeFormat>(new Intl.DateTimeFormat());
  return (
    <>
      <GameIndexHeader />
      <GamesList onDeleteGame={selectDeleteGame} games={games} />
      <Modal
        title='Supprimer une partie'
        onClose={() => selectDeleteGame(null)}
        isOpen={Boolean(deletedGame)}>
        <Flexbox flexDirection='column'>
          <Text>
            {`Souhaites-tu supprimer la partie à ${deletedGame?.courseRef}
            du
            ${
              deletedGame ? dateFormat.current.format(deletedGame.date) : null
            }`}
          </Text>
          <Footer>
            <ButtonPill type='button' onClick={onDeleteGame}>
              Supprimer
            </ButtonPill>
            <DeleteButton type='button' onClick={() => selectDeleteGame(null)}>
              <FontAwesomeIcon icon={faTimes} />
            </DeleteButton>
          </Footer>
        </Flexbox>
      </Modal>
    </>
  );
};
