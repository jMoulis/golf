import styled from '@emotion/styled';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SwipeableDrawer } from '@mui/material';
import { DocumentReference, setDoc } from 'firebase/firestore';
import React, { useEffect, useMemo, useState } from 'react';
import { theme } from '../../../../style/theme';
import { iOS } from '../../../../utils/global.utils';
import { Flexbox } from '../../../commons';
import { ButtonPill } from '../../../commons/Buttons/ButtonPill';
import { DeleteButton } from '../../../commons/Buttons/DeleteButton';
import { FixedBottomToolbar } from '../../../commons/FixedBottomToolbar';
import { ShotButton } from '../../../commons/Buttons/ShotButton';
import { SwipeMenuHeader } from '../../../commons/SwipeMenuHeader';
import { GameType, ThemeType, ShotType } from '../../../types';
import { ThemeList } from '../ThemeForm/ThemeList';
import { useThemes } from '../ThemeForm/useThemes';
import { shotQuality } from './shotQuality';

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 100px 1fr 50px;
  align-items: center;
  padding: 5px;
  border-bottom: 1px solid ${theme.colors.separator};
`;

const EvalWrapper = styled.div`
  border-radius: 10px;
  margin: 10px;
  margin-top: 0;
  box-shadow: 3px 5px 11px 0px rgba(0, 0, 0, 0.23);
  background-color: #fff;
  overflow: auto;
`;

const CustomShotButton = styled(ShotButton)<{
  color?: string;
  selected?: boolean;
  backgroundColor?: string;
}>`
  margin: 0.25rem;
  height: 40px;
  width: 40px;
  color: ${({ color, selected }) => {
    if (typeof selected === 'undefined') {
      return color;
    }
    return selected ? color : 'gray';
  }};
`;

type Props = {
  selectedShot: ShotType | null;
  onAddEvaluation: (value: 'KO' | 'OK', type: string) => void;
  game: GameType;
  gameRef: DocumentReference | null;
  onRemoveEvaluation: (incomingTheme: ThemeType) => void;
};

export const EvalShots = ({
  selectedShot,
  onAddEvaluation,
  game,
  gameRef,
  onRemoveEvaluation,
}: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const { onInit, themes } = useThemes();

  useEffect(() => {
    onInit();
  }, [onInit]);

  const handleSelectTheme = (incomingTheme: ThemeType) => {
    const updatedThemes = [...game.themes, incomingTheme];
    if (gameRef) {
      setDoc(
        gameRef,
        {
          themes: updatedThemes,
        },
        {
          merge: true,
        }
      );
    }
  };

  const handleRemoveTheme = (incomingTheme: ThemeType) => {
    onRemoveEvaluation(incomingTheme);
  };

  const availableShots = useMemo(() => {
    const shotThemes = themes.reduce((acc: any, incomingTheme) => {
      if (selectedShot?.themes?.[incomingTheme.type]) {
        return [...acc, incomingTheme];
      }
      return acc;
    }, []);
    const filteredGameThemes = (game?.themes || []).filter(
      (incomingTheme) => !selectedShot?.themes?.[incomingTheme.type]
    );
    return [...shotThemes, ...filteredGameThemes];
  }, [selectedShot?.themes, game?.themes, themes]);

  return (
    <>
      <Flexbox
        flexDirection="column"
        style={{
          backgroundColor: theme.colors.backgroundPage,
          maxHeight: 'calc(100% - 240px)',
        }}
      >
        <EvalWrapper>
          <Flexbox
            justifyContent="space-between"
            alignItems="center"
            style={{
              padding: '5px',
              borderBottom: `1px solid ${theme.colors.separator}`,
            }}
          >
            <span>Sélectionner ou créer un thème</span>
            <CustomShotButton
              color="#fff"
              backgroundColor={theme.colors.saveButton}
              onClick={() => setOpen(true)}
            >
              <FontAwesomeIcon icon={faPlus} />
            </CustomShotButton>
          </Flexbox>
          {selectedShot &&
            availableShots.map((incomingTheme, key) => {
              const selectedEvaluationValue =
                selectedShot?.themes?.[incomingTheme.type];
              return (
                <Wrapper key={key}>
                  <span style={{ textTransform: 'uppercase' }}>
                    {incomingTheme.type}
                  </span>
                  <Flexbox>
                    {shotQuality.map((evaluationValue, evalKey) => {
                      return (
                        <CustomShotButton
                          key={evalKey}
                          onClick={() =>
                            onAddEvaluation(
                              evaluationValue.value,
                              incomingTheme.type
                            )
                          }
                          selected={
                            selectedEvaluationValue === evaluationValue.value
                          }
                          color={evaluationValue.color}
                        >
                          {evaluationValue.icon}
                        </CustomShotButton>
                      );
                    })}
                  </Flexbox>
                  <DeleteButton
                    onClick={() => handleRemoveTheme(incomingTheme)}
                  />
                </Wrapper>
              );
            })}
        </EvalWrapper>
      </Flexbox>
      <SwipeableDrawer
        disableBackdropTransition={!iOS}
        disableDiscovery={iOS}
        anchor="bottom"
        open={open}
        PaperProps={{
          style: theme.swipeable.paper,
        }}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
      >
        <SwipeMenuHeader title="Select a theme" />
        <ThemeList
          listStyling={{
            maxHeight: '90vh',
            margin: '10px',
          }}
          onSelectTheme={handleSelectTheme}
          selectedThemes={game?.themes}
          themes={themes}
        />
        <FixedBottomToolbar>
          <ButtonPill onClick={() => setOpen(false)}>Enregistrer</ButtonPill>
        </FixedBottomToolbar>
      </SwipeableDrawer>
    </>
  );
};
