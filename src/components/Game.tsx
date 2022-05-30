import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  onSnapshot,
  query,
} from 'firebase/firestore';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { app } from '../firebase';
import { GameType, HoleType, newGame } from '../game';
import { HoleForm } from './HoleForm';
import { saconnay } from './sacconnay';

type Props = {};

export const Game = (props: Props) => {
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
  const [courses, setCourses] = useState<any[]>([]);

  const handleSubmit = async () => {
    const db = getFirestore(app);
    try {
      const newGame = {
        date: Date.now(),
        course: selectedCourse.value,
      };
      const docRef = await addDoc(collection(db, 'games'), newGame);
      console.log('Document written with ID: ', docRef.id);
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  const getCourses = useCallback(async () => {
    const db = getFirestore(app);
    const querySnapshot = await getDocs(collection(db, 'courses'));
    const payload = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      label: doc.data()?.name,
      value: doc.data(),
    }));

    setCourses(payload);
  }, []);

  useEffect(() => {
    getCourses();
  }, [getCourses]);

  console.log(selectedCourse);
  return (
    <div>
      <ul>
        {courses?.map((course) => (
          <li onClick={() => setSelectedCourse(course)}>{course.label}</li>
        ))}
      </ul>
      <button type='button' onClick={() => handleSubmit()}>
        New Game
      </button>
    </div>
  );
};
