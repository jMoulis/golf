import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import { theme } from '../../../../style/theme';
import { Flexbox } from '../../../commons';
import { PageHeader } from '../../../commons/Core/PageHeader';
import { List, ListItem } from '../../../commons/List';
import { Avatar } from '../../../User/Avatar';
import { NameTag } from '../../../User/UserStyledComponents';
import { useUser } from '../../../User/useUser';

const CustomList = styled(List)`
  display: flex;
  align-items: flex-start;
`;

const CustomListItem = styled(ListItem)`
  height: auto;
  width: 150px;
`;

export const PelzIndex = () => {
  const { user } = useUser();

  return (
    <>
      <PageHeader backgroundColor={theme.headers.trainings.linear}>
        Test pelz
      </PageHeader>
      <CustomList>
        {user?.students?.map((student, key) => (
          <CustomListItem key={key}>
            <Link to={`${student.id}`}>
              <Flexbox flexDirection="column" alignItems="center">
                <Avatar user={student} />
                <NameTag>{student.firstname}</NameTag>
              </Flexbox>
            </Link>
          </CustomListItem>
        ))}
      </CustomList>
    </>
  );
};
