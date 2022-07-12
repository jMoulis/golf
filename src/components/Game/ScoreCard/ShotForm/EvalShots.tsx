import styled from '@emotion/styled';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SwipeableDrawer } from '@mui/material';
import { DocumentReference, setDoc } from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import { ShotType } from '../../../../game';
import { theme } from '../../../../style/theme';
import { iOS } from '../../../../utils/global.utils';
import { Flexbox } from '../../../commons';
import { DeleteButton } from '../../../commons/DeleteButton';
import { SwipeMenuHeader } from '../../../commons/SwipeMenuHeader';
import { GameHoleType, GameType, ThemeType } from '../../../types';
import { ThemeForm } from '../ThemeForm/ThemeForm';
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

const ShotButton = styled.button<{
  color?: string;
  selected?: boolean;
  backgroundColor?: string;
}>`
  border: none;
  font-size: 30px;
  margin: 0.25rem;
  height: 40px;
  width: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  color: ${({ color, selected }) => {
    if (typeof selected === 'undefined') {
      return color;
    }
    return selected ? color : 'gray';
  }};
  background-color: transparent;
  background-color: ${({ backgroundColor }) => backgroundColor};
  border-radius: 5px;
`;

type Props = {
  selectedShot: ShotType | null;
  onAddEvaluation: (value: 'KO' | 'OK', type: string) => void;
  game: GameType;
  gameRef: DocumentReference | null;
  hole: GameHoleType | null;
  onRemoveEvaluation: (theme: ThemeType) => void;
};

export const EvalShots = ({
  selectedShot,
  onAddEvaluation,
  game,
  gameRef,
  hole,
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
        },
      );
    }
  };

  const handleRemoveTheme = (incomingTheme: ThemeType) => {
    onRemoveEvaluation(incomingTheme);
  };

  const availableShots = useMemo(() => {
    const shotThemes = themes.reduce((acc: any, theme) => {
      if (selectedShot?.themes?.[theme.type]) {
        return [...acc, theme];
      }
      return acc;
    }, []);
    const filteredGameThemes = (game?.themes || []).filter(
      (theme) => !selectedShot?.themes?.[theme.type],
    );
    return [...shotThemes, ...filteredGameThemes];
  }, [selectedShot?.themes, game?.themes, themes]);

  return (
    <>
      <Flexbox
        flexDirection='column'
        style={{
          backgroundColor: theme.colors.backgroundPage,
          maxHeight: 'calc(100% - 240px)',
        }}>
        <EvalWrapper>
          <Flexbox
            justifyContent='space-between'
            alignItems='center'
            style={{
              padding: '5px',
              borderBottom: `1px solid ${theme.colors.separator}`,
            }}>
            <span>Sélectionner ou créer un thème</span>
            <ShotButton
              color='#fff'
              backgroundColor={theme.colors.saveButton}
              onClick={() => setOpen(true)}>
              <FontAwesomeIcon icon={faPlus} />
            </ShotButton>
          </Flexbox>
          {selectedShot &&
            availableShots.map((theme, key) => {
              const selectedEvaluationValue =
                selectedShot?.themes?.[theme.type];
              return (
                <Wrapper key={key}>
                  <span style={{ textTransform: 'uppercase' }}>
                    {theme.type}
                  </span>
                  <Flexbox>
                    {shotQuality.map((evaluationValue, evalKey) => {
                      return (
                        <ShotButton
                          key={evalKey}
                          onClick={() =>
                            onAddEvaluation(evaluationValue.value, theme.type)
                          }
                          selected={
                            selectedEvaluationValue === evaluationValue.value
                          }
                          color={evaluationValue.color}>
                          {evaluationValue.icon}
                        </ShotButton>
                      );
                    })}
                  </Flexbox>
                  <DeleteButton onClick={() => handleRemoveTheme(theme)}>
                    <FontAwesomeIcon icon={faTrash} />
                  </DeleteButton>
                </Wrapper>
              );
            })}
        </EvalWrapper>
      </Flexbox>
      <SwipeableDrawer
        disableBackdropTransition={!iOS}
        disableDiscovery={iOS}
        anchor='bottom'
        open={open}
        PaperProps={{
          style: theme.swipeable.paper,
        }}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}>
        <SwipeMenuHeader title='Select a theme' />
        <ThemeForm selectedTheme={null} />
        <ThemeList
          onSelectTheme={handleSelectTheme}
          selectedThemes={game?.themes}
          themes={themes}
        />
      </SwipeableDrawer>
    </>
  );
};
