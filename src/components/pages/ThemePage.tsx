import styled from '@emotion/styled';
import { faTrash } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { GoBackLink } from '../Admin/GoBackLink';
import { Flexbox } from '../commons';
import { DeleteButton } from '../commons/DeleteButton';
import { ThemeForm } from '../Game/ScoreCard/ThemeForm/ThemeForm';
import { useThemes } from '../Game/ScoreCard/ThemeForm/useThemes';
import { ThemeType } from '../types';

const List = styled.ul``;
const ListItem = styled.li`
  font-size: 17px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 10px;
`;

export const ThemePage = () => {
  const { themes, onInit, onDeleteTheme } = useThemes();
  const [selectedTheme, setSelectedTheme] = useState<ThemeType | null>(null);

  useEffect(() => {
    onInit();
  }, [onInit]);

  return (
    <div>
      <GoBackLink />
      ThemePage
      <List>
        {themes.map((theme) => (
          <ListItem key={theme.id}>
            <Flexbox flex='1' onClick={() => setSelectedTheme(theme)}>
              <span>{theme.type}</span>
            </Flexbox>
            <DeleteButton
              onClick={() => onDeleteTheme(theme.id)}
              style={{
                height: '40px',
                width: '40px',
              }}>
              <FontAwesomeIcon icon={faTrash} />
            </DeleteButton>
          </ListItem>
        ))}
      </List>
      <ThemeForm
        selectedTheme={selectedTheme}
        onUpdate={() => setSelectedTheme(null)}
      />
    </div>
  );
};
