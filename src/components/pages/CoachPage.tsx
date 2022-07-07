import styled from '@emotion/styled';
import { faTrash } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { updateProfile } from 'firebase/auth';
import {
  collection,
  doc,
  getFirestore,
  onSnapshot,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, app } from '../../firebase';
import { Flexbox } from '../commons';
import { DeleteButton } from '../commons/DeleteButton';
import { ThemeForm } from '../Game/ScoreCard/ThemeForm/ThemeForm';
import { useThemes } from '../Game/ScoreCard/ThemeForm/useThemes';
import { ThemeType } from '../types';

const List = styled.ul``;
const ListItem = styled.li`
  font-size: 17px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 10px;
`;

export const CoachPage = () => {
  const [user] = useAuthState(auth);
  const [coaches, setCoaches] = useState<any>([]);
  useEffect(() => {
    if (user) {
      const db = getFirestore(app);
      const themesQuery = query(
        collection(db, 'users'),
        where('roles', 'array-contains', 'coach'),
      );
      onSnapshot(
        themesQuery,
        (payload) => {
          const incomingCoaches = payload.docs.map((doc) => {
            const theme = doc.data() as ThemeType;
            return {
              ...theme,
              id: doc.id,
            };
          });
          setCoaches(incomingCoaches);
        },
        (error) => console.error(error),
      );
    }
  }, [user]);

  const handleUpdate = async () => {
    if (!auth.currentUser) return null;
    const db = getFirestore(app);
    await setDoc(
      doc(db, 'users', auth.currentUser.uid),
      {
        roles: ['coach'],
      },
      { merge: true },
    );
  };
  return (
    <div>
      CoachPage Get list of users with role coach
      <button onClick={handleUpdate}>Update User</button>
      <List>
        {coaches.map((coach: any) => (
          <ListItem key={coach.id}>
            <Flexbox flex='1' onClick={() => {}}>
              <span>{coach.id}</span>
            </Flexbox>
          </ListItem>
        ))}
      </List>
      {/* <ThemeForm
        selectedTheme={selectedTheme}
        onUpdate={() => setSelectedTheme(null)}
      /> */}
    </div>
  );
};
