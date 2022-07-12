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
import { ButtonPill } from '../../commons/ButtonPill';

const ButtonWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  justify-content: center;
  align-items: center;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  background-color: #fff;
  box-shadow: ${theme.shadows.listItem};
  min-height: 80px;
`;

const CustomButtonPill = styled(ButtonPill)`
  padding: 5px;
  height: 47px;
  margin: 0;
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
    <>
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
        {selectedCourse && step === 'SELECT_THEME' ? (
          <CustomButtonPill
            onClick={() => setStep('SELECT_COURSE')}
            backgroundColor={
              theme.colors.deleteButton
            }>{`Course`}</CustomButtonPill>
        ) : (
          <span />
        )}
        {selectedCourse ? (
          <ButtonPill type='button' onClick={() => handleSubmit()}>
            Créer
          </ButtonPill>
        ) : (
          <span />
        )}
        {selectedCourse && step === 'SELECT_COURSE' ? (
          <CustomButtonPill
            onClick={() => setStep('SELECT_THEME')}
            backgroundColor={
              theme.colors.deleteButton
            }>{`Theme`}</CustomButtonPill>
        ) : (
          <span />
        )}
      </ButtonWrapper>
    </>
  );
};
