import { faMapLocation } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ShotButton } from 'components/commons/Buttons/ShotButton';
import { SwipableDefault } from 'components/commons/SwipableDefault';
import { GameHoleType } from 'components/types';
import { useState } from 'react';
import { theme } from 'style/theme';
import { Map } from './Map';

type Props = {
  hole: GameHoleType;
};

export const MapButton = ({ hole }: Props) => {
  const [openMap, setOpenMap] = useState<boolean>(false);
  return (
    <>
      <ShotButton color={theme.colors.blue} onClick={() => setOpenMap(true)}>
        <FontAwesomeIcon icon={faMapLocation as any} />
      </ShotButton>
      <SwipableDefault
        title="Carte"
        onClose={() => setOpenMap(false)}
        onOpen={() => setOpenMap(false)}
        open={openMap}
      >
        <Map hole={hole} />
      </SwipableDefault>
    </>
  );
};
