import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { ShotType } from '../../../../game';
import { Flexbox } from '../../../commons';
import { ListItem } from '../../../commons/List';
import { ShotButton } from '../../../commons/ShotButton';
import { GameHoleType, GameType } from '../../../types';
import { shotTypesByTypes } from '../ShotForm/shotTypes';
import { theme } from '../../../../style/theme';
import { DocumentReference } from 'firebase/firestore';
import { SwipeShotForm } from '../../../commons/SwipeShotForm/SwipeShotForm';

type Props = {
  selectedShot: ShotType | null;
  hole: GameHoleType | null;
  children: React.ReactNode;
  onEditShot?: (shot: ShotType) => void;
  gameRef: DocumentReference | null;
  game: GameType;
};

export const ShotEvaluationFormItem = ({
  selectedShot,
  hole,
  children,
  game,
  gameRef,
  onEditShot,
}: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <ListItem
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: '5px',
      }}>
      <Flexbox flexDirection='column' flex='1'>
        <span>{`Hole: ${hole?.number} - par: ${hole?.par}`}</span>
        {selectedShot ? (
          <Flexbox flex='1' justifyContent='space-between' alignItems='center'>
            <Flexbox>
              <span>Type:</span>
              <span
                style={{
                  color: shotTypesByTypes[selectedShot?.type]?.color,
                  marginLeft: '5px',
                  fontSize: '20px',
                }}>
                {shotTypesByTypes[selectedShot?.type]?.icon}
              </span>
            </Flexbox>
            <ShotButton
              styling={{
                width: '40px',
                height: '40px',
                fontSize: '25px',
              }}
              onClick={() => setOpen(true)}
              backgroundColor={theme.colors.saveButton}
              color='#fff'>
              <FontAwesomeIcon icon={faPenToSquare} />
            </ShotButton>
          </Flexbox>
        ) : null}
      </Flexbox>
      {children}
      <SwipeShotForm
        gameRef={gameRef}
        onEditShot={onEditShot}
        hole={hole}
        game={game}
        withEvaluationForm={false}
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        title='Modifier un shot'
      />
    </ListItem>
  );
};
