import styled from '@emotion/styled';
import { faCheckCircle, faTrash } from '@fortawesome/free-solid-svg-icons';
import { faFilePen, faGrid } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useRef, useState } from 'react';
import { theme } from '../../../../style/theme';
import { Flexbox } from '../../../commons';
import { DeleteButton } from '../../../commons/DeleteButton';
import { ListItem } from '../../../commons/List';
import { ENUM_GAME_STATUS, GameStatus, GameType } from '../../../types';
import { Avatar } from '../../../User/Avatar';
import { CourseStats } from '../CourseStats';
import { Score } from './Score';
import { ScoreTableDrawer } from './ScoreTableDrawer';

const Status = styled.span<{ status?: GameStatus }>`
  position: absolute;
  top: -20px;
  left: -17px;
  font-size: 20px;
  color: ${({ status }) =>
    status === ENUM_GAME_STATUS.DONE ? 'green' : theme.colors.saveButton};
`;

type Props = {
  game: GameType;
  onSelectDeleteGame: (game: GameType) => void;
  onSelectGame: (game: GameType | null) => void;
};

export const GameListItem = ({
  game,
  onSelectDeleteGame,
  onSelectGame,
}: Props) => {
  const dateFormat = useRef<Intl.DateTimeFormat>(new Intl.DateTimeFormat());

  const [selectedScoreCard, setSelectedScoreCard] = useState<GameType | null>(
    null
  );
  return (
    <>
      <ListItem key={game.id}>
        <Flexbox
          justifyContent="space-between"
          alignItems="center"
          styling={{
            padding: '0.5rem',
            position: 'relative',
          }}
        >
          <Flexbox onClick={() => onSelectGame(game)} flexDirection="column">
            <span style={{ fontWeight: 'bold' }}>{game.courseRef}</span>
            <span>{dateFormat.current.format(game.date)}</span>
            <CourseStats
              game={game}
              holes={game.holes ? Object.values(game.holes) : []}
            />
            <Flexbox justifyContent="space-around">
              <Score holes={game.holes ? Object.values(game.holes) : []} />
            </Flexbox>
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

          <Flexbox flexDirection="column">
            <DeleteButton
              type="button"
              onClick={() => setSelectedScoreCard(game)}
              style={{
                backgroundColor: theme.colors.blue,
              }}
            >
              <FontAwesomeIcon icon={faGrid} />
            </DeleteButton>
            <DeleteButton
              type="button"
              onClick={() => onSelectDeleteGame(game)}
            >
              <FontAwesomeIcon icon={faTrash} />
            </DeleteButton>
          </Flexbox>
        </Flexbox>
      </ListItem>
      <ScoreTableDrawer
        open={Boolean(selectedScoreCard)}
        onClose={() => setSelectedScoreCard(null)}
        onOpen={() => {}}
        game={selectedScoreCard}
      />
    </>
  );
};
