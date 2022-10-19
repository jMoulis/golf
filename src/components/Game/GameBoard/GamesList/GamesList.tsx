import styled from '@emotion/styled';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SwipeableDrawer } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { theme } from 'style/theme';
import { iOS } from 'utils/global.utils';
import { FloatingButton } from 'components/commons/Buttons/FloatingButton';
import { List } from 'components/commons/List';
import { SwipeMenuHeader } from 'components/commons/SwipeMenuHeader';
import { BOTTOM_NAVBAR_HEIGHT } from 'components/cssConstants';
import { GameType } from 'components/types';
import { DeleteModal } from 'components/Game/GameIndex/DeleteModal';
import { NewGame } from 'components/Game/NewGame/NewGame';
import { useGames } from 'components/Game/useGames';
import { useConfig } from 'components/Game/ScoreCard/ShotForm/shotTypes';
import { GameBoard } from '../GameBoard';
import { GameListItem } from './GameListItem';

const CustomList = styled(List)`
  padding-bottom: calc(${BOTTOM_NAVBAR_HEIGHT});
`;
type Props = {
  userId: string;
};

export const GamesList = ({ userId }: Props) => {
  const { shotTypes } = useConfig();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        shotTypes={shotTypes}
      />
    </>
  );
};
