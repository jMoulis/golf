import styled from '@emotion/styled';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormEvent, useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../../../firebase';
import { theme } from '../../../../style/theme';
import { Flexbox } from '../../../commons';
import { ShotButton } from '../../../commons/ShotButton';
import { ThemeType, ThemeTypeInput } from '../../../types';
import { useThemes } from './useThemes';

const Form = styled.form`
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid ${theme.colors.blue};
  border-radius: 3px;
  font-size: 17px;
  &::placeholder {
    font-style: italic;
  }
`;

type Props = {
  selectedTheme: ThemeType | null;
  onUpdate?: () => void;
};

export const ThemeForm = ({ selectedTheme, onUpdate }: Props) => {
  const [input, setInput] = useState<string>('');
  const { onUpdateTheme, onAddTheme } = useThemes();
  const [user] = useAuthState(auth);

  useEffect(() => {
    if (selectedTheme?.type) {
      setInput(selectedTheme.type);
    }
  }, [selectedTheme]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return null;

    if (selectedTheme) {
      onUpdateTheme({ id: selectedTheme.id, type: input });
    } else {
      const theme: ThemeTypeInput = {
        type: input,
        userId: user?.uid,
      };
      onAddTheme(theme);
    }
    if (onUpdate) {
      onUpdate();
    }
    setInput('');
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Input
        placeholder='Nom du thème'
        value={input}
        onChange={(event) => setInput(event.currentTarget.value)}
      />
      <Flexbox
        justifyContent='flex-end'
        style={{
          padding: '5px',
        }}>
        <ShotButton
          style={{
            height: '40px',
            width: '40px',
          }}
          type='submit'
          color='#fff'
          backgroundColor={theme.colors.saveButton}>
          <FontAwesomeIcon icon={faPlus} />
        </ShotButton>
      </Flexbox>
    </Form>
  );
};
