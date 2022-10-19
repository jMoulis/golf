/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/function-component-definition */

import styled from '@emotion/styled';
import { faMapLocation } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Drawer } from '@mui/material';
import { CloseButton } from 'components/commons/Buttons/CloseButton';
import { ShotButton } from 'components/commons/Buttons/ShotButton';
import { GameHoleType } from 'components/types';
import { useToggle } from 'hooks/useToggle';
import React from 'react';
import { theme } from 'style/theme';
import { Map } from './Map';

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
  hole: GameHoleType;
  coords?: GeolocationCoordinates;
};

export const MapButton = ({ hole, coords }: Props) => {
  // const [openMap, setOpenMap] = useState<boolean>(false);
  const { open, onClose, onOpen } = useToggle();
  return (
    <>
      <ShotButton
        color="#fff"
        onClick={onOpen}
        backgroundColor={theme.colors.blue}
      >
        <FontAwesomeIcon icon={faMapLocation as any} />
      </ShotButton>
      <Drawer
        title="Carte"
        onClose={onClose}
        // onOpen={onClose}
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
        <Map hole={hole} geoCoords={coords} />
      </Drawer>
    </>
  );
};
