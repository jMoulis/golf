import styled from '@emotion/styled';
import { faTrash } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Collapse } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { theme } from '../../../style/theme';
import { Flexbox } from '../../commons';
import { CollapseCard } from '../../commons/CollapseCard';
import { ThemeType } from '../../types';
import { ThemeForm } from '../ScoreCard/ThemeForm/ThemeForm';
import { ThemeList } from '../ScoreCard/ThemeForm/ThemeList';
import { useThemes } from '../ScoreCard/ThemeForm/useThemes';

const ThemeTag = styled.div`
  padding: 5px;
  border-radius: 3px 0 0 3px;
  background-color: ${theme.colors.lightPink};
  margin: 5px 0;
  display: flex;
  align-items: center;
`;

const ThemeDeleteButton = styled.button`
  border: none;
  padding: 5px;
  border-radius: 0 3px 3px 0;
  color: #d73038;
  background-color: #f8d7da;
  margin: 5px 0;
  margin-right: 5px;
  font-size: 20px;
`;

type Props = {
  selectedThemes: ThemeType[];
  onRemoveTheme: (themeID: string) => void;
  onSelectTheme: (theme: ThemeType) => void;
};

export const GameThemeForm = ({
  selectedThemes,
  onRemoveTheme,
  onSelectTheme,
}: Props) => {
  const { themes, onInit } = useThemes();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    onInit();
  }, [onInit]);

  return (
    <CollapseCard title='Themes' onAdd={() => setOpen((prev) => !prev)}>
      <Flexbox flexWrap='wrap'>
        {selectedThemes.map((theme) => (
          <Flexbox key={theme.id}>
            <ThemeTag>{theme.type}</ThemeTag>
            <ThemeDeleteButton onClick={() => onRemoveTheme(theme.id)}>
              <FontAwesomeIcon icon={faTrash} />
            </ThemeDeleteButton>
          </Flexbox>
        ))}
      </Flexbox>

      <Collapse in={open}>
        <ThemeForm selectedTheme={null} />
      </Collapse>

      <ThemeList
        onSelectTheme={onSelectTheme}
        selectedThemes={selectedThemes}
        themes={themes}
      />
    </CollapseCard>
  );
};
