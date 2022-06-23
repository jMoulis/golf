import styled from '@emotion/styled';
import { faTrash } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { addDoc, collection, doc, DocumentReference } from 'firebase/firestore';
import { useState } from 'react';
import { Flexbox } from '../../../commons';
import { Modal } from '../../../commons/Modal';
import { InfoMessage } from '../../StyledComponents/InfoMessage';
import { shotEvaluations } from './shotQuality';
import { shotTypesByTypes } from './shotTypes';

const Root = styled.ul`
  flex: 1;
  min-height: 5rem;
  background-color: lightgray;
  margin: 0.5rem;
  border-radius: 3px;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  padding: 5px;
  min-width: 90vw;
`;

const ShotButton = styled.button<{
  color?: string;
}>`
  border: none;
  font-size: 30px;
  margin: 0.25rem;
  color: ${({ color }) => color};
  border-radius: 5px;
`;
const DeleteButton = styled.button<{
  color?: string;
}>`
  border: none;
  font-size: 30px;
  margin: 0.25rem;
  color: ${({ color }) => color};
  border-radius: 5px;
  background-color: #f8d7da;
`;

type Props = {
  shots: { id: string; order: number; type: string }[];
  onShotDelete: (shotID: string) => void;
  holeRef: string | null;
  gameRef: DocumentReference | null;
};

export const Shots = ({ shots, onShotDelete, gameRef, holeRef }: Props) => {
  const [selectedshot, setSelectedShot] = useState<{
    id: string;
    order: number;
    type: string;
  } | null>(null);

  const handleAddShotScoring = async (
    evaluationValue: string,
    evaluationType: string,
  ) => {
    console.log(gameRef);
    console.log(holeRef);
    if (gameRef && holeRef && selectedshot?.id) {
      const ref = doc(gameRef, 'holes', holeRef, 'shots', selectedshot.id);
      await addDoc(collection(ref, 'scores'), {
        type: evaluationType,
        value: evaluationValue,
      });
      console.log(evaluationType);
      console.log(evaluationValue);
    }
  };

  const handleDelete = () => {
    if (selectedshot) {
      onShotDelete(selectedshot.id);
      setSelectedShot(null);
    }
  };
  return (
    <>
      {shots?.length ? (
        <Root>
          {shots?.map((shot, key) => {
            const typedShot = (shotTypesByTypes as any)[shot.type];
            return (
              <ShotButton
                color={typedShot?.color}
                key={key}
                onClick={() => setSelectedShot(shot)}>
                {typedShot?.icon}
              </ShotButton>
            );
          })}
        </Root>
      ) : (
        <InfoMessage>Select a shot type</InfoMessage>
      )}
      <Modal
        isOpen={Boolean(selectedshot)}
        onClose={() => setSelectedShot(null)}>
        <Content>
          {shotEvaluations.map((evaluation, key) => (
            <div key={key}>
              <span>{evaluation.type}</span>
              <Flexbox>
                {evaluation.values.map((evaluationValue, evalKey) => (
                  <ShotButton
                    key={evalKey}
                    onClick={() =>
                      handleAddShotScoring(
                        evaluationValue.value,
                        evaluation.type,
                      )
                    }
                    color={evaluationValue.color}>
                    {evaluationValue.icon}
                  </ShotButton>
                ))}
              </Flexbox>
            </div>
          ))}
          <DeleteButton onClick={handleDelete} color='#d73038'>
            <FontAwesomeIcon icon={faTrash} />
          </DeleteButton>
        </Content>
      </Modal>
    </>
  );
};
