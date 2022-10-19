import styled from '@emotion/styled';
import { ShotButton } from 'components/commons/Buttons/ShotButton';
import { BagClubType } from 'components/types';
import { ClubImage } from 'components/User/Bag/ClubImage';
import { useUser } from 'components/User/useUser';
import React from 'react';
import { theme } from 'style/theme';

const List = styled.ul`
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
`;

const CustomShotButton = styled(ShotButton)`
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80px;
  width: 80px;
  font-size: 15px;
`;

type Props = {
  onSelectClub: (club: BagClubType) => void;
  selectedClub: BagClubType | null;
};

export const ClubButtons = ({ onSelectClub, selectedClub }: Props) => {
  const { user } = useUser();

  return (
    <List>
      {user?.bag
        ?.sort((a, b) => a.order - b.order)
        .map((club) => (
          <li key={club.id}>
            <CustomShotButton
              color={selectedClub?.id === club?.id ? '#fff' : undefined}
              backgroundColor={
                selectedClub?.id === club?.id ? theme.colors.blue : '#fff'
              }
              onClick={() => onSelectClub(club)}
            >
              <ClubImage clubName={club.name} clubThumbnail={club.thumbnail} />
              {club.name}
            </CustomShotButton>
          </li>
        ))}
    </List>
  );
};
