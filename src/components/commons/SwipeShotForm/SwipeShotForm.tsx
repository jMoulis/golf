import { SwipeableDrawer } from '@mui/material';
import { DocumentReference } from 'firebase/firestore';
import { theme } from 'style/theme';
import { iOS } from 'utils/global.utils';
import { ShotForm } from 'components/Game/ScoreCard/ShotForm/ShotForm';
import { GameHoleType, GameType, ShotType } from 'components/types';
import { SwipeMenuHeader } from 'components/commons//SwipeMenuHeader';

type Props = {
  open: boolean;
  onClose: () => void;
  onOpen: () => void;
  gameRef: DocumentReference | null;
  onAddShot?: (shot: ShotType, hole: GameHoleType) => void;
  onEditShot?: (shot: ShotType) => void;
  hole: GameHoleType | null;
  game: GameType;
  title: string;
  selectedShot?: ShotType;
};

export const SwipeShotForm = ({
  open,
  onClose,
  onOpen,
  gameRef,
  hole,
  onAddShot,
  onEditShot,
  game,
  title,
  selectedShot,
}: Props) => {
  return (
    <SwipeableDrawer
      disableBackdropTransition={!iOS}
      disableDiscovery={iOS}
      anchor="bottom"
      open={open}
      onClose={onClose}
      PaperProps={{
        style: theme.swipeable.paper,
      }}
      onOpen={onOpen}
    >
      <SwipeMenuHeader title={title} />
      <ShotForm
        gameRef={gameRef}
        onAddShot={onAddShot}
        onEditShot={onEditShot}
        hole={hole}
        onCloseDrawerParent={onClose}
        game={game}
        withEvaluationForm={false}
        selectedShot={selectedShot}
      />
    </SwipeableDrawer>
  );
};
