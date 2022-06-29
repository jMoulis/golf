import { useEffect, useMemo, useRef, useState } from 'react';
import { ShotForm } from './ShotForm/ShotForm';
import {
  arrayUnion,
  DocumentReference,
  setDoc,
  Unsubscribe,
} from 'firebase/firestore';
import styled from '@emotion/styled';
import { GameHoleType, GameType } from '../../types';
import { v4 } from 'uuid';
import { RenderHoles } from './RenderHoles';

const List = styled.ul`
  overflow: auto;
  height: calc(100vh - 4rem - 2rem - 200px);
`;

type Props = {
  game?: GameType;
  gameRef: DocumentReference | null;
};
export const ScoreCard = ({ game, gameRef }: Props) => {
  const [selectedHole, setSelectedHole] = useState<any | null>(null);
  const shotUnsubscribeRef = useRef<Unsubscribe | null>(null);

  useEffect(() => {
    const shotUnsub = shotUnsubscribeRef.current;
    return () => {
      if (shotUnsub) shotUnsub();
    };
  }, []);

  const handleSelectHole = (incomingHole: GameHoleType) => {
    if (incomingHole === selectedHole) {
      setSelectedHole(null);
    } else {
      setSelectedHole(incomingHole);
    }
  };

  const handleAddShot = async (shot: any, hole: GameHoleType) => {
    if (gameRef) {
      await setDoc(
        gameRef,
        {
          holes: {
            [hole.ref]: {
              shots: arrayUnion({ ...shot, id: v4() }),
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

  if (!game) return null;

  return (
    <>
      <List>
        <RenderHoles
          gameRef={gameRef}
          onSelectHole={handleSelectHole}
          selectedHole={selectedHole}
          holes={frontNine}
        />
        <RenderHoles
          gameRef={gameRef}
          onSelectHole={handleSelectHole}
          selectedHole={selectedHole}
          holes={backNine}
        />
      </List>
      <ShotForm onAddShot={handleAddShot} hole={selectedHole} />
    </>
  );
};
