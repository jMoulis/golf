import { Button } from '../commons';
import { logout } from '../../auth/authActions';
import styled from '@emotion/styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOut } from '@fortawesome/pro-duotone-svg-icons';
import { useAuthState } from 'react-firebase-hooks/auth';
import { app, auth } from '../../firebase';
import { useCallback, useEffect, useState } from 'react';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { UserType } from '../types';

const Root = styled.nav`
  padding: 10px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const Username = styled.span`
  display: inline-block;
  font-weight: bold;
  margin-right: 10px;
`;

const LogoutButton = styled(Button)`
  font-size: 25px;
`;

export const UserPanel = () => {
  const [authUser] = useAuthState(auth);
  const [user, setUser] = useState<UserType | null>(null);
  const getFullUser = useCallback(async () => {
    if (!authUser) return null;
    if (!user) {
      const db = getFirestore(app);
      const docRef = doc(db, 'users', authUser.uid);
      const docSnap = await getDoc(docRef);
      const payloadUser: any = docSnap.data();
      setUser(payloadUser || null);
    }
  }, [authUser, user]);

  useEffect(() => {
    getFullUser();
  }, [getFullUser]);

  return (
    <Root>
      <Username>{user?.firstname}</Username>
      <LogoutButton onClick={logout}>
        <FontAwesomeIcon icon={faSignOut} />
      </LogoutButton>
    </Root>
  );
};
