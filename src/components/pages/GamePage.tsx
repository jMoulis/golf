import styled from '@emotion/styled';
import { Button, Flexbox } from '../commons';
import { PageHeader } from '../commons/Core/PageHeader';
import { Modal } from '../commons/Modal';
import { TabNavigation } from '../commons/TabNavigation/TabNavigation';
import { GamesList } from '../Game/GameBoard/GamesList';
import { useGames } from '../Game/useGames';

const HeaderTitle = styled.span`
  text-transform: uppercase;
`;

export const GamePage = () => {
  const { games, onDeleteGame, selectDeleteGame, deletedGame } = useGames();
  return (
    <>
      <PageHeader backgroundColor='linear-gradient(150deg, rgba(50,120,217,1) 30%, rgba(82,196,250,1) 97%);'>
        <Flexbox flex='1' flexDirection='column' justifyContent='space-between'>
          <Flexbox justifyContent='center'>
            <HeaderTitle>Games</HeaderTitle>
          </Flexbox>
          <TabNavigation
            tabs={[{ label: 'list' }, { label: 'stats' }]}
            onSelectTab={() => {}}
            selectedTab={null}
          />
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
