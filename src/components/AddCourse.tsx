import {
  collection,
  doc,
  getDocs,
  getFirestore,
  setDoc,
} from 'firebase/firestore';
import React, { useCallback, useEffect, useState } from 'react';
import { app } from '../firebase';
import { saconnay } from './sacconnay';

export const AddCourse = () => {
  console.log(saconnay);
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const handleSubmit = async () => {
    const db = getFirestore(app);
    try {
      const docRef = doc(db, 'courses', saconnay.name);

      setDoc(docRef, {
        name: saconnay.name,
      });

      saconnay.holes.forEach((hole: any) => {
        const holRef = doc(docRef, 'holes', `hole-${hole.number}`);
        setDoc(holRef, hole);
      });
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  const getCourses = useCallback(async () => {
    const db = getFirestore(app);
    const querySnapshot = await getDocs(collection(db, 'courses'));
    const payload = querySnapshot.docs.map((doc) => doc.data());
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
          <li onClick={() => setSelectedCourse(course)}>{course.name}</li>
        ))}
      </ul>
      {/* {selectedCourse ? ( */}
      <button type='button' onClick={() => handleSubmit()}>
        New course
      </button>
      {/* ) : null} */}
    </div>
  );
};
