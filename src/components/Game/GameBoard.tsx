import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { HoleType } from '../../game';
import { ShotForm } from './ShotForm/ShotForm';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  DocumentReference,
  getDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  Unsubscribe,
} from 'firebase/firestore';
import { app } from '../../firebase';
import { RenderHolesTable } from './RenderHolesTable';
import { Shots } from './ShotForm/Shots';
import { Flexbox } from '../commons';

export const GameBoard = () => {
  const [game, setGame] = useState<any | null>(null);
  const [selectedHole, setSelectedHole] = useState<any | null>(null);
  const [shots, setShots] = useState<Record<string, any>>({});
  const { gameId } = useParams();
  const gameRef = useRef<DocumentReference<DocumentData> | null>(null);
  const shotUnsubscribeRef = useRef<Unsubscribe | null>(null);

  const fetchGame = useCallback(async (id: string) => {
    const db = getFirestore(app);
    gameRef.current = doc(db, 'games', id);
    const docSnap = await getDoc(gameRef.current);
    if (docSnap.exists()) {
      const q = query(
        collection(db, 'games', docSnap.id, 'holes'),
        orderBy('number'),
      );
      const querySnapshot = await getDocs(q);

      const holes = querySnapshot.docs.reduce((acc: any[], doc) => {
        const hole = doc.data();
        if (!hole) return acc;

        const shotQuery = query(
          collection(db, 'games', docSnap.id, 'holes', doc.id, 'shots'),
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

      setGame({ ...docSnap.data(), holes });
    } else {
      // doc.data() will be undefined in this case
      console.log('No such document!');
    }
  }, []);

  useEffect(() => {
    // setGame(newGame);
    if (gameId) {
      fetchGame(gameId);
    }
  }, [gameId, fetchGame]);

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
    if (gameRef.current) {
      const ref = doc(gameRef.current, 'holes', hole.ref);
      const order = (shots[hole.ref]?.length || 0) + 1;
      await addDoc(collection(ref, 'shots'), { ...shot, order });
    }
  };

  const handleDeleteShot = async (shotRef: string, hole: any) => {
    if (gameRef.current) {
      const deleteRef = doc(
        gameRef.current,
        'holes',
        hole.ref,
        'shots',
        shotRef,
      );
      deleteDoc(deleteRef);
    }
  };

  if (!game) return null;

  return (
    <div>
      <header style={{ display: 'flex' }}>
        <h2>{game.courseRef}</h2>
      </header>
      <RenderHolesTable
        selectedHole={selectedHole}
        holeShots={shots}
        holes={game.holes}
        onSelectHole={handleSelectHole}
      />
      <Flexbox flexDirection='column'>
        <Shots
          shots={selectedHole ? shots[selectedHole.ref] : []}
          onShotDelete={(shotID) => handleDeleteShot(shotID, selectedHole)}
        />
        <ShotForm
          onAddShot={handleAddShot}
          hole={selectedHole}
          shots={selectedHole ? shots[selectedHole.ref] : []}
        />
      </Flexbox>
    </div>
  );
};
