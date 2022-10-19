import styled from '@emotion/styled';
import { DocumentReference } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { v4 } from 'uuid';
import { theme } from 'style/theme';
import { Flexbox } from 'components/commons';
import { ButtonPill } from 'components/commons/Buttons/ButtonPill';
import { DeleteButton } from 'components/commons/Buttons/DeleteButton';
import { FixedBottomToolbar } from 'components/commons/FixedBottomToolbar';
import { ShotButton } from 'components/commons/Buttons/ShotButton';
import {
  GameHoleType,
  GameType,
  ThemeType,
  ShotType,
  BagClubType,
} from 'components/types';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ShotEvaluationForm } from '../ShotEvaluationForm/ShotEvaluationForm';
import { ShotConfigType } from './shotTypes';
import { useScoring } from './useScoring';
import { ClubButtons } from './ClubButtons';

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
  selectedShot?: ShotType;
  shotTypes: ShotConfigType[];
};

export const ShotForm = ({
  hole,
  onAddShot,
  gameRef,
  onCloseDrawerParent,
  game,
  withEvaluationForm,
  onEditShot,
  selectedShot: prevShot,
  shotTypes,
}: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const [selectedShot, setSelectedShot] = useState<ShotType | null>(null);
  const [selectedClub, setSelectedClub] = useState<BagClubType | null>(null);
  const { onAddShotScoring, onRemoveShotScoring } = useScoring();

  const [newShot, setNewShot] = useState<{
    shot: ShotType;
    hole: GameHoleType;
  } | null>(null);

  useEffect(() => {
    if (prevShot) {
      setNewShot({ shot: prevShot, hole: hole as any });
      setSelectedShot(prevShot);
      if (prevShot.club) {
        setSelectedClub(prevShot.club as any);
      }
    }
  }, [hole, prevShot]);

  const handleAddShot = (incomingShot: ShotType, incomingHole: any) => {
    if (incomingHole) {
      const shotId = v4();
      const createdShot = {
        ...newShot,
        ...incomingShot,
        id: shotId,
      };
      setNewShot({
        shot: createdShot,
        hole: incomingHole,
      });
      setSelectedShot(createdShot);
    }
  };

  const handleSubmit = () => {
    if (!selectedShot) {
      return toast.error('Selectionner un type de shot');
    }
    if (!selectedClub) {
      return toast.error('Selectionner un club');
    }
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

  const handleSelectClub = (club: any) => {
    setSelectedClub(club);
    setNewShot((prev) => {
      return {
        ...prev,
        club: {
          id: club.id,
          name: club.name,
          distance: (prev?.shot?.club?.distance as any) || 0,
        },
      } as any;
    });
  };

  const handleClose = () => {
    setOpen(false);
    onCloseDrawerParent();
    setSelectedShot(null);
    setNewShot(null);
  };

  if (!shotTypes) return null;
  return (
    <>
      <Root flexDirection="column">
        <Wrapper>
          {shotTypes
            .sort((a: any, b: any) => a.order - b.order)
            .filter((shot: any) => !shot.onlyStat)
            .map((shot: any, key: number) => (
              <CustomShotButton
                type="button"
                key={key}
                onClick={() => handleAddShot({ type: shot.type }, hole)}
                color={selectedShot?.type === shot?.type ? '#fff' : shot?.color}
                backgroundColor={
                  selectedShot?.type === shot?.type ? theme.colors.blue : '#fff'
                }
              >
                {shot?.icon ? (
                  <FontAwesomeIcon icon={shot?.icon as any} />
                ) : null}
              </CustomShotButton>
            ))}
        </Wrapper>
        <ClubButtons
          onSelectClub={handleSelectClub}
          selectedClub={selectedClub}
        />
        <FixedBottomToolbar>
          <ButtonPill
            disabled={!selectedClub || !selectedShot}
            onClick={handleSubmit}
          >
            Enregistrer
          </ButtonPill>
          <DeleteButton
            buttonStyle={{
              height: '50px',
              width: '50px',
              color: '#fff',
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
