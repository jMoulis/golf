import styled from '@emotion/styled';
import { faSignOut } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ref, uploadBytes } from 'firebase/storage';
import { FormEvent, useEffect, useState } from 'react';
import { logout } from '../../auth/authActions';
import { storage } from '../../firebase';
import { theme } from '../../style/theme';
import { ButtonPill } from '../commons/ButtonPill';
import { DeleteButton } from '../commons/DeleteButton';
import { FixedBottomToolbar } from '../commons/FixedBottomToolbar';
import { Input } from '../commons/Input';
import { UserType } from '../types';
import { Avatar } from './Avatar';
import { Roles } from './Roles';
import { useUser } from './useUser';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  margin: 10px;
  border-radius: 10px;
  padding: 10px 0;
  box-shadow: ${theme.shadows.listItem};
`;

type Props = {
  user: UserType;
  onClose: () => void;
};

export const UserForm = ({ user, onClose }: Props) => {
  const { editUser } = useUser();
  const [form, setForm] = useState<UserType>({
    firstname: '',
    lastname: '',
  });

  const handleInputChange = (event: FormEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  useEffect(() => {
    setForm(user);
  }, [user]);

  const handleEditRoles = (roles: string[]) => {
    setForm((prevForm) => ({
      ...prevForm,
      roles,
    }));
  };

  const handleUploadFile = (file: File) => {
    if (!user?.id) return null;
    if (!file) return null;
    const storageRef = ref(storage, `/avatars/${user?.id}/${file.name}`);
    uploadBytes(storageRef, file).then((snapshot) => {
      const { fullPath } = snapshot.metadata;
      const updatedUser = {
        ...user,
        avatar: fullPath,
      };
      editUser(updatedUser);
    });
  };

  const handleSubmit = () => {
    editUser(form);
    onClose();
  };

  return (
    <Root>
      <Avatar
        styling={{
          height: '150px',
          width: '150px',
          margin: '10px 0',
        }}
        user={user}
        onUploadAvatar={handleUploadFile}
      />

      <Input
        style={{
          margin: '5px 0',
        }}
        onChange={handleInputChange}
        name='firstname'
        value={form?.firstname || ''}
      />
      <Input
        style={{
          margin: '5px 0',
        }}
        onChange={handleInputChange}
        name='lastname'
        value={form?.lastname || ''}
      />
      <Roles selectedRoles={form.roles || []} onEdit={handleEditRoles} />
      <FixedBottomToolbar>
        <ButtonPill onClick={handleSubmit}>ENREGISTRER</ButtonPill>
        <DeleteButton onClick={logout}>
          <FontAwesomeIcon icon={faSignOut} />
        </DeleteButton>
      </FixedBottomToolbar>
    </Root>
  );
};
