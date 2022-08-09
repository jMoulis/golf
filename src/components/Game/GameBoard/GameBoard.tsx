import { useCallback, useEffect, useRef, useState } from 'react';
import {
  doc,
  DocumentData,
  DocumentReference,
  getDoc,
  getFirestore,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { app } from '../../../firebase';
import { ScoreCard } from '../ScoreCard/ScoreCard';
import { CoursePayloadType, GameType } from '../../types';
import { GameBoardHeader } from './GameBoardHeader';
import { PageHeader } from '../../commons/Core/PageHeader';
import { theme } from '../../../style/theme';
import { SwipeableDrawer } from '@mui/material';
import { iOS } from '../../../utils/global.utils';
import { SwipeMenuHeader } from '../../commons/SwipeMenuHeader';

type Props = {
  open: boolean;
  onClose: () => void;
  gameID: string | null;
};
export const GameBoard = ({ open, onClose, gameID }: Props) => {
  const [game, setGame] = useState<GameType | null>(null);
  const [course, setCourse] = useState<CoursePayloadType | null>(null);
  const gameRef = useRef<DocumentReference<DocumentData> | null>(null);
  const holeUnsubscribe = useRef<Unsubscribe | null>(null);

  const getCourse = async (courseId: string) => {
    const db = getFirestore(app);
    const courseRef = doc(db, 'courses', courseId);
    const payload = await getDoc(courseRef);
    if (payload.exists()) {
      const data = payload.data() as CoursePayloadType;
      setCourse({
        id: payload.id,
        ...data,
      });
    }
  };
  const fetchGame = useCallback(async (id: string) => {
    const db = getFirestore(app);
    gameRef.current = doc(db, 'games', id);
    try {
      holeUnsubscribe.current = onSnapshot(gameRef.current, (data) => {
        if (data.exists()) {
          const payloadGame = { ...data.data(), id: data.id } as GameType;
          setGame(payloadGame);
          getCourse(payloadGame.courseRef);
        } else {
          console.error('No such document!');
        }
      });
    } catch (error: any) {
      console.error(error.message);
    }
  }, []);

  const handleClose = () => {
    onClose();
    if (holeUnsubscribe.current) holeUnsubscribe.current();
  };

  useEffect(() => {
    if (gameID) {
      fetchGame(gameID);
    }
  }, [gameID, fetchGame]);

  useEffect(() => {
    const shotUnsub = holeUnsubscribe.current;
    return () => {
      if (shotUnsub) shotUnsub();
    };
  }, []);

  return (
    <SwipeableDrawer
      disableBackdropTransition={!iOS}
      disableDiscovery={iOS}
      PaperProps={{
        style: {
          ...theme.swipeable.paper,
          height: '100vh',
        },
      }}
      anchor="bottom"
      open={open}
      onClose={handleClose}
      onOpen={() => {}}
    >
      <SwipeMenuHeader title="" />
      {game ? (
        <>
          <PageHeader backgroundColor={theme.headers.games.linear}>
            <GameBoardHeader
              game={game}
              holes={game?.holes}
              courseName={game.courseRef}
            />
          </PageHeader>
          <ScoreCard
            game={game}
            gameRef={gameRef.current}
            onClose={handleClose}
            course={course}
          />
        </>
      ) : null}
    </SwipeableDrawer>
  );
};
