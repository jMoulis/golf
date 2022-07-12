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
import { FixedBottomToolbar } from '../../commons/FixedBottomToolbar';
import { ListItem } from '../../commons/List';
import { Flexbox } from '../../commons';

const ThemeTag = styled.div`
  background-color: ${theme.colors.blueGreen};
  padding: 5px;
  margin: 5px;
  border-radius: 10px;
`;

const ButtonWrapper = styled(FixedBottomToolbar)`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
`;

const CustomButtonPill = styled(ButtonPill)`
  padding: 5px;
  height: 40px;
  margin: 0;
  font-size: 13px;
`;

type StepType = 'SELECT_COURSE' | 'SELECT_THEME' | null;

export const NewGame = () => {
  const [selectedCourse, setSelectedCourse] = useState<CourseType | null>(null);
  const [courses, setCourses] = useState<CourseType[]>([]);
  const [selectedThemes, setSelectedThemes] = useState<ThemeType[]>([]);
  const [step, setStep] = useState<StepType>(null);
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

  useEffect(() => {
    return () => {
      setSelectedCourse(null);
    };
  }, []);

  return (
    <>
      {selectedCourse ? (
        <ListItem as='div'>
          {selectedCourse?.name}
          <Flexbox flexWrap='wrap'>
            {selectedThemes.map((theme) => (
              <ThemeTag onClick={() => handleRemoveTheme(theme.id)}>
                {theme.type}
              </ThemeTag>
            ))}
          </Flexbox>
        </ListItem>
      ) : (
        <ListItem as='div'>Aucun parcours n'est sélectionné</ListItem>
      )}

      <CourseList
        open={step === 'SELECT_COURSE'}
        courses={courses}
        selectedCourse={selectedCourse}
        onSelect={setSelectedCourse}
        onClose={() => setStep(null)}
      />

      <GameThemeForm
        selectedThemes={selectedThemes}
        onRemoveTheme={handleRemoveTheme}
        onSelectTheme={handleSelectTheme}
        onClose={() => setStep(null)}
        open={step === 'SELECT_THEME'}
      />

      <ButtonWrapper>
        <CustomButtonPill
          onClick={() => setStep('SELECT_COURSE')}
          backgroundColor={
            theme.colors.deleteButton
          }>{`Parcours`}</CustomButtonPill>

        {selectedCourse ? (
          <ButtonPill type='button' onClick={() => handleSubmit()}>
            Créer
          </ButtonPill>
        ) : (
          <span />
        )}

        <CustomButtonPill
          onClick={() => setStep('SELECT_THEME')}
          backgroundColor={
            theme.colors.deleteButton
          }>{`Themes`}</CustomButtonPill>
      </ButtonWrapper>
    </>
  );
};
