import styled from '@emotion/styled';
import { theme } from '../../style/theme';
import { Button, Flexbox } from '../commons';
import { PageHeader } from '../commons/Core/PageHeader';
import { Modal } from '../commons/Modal';
import { GamesList } from './GameBoard/GamesList';
import { useGames } from './useGames';

const HeaderTitle = styled.span`
  text-transform: uppercase;
`;

export const GameIndex = () => {
  const { games, onDeleteGame, selectDeleteGame, deletedGame } = useGames();
  return (
    <>
      <PageHeader backgroundColor={theme.headers.games.linear}>
        <Flexbox flex='1' flexDirection='column'>
          <Flexbox justifyContent='center'>
            <HeaderTitle>Games</HeaderTitle>
          </Flexbox>
          <span>Total parties jouées: {games?.length}</span>
        </Flexbox>
      </PageHeader>
      <GamesList onDeleteGame={selectDeleteGame} games={games} />
      <Modal
        onClose={() => selectDeleteGame(null)}
        isOpen={Boolean(deletedGame)}>
        <Button type='button' onClick={onDeleteGame}>
          Delete
        </Button>
      </Modal>
    </>
  );
};
