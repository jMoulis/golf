import styled from '@emotion/styled';
import { faCheck, faTrash } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { doc, DocumentReference, setDoc } from 'firebase/firestore';
import { useState } from 'react';
import { theme } from '../../../../style/theme';
import { Flexbox } from '../../../commons';
import { Modal } from '../../../commons/Modal';
import { shotEvaluations } from './shotQuality';
import { shotTypesByTypes } from './shotTypes';

const Root = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  border-radius: 3px;
  flex-wrap: wrap;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 90vw;
  padding: 0.5rem;
`;

const Dot = styled.div<{ status: boolean }>`
  height: 14px;
  width: 14px;
  margin: 0 2px;
  border-radius: 20rem;
  font-size: 10px;
  font-weight: bold;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background-color: ${({ status }) => (status ? '#02732A' : '#d73038')};
`;
const ShotButton = styled.button<{
  color?: string;
}>`
  border: none;
  font-size: 30px;
  margin: 0.25rem;
  height: 50px;
  width: 50px;
  color: ${({ color }) => color};
  border-radius: 10px;
  background-color: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
`;
const ModalShotButton = styled(ShotButton)<{
  color?: string;
  selected?: boolean;
}>`
  color: ${({ color, selected }) => (selected ? color : 'gray')};
  background-color: transparent;
  border-radius: 5px;
`;

const DeleteButton = styled.button<{
  color?: string;
  backgroundColor?: string;
}>`
  flex: 1;
  border: none;
  font-size: 30px;
  margin: 0.25rem;
  color: ${({ color }) => color};
  border-radius: 5px;
  background-color: ${({ backgroundColor }) => backgroundColor || '#f8d7da'};
`;

type Props = {
  shots: {
    id: string;
    order: number;
    type: string;
    themes?: Record<string, 'KO' | 'OK'>;
  }[];
  onShotDelete: (shotID: string) => void;
  holeRef: string | null;
  gameRef: DocumentReference | null;
};

export const Shots = ({ shots, onShotDelete, gameRef, holeRef }: Props) => {
  const [selectedshot, setSelectedShot] = useState<{
    id: string;
    order: number;
    type: string;
    themes?: Record<string, 'KO' | 'OK'>;
  } | null>(null);

  const handleAddShotScoring = async (
    evaluationValue: 'KO' | 'OK',
    evaluationType: string,
  ) => {
    if (gameRef && holeRef && selectedshot?.id) {
      const ref = doc(gameRef, 'holes', holeRef, 'shots', selectedshot.id);
      setSelectedShot({
        ...selectedshot,
        themes: {
          ...selectedshot.themes,
          [evaluationType]: evaluationValue,
        },
      });
      await setDoc(
        ref,
        {
          themes: {
            [evaluationType]: evaluationValue,
          },
        },
        { merge: true },
      );
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
              <Flexbox
                flexDirection='column'
                styling={{ position: 'relative' }}>
                <ShotButton
                  color={typedShot?.color}
                  key={key}
                  onClick={() => setSelectedShot(shot)}>
                  {typedShot?.icon}
                </ShotButton>
                <Flexbox
                  styling={{
                    position: 'absolute',
                    bottom: '0',
                    left: 0,
                    right: 0,
                    justifyContent: 'space-around',
                  }}>
                  {Object.keys(shot.themes || {})
                    .sort()
                    .map((key) => (
                      <Dot status={shot.themes?.[key] === 'OK'}>{key[0]}</Dot>
                    ))}
                </Flexbox>
              </Flexbox>
            );
          })}
        </Root>
      ) : null}
      <Modal
        isOpen={Boolean(selectedshot)}
        onClose={() => setSelectedShot(null)}>
        <Content>
          {selectedshot &&
            shotEvaluations.map((evaluation, key) => {
              const selectedEvaluationValue =
                selectedshot?.themes?.[evaluation.type];
              return (
                <div key={key}>
                  <span style={{ textTransform: 'capitalize' }}>
                    {evaluation.type}
                  </span>
                  <Flexbox>
                    {evaluation.values.map((evaluationValue, evalKey) => {
                      return (
                        <ModalShotButton
                          key={evalKey}
                          onClick={() =>
                            handleAddShotScoring(
                              evaluationValue.value,
                              evaluation.type,
                            )
                          }
                          selected={
                            selectedEvaluationValue === evaluationValue.value
                          }
                          color={evaluationValue.color}>
                          {evaluationValue.icon}
                        </ModalShotButton>
                      );
                    })}
                  </Flexbox>
                </div>
              );
            })}
          <Flexbox>
            <DeleteButton
              onClick={() => setSelectedShot(null)}
              color={theme.colors.blue}
              backgroundColor={theme.colors.blueGreen}>
              <FontAwesomeIcon icon={faCheck} />
            </DeleteButton>
            <DeleteButton onClick={handleDelete} color='#d73038'>
              <FontAwesomeIcon icon={faTrash} />
            </DeleteButton>
          </Flexbox>
        </Content>
      </Modal>
    </>
  );
};
