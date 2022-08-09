import styled from '@emotion/styled';
import React from 'react';
import { theme } from '../../../style/theme';
import { StartDot } from '../../Admin/Course/Starts/StartDot';

const CustomStartDot = styled(StartDot)<{ selected: boolean }>`
  border: 1px solid
    ${({ selected, color }) => (selected ? theme.colors.blue : color)};
`;

type Props = {
  starts: string[];
  onSelect: (start: string) => void;
  selectedStart: string | null;
};

export const Starts = ({ starts, onSelect, selectedStart }: Props) => {
  return (
    <div>
      {starts.map((start) => (
        <CustomStartDot
          key={start}
          color={start}
          selected={selectedStart === start}
          onClick={() => onSelect(start)}
        />
      ))}
    </div>
  );
};
