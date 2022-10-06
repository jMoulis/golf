import styled from '@emotion/styled';
import { DocumentReference } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { v4 } from 'uuid';
import { useGeolocated } from 'react-geolocated';
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
import { ShotEvaluationForm } from '../ShotEvaluationForm/ShotEvaluationForm';
import { shotTypes } from './shotTypes';
import { useScoring } from './useScoring';
import { useUser } from 'components/User/useUser';
import { ClubButtons } from './ClubButtons';
import { toast } from 'react-toastify';
import { classicShots } from '../utils';

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
  }, [prevShot]);

  const handleAddShot = (incomingShot: ShotType, hole: any) => {
    if (hole) {
      const shotId = v4();
      const newShot = {
        ...incomingShot,
        id: shotId,
      };
      setNewShot({ shot: newShot, hole });
      setSelectedShot(newShot);
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
      if (prev?.shot) {
        return {
          ...prev,
          shot: {
            ...prev.shot,
            club: {
              id: club.id,
              name: club.name,
              distance: (prev.shot?.club?.distance as any) || 0,
            },
          },
        } as any;
      }
      return prev;
    });
  };

  const handleClose = () => {
    setOpen(false);
    onCloseDrawerParent();
    setSelectedShot(null);
    setNewShot(null);
  };

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
