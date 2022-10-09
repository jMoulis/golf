import styled from '@emotion/styled';
import { useFileStorage } from 'hooks/useFileStorage';
import React, { useCallback, useEffect, useState } from 'react';

const ImageClub = styled.img`
  height: 2rem;
`;

type Props = {
  clubThumbnail?: string;
  clubName: string;
};

export const ClubImage = ({ clubThumbnail, clubName }: Props) => {
  const [image, setImage] = useState<string | null>(null);

  const { getFileURL } = useFileStorage();

  const fetchImageURL = useCallback(async (userAvatar: string) => {
    // setLoading('LOADING');
    const downloadedUrl = await getFileURL(userAvatar);
    if (downloadedUrl) {
      setImage(downloadedUrl);
    }
    // setLoading('DONE');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (clubThumbnail) {
      fetchImageURL(clubThumbnail);
    }
  }, [clubThumbnail]);
  return image ? <ImageClub alt={clubName} src={image} /> : null;
};
