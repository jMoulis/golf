import styled from '@emotion/styled';
import { faSquareArrowUp } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMemo } from 'react';
import { theme } from '../../../../style/theme';
import { ThemeType } from '../../../types';
import { ThemeForm } from './ThemeForm';

const List = styled.ul`
  max-height: 100%;
`;

const ListItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
`;
const ThemeLabel = styled.span`
  font-size: 20px;
`;
const Button = styled.button`
  background-color: transparent;
  border: none;
  font-size: 30px;
  color: ${theme.colors.blue};
`;

type Props = {
  onSelectTheme: (theme: ThemeType) => void;
  selectedThemes: ThemeType[];
  themes: ThemeType[];
};

export const ThemeList = ({ onSelectTheme, selectedThemes, themes }: Props) => {
  const availableThemes = useMemo(() => {
    return themes.filter((theme) =>
      !selectedThemes.some((selectedTheme) => selectedTheme.id === theme.id)
        ? theme
        : null,
    );
  }, [selectedThemes, themes]);

  return (
    <List>
      <ListItem>
        <ThemeForm selectedTheme={null} />
      </ListItem>
      {availableThemes?.length
        ? availableThemes.map((theme) => (
            <ListItem key={theme.id}>
              <ThemeLabel>{theme.type}</ThemeLabel>
              <Button onClick={() => onSelectTheme(theme)}>
                <FontAwesomeIcon icon={faSquareArrowUp} />
              </Button>
            </ListItem>
          ))
        : null}
    </List>
  );
};
