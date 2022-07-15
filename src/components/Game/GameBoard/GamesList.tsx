import styled from '@emotion/styled';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import {
  faCheckCircle,
  faFilePen,
  faTrash,
} from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SwipeableDrawer } from '@mui/material';
import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { theme } from '../../../style/theme';
import { iOS } from '../../../utils/global.utils';
import { Flexbox } from '../../commons';
import { DeleteButton } from '../../commons/DeleteButton';
import { FloatingButton } from '../../commons/FloatingButton';
import { List, ListItem } from '../../commons/List';
import { SwipeMenuHeader } from '../../commons/SwipeMenuHeader';
import { BOTTOM_NAVBAR_HEIGHT } from '../../cssConstants';
import { ENUM_GAME_STATUS, GameStatus, GameType } from '../../types';
import { Avatar } from '../../User/Avatar';
import { NewGame } from '../NewGame/NewGame';

const Status = styled.span<{ status?: GameStatus }>`
  position: absolute;
  top: -20px;
  left: -17px;
  font-size: 20px;
  color: ${({ status }) =>
    status === ENUM_GAME_STATUS.DONE ? 'green' : theme.colors.saveButton};
`;
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
                position: 'relative',
              }}>
              <Link to={`${game.id}`}>
                <Flexbox flexDirection='column'>
                  <span style={{ fontWeight: 'bold' }}>{game.courseRef}</span>
                  <span>{dateFormat.current.format(game.date)}</span>
                  <Flexbox>
                    {game.coach ? (
                      <Avatar
                        styling={{
                          width: '30px',
                          height: '30px',
                        }}
                        onDisplayDetail={() => {}}
                        user={game.coach}
                      />
                    ) : null}
                    {game.player ? (
                      <Avatar
                        styling={{
                          width: '30px',
                          height: '30px',
                        }}
                        user={game.player}
                        onDisplayDetail={() => {}}
                      />
                    ) : null}
                  </Flexbox>
                  <Status status={game.status}>
                    <FontAwesomeIcon
                      icon={
                        game.status === ENUM_GAME_STATUS.DONE
                          ? faCheckCircle
                          : faFilePen
                      }
                    />
                  </Status>
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
