import styled from '@emotion/styled';
import { faSquarePlus } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DocumentReference, increment, setDoc } from 'firebase/firestore';
import { useState } from 'react';
import { ShotType } from '../../../../game';
import { theme } from '../../../../style/theme';
import { ShotButton } from '../../../commons/Buttons/ShotButton';
import { GameHoleType, GameType, ThemeType } from '../../../types';
import { ShotEvaluationForm } from '../ShotEvaluationForm/ShotEvaluationForm';
import { Shot } from './Shot';
import { shotTypesByTypes } from './shotTypes';
import { useScoring } from './useScoring';

const Root = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  border-radius: 3px;
  flex-wrap: wrap;
`;

type Props = {
  shots: ShotType[];
  hole: GameHoleType;
  gameRef: DocumentReference | null;
  onOpenForm: (event: React.KeyboardEvent | React.MouseEvent) => void;
  selectedHole: boolean;
  game: GameType;
};

export const Shots = ({
  shots,
  gameRef,
  hole,
  onOpenForm,
  selectedHole,
  game,
}: Props) => {
  const [selectedShot, setSelectedShot] = useState<ShotType | null>(null);
  const { onAddShotScoring, onRemoveShotScoring } = useScoring();

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

  const handleRemoveEval = async (incomingTheme: ThemeType) => {
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

  const handleDelete = () => {
    if (selectedShot && gameRef) {
      const updatedShots = hole.shots?.filter(
        (shot) => shot.id !== selectedShot.id
      );
      setDoc(
        gameRef,
        {
          strokeBrut: increment(-1),
          holes: {
            [hole.ref]: {
              shots: updatedShots,
            },
          },
        },
        { merge: true }
      );
      setSelectedShot(null);
    }
  };

  const handleEditShot = async (incomingShot: ShotType) => {
    const updateShots = (prevShots: ShotType[], updatedShot: ShotType) => {
      return prevShots.map((prevShot) => {
        if (prevShot.id === updatedShot.id) {
          return { ...prevShot, ...updatedShot };
        }
        return prevShot;
      });
    };
    if (gameRef && selectedShot) {
      const updatedShot = { ...selectedShot, type: incomingShot.type };
      setSelectedShot(updatedShot);
      const updatedShots = updateShots(hole.shots, updatedShot);
      await setDoc(
        gameRef,
        {
          holes: {
            [hole.ref]: {
              shots: updatedShots,
            },
          },
        },
        {
          merge: true,
        }
      );
    }
  };

  return (
    <>
      <Root>
        {shots?.length
          ? shots?.map((shot, key) => {
              const typedShot = (shotTypesByTypes as any)[shot.type];
              return (
                <Shot
                  key={key}
                  typedShot={typedShot}
                  onSelectShot={setSelectedShot}
                  shot={shot}
                />
              );
            })
          : null}
        {selectedHole ? (
          <ShotButton color={theme.colors.blue} onClick={onOpenForm}>
            <FontAwesomeIcon icon={faSquarePlus as any} />
          </ShotButton>
        ) : null}
      </Root>

      <ShotEvaluationForm
        onAddEvaluation={handleAddShotScoring}
        onEditShot={handleEditShot}
        onRemoveEvaluation={handleRemoveEval}
        onDeleteShot={handleDelete}
        selectedShot={selectedShot}
        open={Boolean(selectedShot)}
        hole={hole}
        onOpen={() => {}}
        game={game}
        gameRef={gameRef}
        onClose={() => setSelectedShot(null)}
      />
    </>
  );
};
