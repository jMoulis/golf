import styled from '@emotion/styled';
import {
  faSquareArrowDown,
  faSquareArrowUp,
} from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { theme } from '../../../../style/theme';
import { DeleteButton } from '../../../commons/Buttons/DeleteButton';
import { List, ListItem } from '../../../commons/List';
import { ThemeType } from '../../../types';
import { ThemeForm } from './ThemeForm';

const ThemeLabel = styled.span`
  font-size: 20px;
`;
const CustomList = styled(List)<{ styling?: any }>`
  max-height: 58vh;
  ${({ styling }) => styling};
`;

const CustomListItem = styled(ListItem)`
  display: grid;
  align-items: center;
  grid-template-columns: 1fr auto auto;
  margin: 0;
  border-radius: 0;
  box-shadow: unset;
  border-bottom: 1px solid ${theme.colors.separator};
`;

const Button = styled.button<{ selected: boolean }>`
  background-color: transparent;
  border: none;
  font-size: 30px;
  color: ${({ selected }) =>
    selected ? theme.colors.blue : theme.colors.deleteButton};
`;

type Props = {
  onSelectTheme?: (gameTheme: ThemeType) => void;
  onDeleteTheme?: (themeId: string) => void;
  selectedThemes: ThemeType[];
  themes: ThemeType[];
  onRemoveTheme?: (themeId: string) => void;
  listStyling?: any;
};

export const ThemeList = ({
  onSelectTheme,
  selectedThemes,
  themes,
  onRemoveTheme,
  onDeleteTheme,
  listStyling,
}: Props) => {
  return (
    <CustomList styling={listStyling}>
      <CustomListItem>
        <ThemeForm selectedTheme={null} />
      </CustomListItem>
      {themes.map((gameTheme) => (
        <CustomListItem key={gameTheme.id}>
          <ThemeLabel>{gameTheme.type}</ThemeLabel>
          {onSelectTheme ? (
            <Button
              selected={selectedThemes.some(
                (selectedTheme) => selectedTheme.id === gameTheme.id
              )}
              onClick={() => onSelectTheme(gameTheme)}
            >
              <FontAwesomeIcon icon={faSquareArrowUp} />
            </Button>
          ) : null}

          {onRemoveTheme ? (
            <Button
              selected={false}
              onClick={() => onRemoveTheme(gameTheme.id)}
            >
              <FontAwesomeIcon icon={faSquareArrowDown} />
            </Button>
          ) : null}
          {onDeleteTheme ? (
            <DeleteButton onClick={() => onDeleteTheme(gameTheme.id)} />
          ) : null}
        </CustomListItem>
      ))}
    </CustomList>
  );
};
