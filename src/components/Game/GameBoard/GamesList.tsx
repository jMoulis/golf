import styled from '@emotion/styled';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Flexbox } from '../../commons';
import { DeleteButton } from '../../commons/DeleteButton';
import { FloatingButton } from '../../commons/FloatingButton';
import { List, ListItem } from '../../commons/List';
import { BOTTOM_NAVBAR_HEIGHT } from '../../cssConstants';
import { GameType } from '../../types';

const CustomList = styled(List)`
  padding-bottom: calc(${BOTTOM_NAVBAR_HEIGHT});
`;
type Props = {
  games: GameType[];
  onDeleteGame: (game: GameType) => void;
};

export const GamesList = ({ games, onDeleteGame }: Props) => {
  const dateFormat = useRef<Intl.DateTimeFormat>(new Intl.DateTimeFormat());
  return (
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
              <div>
                <span>{game.courseRef}</span>
                <div>{dateFormat.current.format(game.date)}</div>
              </div>
            </Link>
            <DeleteButton type='button' onClick={() => onDeleteGame(game)}>
              <FontAwesomeIcon icon={faTrash} />
            </DeleteButton>
          </Flexbox>
        </ListItem>
      ))}
      <FloatingButton backgroundColor='#000' color='#fff'>
        <FontAwesomeIcon icon={faPlus} size='3x' />
      </FloatingButton>
    </CustomList>
  );
};
