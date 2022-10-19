import styled from '@emotion/styled';
import { ListItem } from 'components/commons/List';
import { BagClubType } from 'components/types';
import React from 'react';
import { DeleteButton } from 'components/commons/Buttons/DeleteButton';
import { getClubDistanceAverage } from 'utils/scoreUtils';
import { useToggle } from 'hooks/useToggle';
import { Collapse } from '@mui/material';
import { Flexbox } from 'components/commons';
import { theme } from 'style/theme';
import { ClubImage } from './ClubImage';

const Root = styled(ListItem)`
  border-radius: 5px;
  margin: 5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const DistanceList = styled.ul`
  margin: 0 1rem;
  border-radius: 5px;
  background-color: #fff;
  box-shadow: ${theme.shadows.listItem};
`;
const DistanceListItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 5px;
`;
const DistanceLabel = styled.span`
  font-size: 12px;
`;

type Props = {
  club: BagClubType;
  onEdit: (club: BagClubType) => void;
  onDelete: (clubID: string) => void;
};

export const ClubListItem = ({ club, onEdit, onDelete }: Props) => {
  const { open, onToggle } = useToggle();

  const handleRemoveDistance = (index: number) => {
    const updatedDistances = [...club.distances];
    updatedDistances.splice(index, 1);
    onEdit({
      ...club,
      distances: updatedDistances,
    });
  };
  return (
    <>
      <Root key={club.id}>
        <span onClick={() => onToggle()}>
          <Flexbox alignItems="center">
            <ClubImage clubName={club.name} clubThumbnail={club.thumbnail} />
            {club.name}
          </Flexbox>
        </span>
        <span>distance</span>
        <span>{getClubDistanceAverage(club.distances)}</span>
        <DeleteButton onClick={() => onDelete(club.id)} />
      </Root>
      <Collapse in={open}>
        <DistanceList>
          {club.distances.map((distance, key) => (
            <DistanceListItem key={key}>
              <DistanceLabel>{distance}</DistanceLabel>
              <DeleteButton
                buttonStyle={{
                  height: '25px',
                  minHeight: '25px',
                  maxHeight: '25px',
                  width: '25px',
                  minWidth: '25px',
                  maxWidth: '25px',
                  fontSize: '15px',
                }}
                onClick={() => handleRemoveDistance(key)}
              />
            </DistanceListItem>
          ))}
        </DistanceList>
      </Collapse>
    </>
  );
};
