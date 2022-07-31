import styled from '@emotion/styled';
import { FormEvent, useEffect, useState } from 'react';
import { PelzTestShot } from './types';

const Input = styled.input`
  max-width: 100%;
  width: 0;
  height: 50px;
  min-width: 100%;
  text-align: center;
  border: 1px solid gray;
  border-radius: 3px;
  font-size: 20px;
`;

type Props = {
  shot: PelzTestShot;
  onEditShot: (shot: PelzTestShot) => void;
};

export const PelzTestIemShotForm = ({ shot, onEditShot }: Props) => {
  const [value, setValue] = useState<number>();

  useEffect(() => {
    setValue(shot.value);
  }, [shot]);

  const handleChange = (event: FormEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setValue(Number(value));
  };

  const handleBlur = () => {
    if (value === shot.value) return null;
    if (typeof value === undefined) return null;
    onEditShot({
      ...shot,
      value: value as number,
    });
  };
  return (
    <>
      <Input
        onBlur={handleBlur}
        onChange={handleChange}
        type="number"
        value={value || 0}
        min="0"
        max="4"
      />
    </>
  );
};
