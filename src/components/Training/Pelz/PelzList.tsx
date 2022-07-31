import styled from '@emotion/styled';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SwipeableDrawer } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { iOS } from '../../../utils/global.utils';
import { Flexbox } from '../../commons';
import { DeleteButton } from '../../commons/DeleteButton';
import { FloatingButton } from '../../commons/FloatingButton';
import { List, ListItem } from '../../commons/List';
import { SwipeMenuHeader } from '../../commons/SwipeMenuHeader';
import { ENUM_PELZ_THEME } from './enums';
import { PelzTest } from './PelzTest';
import { PelzType } from './types';
import { usePelz } from './usePelz';

const Pelz = styled.div`
  display: flex;
  flex-direction: column;
`;

export const PelzList = () => {
  const { loadTests, pelzs, createTest, onDeletePelz } = usePelz();
  const [selectedPelz, setSelectedPelz] = useState<PelzType | null>(null);
  const dateFormat = useRef<Intl.DateTimeFormat>(new Intl.DateTimeFormat());

  useEffect(() => {
    if (selectedPelz?.id && pelzs?.length) {
      const prevPelz = pelzs.find((prev) => prev.id === selectedPelz.id);
      if (prevPelz) {
        setSelectedPelz(prevPelz);
      }
    }
  }, [selectedPelz?.id, pelzs]);

  const handleCreate = async () => {
    const newPelz = await createTest(ENUM_PELZ_THEME.SHORT_GAME);
    if (newPelz) setSelectedPelz(newPelz);
  };

  const handleOpen = (incomingPelz: PelzType) => {
    setSelectedPelz(incomingPelz);
  };
  const handleClose = () => setSelectedPelz(null);

  useEffect(() => {
    loadTests();
  }, [loadTests]);

  return (
    <>
      <List>
        {pelzs.map((pelz, key) => (
          <ListItem key={key}>
            <Flexbox justifyContent="space-between">
              <Pelz onClick={() => handleOpen(pelz)}>
                <span>{pelz.theme}</span>
                <span>{dateFormat.current.format(pelz.date)}</span>
              </Pelz>
              <DeleteButton type="button" onClick={() => onDeletePelz(pelz.id)}>
                <FontAwesomeIcon icon={faTrash} />
              </DeleteButton>
            </Flexbox>
          </ListItem>
        ))}
      </List>
      <FloatingButton
        onClick={handleCreate}
        backgroundColor="#000"
        color="#fff"
      >
        <FontAwesomeIcon icon={faPlus} size="3x" />
      </FloatingButton>
      <SwipeableDrawer
        disableBackdropTransition={!iOS}
        disableDiscovery={iOS}
        PaperProps={{
          style: {
            height: '95vh',
          },
        }}
        anchor="bottom"
        open={Boolean(selectedPelz)}
        onClose={handleClose}
        onOpen={() => {}}
      >
        <SwipeMenuHeader title="Modifier test" />
        <PelzTest pelz={selectedPelz} />
      </SwipeableDrawer>
    </>
  );
};
