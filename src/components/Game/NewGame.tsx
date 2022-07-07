import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  Timestamp,
} from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';
import { app, auth } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import { CourseType, ThemeType } from '../types';
import styled from '@emotion/styled';
import { theme } from '../../style/theme';
import { useThemes } from './ScoreCard/ThemeForm/useThemes';
import { ThemeList } from './ScoreCard/ThemeForm/ThemeList';
import { Flexbox } from '../commons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/pro-duotone-svg-icons';
import { useAuthState } from 'react-firebase-hooks/auth';

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

const ThemeTag = styled.div`
  padding: 5px;
  border-radius: 3px 0 0 3px;
  background-color: ${theme.colors.lightPink};
  margin: 5px 0;
  display: flex;
  align-items: center;
`;

const ThemeDeleteButton = styled.button`
  border: none;
  padding: 5px;
  border-radius: 0 3px 3px 0;
  color: #d73038;
  background-color: #f8d7da;
  margin: 5px 0;
  margin-right: 5px;
  font-size: 20px;
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
  const [selectedThemes, setSelectedThemes] = useState<ThemeType[]>([]);
  const { themes, onInit } = useThemes();
  const [user] = useAuthState(auth);

  console.log(themes);
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
    onInit();
    getCourses();
  }, [getCourses, onInit]);

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
        {selectedCourse ? (
          <>
            <Flexbox flexWrap='wrap'>
              {selectedThemes.map((theme) => (
                <Flexbox key={theme.id}>
                  <ThemeTag>{theme.type}</ThemeTag>
                  <ThemeDeleteButton
                    onClick={() => handleRemoveTheme(theme.id)}>
                    <FontAwesomeIcon icon={faTrash} />
                  </ThemeDeleteButton>
                </Flexbox>
              ))}
            </Flexbox>
            <ThemeList
              onSelectTheme={handleSelectTheme}
              selectedThemes={selectedThemes}
              themes={themes}
            />
          </>
        ) : null}
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
