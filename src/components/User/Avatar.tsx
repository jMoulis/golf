import styled from '@emotion/styled';
import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { UserType, UserTypeSummary } from '../types';
import avatarPlaceholder from '../../assets/images/avatar-placeholder.png';
import { useFileStorage } from '../../hooks/useFileStorage';

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
  user: UserType | UserTypeSummary;
  styling?: any;
  onUploadAvatar?: (file: File) => void;
  onDisplayDetail?: () => void;
};

export const Avatar = ({ user, styling, onUploadAvatar }: Props) => {
  const [loading, setLoading] = useState<'UNSET' | 'LOADING' | 'DONE'>('UNSET');
  const [imageUrl, setImageUrl] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { getFileURL } = useFileStorage();

  const fetchImageURL = useCallback(async (userAvatar: string) => {
    setLoading('LOADING');
    const downloadedUrl = await getFileURL(userAvatar);
    if (downloadedUrl) {
      setImageUrl(downloadedUrl);
    }
    setLoading('DONE');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (user.avatar) {
      fetchImageURL(user.avatar);
    } else {
      setLoading('DONE');
      setImageUrl(avatarPlaceholder);
    }
  }, [fetchImageURL, user]);

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
        type="file"
        style={{ display: 'none' }}
      />
    </>
  );
};
