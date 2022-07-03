import { DocumentReference, setDoc } from "firebase/firestore"
import { ShotType } from "../../../../game"
import { GameHoleType } from "../../../types"

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
  return {
    onAddShotScoring
  }
}