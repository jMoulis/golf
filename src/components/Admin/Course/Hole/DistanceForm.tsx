import styled from '@emotion/styled';
import React, { FormEvent, useEffect, useMemo, useState } from 'react';
import { useToggle } from '../../../../hooks/useToggle';
import { theme } from '../../../../style/theme';
import { Flexbox } from '../../../commons';
import { ButtonPill } from '../../../commons/Buttons/ButtonPill';
import { FixedBottomToolbar } from '../../../commons/FixedBottomToolbar';
import { Input } from '../../../commons/Input';
import { SwipableDefault } from '../../../commons/SwipableDefault';
import {
  CourseDistanceType,
  HoleCourseType,
  StartCourseType,
} from '../../../types';
import { orderStarts } from '../utils';

const Root = styled(Flexbox)`
  align-items: center;
`;
const StartWrapper = styled(Flexbox)`
  flex-wrap: wrap;
`;

const StartDot = styled.div<{ color: string }>`
  background-color: ${({ color }) => color};
  border: 1px solid ${({ color }) => (color === 'white' ? 'gray' : color)};
  height: 20px;
  width: 20px;
  min-height: 20px;
  min-width: 20px;
  border-radius: 100px;
  margin: 2px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

type Props = {
  hole?: HoleCourseType;
  starts: Record<string, StartCourseType>;
  onSubmit: (distances: CourseDistanceType) => void;
};

export const DistanceForm = ({ starts, hole, onSubmit }: Props) => {
  const { open, onOpen, onClose } = useToggle();
  const [form, setForm] = useState<CourseDistanceType>({});

  useEffect(() => {
    if (hole?.distances) {
      setForm(hole.distances);
    } else {
      setForm({});
    }
  }, [hole?.distances]);

  const handleInputChange = (event: FormEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;
    setForm((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  const handleSubmit = () => {
    onSubmit(form);
    onClose();
  };

  const orderedStarts = useMemo(() => {
    return orderStarts(starts);
  }, [starts]);

  return (
    <Root>
      <StartWrapper onClick={onOpen}>
        {Object.keys(orderedStarts).map((startKey) => (
          <StartDot color={startKey} key={startKey} />
        ))}
      </StartWrapper>
      <SwipableDefault
        title="Modifier distance"
        onClose={onClose}
        onOpen={onOpen}
        open={open}
      >
        <Flexbox
          justifyContent="space-around"
          flexDirection="column"
          style={{
            backgroundColor: '#fff',
            padding: '5px',
            borderRadius: '10px',
            margin: '10px',
          }}
        >
          Hole: {hole?.number}
          {Object.keys(orderedStarts).map((startKey) => (
            <Flexbox
              key={startKey}
              alignItems="center"
              style={{
                margin: '2px',
                position: 'relative',
                border: `1px solid ${theme.colors.blue}`,
                borderRadius: '3px',
              }}
            >
              <StartDot color={startKey} />
              <Input
                name={startKey}
                style={{
                  maxWidth: '100%',
                  border: 'none',
                }}
                type="number"
                inputMode="numeric"
                onChange={handleInputChange}
                value={form[startKey] || ''}
              />
            </Flexbox>
          ))}
        </Flexbox>
        <FixedBottomToolbar>
          <ButtonPill onClick={handleSubmit}>ENREGISTRER</ButtonPill>
        </FixedBottomToolbar>
      </SwipableDefault>
    </Root>
  );
};
