import {
  addDoc,
  collection,
  doc,
  getDocs,
  getFirestore,
  setDoc,
  Timestamp,
} from 'firebase/firestore';
import React, { useCallback, useEffect, useState } from 'react';
import { app } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import { CourseHoleType, CourseType, GameHoleType } from '../types';
import styled from '@emotion/styled';
import { theme } from '../../style/theme';

const Root = styled.div`
  display: flex;
  flex-direction: column;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  flex: 1;
  align-items: center;
`;

const List = styled.ul`
  flex: 1;
  padding: 0.3rem;
`;

const ListItem = styled.li<{ selected: boolean }>`
  padding: 0.5rem;
  background-color: ${({ selected }) =>
    selected ? theme.colors.lightBlue : 'transparent'};
  border-radius: 3px;
`;

const Button = styled.button`
  background-color: ${theme.colors.blueGreen};
  padding: 0.5rem 1rem;
  border-radius: 3px;
  font-size: 30px;
  border: none;
`;

export const NewGame = () => {
  const [selectedCourse, setSelectedCourse] = useState<CourseType | null>(null);
  const [courses, setCourses] = useState<CourseType[]>([]);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const db = getFirestore(app);
    if (!selectedCourse) return null;
    try {
      const newGame = {
        date: Timestamp.fromDate(new Date()),
        courseRef: selectedCourse.id,
      };

      const holesSnapshot = await getDocs(
        collection(db, 'courses', selectedCourse.name, 'holes'),
      );

      const holes = holesSnapshot.docs.reduce((acc: GameHoleType[], doc) => {
        const hole = doc.data() as CourseHoleType;
        if (!hole) return acc;
        return [
          ...acc,
          {
            ref: doc.id,
            number: hole.number,
            par: hole.par,
          },
        ];
      }, []);

      const docRef = await addDoc(collection(db, 'games'), newGame);

      holes.forEach((hole: any) => {
        const holRef = doc(docRef, 'holes', `${hole.ref}`);
        setDoc(holRef, hole);
      });

      navigate(`/protected/games/${docRef.id}`, { replace: true });
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  const getCourses = useCallback(async () => {
    const db = getFirestore(app);
    const querySnapshot = await getDocs(collection(db, 'courses'));
    const payload = querySnapshot.docs.map((doc) => {
      const course = doc.data() as CourseType;
      return {
        id: doc.id,
        name: course.name,
      };
    });
    setCourses(payload);
  }, []);

  useEffect(() => {
    getCourses();
  }, [getCourses]);

  return (
    <Root>
      <List>
        <li>
          <span>Available courses</span>
        </li>
        {courses?.map((course, key) => (
          <ListItem
            selected={course.id === selectedCourse?.id}
            key={key}
            onClick={() => setSelectedCourse(course)}>
            {course.name}
          </ListItem>
        ))}
      </List>
      <ButtonWrapper>
        {selectedCourse ? (
          <Button type='button' onClick={() => handleSubmit()}>
            New Game
          </Button>
        ) : null}
      </ButtonWrapper>
    </Root>
  );
};
