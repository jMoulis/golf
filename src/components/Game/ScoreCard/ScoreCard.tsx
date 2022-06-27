import React, { useCallback, useEffect, useRef, useState } from 'react';
import { HoleType } from '../../../game';
import { ShotForm } from './ShotForm/ShotForm';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentReference,
  getDocs,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  Unsubscribe,
} from 'firebase/firestore';
import { app } from '../../../firebase';
import { Shots } from './ShotForm/Shots';
import styled from '@emotion/styled';

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
  game?: {
    courseRef: string;
    date: any;
    id: string;
  };
  gameRef: DocumentReference | null;
};
export const ScoreCard = ({ game, gameRef }: Props) => {
  const [holes, setHoles] = useState<any[]>([]);
  const [selectedHole, setSelectedHole] = useState<any | null>(null);
  const [shots, setShots] = useState<Record<string, any>>({});
  const shotUnsubscribeRef = useRef<Unsubscribe | null>(null);

  const fetchHoles = useCallback(
    async (id: string) => {
      const db = getFirestore(app);
      if (game) {
        const q = query(
          collection(db, 'games', game.id, 'holes'),
          orderBy('number'),
        );
        const querySnapshot = await getDocs(q);

        const incomingHoles = querySnapshot.docs.reduce((acc: any[], doc) => {
          const hole = doc.data();
          if (!hole) return acc;

          const shotQuery = query(
            collection(db, 'games', game.id, 'holes', doc.id, 'shots'),
            orderBy('order', 'desc'),
          );

          shotUnsubscribeRef.current = onSnapshot(shotQuery, (payload) => {
            const holeShots = payload.docs.map((shot) => ({
              id: shot.id,
              ...shot.data(),
            }));
            setShots((prevShots) => ({
              ...prevShots,
              [hole.ref]: holeShots,
            }));
          });
          return [
            ...acc,
            {
              ref: doc.id,
              number: hole.number,
              par: hole.par,
            },
          ];
        }, []);
        setHoles(incomingHoles);
      } else {
        // doc.data() will be undefined in this case
        console.log('No such document!');
      }
    },
    [game],
  );

  useEffect(() => {
    if (game) {
      fetchHoles(game.id);
    }
  }, [game, fetchHoles]);

  useEffect(() => {
    const shotUnsub = shotUnsubscribeRef.current;
    return () => {
      if (shotUnsub) shotUnsub();
    };
  }, []);

  const handleSelectHole = (incomingHole: HoleType) => {
    if (incomingHole === selectedHole) {
      setSelectedHole(null);
    } else {
      setSelectedHole(incomingHole);
    }
  };

  const handleAddShot = async (shot: any, hole: any) => {
    if (gameRef) {
      const ref = doc(gameRef, 'holes', hole.ref);
      const order = (shots[hole.ref]?.length || 0) + 1;
      await addDoc(collection(ref, 'shots'), { ...shot, order });
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
        {holes.map((hole) => (
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
              shots={hole ? shots[hole.ref] : []}
              onShotDelete={(shotID) => handleDeleteShot(shotID, hole)}
              holeRef={hole?.ref || null}
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
