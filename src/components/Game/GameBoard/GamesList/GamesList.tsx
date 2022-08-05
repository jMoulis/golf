import styled from '@emotion/styled';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SwipeableDrawer } from '@mui/material';
import { useEffect, useState } from 'react';
import { theme } from '../../../../style/theme';
import { iOS } from '../../../../utils/global.utils';
import { FloatingButton } from '../../../commons/Buttons/FloatingButton';
import { List } from '../../../commons/List';
import { SwipeMenuHeader } from '../../../commons/SwipeMenuHeader';
import { BOTTOM_NAVBAR_HEIGHT } from '../../../cssConstants';
import { GameType } from '../../../types';
import { DeleteModal } from '../../GameIndex/DeleteModal';
import { NewGame } from '../../NewGame/NewGame';
import { useGames } from '../../useGames';
import { GameBoard } from '../GameBoard';
import { GameListItem } from './GameListItem';

const CustomList = styled(List)`
  padding-bottom: calc(${BOTTOM_NAVBAR_HEIGHT});
`;
type Props = {
  userId: string;
};

export const GamesList = ({ userId }: Props) => {
  const { games, getGames, selectDeleteGame, deletedGame, onDeleteGame } =
    useGames();
  const [open, setOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<GameType | null>(null);

  const handleSubmitNewGame = (newGame: GameType) => {
    setSelectedGame(newGame);
    setOpen(false);
  };

  const handleDeleteGame = () => {
    onDeleteGame();
    setSelectedGame(null);
  };

  useEffect(() => {
    getGames(userId);
  }, [userId]);

  return (
    <>
      <CustomList>
        {games.map((game, key) => (
          <GameListItem
            key={key}
            game={game}
            onSelectDeleteGame={selectDeleteGame}
            onSelectGame={setSelectedGame}
          />
        ))}
        <FloatingButton
          onClick={() => setOpen(true)}
          backgroundColor="#000"
          color="#fff"
        >
          <FontAwesomeIcon icon={faPlus} size="3x" />
        </FloatingButton>
      </CustomList>

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
        <SwipeMenuHeader title="Nouvelle partie" />
        <NewGame onSubmit={handleSubmitNewGame} />
      </SwipeableDrawer>

      <DeleteModal
        onClose={() => selectDeleteGame(null)}
        deletedGame={deletedGame}
        onDeleteGame={handleDeleteGame}
      />
      <GameBoard
        open={Boolean(selectedGame)}
        gameID={selectedGame?.id || null}
        onClose={() => setSelectedGame(null)}
      />
    </>
  );
};
