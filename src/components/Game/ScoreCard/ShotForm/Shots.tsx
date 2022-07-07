import styled from '@emotion/styled';
import { faSquarePlus, faTrash } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DocumentReference, setDoc } from 'firebase/firestore';
import { useState } from 'react';
import { ShotType } from '../../../../game';
import { theme } from '../../../../style/theme';
import { ShotButton } from '../../../commons/ShotButton';
import { GameHoleType, GameType } from '../../../types';
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

const DeleteButton = styled.button<{
  color?: string;
  backgroundColor?: string;
}>`
  border: none;
  font-size: 15px;
  margin: 0.25rem;
  width: 110px;
  height: 40px;
  color: ${({ color }) => color};
  border-radius: 5px;
  background-color: ${({ backgroundColor }) => backgroundColor || '#f8d7da'};
  & span {
    display: inline-block;
    margin-left: 5px;
    font-size: 15px;
  }
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
  const { onAddShotScoring } = useScoring();
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

  const handleDelete = () => {
    if (selectedShot && gameRef) {
      const updatedShots = hole.shots?.filter(
        (shot) => shot.id !== selectedShot.id,
      );
      setDoc(
        gameRef,
        {
          holes: {
            [hole.ref]: {
              shots: updatedShots,
            },
          },
        },
        { merge: true },
      );
      setSelectedShot(null);
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
        selectedShot={selectedShot}
        open={Boolean(selectedShot)}
        hole={hole}
        onOpen={() => {}}
        game={game}
        gameRef={gameRef}
        onClose={() => setSelectedShot(null)}>
        <DeleteButton onClick={handleDelete} color='#d73038'>
          <FontAwesomeIcon icon={faTrash} />
          <span>Delete shot</span>
        </DeleteButton>
      </ShotEvaluationForm>
    </>
  );
};
