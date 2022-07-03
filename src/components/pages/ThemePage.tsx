import styled from '@emotion/styled';
import { faTrash } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
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

type Props = {};

export const ThemePage = (props: Props) => {
  const { themes, onInit } = useThemes();
  const [selectedTheme, setSelectedTheme] = useState<ThemeType | null>(null);

  useEffect(() => {
    onInit();
  }, [onInit]);

  return (
    <div>
      ThemePage
      <List>
        {themes.map((theme) => (
          <ListItem onClick={() => setSelectedTheme(theme)} key={theme.id}>
            <span>{theme.type}</span>
            <DeleteButton
              style={{
                height: '40px',
                width: '40px',
              }}>
              <FontAwesomeIcon icon={faTrash} />
            </DeleteButton>
          </ListItem>
        ))}
      </List>
      <ThemeForm selectedTheme={selectedTheme} />
    </div>
  );
};
