import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { ENUM_PELZ_THEME } from '../../enums';
import { PelzTestIemShotForm } from './PelzTestIemShotForm';
import { TestItemShotHeader } from './TestItemShotHeader';
import { PelzTestShot, PelzTestType } from '../../types';
import { usePelz } from '../../usePelz';
import { theme } from '../../../../../style/theme';

const Root = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 5px;
  padding: 10px;
  background-color: #fff;
  margin: 10px;
  box-shadow: ${theme.shadows.listItem};
`;

type Props = {
  test: PelzTestType;
  pelzID: string;
  pelzTheme: ENUM_PELZ_THEME;
};

export const PelzTestItemForm = ({ test, pelzID, pelzTheme }: Props) => {
  const [form, setForm] = useState<PelzTestType>(test);
  const { onEditPelz } = usePelz();

  useEffect(() => {
    setForm(test);
  }, [test]);

  const handleChange = (editedShot: PelzTestShot) => {
    const updatedShots = form.shots.map((shot) => {
      if (shot.id === editedShot.id) {
        return editedShot;
      }
      return shot;
    });
    const updatedForm = {
      ...form,
      shots: updatedShots,
    };
    setForm(updatedForm);
    onEditPelz({ tests: { [test.id]: updatedForm } }, pelzID);
  };

  return (
    <Root>
      <TestItemShotHeader form={form} theme={pelzTheme} />
      {form.shots.map((shot, key) => (
        <PelzTestIemShotForm key={key} shot={shot} onEditShot={handleChange} />
      ))}
    </Root>
  );
};
