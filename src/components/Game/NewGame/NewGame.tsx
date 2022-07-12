import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  Timestamp,
} from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';
import { app, auth } from '../../../firebase';
import { useNavigate } from 'react-router-dom';
import { CourseType, ThemeType } from '../../types';
import styled from '@emotion/styled';
import { theme } from '../../../style/theme';
import { useAuthState } from 'react-firebase-hooks/auth';
import { CourseList } from './CourseList';
import { GameThemeForm } from './GameThemeForm';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #e4e4e4;
  flex: 1;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  flex: 1;
  align-items: center;
`;

const Button = styled.button`
  background-color: ${theme.colors.blueGreen};
  padding: 0.5rem 1rem;
  border-radius: 3px;
  font-size: 30px;
  border: none;
`;

type StepType = 'SELECT_COURSE' | 'SELECT_THEME';

export const NewGame = () => {
  const [selectedCourse, setSelectedCourse] = useState<CourseType | null>(null);
  const [courses, setCourses] = useState<CourseType[]>([]);
  const [selectedThemes, setSelectedThemes] = useState<ThemeType[]>([]);
  const [step, setStep] = useState<StepType>('SELECT_COURSE');
  const [user] = useAuthState(auth);

  const navigate = useNavigate();

  const handleSubmit = async () => {
    const db = getFirestore(app);
    if (!selectedCourse) return null;
    if (!user) return null;
    try {
      const newGame = {
        date: Timestamp.fromDate(new Date()),
        courseRef: selectedCourse.id,
        themes: selectedThemes,
        holes: selectedCourse?.holes || {},
        userId: user.uid,
        roles: {
          SfqfLdvgdiUXxC8x865JfxFhoys2: 'coach',
          [user.uid]: 'owner',
        },
      };
      const docRef = await addDoc(collection(db, 'games'), newGame);
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
        ...course,
      };
    });
    setCourses(payload);
  }, []);

  const handleSelectTheme = (incomingTheme: ThemeType) => {
    setSelectedThemes((prev) => [...prev, incomingTheme]);
  };

  const handleRemoveTheme = (themeID: string) => {
    const updatedSelectedThemes = selectedThemes.filter(
      (prevTheme) => prevTheme.id !== themeID,
    );
    setSelectedThemes(updatedSelectedThemes);
  };

  useEffect(() => {
    getCourses();
  }, [getCourses]);

  return (
    <Root>
      {step === 'SELECT_COURSE' ? (
        <CourseList
          courses={courses}
          selectedCourse={selectedCourse}
          onSelect={setSelectedCourse}
        />
      ) : null}
      {step === 'SELECT_THEME' ? (
        <GameThemeForm
          selectedThemes={selectedThemes}
          onRemoveTheme={handleRemoveTheme}
          onSelectTheme={handleSelectTheme}
        />
      ) : null}

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
