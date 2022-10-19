import styled from '@emotion/styled';
import React, { FormEvent, useRef } from 'react';
import { UserType, UserTypeSummary } from '../types';

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
  const inputRef = useRef<HTMLInputElement | null>(null);

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
      {user.avatar ? (
        <Image
          styling={styling}
          alt={user.firstname}
          src={user.avatar}
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
