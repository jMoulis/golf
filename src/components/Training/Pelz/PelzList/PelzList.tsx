import { SwipeableDrawer } from '@mui/material';
import { useEffect, useState } from 'react';
import { iOS } from '../../../../utils/global.utils';
import { FixedBottomToolbar } from '../../../commons/FixedBottomToolbar';
import { List } from '../../../commons/List';
import { SwipeMenuHeader } from '../../../commons/SwipeMenuHeader';
import { ENUM_PELZ_THEME } from '../enums';
import { PelzListItem } from './PelzListItem';
import { PelzNewFormMenu } from './PelzNewFormMenu';
import { PelzTest } from '../PelzTest/PelzTest';
import { StatFooter } from './StatFooter';
import { PelzType } from '../types';
import { usePelz } from '../usePelz';
import { theme } from '../../../../style/theme';

type Props = {
  userId: string;
};
export const PelzList = ({ userId }: Props) => {
  const { loadTests, pelzs, createTest } = usePelz();
  const [selectedPelz, setSelectedPelz] = useState<PelzType | null>(null);

  useEffect(() => {
    if (selectedPelz?.id && pelzs?.length) {
      const prevPelz = pelzs.find((prev) => prev.id === selectedPelz.id);
      if (prevPelz) {
        setSelectedPelz(prevPelz);
      }
    }
  }, [selectedPelz?.id, pelzs]);

  const handleCreate = async (theme: ENUM_PELZ_THEME) => {
    const newPelz = await createTest(theme);
    if (newPelz) setSelectedPelz(newPelz);
  };

  const handleOpen = (incomingPelz: PelzType) => {
    setSelectedPelz(incomingPelz);
  };
  const handleClose = () => setSelectedPelz(null);

  useEffect(() => {
    loadTests(userId);
  }, [loadTests]);

  return (
    <>
      <List>
        {pelzs.map((pelz, key) => (
          <PelzListItem pelz={pelz} key={key} onSelect={handleOpen} />
        ))}
      </List>
      <PelzNewFormMenu onCreate={handleCreate} />
      <SwipeableDrawer
        disableBackdropTransition={!iOS}
        disableDiscovery={iOS}
        PaperProps={{
          style: theme.swipeable.paper,
        }}
        anchor="bottom"
        open={Boolean(selectedPelz)}
        onClose={handleClose}
        onOpen={() => {}}
      >
        <SwipeMenuHeader title={`Modifier - ${selectedPelz?.theme}`} />
        <PelzTest pelz={selectedPelz} />
        <FixedBottomToolbar>
          <StatFooter
            pelz={selectedPelz}
            onClose={() => setSelectedPelz(null)}
          />
        </FixedBottomToolbar>
      </SwipeableDrawer>
    </>
  );
};
