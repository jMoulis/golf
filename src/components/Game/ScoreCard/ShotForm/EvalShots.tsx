import styled from '@emotion/styled';
import { faSquarePlus } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SwipeableDrawer } from '@mui/material';
import { DocumentReference, setDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ShotType } from '../../../../game';
import { theme } from '../../../../style/theme';
import { iOS } from '../../../../utils/global.utils';
import { Flexbox } from '../../../commons';
import { SwipeMenuHeader } from '../../../commons/SwipeMenuHeader';
import { GameType, ThemeType } from '../../../types';
import { ThemeList } from '../ThemeForm/ThemeList';
import { useThemes } from '../ThemeForm/useThemes';
import { shotQuality } from './shotQuality';

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 100px 1fr;
  align-items: center;
  padding: 5px;
`;

const Header = styled.div`
  display: flex;
  font-size: 25px;
  align-items: center;
  justify-content: space-between;
  padding: 5px;
  color: ${theme.colors.blue};
`;

const ShotButton = styled.button<{
  color?: string;
  selected?: boolean;
}>`
  border: none;
  font-size: 30px;
  margin: 0.25rem;
  height: 40px;
  width: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${({ color }) => color};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  color: ${({ color, selected }) => (selected ? color : 'gray')};
  background-color: transparent;
  border-radius: 5px;
`;

type Props = {
  selectedShot: ShotType | null;
  onAddEvaluation: (value: 'KO' | 'OK', type: string) => void;
  game: GameType;
  gameRef: DocumentReference | null;
};

export const EvalShots = ({
  selectedShot,
  onAddEvaluation,
  game,
  gameRef,
}: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const { onInit, themes } = useThemes();

  useEffect(() => {
    onInit();
  }, [onInit]);

  const handleSelectTheme = (incomingTheme: ThemeType) => {
    console.log(gameRef);
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

  return (
    <>
      <Flexbox flexDirection='column'>
        <Header>
          <span>Themes</span>
          <FontAwesomeIcon icon={faSquarePlus} onClick={() => setOpen(true)} />
        </Header>
        {selectedShot &&
          game?.themes.map((theme, key) => {
            const selectedEvaluationValue = selectedShot?.themes?.[theme.type];
            return (
              <Wrapper key={key}>
                <span style={{ textTransform: 'uppercase' }}>{theme.type}</span>
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
              </Wrapper>
            );
          })}
      </Flexbox>
      <SwipeableDrawer
        disableBackdropTransition={!iOS}
        disableDiscovery={iOS}
        anchor='bottom'
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}>
        <SwipeMenuHeader
          onClose={() => setOpen(false)}
          title='Select a theme'
        />
        {
          <ThemeList
            onSelectTheme={handleSelectTheme}
            selectedThemes={game?.themes}
            themes={themes}
          />
        }
      </SwipeableDrawer>
    </>
  );
};
