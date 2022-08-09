import styled from '@emotion/styled';
import { FormEvent, useEffect, useState } from 'react';
import { Flexbox } from '../../../commons';
import { DeleteButton } from '../../../commons/Buttons/DeleteButton';
import { Input } from '../../../commons/Input';
import {
  CourseDistanceType,
  HoleCourseType,
  StartCourseType,
} from '../../../types';
import { DistanceForm } from './DistanceForm';

const CustomInput = styled(Input)`
  width: 50px;
`;

const InputWrapper = styled(Flexbox)`
  margin: 5px;
`;

type Props = {
  hole: HoleCourseType;
  onChange: (hole: HoleCourseType) => void;
  onDelete: (holeRef?: string) => void;
  starts: Record<string, StartCourseType>;
};

export const HoleForm = ({ hole, onChange, onDelete, starts }: Props) => {
  const [holeForm, setHoleForm] = useState<HoleCourseType>();

  useEffect(() => {
    if (hole) {
      setHoleForm(hole);
    }
  }, [hole]);

  const handleChange = (event: FormEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;
    if (holeForm) {
      const updatedHole = {
        ...holeForm,
        [name]: Number(value),
      };
      setHoleForm(updatedHole);
    }
  };

  const handleOnBlur = () => {
    if (holeForm) {
      onChange(holeForm);
    }
  };

  const handleSubmit = (distances: CourseDistanceType) => {
    if (holeForm) {
      const updatedHole = {
        ...holeForm,
        distances,
      };
      setHoleForm(updatedHole);
      onChange(updatedHole);
    }
  };
  return (
    <Flexbox justifyContent="space-between" alignItems="flex-end">
      <Flexbox>
        <InputWrapper flexDirection="column">
          <span>Numéro</span>
          <CustomInput
            onChange={handleChange}
            type="number"
            name="number"
            value={holeForm?.number || ''}
            onBlur={handleOnBlur}
          />
        </InputWrapper>
        <InputWrapper flexDirection="column">
          <span>par</span>
          <CustomInput
            onChange={handleChange}
            type="number"
            name="par"
            value={holeForm?.par || ''}
            onBlur={handleOnBlur}
          />
        </InputWrapper>
        <InputWrapper flexDirection="column">
          <span>Hcp</span>
          <CustomInput
            onChange={handleChange}
            type="number"
            name="hcp"
            value={holeForm?.hcp || ''}
            onBlur={handleOnBlur}
          />
        </InputWrapper>
        <DistanceForm hole={holeForm} starts={starts} onSubmit={handleSubmit} />
      </Flexbox>
      <DeleteButton onClick={() => onDelete(hole.ref)} />
    </Flexbox>
  );
};
