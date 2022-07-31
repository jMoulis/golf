import { useEffect, useState } from 'react';
import { ENUM_PELZ_THEME } from './enums';
import { PelzTestIemShotForm } from './PelzTestIemShotForm';
import { PelzTestShot, PelzTestType } from './types';
import { usePelz } from './usePelz';
import { calculatePelzHCPByTest } from './utils';

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
    <>
      <span
        style={{
          whiteSpace: 'nowrap',
          gridColumn: '1 / 6',
          display: 'block',
          padding: '5px',
        }}
      >
        {test.id}
        <span>TOTAL</span>
        <span>
          {form.shots.reduce((acc: number, shot) => acc + shot.value, 0)}
        </span>
        <span>HCP</span>
        <span>
          {calculatePelzHCPByTest(
            form.id,
            form.shots.reduce((acc: number, shot) => acc + shot.value, 0),
            pelzTheme
          )}
        </span>
        <span>Average</span>
        {form.description.averagePoint}
      </span>

      {form.shots.map((shot, key) => (
        <PelzTestIemShotForm key={key} shot={shot} onEditShot={handleChange} />
      ))}
      {/*
      {buildArrayFromNumber(7).map((id) => (
        <span key={id} />
      ))} */}
    </>
  );
};
