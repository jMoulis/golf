import styled from '@emotion/styled';
import { SwipeableDrawer } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { iOS } from '../../../../../utils/global.utils';
import { Flexbox } from '../../../../commons';
import { ShotButton } from '../../../../commons/Buttons/ShotButton';
import { SwipeMenuHeader } from '../../../../commons/SwipeMenuHeader';
import { buildArrayFromNumber } from '../../testsMatrix';
import { PelzTestShot } from '../../types';
import { scoreMappingColor } from '../../utils';

const CustomShotButton = styled(ShotButton)`
  height: auto;
  width: unset;
  font-size: 25px;
  margin: 0;
`;
type Props = {
  shot: PelzTestShot;
  onEditShot: (shot: PelzTestShot) => void;
};

export const PelzTestIemShotForm = ({ shot, onEditShot }: Props) => {
  const [value, setValue] = useState<number>();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setValue(shot.value);
  }, [shot]);

  const handleChange = (incomingValue: number) => {
    setValue(incomingValue);
    setOpen(false);
    onEditShot({
      ...shot,
      value: incomingValue,
    });
  };

  return (
    <>
      <CustomShotButton
        backgroundColor={`${scoreMappingColor[value || '0']}`}
        color="#fff"
        onClick={() => setOpen(true)}
      >
        {value}
      </CustomShotButton>
      <SwipeableDrawer
        disableBackdropTransition={!iOS}
        disableDiscovery={iOS}
        PaperProps={{
          style: {
            height: '50vh',
          },
        }}
        anchor="bottom"
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
      >
        <SwipeMenuHeader title="Score" />
        <Flexbox
          flexWrap="wrap"
          justifyContent="space-around"
          styling={{
            padding: '10px',
          }}
        >
          {buildArrayFromNumber(5).map((id) => (
            <CustomShotButton
              backgroundColor={`${scoreMappingColor[id - 1]}`}
              onClick={() => handleChange(id - 1)}
              key={id}
              color="#fff"
            >
              {id - 1}
            </CustomShotButton>
          ))}
        </Flexbox>
      </SwipeableDrawer>
    </>
  );
};
