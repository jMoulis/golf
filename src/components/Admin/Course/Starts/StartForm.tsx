import styled from '@emotion/styled';
import React, { FormEvent } from 'react';
import { Flexbox } from '../../../commons';
import { Input } from '../../../commons/Input';
import { SSSSlopeType } from '../../../types';

const trad = {
  mens: 'Messieurs',
  ladies: 'Dames',
};
const Root = styled(Flexbox)`
  flex-direction: column;
  margin: 10px 0;
`;

const GenderName = styled.span`
  text-transform: uppercase;
  font-weight: bold;
`;

const InputWrapper = styled(Flexbox)`
  flex-direction: column;
`;

type Props = {
  name: 'mens' | 'ladies';
  onChange: (sssSlope: SSSSlopeType) => void;
  value: SSSSlopeType;
};

export const StartForm = ({ name, onChange, value }: Props) => {
  const handleInputChange = (event: FormEvent<HTMLInputElement>) => {
    const { name, value: inputValue } = event.currentTarget;
    if (value) {
      onChange({
        ...value,
        [name]: Number(inputValue),
      });
    }
  };
  return (
    <Root>
      <GenderName>{trad[name]}</GenderName>
      <InputWrapper>
        <span>Slope</span>
        <Input
          onChange={handleInputChange}
          name="slope"
          type="number"
          inputMode="numeric"
          value={value?.slope || ''}
        />
      </InputWrapper>
      <InputWrapper>
        <span>SSS</span>
        <Input
          onChange={handleInputChange}
          name="sss"
          type="number"
          inputMode="numeric"
          value={value?.sss || ''}
        />
      </InputWrapper>
    </Root>
  );
};
