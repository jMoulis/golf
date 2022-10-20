import styled from '@emotion/styled';
import { faMapLocation } from '@fortawesome/pro-duotone-svg-icons';
import { Drawer } from '@mui/material';
import { CloseButton } from 'components/commons/Buttons/CloseButton';
import { DeleteButton } from 'components/commons/Buttons/DeleteButton';
import { HoleCourseType } from 'components/types';
import { GeoPoint } from 'firebase/firestore';
import { useToggle } from 'hooks/useToggle';
import React from 'react';
import { theme } from 'style/theme';
import { GeoFormMap } from './GeoFormMap';

const Root = styled.div``;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
`;
const Title = styled.div`
  font-weight: bold;
  font-size: 17px;
`;

type Props = {
  hole?: HoleCourseType;
  onChange: (hole: HoleCourseType) => void;
};
export const GeoForm = ({ hole, onChange }: Props) => {
  const { open, onClose, onOpen } = useToggle();

  const handleChange = (coords: number[][]) => {
    const geoCoords = coords.map((coord: any) => {
      const [lng, lat] = coord;
      return new GeoPoint(lat, lng);
    });
    if (hole) {
      const updatedHole = {
        ...hole,
        bounds: geoCoords,
      };
      onChange(updatedHole);
    }
  };

  return (
    <Root>
      <DeleteButton
        buttonStyle={{
          color: '#fff',
          backgroundColor: hole?.bounds ? 'green' : theme.colors.saveButton,
        }}
        icon={faMapLocation}
        onClick={onOpen}
      />
      <Drawer
        title="Carte"
        onClose={onClose}
        open={open}
        PaperProps={{
          style: {
            ...theme.swipeable.paper,
            height: '100vh',
          },
        }}
        anchor="bottom"
      >
        <Header onClick={onClose}>
          <Title>Carte</Title>
          <CloseButton
            buttonStyle={{
              color: theme.colors.deleteButton,
              fontSize: '20px',
            }}
            onClick={onClose}
          />
        </Header>
        <GeoFormMap onSelect={handleChange} hole={hole} />
      </Drawer>
    </Root>
  );
};
