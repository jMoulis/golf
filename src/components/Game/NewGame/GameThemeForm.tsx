import { SwipeableDrawer } from '@mui/material';
import React, { useEffect } from 'react';
import { theme } from '../../../style/theme';
import { ButtonPill } from '../../commons/Buttons/ButtonPill';
import { FixedBottomToolbar } from '../../commons/FixedBottomToolbar';
import { SwipeMenuHeader } from '../../commons/SwipeMenuHeader';
import { ThemeType } from '../../types';
import { ThemeList } from '../ScoreCard/ThemeForm/ThemeList';
import { useThemes } from '../ScoreCard/ThemeForm/useThemes';

type Props = {
  selectedThemes: ThemeType[];
  onRemoveTheme: (themeID: string) => void;
  onSelectTheme: (incomingTheme: ThemeType) => void;
  open: boolean;
  onClose: () => void;
};

export const GameThemeForm = ({
  selectedThemes,
  onRemoveTheme,
  onSelectTheme,
  open,
  onClose,
}: Props) => {
  const { themes, onInit } = useThemes();

  useEffect(() => {
    onInit();
  }, [onInit]);

  return (
    <SwipeableDrawer
      anchor="bottom"
      PaperProps={{
        style: theme.swipeable.paper,
      }}
      onClose={onClose}
      onOpen={() => {}}
      open={open}
    >
      <SwipeMenuHeader title="Themes" />
      <ThemeList
        listStyling={{
          maxHeight: 'calc(100% - 80px)',
        }}
        onSelectTheme={onSelectTheme}
        selectedThemes={selectedThemes}
        themes={themes}
        onRemoveTheme={onRemoveTheme}
      />
      <FixedBottomToolbar>
        <ButtonPill onClick={onClose}>Valider</ButtonPill>
      </FixedBottomToolbar>
    </SwipeableDrawer>
  );
};
