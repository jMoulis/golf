import styled from '@emotion/styled';
import { arrayUnion, doc, getFirestore, setDoc } from 'firebase/firestore';
import { useEffect, useMemo } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, app } from '../../../firebaseConfig/firebase';
import { theme } from '../../../style/theme';
import { UserType } from '../../types';
import { Avatar } from '../../User/Avatar';
import { ButtonPill } from '../../commons/Buttons/ButtonPill';
import { List } from '../../commons/List';
import { Flexbox } from '../../commons';
import { NameTag, RoleTag } from '../../User/UserStyledComponents';
import { useUser } from '../../User/useUser';

const CustomPillButton = styled(ButtonPill)`
  font-size: 15px;
  padding: 5px 10px;
`;
const CustomList = styled(List)`
  display: flex;
  max-height: 100%;
  overflow: auto;
  padding: 10px;
`;
const ListItem = styled.li`
  border-radius: 10px;
  box-shadow: ${theme.shadows.listItem};
  height: 200px;
  width: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  padding-bottom: 10px;
  justify-content: space-between;
  background-color: #fff;
`;

type Props = {
  coachControl?: { coach: UserType | null };
  onSelect?: (coach: UserType | null) => void;
};
export const CoachPage = ({ coachControl, onSelect }: Props) => {
  const [user] = useAuthState(auth);
  const { coaches, getCoaches, user: fullUser } = useUser();

  useEffect(() => {
    if (user) {
      getCoaches();
    }
  }, [user, getCoaches]);

  const handleSelectCoach = (coach: UserType) => {
    if (!user) return null;
    if (user.uid === coach.id) return null;
    if (onSelect) {
      return onSelect({
        id: coach.id,
        firstname: coach.firstname,
        lastname: coach.lastname,
        avatar: coach.avatar,
      });
    }
    const db = getFirestore(app);
    setDoc(
      doc(db, 'users', user.uid),
      {
        coaches: arrayUnion(coach),
      },
      { merge: true }
    );
    setDoc(
      doc(db, 'users', coach.id as string),
      {
        students: arrayUnion({
          firstname: fullUser?.firstname,
          lastname: fullUser?.lastname,
          avatar: fullUser?.avatar,
          id: fullUser?.id,
        }),
      },
      { merge: true }
    );
  };

  const handleRemoveCoach = async (coach: UserType) => {
    if (!user) return null;
    if (user.uid === coach.id) return null;

    if (onSelect) {
      return onSelect(null);
    }

    const db = getFirestore(app);

    const updatedCoaches = (fullUser?.coaches || []).filter(
      (userCoach) => userCoach.id !== coach.id
    );
    const updatedStudents = (coach?.students || []).filter(
      (coachStudent) => coachStudent.id !== fullUser?.id
    );

    await setDoc(
      doc(db, 'users', user.uid),
      {
        coaches: updatedCoaches,
      },
      { merge: true }
    );
    setDoc(
      doc(db, 'users', coach.id as string),
      {
        students: updatedStudents,
      },
      { merge: true }
    );
  };

  const disabled = useMemo(
    () => (coach: UserType) => {
      if (coachControl) {
        return coachControl.coach?.id === coach.id;
      }
      return fullUser?.coaches?.some((userCoach) => userCoach.id === coach.id);
    },
    [fullUser, coachControl]
  );

  return (
    <>
      <CustomList>
        {coaches.map((coach, key) => (
          <ListItem key={key}>
            <Flexbox flexDirection="column" alignItems="center">
              <Avatar user={coach} />
              <NameTag>{coach.firstname}</NameTag>
            </Flexbox>
            {coach.roles?.map((role, key) => (
              <RoleTag key={key}>{role}</RoleTag>
            ))}
            {user?.uid !== coach.id ? (
              <CustomPillButton
                onClick={() =>
                  disabled(coach)
                    ? handleRemoveCoach(coach)
                    : handleSelectCoach(coach)
                }
              >
                {disabled(coach) ? 'Retirer' : 'Ajouter'}
              </CustomPillButton>
            ) : null}
          </ListItem>
        ))}
      </CustomList>
    </>
  );
};
