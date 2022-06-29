import { useEffect, useRef, useState } from 'react';
import { ShotForm } from './ShotForm/ShotForm';
import {
  arrayUnion,
  deleteDoc,
  doc,
  DocumentReference,
  setDoc,
  Unsubscribe,
} from 'firebase/firestore';
import { Shots } from './ShotForm/Shots';
import styled from '@emotion/styled';
import { GameHoleType, GameType } from '../../types';
import { v4 } from 'uuid';

const List = styled.ul`
  overflow: auto;
  height: calc(100vh - 4rem - 2rem - 200px);
`;
const ListItem = styled.div<{ selected: boolean }>`
  display: grid;
  grid-template-columns: 4rem 1fr;
  align-items: center;
  border: 1px solid ${({ selected }) => (selected ? '#e2e1e0' : 'transparent')};
  background-color: ${({ selected }) => (selected ? '#e2e1e0' : 'transparent')};
  padding: 0.25rem;
  margin: 0 0.25rem;
  border-radius: 5px;
`;

const HoleHeader = styled.div`
  display: flex;
  align-items: center;
`;
type Props = {
  game?: GameType;
  gameRef: DocumentReference | null;
};
export const ScoreCard = ({ game, gameRef }: Props) => {
  console.log(game);

  const [selectedHole, setSelectedHole] = useState<any | null>(null);
  const shotUnsubscribeRef = useRef<Unsubscribe | null>(null);

  useEffect(() => {
    if (game) {
      // fetchHoles(game.id);
    }
  }, [game]);

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
      console.log(shot);
      console.log(hole);
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
      // await addDoc(collection(ref, 'shots'), { ...shot, order });
    }
  };

  const handleDeleteShot = async (shotRef: string, hole: any) => {
    if (gameRef) {
      const deleteRef = doc(gameRef, 'holes', hole.ref, 'shots', shotRef);
      deleteDoc(deleteRef);
    }
  };

  if (!game) return null;

  return (
    <>
      <List>
        {Object.values(game.holes)
          .sort((a, b) => a.number - b.number)
          .map((hole) => (
            <ListItem selected={hole.ref === selectedHole?.ref} key={hole.ref}>
              <HoleHeader onClick={() => handleSelectHole(hole)}>
                <span
                  style={{
                    fontWeight: 'bold',
                    fontSize: '20px',
                    display: 'inline-block',
                    marginRight: '5px',
                  }}>
                  {hole.number}
                </span>
                <span style={{ fontSize: '13px', color: 'gray' }}>
                  Par {hole.par}
                </span>
              </HoleHeader>

              <Shots
                shots={hole.shots || []}
                onShotDelete={(shotID) => handleDeleteShot(shotID, hole)}
                hole={hole || null}
                gameRef={gameRef}
              />
            </ListItem>
          ))}
      </List>
      {/* <RenderHolesTable
        selectedHole={selectedHole}
        holeShots={shots}
        holes={holes || []}
        onSelectHole={handleSelectHole}
      /> */}

      <ShotForm onAddShot={handleAddShot} hole={selectedHole} />
    </>
  );
};
