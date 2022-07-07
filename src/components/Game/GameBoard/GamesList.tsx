import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button, Flexbox } from '../../commons';
import { GameType } from '../../types';

type Props = {
  games: GameType[];
  onDeleteGame: (game: GameType) => void;
};

export const GamesList = ({ games, onDeleteGame }: Props) => {
  const dateFormat = useRef<Intl.DateTimeFormat>(new Intl.DateTimeFormat());
  return (
    <ul>
      {games.map((game) => (
        <li key={game.id}>
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
            <div>
              <Button type='button' onClick={() => onDeleteGame(game)}>
                Delete
              </Button>
            </div>
          </Flexbox>
        </li>
      ))}
    </ul>
  );
};
