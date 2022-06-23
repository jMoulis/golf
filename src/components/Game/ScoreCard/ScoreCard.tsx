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
import { RenderHolesTable } from '../RenderHolesTable';
import { Shots } from './ShotForm/Shots';
import { Flexbox } from '../../commons';
import { InfoMessage } from '../StyledComponents/InfoMessage';

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
    <div>
      <RenderHolesTable
        selectedHole={selectedHole}
        holeShots={shots}
        holes={holes || []}
        onSelectHole={handleSelectHole}
      />
      <Flexbox flexDirection='column'>
        {selectedHole ? (
          <Shots
            shots={selectedHole ? shots[selectedHole.ref] : []}
            onShotDelete={(shotID) => handleDeleteShot(shotID, selectedHole)}
            holeRef={selectedHole?.ref || null}
            gameRef={gameRef}
          />
        ) : (
          <InfoMessage>Select a hole</InfoMessage>
        )}
        <ShotForm
          shots={selectedHole ? shots[selectedHole.ref] : []}
          onAddShot={handleAddShot}
          hole={selectedHole}
        />
      </Flexbox>
    </div>
  );
};
