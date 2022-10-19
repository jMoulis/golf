import styled from '@emotion/styled';
import React from 'react';

const ImageClub = styled.img`
  height: 2rem;
`;

type Props = {
  clubThumbnail?: string;
  clubName: string;
};

export const ClubImage = ({ clubThumbnail, clubName }: Props) => {
  return clubThumbnail ? (
    <ImageClub alt={clubName} src={clubThumbnail} />
  ) : null;
};
