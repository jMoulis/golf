import { DocumentReference, setDoc } from "firebase/firestore"
import { GameHoleType, GameType, ThemeType, ShotType } from "../../../types"

export const useScoring = () => {
  const onAddShotScoring = ({ evaluation, gameRef, selectedShot, hole }: {
    evaluation: {
      value: 'KO' | 'OK',
      type: string
    },
    selectedShot?: ShotType | null,
    gameRef: DocumentReference | null,
    hole: GameHoleType | null
  }) => {
    if (gameRef && selectedShot?.id && hole?.ref) {
      const updatedTypeValue = (
        value: 'OK' | 'KO',
        type: string,
        shot: ShotType,
      ) => {
        if (shot?.themes?.[type] === value) {
          return null;
        }
        return value;
      };

      const updatedShot = {
        ...selectedShot,
        themes: {
          ...selectedShot.themes,
          [evaluation.type]: updatedTypeValue(
            evaluation.value,
            evaluation.type,
            selectedShot,
          ),
        },
      };

      const updatedShots = hole?.shots.map((shot) => {
        if (shot.id === updatedShot.id) {
          return updatedShot;
        }
        return shot;
      });

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
      return {
        updatedShot,
      }
    }
  }
  const onRemoveShotScoring = ({ theme, gameRef, selectedShot, hole, game }: {
    theme: ThemeType,
    selectedShot?: ShotType | null,
    gameRef: DocumentReference | null,
    hole: GameHoleType | null,
    game: GameType
  }) => {
    const updatedThemes = game.themes.filter((prevTheme) => {
      return prevTheme?.id !== theme.id;
    });

    const selectedShotThemes = selectedShot?.themes || {};
    const filteredThemes = Object.keys(selectedShotThemes).reduce((acc: Record<string, any>, key) => {
      if (theme.type === key) return acc;
      return {
        ...acc,
        [key]: selectedShotThemes[key]
      }
    }, {});

    const updatedShot = {
      ...selectedShot,
      themes: filteredThemes
    }
    if (gameRef && hole?.ref) {
      const updatedShots = hole?.shots.map((shot) => {
        if (shot.id === updatedShot.id) {
          return updatedShot;
        }
        return shot;
      });
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
    return {
      updatedShot,
    }
  }
  return {
    onAddShotScoring,
    onRemoveShotScoring
  }
}