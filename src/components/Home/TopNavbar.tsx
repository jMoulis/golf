import styled from '@emotion/styled';
import { faArrowCircleLeft } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../commons';
import { TOP_NAVBAR_HEIGHT } from '../cssConstants';
import { UserPanel } from './UserPanel';

const Root = styled.div`
  display: flex;
  height: ${TOP_NAVBAR_HEIGHT};
  justify-content: space-between;
  padding: 0 5px;
`;

export const TopNavbar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const shouldDisplayBackButton = useMemo(() => {
    return pathname.split('/').length > 4;
  }, [pathname]);

  const handleClick = () => {
    navigate(-1);
  };

  return (
    <Root>
      {shouldDisplayBackButton ? (
        <Button
          onClick={handleClick}
          style={{
            fontSize: '30px',
          }}>
          <FontAwesomeIcon icon={faArrowCircleLeft} />
        </Button>
      ) : (
        <span />
      )}
      <UserPanel />
    </Root>
  );
};
