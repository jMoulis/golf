import styled from '@emotion/styled';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Collapse } from '@mui/material';
import { useEffect, useState } from 'react';
import { useToggle } from '../../../../hooks/useToggle';
import { theme } from '../../../../style/theme';
import { removeForbiddenKeys } from '../../../../utils/global.utils';
import { Flexbox } from '../../../commons';
import { ButtonPill } from '../../../commons/Buttons/ButtonPill';
import { DeleteButton } from '../../../commons/Buttons/DeleteButton';
import { FixedBottomToolbar } from '../../../commons/FixedBottomToolbar';
import { SwipableDefault } from '../../../commons/SwipableDefault';
import { SSSSlopeType, StartCourseType } from '../../../types';
import { defaultStarts } from '../utils';
import { StartDot } from './StartDot';
import { StartForm } from './StartForm';

const Root = styled(Flexbox)`
  height: 50px;
`;

const FormContent = styled(Flexbox)`
  background-color: #fff;
  margin: 10px;
  padding: 10px;
  border-radius: 10px;
  flex-direction: column;
`;

const StartWrapper = styled(Flexbox)<{ open: boolean }>`
  margin: 5px 0;
  border-radius: 10px;
  box-shadow: ${theme.shadows.flatButton};
`;

type Props = {
  onSelect: (start: Record<string, StartCourseType>) => void;
  selectedStarts: Record<string, StartCourseType>;
};

export const Starts = ({ onSelect, selectedStarts }: Props) => {
  const [form, setForm] = useState<Record<string, StartCourseType>>({});
  const [open, setOpen] = useState(false);
  const [selectedStart, setSeletedStart] = useState<string | null>(null);
  const {
    onClose: onSwipeClose,
    onOpen: onSwipeOpen,
    open: swipeOpen,
  } = useToggle();

  useEffect(() => {
    setForm(selectedStarts);
  }, [selectedStarts]);

  const handleSelectStart = (start: string) => {
    onSwipeOpen();
    setSeletedStart(start);
  };

  const handleChangeStart = (
    gender: 'mens' | 'ladies',
    value: SSSSlopeType,
    start: string | null
  ) => {
    if (!start) return null;
    const updatedForm = {
      ...form,
      [start]: {
        ...form[start],
        [gender]: value,
      },
    };
    setForm(updatedForm);
    onSelect(updatedForm);
  };

  const handleDeleteStart = (start: string) => {
    const updatedForm = removeForbiddenKeys(form, [start]);
    setForm(updatedForm);
    onSelect(updatedForm);
    onSwipeClose();
  };
  return (
    <>
      <Root alignItems="center">
        <Flexbox style={{ margin: '5px 0' }}>
          {Object.keys(selectedStarts).map((start, key) => (
            <StartDot
              color={start}
              key={key}
              onClick={() => handleSelectStart(start)}
            />
          ))}
        </Flexbox>
        <DeleteButton
          buttonStyle={{
            width: '30px',
            height: '30px',
            minWidth: '30px',
            minHeight: '30px',
          }}
          icon={open ? faTimes : faPlus}
          onClick={() => setOpen((prev) => !prev)}
        />
      </Root>
      <Collapse in={open}>
        <StartWrapper open={open}>
          {defaultStarts.map((start, key) => (
            <StartDot
              color={start}
              key={key}
              onClick={() => handleSelectStart(start)}
            />
          ))}
        </StartWrapper>
      </Collapse>
      <SwipableDefault
        title="Configure repère"
        open={swipeOpen}
        onClose={onSwipeClose}
        onOpen={onSwipeOpen}
      >
        {selectedStart ? (
          <FormContent>
            <span>Repère sélectionné</span>
            <StartDot color={selectedStart || ''} />
            <StartForm
              name="mens"
              onChange={(value) =>
                handleChangeStart('mens', value, selectedStart)
              }
              value={form[selectedStart]?.mens || { slope: 0, sss: 0 }}
            />
            <StartForm
              name="ladies"
              onChange={(value) =>
                handleChangeStart('ladies', value, selectedStart)
              }
              value={form[selectedStart]?.ladies || { slope: 0, sss: 0 }}
            />
          </FormContent>
        ) : null}
        <FixedBottomToolbar>
          <ButtonPill onClick={onSwipeClose}>ENregistrer</ButtonPill>
          <DeleteButton
            onClick={() => selectedStart && handleDeleteStart(selectedStart)}
          />
        </FixedBottomToolbar>
      </SwipableDefault>
    </>
  );
};
