import styled from '@emotion/styled';
import { faSquareArrowUp } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMemo } from 'react';
import { theme } from '../../../../style/theme';
import { List, ListItem } from '../../../commons/List';
import { ThemeType } from '../../../types';

const ThemeLabel = styled.span`
  font-size: 20px;
`;
const CustomList = styled(List)`
  min-height: 90vh;
`;

const CustomListItem = styled(ListItem)`
  display: grid;
  align-items: center;
  grid-template-columns: 1fr 30px;
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
    <CustomList>
      {availableThemes?.length
        ? availableThemes.map((theme) => (
            <CustomListItem key={theme.id}>
              <ThemeLabel>{theme.type}</ThemeLabel>
              <Button onClick={() => onSelectTheme(theme)}>
                <FontAwesomeIcon icon={faSquareArrowUp} />
              </Button>
            </CustomListItem>
          ))
        : null}
    </CustomList>
  );
};
