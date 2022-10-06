import { useEffect, useMemo, useRef, useState } from 'react';
import {
  arrayUnion,
  doc,
  DocumentReference,
  getFirestore,
  increment,
  setDoc,
  Unsubscribe,
} from 'firebase/firestore';
import styled from '@emotion/styled';
import {
  CoursePayloadType,
  ENUM_GAME_STATUS,
  ShotType,
  GameHoleType,
  GameType,
  UserType,
} from 'components/types';
import { RenderHoles } from './RenderHoles';
import { SwipeShotForm } from 'components/commons/SwipeShotForm/SwipeShotForm';
import { SaveMenu } from './SaveMenu';
import { app } from 'components/../firebaseConfig/firebase';
import { firebaseErrors } from 'components/../utils/firebaseErrors';
import { Alerts } from 'components/commons/Alerts';
import * as geometry from 'spherical-geometry-js';
import { useGeolocated } from 'react-geolocated';
import { useUser } from 'components/User/useUser';
import { excludedDistanceshotType } from './utils';
import { scoresByType, shotsTypeStat } from 'utils/scoreUtils';
import { sortHoles } from 'components/Admin/Course/utils';

const calculateDistance = (
  newCoords?: { lng: number | null; lat: number | null },
  prevCoords?: { lng: number | null; lat: number | null }
) => {
  if (!newCoords || !prevCoords) return 0;
  if (!newCoords?.lat) return 0;
  if (!newCoords?.lng) return 0;
  if (!prevCoords?.lat) return 0;
  if (!prevCoords?.lng) return 0;

  const distance = geometry.computeDistanceBetween(
    { lat: newCoords.lat, lng: newCoords.lng },
    {
      lat: prevCoords.lat,
      lng: prevCoords.lng,
    }
  );
  return distance;
};

const List = styled.ul`
  overflow: auto;
  max-height: 100%;
`;

type Props = {
  game?: GameType;
  gameRef: DocumentReference | null;
  onClose: () => void;
  course: CoursePayloadType | null;
};

export const ScoreCard = ({ game, onClose, course }: Props) => {
  const gameRef = useMemo(() => {
    if (!game?.id) return null;
    const db = getFirestore(app);
    return doc(db, 'games', game.id);
  }, [game?.id]);

  const { coords, isGeolocationAvailable, isGeolocationEnabled } =
    useGeolocated({
      positionOptions: {
        enableHighAccuracy: true,
      },
      watchPosition: true,
      userDecisionTimeout: 5000,
    });
  const { user, editUser, updateUserBagClubDistance } = useUser();
  const [selectedHole, setSelectedHole] = useState<GameHoleType | null>(null);
  const shotUnsubscribeRef = useRef<Unsubscribe | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const shotUnsub = shotUnsubscribeRef.current;
    return () => {
      if (shotUnsub) shotUnsub();
    };
  }, []);

  useEffect(() => {
    if (game?.holes && selectedHole?.ref && game.holes[selectedHole.ref]) {
      const prevHole = game.holes[selectedHole.ref];
      if (prevHole) {
        setSelectedHole(prevHole);
      }
    }
  }, [game?.holes, selectedHole?.ref]);

  const handleSelectHole = (incomingHole: GameHoleType) => {
    if (incomingHole === selectedHole) {
      setSelectedHole(null);
    } else {
      setSelectedHole(incomingHole);
    }
  };

  const handleAddShot = async (shot: ShotType, hole: GameHoleType) => {
    let newShot = { ...shot };
    if (coords) {
      newShot = {
        ...newShot,
        coords: coords
          ? { lat: coords?.latitude, lng: coords?.longitude }
          : { lat: null, lng: null },
      };
    }

    const prevShot = (hole.shots || [])[(hole.shots || []).length - 1];

    const updatedShots = (hole.shots || []).map((prev) => {
      if (prev.id === prevShot?.id) {
        const newDistance = calculateDistance(prev.coords, newShot.coords);
        if (
          user &&
          prevShot.club?.id &&
          newDistance &&
          !excludedDistanceshotType.includes(newShot.type)
        ) {
          editUser(
            updateUserBagClubDistance(prevShot.club.id, newDistance, user)
          );
        }
        return {
          ...prev,
          club: {
            ...prev.club,
            distance: newDistance,
          },
        };
      }
      return prev;
    });

    if (gameRef) {
      const payload = await setDoc(
        gameRef,
        {
          strokeBrut: increment(1),
          holes: {
            [hole.ref]: {
              shots: [...updatedShots, newShot],
            },
          },
        },
        {
          merge: true,
        }
      ).catch(firebaseErrors);
      if (payload?.ERROR) {
        setError(payload.ERROR);
      }
    }
  };

  const frontNine = useMemo(() => {
    if (!game?.holes) return [];
    return Object.values(game.holes).sort((a, b) => a.number - b.number);
    // .slice(0, 9);
  }, [game?.holes]);

  const toggleDrawer =
    (state: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      setOpen(state);
    };

  const handleValidate = async (holesCount: number) => {
    if (!game) return null;
    const holes = Object.values(game.holes);
    const sortedHoles = sortHoles(holes);

    const frontNine = sortedHoles.slice(0, 9);

    let stats = {
      type: 0,
      gameID: game.id,
      score: 0,
      shotTypes: {},
      scoreType: {},
    };
    if (holesCount === 9) {
      stats = {
        ...stats,
        type: 9,
        shotTypes: shotsTypeStat(frontNine as any),
        scoreType: scoresByType(frontNine as any),
        score: frontNine.reduce(
          (acc, hole: any) => acc + (hole.shots?.length || 0),
          0
        ),
      };
    } else if (holesCount === 18) {
      stats = {
        ...stats,
        type: 18,
        shotTypes: shotsTypeStat(sortedHoles as any),
        scoreType: scoresByType(sortedHoles as any),
        score: sortedHoles.reduce(
          (acc, hole: any) => acc + (hole.shots?.length || 0),
          0
        ),
      };
    }
    if (
      user &&
      ![...(user.stats || [])].some((prev) => prev.gameID === game.id)
    ) {
      editUser({
        ...user,
        stats: [...(user.stats || []), stats],
      });
    }
    if (gameRef) {
      await setDoc(
        gameRef,
        {
          status: ENUM_GAME_STATUS.DONE,
        },
        {
          merge: true,
        }
      );
    }
  };

  if (!game) return null;

  return (
    <>
      <List>
        <RenderHoles
          gameRef={gameRef}
          onSelectHole={handleSelectHole}
          selectedHole={selectedHole}
          holes={frontNine}
          onOpenForm={toggleDrawer(true)}
          game={game}
          courseHoles={course?.holes}
        />
      </List>
      <SwipeShotForm
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        gameRef={gameRef}
        onAddShot={handleAddShot}
        hole={selectedHole}
        game={game}
        open={open}
        title="Ajouter un shot"
      />
      <SaveMenu onClose={onClose} onValidate={handleValidate} />
      <Alerts
        onClose={() => setError(null)}
        open={Boolean(error)}
        message={error || 'Erreur'}
        severity="error"
      />
    </>
  );
};
