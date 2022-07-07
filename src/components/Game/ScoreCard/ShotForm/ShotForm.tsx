import styled from '@emotion/styled';
import { faCheck, faTrash } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DocumentReference } from 'firebase/firestore';
import { useState } from 'react';
import { v4 } from 'uuid';
import { ShotType } from '../../../../game';
import { theme } from '../../../../style/theme';
import { Flexbox } from '../../../commons';
import { ShotButton } from '../../../commons/ShotButton';
import { GameHoleType, GameType } from '../../../types';
import { ShotEvaluationForm } from '../ShotEvaluationForm/ShotEvaluationForm';
import { shotTypes } from './shotTypes';
import { useScoring } from './useScoring';

const SubmitButton = styled.button<{
  color?: string;
  backgroundColor?: string;
}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 5px;
  border: none;
  font-size: 30px;
  margin: 0.25rem;
  color: ${({ color }) => color};
  border-radius: 5px;
  background-color: ${({ backgroundColor }) => backgroundColor || '#f8d7da'};
  & span {
    font-size: 15px;
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  padding: 0.5rem;
  background-color: #fff;
`;

type Props = {
  hole: GameHoleType | null;
  onAddShot: (shot: ShotType, hole: GameHoleType) => void;
  gameRef: DocumentReference | null;
  onCloseDrawerParent: () => void;
  game: GameType;
};

export const ShotForm = ({
  hole,
  onAddShot,
  gameRef,
  onCloseDrawerParent,
  game,
}: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const [selectedShot, setSelectedShot] = useState<ShotType | null>(null);
  const { onAddShotScoring } = useScoring();
  const [newShot, setNewShot] = useState<{
    shot: ShotType;
    hole: GameHoleType;
  } | null>(null);

  const handleAddShot = (incomingShot: ShotType, hole: any) => {
    if (hole) {
      const shotId = v4();
      const newShot = { ...incomingShot, id: shotId };
      setNewShot({ shot: newShot, hole });
      setSelectedShot(newShot);
    }
  };

  const handleSubmit = () => {
    if (newShot) {
      onAddShot(newShot.shot, newShot.hole);
      setOpen(true);
    }
  };

  const handleAddShotScoring = async (
    evaluationValue: 'KO' | 'OK',
    evaluationType: string,
  ) => {
    const payload = onAddShotScoring({
      evaluation: { type: evaluationType, value: evaluationValue },
      gameRef,
      selectedShot,
      hole,
    });
    if (payload?.updatedShot) {
      setSelectedShot(payload?.updatedShot);
    }
  };

  const handleClose = () => {
    setOpen(false);
    onCloseDrawerParent();
    setSelectedShot(null);
    setNewShot(null);
  };

  const classicShots = ['tee', 'rough-left', 'fairway', 'rough-right', 'putt'];
  const troubleShots = ['bunker', 'penalty'];

  return (
    <>
      <Flexbox flexDirection='column'>
        <Wrapper>
          {shotTypes.map((shot, key) =>
            classicShots.includes(shot.type) ? (
              <ShotButton
                type='button'
                key={key}
                onClick={() => handleAddShot({ type: shot.type }, hole)}
                color={selectedShot?.type === shot?.type ? '#fff' : shot?.color}
                backgroundColor={
                  selectedShot?.type === shot?.type ? theme.colors.blue : '#fff'
                }>
                {shot?.icon}
              </ShotButton>
            ) : null,
          )}
        </Wrapper>
        <Wrapper>
          {shotTypes.map((shot, key) =>
            troubleShots.includes(shot.type) ? (
              <ShotButton
                type='button'
                key={key}
                onClick={() => handleAddShot({ type: shot.type }, hole)}
                color={selectedShot?.type === shot?.type ? '#fff' : shot?.color}
                backgroundColor={
                  selectedShot?.type === shot?.type ? theme.colors.blue : '#fff'
                }>
                {shot?.icon}
              </ShotButton>
            ) : null,
          )}
        </Wrapper>
        <Flexbox>
          <SubmitButton
            onClick={handleSubmit}
            color={theme.colors.blue}
            backgroundColor={theme.colors.blueGreen}>
            <FontAwesomeIcon icon={faCheck} />
          </SubmitButton>
          <SubmitButton onClick={handleClose} color='#d73038'>
            <FontAwesomeIcon icon={faTrash} />
          </SubmitButton>
        </Flexbox>
      </Flexbox>
      <ShotEvaluationForm
        open={open}
        gameRef={gameRef}
        onClose={handleClose}
        onOpen={() => setOpen(true)}
        onAddEvaluation={handleAddShotScoring}
        selectedShot={selectedShot}
        hole={hole}
        game={game}
      />
    </>
  );
};
