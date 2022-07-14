import { useEffect, useMemo, useRef, useState } from 'react';
import {
  arrayUnion,
  DocumentReference,
  setDoc,
  Unsubscribe,
} from 'firebase/firestore';
import styled from '@emotion/styled';
import { GameHoleType, GameType } from '../../types';
import { RenderHoles } from './RenderHoles';
import { ShotType } from '../../../game';
import { SwipeShotForm } from '../../commons/SwipeShotForm/SwipeShotForm';

const List = styled.ul`
  overflow: auto;
  max-height: 100%;
`;

type Props = {
  game?: GameType;
  gameRef: DocumentReference | null;
};
export const ScoreCard = ({ game, gameRef }: Props) => {
  const [selectedHole, setSelectedHole] = useState<GameHoleType | null>(null);
  const shotUnsubscribeRef = useRef<Unsubscribe | null>(null);
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    const shotUnsub = shotUnsubscribeRef.current;
    return () => {
      if (shotUnsub) shotUnsub();
    };
  }, []);

  useEffect(() => {
    if (game?.holes && selectedHole?.ref && game.holes[selectedHole.ref]) {
      const prevHole = game.holes[selectedHole.ref];
      if (prevHole) {
        setSelectedHole(prevHole);
      }
    }
  }, [game?.holes, selectedHole?.ref]);

  const handleSelectHole = (incomingHole: GameHoleType) => {
    if (incomingHole === selectedHole) {
      setSelectedHole(null);
    } else {
      setSelectedHole(incomingHole);
    }
  };

  const handleAddShot = async (shot: ShotType, hole: GameHoleType) => {
    if (gameRef) {
      await setDoc(
        gameRef,
        {
          holes: {
            [hole.ref]: {
              shots: arrayUnion(shot),
            },
          },
        },
        {
          merge: true,
        },
      );
    }
  };

  const frontNine = useMemo(() => {
    if (!game?.holes) return [];
    return Object.values(game.holes)
      .sort((a, b) => a.number - b.number)
      .slice(0, 9);
  }, [game?.holes]);

  const backNine = useMemo(() => {
    if (!game?.holes) return [];
    return Object.values(game.holes)
      .sort((a, b) => a.number - b.number)
      .slice(9, 18);
  }, [game?.holes]);

  const toggleDrawer =
    (state: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      setOpen(state);
    };

  if (!game) return null;

  return (
    <>
      <List>
        <RenderHoles
          gameRef={gameRef}
          onSelectHole={handleSelectHole}
          selectedHole={selectedHole}
          holes={frontNine}
          onOpenForm={toggleDrawer(true)}
          game={game}
        />
        <RenderHoles
          gameRef={gameRef}
          onSelectHole={handleSelectHole}
          selectedHole={selectedHole}
          holes={backNine}
          onOpenForm={toggleDrawer(true)}
          game={game}
        />
      </List>
      <SwipeShotForm
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        gameRef={gameRef}
        onAddShot={handleAddShot}
        hole={selectedHole}
        game={game}
        withEvaluationForm
        open={open}
      />
    </>
  );
};
