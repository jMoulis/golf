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
import { CourseType, ENUM_GAME_STATUS, ThemeType, UserType } from '../../types';
import styled from '@emotion/styled';
import { theme } from '../../../style/theme';
import { useAuthState } from 'react-firebase-hooks/auth';
import { CourseList } from './CourseList';
import { GameThemeForm } from './GameThemeForm';
import { ButtonPill } from '../../commons/ButtonPill';
import { FixedBottomToolbar } from '../../commons/FixedBottomToolbar';
import { ListItem } from '../../commons/List';
import { Flexbox } from '../../commons';
import { CoachPage } from '../../pages/CoachPage';
import { CourseMeta } from '../../Admin/Course/CourseMeta';
import { ShotButton } from '../../commons/ShotButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useUser } from '../../User/useUser';

const ThemeTag = styled.div`
  background-color: ${theme.colors.blueGreen};
  padding: 5px;
  margin: 5px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ButtonWrapper = styled(FixedBottomToolbar)`
  display: flex;
  justify-content: center;
`;

type StepType = 'SELECT_COURSE' | 'SELECT_THEME' | null;

export const NewGame = () => {
  const [selectedCourse, setSelectedCourse] = useState<CourseType | null>(null);
  const [courses, setCourses] = useState<CourseType[]>([]);
  const [selectedThemes, setSelectedThemes] = useState<ThemeType[]>([]);
  const [step, setStep] = useState<StepType>(null);
  const [user] = useAuthState(auth);
  const [selectedCoach, setSelectedCoach] = useState<UserType | null>(null);
  const { getUser, user: fullUser } = useUser();

  const navigate = useNavigate();

  const handleSubmit = async () => {
    const db = getFirestore(app);
    if (!selectedCourse) return null;
    if (!user) return null;
    if (!fullUser) return null;
    try {
      const newGame = {
        date: Timestamp.fromDate(new Date()),
        courseRef: selectedCourse.id,
        themes: selectedThemes,
        holes: selectedCourse?.holes || {},
        userId: user.uid,
        coursePar: selectedCourse.par,
        status: ENUM_GAME_STATUS.DRAFT,
        users: selectedCoach?.id ? [user.uid, selectedCoach.id] : [user.uid],
        player: {
          firstname: fullUser?.firstname,
          lastname: fullUser?.lastname,
          id: fullUser?.id,
          avatar: fullUser?.avatar,
        },
        coach: {
          firstname: selectedCoach?.firstname,
          lastname: selectedCoach?.lastname,
          id: selectedCoach?.id,
          avatar: selectedCoach?.avatar,
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

  const handleSelectCourse = (course: CourseType) => {
    setSelectedCourse(course);
    setStep(null);
  };

  useEffect(() => {
    getCourses();
    getUser();
  }, [getCourses, getUser]);

  useEffect(() => {
    return () => {
      setSelectedCourse(null);
    };
  }, []);

  return (
    <>
      {selectedCourse ? (
        <ListItem as='div' onClick={() => setStep('SELECT_COURSE')}>
          <CourseMeta course={selectedCourse} />
          <Flexbox flexWrap='wrap'>
            {selectedThemes.map((theme, key) => (
              <ThemeTag
                key={key}
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveTheme(theme.id);
                }}>
                {theme.type}
              </ThemeTag>
            ))}
            <ShotButton
              style={{
                height: '40px',
                width: '40px',
              }}
              type='submit'
              color='#fff'
              onClick={(e) => {
                e.stopPropagation();
                setStep('SELECT_THEME');
              }}
              backgroundColor={theme.colors.saveButton}>
              <FontAwesomeIcon icon={faPlus} />
            </ShotButton>
          </Flexbox>
        </ListItem>
      ) : (
        <ListItem
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            display: 'flex',
          }}
          onClick={() => setStep('SELECT_COURSE')}
          as='div'>
          Cliques pour ajouter un parcours
        </ListItem>
      )}

      <CourseList
        open={step === 'SELECT_COURSE'}
        courses={courses}
        selectedCourse={selectedCourse}
        onSelect={handleSelectCourse}
        onClose={() => setStep(null)}
      />

      <CoachPage
        coachControl={{ coach: selectedCoach }}
        onSelect={setSelectedCoach}
      />
      <GameThemeForm
        selectedThemes={selectedThemes}
        onRemoveTheme={handleRemoveTheme}
        onSelectTheme={handleSelectTheme}
        onClose={() => setStep(null)}
        open={step === 'SELECT_THEME'}
      />

      <ButtonWrapper>
        {selectedCourse ? (
          <ButtonPill type='button' onClick={() => handleSubmit()}>
            Créer
          </ButtonPill>
        ) : null}
      </ButtonWrapper>
    </>
  );
};
