import styled from '@emotion/styled';
import { faSignOut } from '@fortawesome/free-solid-svg-icons';
import { Timestamp } from 'firebase/firestore';
import { FormEvent, useEffect, useState } from 'react';
import { useAuthAction } from '../../auth/useAuthAction';
import { useFileStorage } from '../../hooks/useFileStorage';
import { theme } from '../../style/theme';
import { resizeFile, ResizeFileOptionsType } from '../../utils/global.utils';
import { ButtonPill } from '../commons/Buttons/ButtonPill';
import { DeleteButton } from '../commons/Buttons/DeleteButton';
import { FixedBottomToolbar } from '../commons/FixedBottomToolbar';
import { Input } from '../commons/Input';
import { ClubType, UserType } from '../types';
import { Avatar } from './Avatar';
import { Bag } from './Bag/Bag';
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
  const { uploadFile } = useFileStorage();
  const { logout } = useAuthAction();
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

  const handleUploadFile = async (file: File) => {
    if (!user?.id) return null;
    if (!file) return null;
    const options: ResizeFileOptionsType = {
      maxWidth: 200,
      maxHeight: 200,
      compressFormat: 'JPEG',
      quality: 50,
      rotation: 0,
      outputType: 'file',
    };
    const resizedImage: any = await resizeFile(file, options);

    uploadFile(
      resizedImage,
      `/avatars/${user?.id}/avatar.${options.compressFormat}`
    ).then((snapshot) => {
      const { fullPath } = snapshot.metadata;
      const updatedUser = {
        ...user,
        avatar: fullPath,
      };
      const updatedAt = Timestamp.fromDate(new Date());
      editUser({ ...updatedUser, updatedAt });
    });
  };

  const handleLogout = () => {
    onClose();
    logout();
  };

  const handleSubmit = () => {
    editUser(form);
    onClose();
  };

  const handleUpdateBag = (club: ClubType) => {
    const updatedBag = [...(user?.bag || [])];
    const prevClub = updatedBag.findIndex(
      (prevClub) => prevClub.id === club.id
    );

    if (prevClub === -1) {
      updatedBag.push({ ...club, distance: 0, distances: [] });
    } else {
      updatedBag.splice(prevClub, 1);
    }

    const updatedUser = {
      ...user,
      bag: updatedBag,
    };
    editUser(updatedUser);
  };

  const handleDeleteClub = (club: ClubType) => {
    const updatedBag = [...(user?.bag || [])];
    const updatedUser = {
      ...user,
      bag: updatedBag.filter((prevClub) => prevClub.id !== club.id),
    };
    editUser(updatedUser);
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
        name="firstname"
        value={form?.firstname || ''}
        placeholder="Prénom"
      />
      <Input
        style={{
          margin: '5px 0',
        }}
        onChange={handleInputChange}
        name="lastname"
        value={form?.lastname || ''}
        placeholder="Nom de famille"
      />
      <Roles selectedRoles={form.roles || []} onEdit={handleEditRoles} />

      <Bag
        clubs={user.bag || []}
        onEdit={handleUpdateBag}
        onDelete={handleDeleteClub}
      />
      <FixedBottomToolbar>
        <ButtonPill onClick={handleSubmit}>ENREGISTRER</ButtonPill>
        <DeleteButton onClick={handleLogout} icon={faSignOut} />
      </FixedBottomToolbar>
    </Root>
  );
};
