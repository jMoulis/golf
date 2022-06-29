import {
  collection,
  deleteDoc,
  doc,
  getFirestore,
  onSnapshot,
  query,
  setDoc,
  Unsubscribe,
} from 'firebase/firestore';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { app } from '../firebase';
import { Button } from './commons';
import { saconnay } from './sacconnay';
import { CourseType } from './types';

export const AddCourse = () => {
  // const [_selectedCourse, setSelectedCourse] = useState<CourseType | null>(
  //   null,
  // );
  const [courses, setCourses] = useState<CourseType[]>([]);
  const courseUnsubscribe = useRef<Unsubscribe | null>(null);

  useEffect(() => {
    const unsubscribeGames = courseUnsubscribe.current;
    return () => {
      if (unsubscribeGames) {
        unsubscribeGames();
      }
    };
  }, []);

  const handleSubmit = async () => {
    const db = getFirestore(app);
    try {
      const docRef = doc(db, 'courses', saconnay.name);
      const mapHoles = saconnay.holes.reduce(
        (acc: Record<string, any>, hole: any) => {
          return {
            ...acc,
            [`hole-${hole.number}`]: {
              ref: `hole-${hole.number}`,
              ...hole,
            },
          };
        },
        {},
      );
      setDoc(docRef, {
        name: saconnay.name,
        holes: mapHoles,
      });
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  const getCourses = useCallback(async () => {
    const db = getFirestore(app);
    const gamesQuery = query(collection(db, 'courses'));
    courseUnsubscribe.current = onSnapshot(gamesQuery, (payload) => {
      const incomingCourses: any = payload.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCourses(incomingCourses);
    });
  }, []);

  useEffect(() => {
    getCourses();
  }, [getCourses]);

  const handleDelete = async (courseID: string) => {
    const db = getFirestore(app);
    try {
      await deleteDoc(doc(db, 'courses', courseID));
    } catch (error: any) {
      console.log(error.message);
    }
  };

  return (
    <div>
      <ul>
        {courses?.map((course) => (
          <li
            key={course.name}
            onClick={() => {
              // setSelectedCourse(course)
            }}>
            <span>{course.name}</span>
            <Button onClick={() => handleDelete(course.id as string)}>
              Delete
            </Button>
          </li>
        ))}
      </ul>

      <button type='button' onClick={() => handleSubmit()}>
        New course
      </button>
    </div>
  );
};
