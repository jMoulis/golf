import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  Timestamp,
} from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';
import { app, auth } from '../../../firebase';
import {
  CoursePayloadType,
  ENUM_GAME_STATUS,
  GameType,
  ThemeType,
  UserType,
} from '../../types';
import styled from '@emotion/styled';
import { theme } from '../../../style/theme';
import { useAuthState } from 'react-firebase-hooks/auth';
import { CourseList } from './CourseList';
import { GameThemeForm } from './GameThemeForm';
import { ButtonPill } from '../../commons/Buttons/ButtonPill';
import { FixedBottomToolbar } from '../../commons/FixedBottomToolbar';
import { ListItem } from '../../commons/List';
import { Flexbox } from '../../commons';
import { CoachPage } from '../../pages/AdminPages/CoachPage';
import { CourseMeta } from '../../Admin/Course/CourseMeta';
import { useUser } from '../../User/useUser';
import { Starts } from './Starts';

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

type Props = {
  onSubmit: (game: GameType) => void;
};
export const NewGame = ({ onSubmit }: Props) => {
  const [selectedCourse, setSelectedCourse] =
    useState<CoursePayloadType | null>(null);
  const [courses, setCourses] = useState<CoursePayloadType[]>([]);
  const [selectedThemes, setSelectedThemes] = useState<ThemeType[]>([]);
  const [step, setStep] = useState<StepType>(null);
  const [user] = useAuthState(auth);
  const [selectedCoach, setSelectedCoach] = useState<UserType | null>(null);
  const [selectedStart, setSelectedStart] = useState<string>('yellow');

  const { user: fullUser } = useUser();

  const handleSubmit = async () => {
    const db = getFirestore(app);
    if (!selectedCourse) return null;
    if (!user) return null;
    if (!fullUser) return null;
    try {
      const date = new Date();
      const newGame = {
        date: Timestamp.fromDate(date),
        courseRef: selectedCourse.id,
        themes: selectedThemes,
        holes: selectedCourse?.holes || {},
        userId: user.uid,
        coursePar: selectedCourse.par,
        status: ENUM_GAME_STATUS.DRAFT,
        start: selectedStart,
        users: selectedCoach?.id ? [user.uid, selectedCoach.id] : [user.uid],
        player: {
          firstname: fullUser?.firstname,
          lastname: fullUser?.lastname,
          id: fullUser?.id,
          avatar: fullUser?.avatar,
        },
        coach: selectedCoach
          ? {
              firstname: selectedCoach?.firstname,
              lastname: selectedCoach?.lastname,
              id: selectedCoach?.id,
              avatar: selectedCoach?.avatar,
            }
          : {},
      };
      const docRef = await addDoc(collection(db, 'games'), newGame);

      const gameSubmit: GameType = {
        ...newGame,
        date,
        id: docRef.id,
        courseRef: newGame.courseRef as string,
        holes: newGame.holes as any,
      };

      onSubmit(gameSubmit);
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  const getCourses = useCallback(async () => {
    const db = getFirestore(app);
    const querySnapshot = await getDocs(collection(db, 'courses'));
    const payload = querySnapshot.docs.map((doc) => {
      const course = doc.data() as CoursePayloadType;
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
      (prevTheme) => prevTheme.id !== themeID
    );
    setSelectedThemes(updatedSelectedThemes);
  };

  const handleSelectCourse = (course: CoursePayloadType) => {
    setSelectedCourse(course);
    setStep(null);
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
        <ListItem as="div" onClick={() => setStep('SELECT_COURSE')}>
          <CourseMeta course={selectedCourse} />
          <Flexbox flexWrap="wrap">
            {selectedThemes.map((theme, key) => (
              <ThemeTag
                key={key}
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveTheme(theme.id);
                }}
              >
                {theme.type}
              </ThemeTag>
            ))}
          </Flexbox>
          <Flexbox justifyContent="center">
            <ButtonPill
              style={{
                minHeight: '40px',
                minWidth: 'fit-content',
              }}
              type="submit"
              color="#fff"
              onClick={(e) => {
                e.stopPropagation();
                setStep('SELECT_THEME');
              }}
              backgroundColor={theme.colors.saveButton}
            >
              Ajouter des thèmes
            </ButtonPill>
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
          as="div"
        >
          Cliques pour ajouter un parcours
        </ListItem>
      )}

      <Starts
        starts={
          selectedCourse?.starts ? Object.keys(selectedCourse.starts) : []
        }
        onSelect={setSelectedStart}
        selectedStart={selectedStart}
      />
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
          <ButtonPill type="button" onClick={() => handleSubmit()}>
            Créer
          </ButtonPill>
        ) : null}
      </ButtonWrapper>
    </>
  );
};
