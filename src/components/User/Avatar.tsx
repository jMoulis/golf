import styled from '@emotion/styled';
import { getDownloadURL, ref } from 'firebase/storage';
import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { storage } from '../../firebase';
import { UserType } from '../types';
import avatarPlaceholder from '../../assets/images/avatar-placeholder.png';

const Image = styled.img<{ styling?: any }>`
  border-radius: 300px;
  height: 70px;
  width: 70px;
  object-fit: cover;
  ${({ styling }) => styling};
`;

const Placeholder = styled.div<{ styling?: any }>`
  border-radius: 300px;
  height: 70px;
  width: 70px;
  object-fit: cover;
  ${({ styling }) => styling};
`;
type Props = {
  user: UserType;
  styling?: any;
  onUploadAvatar?: (file: File) => void;
};

export const Avatar = ({ user, styling, onUploadAvatar }: Props) => {
  const [loading, setLoading] = useState<'UNSET' | 'LOADING' | 'DONE'>('UNSET');
  const [imageUrl, setImageUrl] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  const fetchImageURL = useCallback(async (userAvatar: string) => {
    setLoading('LOADING');
    const storageRef = ref(storage, userAvatar);
    const downloadedUrl = await getDownloadURL(storageRef);
    setImageUrl(downloadedUrl);
    setLoading('DONE');
  }, []);

  useEffect(() => {
    if (user.avatar) {
      fetchImageURL(user.avatar);
    } else {
      setLoading('DONE');
      setImageUrl(avatarPlaceholder);
    }
  }, [fetchImageURL, user.avatar]);

  const handleClick = () => {
    if (onUploadAvatar) {
      inputRef.current?.click();
    }
  };
  const handleChange = (event: FormEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    if (file && onUploadAvatar) {
      onUploadAvatar(file);
    }
  };

  return (
    <>
      {loading === 'DONE' ? (
        <Image
          styling={styling}
          alt={user.firstname}
          src={imageUrl}
          onClick={handleClick}
        />
      ) : (
        <Placeholder styling={styling} onClick={handleClick} />
      )}
      <input
        onChange={handleChange}
        ref={inputRef}
        type='file'
        style={{ display: 'none' }}
      />
    </>
  );
};
