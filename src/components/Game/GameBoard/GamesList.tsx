import styled from '@emotion/styled';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SwipeableDrawer } from '@mui/material';
import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { iOS } from '../../../utils/global.utils';
import { Flexbox } from '../../commons';
import { DeleteButton } from '../../commons/DeleteButton';
import { FloatingButton } from '../../commons/FloatingButton';
import { List, ListItem } from '../../commons/List';
import { SwipeMenuHeader } from '../../commons/SwipeMenuHeader';
import { BOTTOM_NAVBAR_HEIGHT } from '../../cssConstants';
import { GameType } from '../../types';
import { NewGame } from '../NewGame/NewGame';

const CustomList = styled(List)`
  padding-bottom: calc(${BOTTOM_NAVBAR_HEIGHT});
`;
type Props = {
  games: GameType[];
  onDeleteGame: (game: GameType) => void;
};

export const GamesList = ({ games, onDeleteGame }: Props) => {
  const [open, setOpen] = useState(false);

  const dateFormat = useRef<Intl.DateTimeFormat>(new Intl.DateTimeFormat());
  return (
    <>
      <CustomList>
        {games.map((game) => (
          <ListItem key={game.id}>
            <Flexbox
              justifyContent='space-between'
              alignItems='center'
              styling={{
                padding: '0.5rem',
              }}>
              <Link to={`${game.id}`}>
                <Flexbox flexDirection='column'>
                  <span style={{ fontWeight: 'bold' }}>{game.courseRef}</span>
                  <span>{dateFormat.current.format(game.date)}</span>
                </Flexbox>
              </Link>
              <DeleteButton type='button' onClick={() => onDeleteGame(game)}>
                <FontAwesomeIcon icon={faTrash} />
              </DeleteButton>
            </Flexbox>
          </ListItem>
        ))}
        <FloatingButton
          onClick={() => setOpen(true)}
          backgroundColor='#000'
          color='#fff'>
          <FontAwesomeIcon icon={faPlus} size='3x' />
        </FloatingButton>
      </CustomList>
      <SwipeableDrawer
        disableBackdropTransition={!iOS}
        disableDiscovery={iOS}
        PaperProps={{
          style: {
            height: '90vh',
          },
        }}
        anchor='bottom'
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}>
        <SwipeMenuHeader title='Create game' />
        <NewGame />
      </SwipeableDrawer>
    </>
  );
};
