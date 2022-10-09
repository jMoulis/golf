import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useMemo, useState } from 'react';
import { Flexbox } from 'components/commons';
import { ListItem } from 'components/commons/List';
import { ShotButton } from 'components/commons/Buttons/ShotButton';
import { GameHoleType, GameType, ShotType } from 'components/types';
import { useConfig } from 'components/Game/ScoreCard/ShotForm/shotTypes';
import { theme } from 'style/theme';
import { DocumentReference } from 'firebase/firestore';
import { SwipeShotForm } from 'components/commons/SwipeShotForm/SwipeShotForm';

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
  const { shotTypesByTypes } = useConfig();
  const roundDistance = useMemo(() => {
    if (selectedShot?.club?.distance) {
      return `${Math.round(selectedShot.club.distance)}m`;
    }
    return 0;
  }, [selectedShot?.club?.distance]);

  return (
    <ListItem
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: '5px',
      }}
    >
      <Flexbox flexDirection="column" flex="1">
        <span>{`Hole: ${hole?.number} - par: ${hole?.par}`}</span>
        {selectedShot ? (
          <Flexbox flex="1" justifyContent="space-between" alignItems="center">
            <Flexbox flexDirection="column">
              <Flexbox>
                <span>Type:</span>
                <span
                  style={{
                    color: shotTypesByTypes[selectedShot?.type]?.color,
                    marginLeft: '5px',
                    fontSize: '20px',
                  }}
                >
                  {shotTypesByTypes[selectedShot?.type]?.icon ? (
                    <FontAwesomeIcon
                      icon={shotTypesByTypes[selectedShot?.type]?.icon}
                    />
                  ) : null}
                </span>
              </Flexbox>
              <Flexbox>{selectedShot.club?.name}</Flexbox>
              <Flexbox>{roundDistance}</Flexbox>
            </Flexbox>
            <ShotButton
              styling={{
                width: '40px',
                height: '40px',
                fontSize: '25px',
              }}
              onClick={() => setOpen(true)}
              backgroundColor={theme.colors.saveButton}
              color="#fff"
            >
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
        open={open}
        selectedShot={selectedShot || undefined}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        title="Modifier un shot"
      />
    </ListItem>
  );
};
