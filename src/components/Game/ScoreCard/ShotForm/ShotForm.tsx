import styled from '@emotion/styled';
import { faTrash } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DocumentReference } from 'firebase/firestore';
import { useState } from 'react';
import { v4 } from 'uuid';
import { ShotType } from '../../../../game';
import { theme } from '../../../../style/theme';
import { Flexbox } from '../../../commons';
import { ButtonPill } from '../../../commons/Buttons/ButtonPill';
import { DeleteButton } from '../../../commons/Buttons/DeleteButton';
import { FixedBottomToolbar } from '../../../commons/FixedBottomToolbar';
import { ShotButton } from '../../../commons/Buttons/ShotButton';
import { GameHoleType, GameType, ThemeType } from '../../../types';
import { ShotEvaluationForm } from '../ShotEvaluationForm/ShotEvaluationForm';
import { shotTypes } from './shotTypes';
import { useScoring } from './useScoring';

const Root = styled(Flexbox)`
  background-color: ${theme.colors.backgroundPage};
  flex: 1;
  align-items: flex-start;
`;

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 0 0.5rem;
`;

const CustomShotButton = styled(ShotButton)`
  height: 80px;
  width: 80px;
  font-size: 40px;
`;

type Props = {
  hole: GameHoleType | null;
  onAddShot?: (shot: ShotType, hole: GameHoleType) => void;
  gameRef: DocumentReference | null;
  onCloseDrawerParent: () => void;
  game: GameType;
  withEvaluationForm: boolean;
  onEditShot?: (shot: ShotType) => void;
};

export const ShotForm = ({
  hole,
  onAddShot,
  gameRef,
  onCloseDrawerParent,
  game,
  withEvaluationForm,
  onEditShot,
}: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const [selectedShot, setSelectedShot] = useState<ShotType | null>(null);
  const { onAddShotScoring, onRemoveShotScoring } = useScoring();
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
    if (onEditShot && newShot) {
      onEditShot(newShot.shot);
      onCloseDrawerParent();
    } else if (newShot && onAddShot) {
      onAddShot(newShot.shot, newShot.hole);
      if (withEvaluationForm) {
        setOpen(true);
      } else {
        onCloseDrawerParent();
      }
    }
  };

  const handleAddShotScoring = async (
    evaluationValue: 'KO' | 'OK',
    evaluationType: string
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
  const handleRemoveShotScoring = async (incomingTheme: ThemeType) => {
    if (gameRef) {
      const payload = onRemoveShotScoring({
        theme: incomingTheme,
        gameRef,
        selectedShot,
        hole,
        game,
      });

      if (payload?.updatedShot) {
        setSelectedShot(payload?.updatedShot as any);
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
    onCloseDrawerParent();
    setSelectedShot(null);
    setNewShot(null);
  };

  const classicShots = [
    'tee',
    'rough-left',
    'fairway',
    'rough-right',
    'putt',
    'bunker',
    'penalty',
  ];

  return (
    <>
      <Root flexDirection="column">
        <Wrapper>
          {shotTypes.map((shot, key) =>
            classicShots.includes(shot.type) ? (
              <CustomShotButton
                type="button"
                key={key}
                onClick={() => handleAddShot({ type: shot.type }, hole)}
                color={selectedShot?.type === shot?.type ? '#fff' : shot?.color}
                backgroundColor={
                  selectedShot?.type === shot?.type ? theme.colors.blue : '#fff'
                }
              >
                {shot?.icon}
              </CustomShotButton>
            ) : null
          )}
        </Wrapper>
        <FixedBottomToolbar>
          <ButtonPill onClick={handleSubmit}>Enregistrer</ButtonPill>
          <DeleteButton
            buttonStyle={{
              height: '50px',
              width: '50px',
              color: '#d73038',
            }}
            onClick={handleClose}
          />
        </FixedBottomToolbar>
      </Root>
      {withEvaluationForm ? (
        <ShotEvaluationForm
          open={open}
          gameRef={gameRef}
          onClose={handleClose}
          onOpen={() => setOpen(true)}
          onAddEvaluation={handleAddShotScoring}
          onRemoveEvaluation={handleRemoveShotScoring}
          selectedShot={selectedShot}
          hole={hole}
          game={game}
        />
      ) : null}
    </>
  );
};
