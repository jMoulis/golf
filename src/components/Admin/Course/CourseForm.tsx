import styled from '@emotion/styled';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { ButtonPill } from '../../commons/ButtonPill';
import { FixedBottomToolbar } from '../../commons/FixedBottomToolbar';
import { FloatingButton } from '../../commons/FloatingButton';
import { Input } from '../../commons/Input';
import { BOTTOM_NAVBAR_HEIGHT, FLOATING_HEIGHT } from '../../cssConstants';
import { CourseType, HoleCourseType } from '../../types';
import { HoleForm } from './HoleForm';
import { sortHoles } from './utils';
import Menu from '@mui/material/Menu';
import { ShotButton } from '../../commons/ShotButton';
import { DeleteButton } from '../../commons/DeleteButton';
import { List, ListItem } from '../../commons/List';
import { getCoursePar } from '../../../utils/scoreUtils';
import { Flexbox } from '../../commons';
import { FormInputError } from '../../commons/FormInputError';

const CustomList = styled(List)`
  padding-bottom: calc(${BOTTOM_NAVBAR_HEIGHT} + ${FLOATING_HEIGHT});
`;

const CustomListItem = styled(ListItem)`
  align-items: center;
  grid-template-columns: 1fr auto auto;
  margin: 0;
  border-radius: 0;
  box-shadow: unset;
`;

const CustomShotButton = styled(ShotButton)`
  width: 150px;
  font-size: 20px;
`;

type Props = {
  selectedCourse: CourseType | null;
  onSubmit: (course: CourseType) => void;
  onClose: () => void;
};

export const CourseForm = ({ selectedCourse, onSubmit, onClose }: Props) => {
  const defaultForm = useRef<CourseType>({
    name: '',
    holes: [],
    par: 0,
  });
  const [form, setForm] = useState<CourseType>({
    name: '',
    holes: [],
    par: 0,
  });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    if (selectedCourse) {
      setForm(selectedCourse);
    } else {
      setForm(defaultForm.current);
    }
  }, [selectedCourse]);

  useEffect(() => {
    const prevDefaultForm = defaultForm.current;
    return () => {
      setForm(prevDefaultForm);
    };
  }, []);

  const handleHoleChange = (updatedHole: HoleCourseType) => {
    console.log(updatedHole);
    const prevHoles = form?.holes || [];
    const prevHole = prevHoles.find(
      (prevHole) => prevHole.ref === updatedHole.ref,
    );
    if (prevHole) {
      const updatedHoles = prevHoles.map((prevHole) =>
        prevHole.ref === updatedHole.ref ? updatedHole : prevHole,
      );
      console.log(updatedHoles);
      setForm((prevForm) => ({
        ...prevForm,
        holes: updatedHoles,
      }));
    } else {
      const updatedHoles = [...prevHoles, updatedHole];
      setForm((prevForm) => ({
        ...prevForm,
        holes: updatedHoles,
      }));
    }
  };

  const handleChangeName = (event: FormEvent<HTMLInputElement>) => {
    const { value, name } = event.currentTarget;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: name === 'par' ? Number(value) : value,
    }));
  };

  const handleAddHole = (countHole: number) => {
    const prevHoles = form?.holes || [];

    const getLastNumber = (prevHoles[prevHoles.length - 1]?.number || 0) + 1;

    const countHoles = Array.from(
      { length: countHole },
      (_, index) => index + getLastNumber,
    );

    const newHoles: HoleCourseType[] = countHoles.map((holeId) => ({
      number: holeId,
      ref: `hole-${holeId}`,
    }));

    setForm((prevForm) => ({
      ...prevForm,
      holes: sortHoles([...prevForm.holes, ...newHoles]),
    }));
    setAnchorEl(null);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteHole = (holeRef?: string) => {
    const updatedHoles = sortHoles(
      form.holes.filter((prevHole) => prevHole.ref !== holeRef),
    );
    setForm((prevForm) => ({
      ...prevForm,
      holes: updatedHoles,
    }));
  };

  const guessedPar = useMemo(() => {
    const par = getCoursePar(form.holes);
    return par;
  }, [form.holes]);

  return (
    <>
      <CustomList>
        <CustomListItem>
          <Input
            name='name'
            placeholder='Nom du parcours'
            value={form?.name || ''}
            onChange={handleChangeName}
          />
          <Flexbox alignItems='flex-end'>
            <Flexbox flexDirection='column'>
              <span>PAR</span>
              <Input
                name='par'
                placeholder='Par'
                value={form?.par || ''}
                onChange={handleChangeName}
                style={{
                  width: '100px',
                }}
              />
            </Flexbox>
            {guessedPar !== form.par ? (
              <FormInputError>
                Le total des pars par trou ne correspond par au par global
              </FormInputError>
            ) : null}
          </Flexbox>
        </CustomListItem>
        {form?.holes
          ? form.holes.map((hole, key) => (
              <ListItem key={key}>
                <HoleForm
                  onChange={handleHoleChange}
                  hole={hole}
                  onDelete={handleDeleteHole}
                />
              </ListItem>
            ))
          : null}
      </CustomList>

      <FloatingButton
        // onClick={handleAddHole}
        backgroundColor='#000'
        id='demo-positioned-button'
        aria-controls={open ? 'demo-positioned-menu' : undefined}
        aria-haspopup='true'
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        color='#fff'>
        <FontAwesomeIcon icon={faPlus} size='3x' />
      </FloatingButton>
      <Menu
        id='positioned-menu'
        aria-labelledby='positioned-button'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
        PaperProps={{
          style: {
            marginLeft: '-20px',
            background: 'transparent',
            boxShadow: 'none',
          },
        }}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}>
        <CustomShotButton onClick={() => handleAddHole(9)}>
          9 holes
        </CustomShotButton>
        <CustomShotButton onClick={() => handleAddHole(18)}>
          18 holes
        </CustomShotButton>
        <CustomShotButton onClick={() => handleAddHole(1)}>
          1 hole
        </CustomShotButton>
      </Menu>
      <FixedBottomToolbar>
        <ButtonPill disabled={!form.name} onClick={() => onSubmit(form)}>
          ENREGISTRER
        </ButtonPill>
        <DeleteButton onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </DeleteButton>
      </FixedBottomToolbar>
    </>
  );
};
