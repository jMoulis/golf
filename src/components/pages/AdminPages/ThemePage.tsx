import React, { useEffect } from 'react';
import { ThemeList } from '../../Game/ScoreCard/ThemeForm/ThemeList';
import { useThemes } from '../../Game/ScoreCard/ThemeForm/useThemes';

export const ThemePage = () => {
  const { themes, onInit, onDeleteTheme } = useThemes();

  useEffect(() => {
    onInit();
  }, [onInit]);

  return (
    <ThemeList
      listStyling={{
        maxHeight: '80vh',
        margin: '10px',
      }}
      onDeleteTheme={onDeleteTheme}
      selectedThemes={[]}
      themes={themes}
    />
  );
};
