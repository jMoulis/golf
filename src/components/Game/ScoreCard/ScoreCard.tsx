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

const updateUserBagClubDistance = (
  clubId: string,
  distance: number,
  user: UserType
) => {
  const userBag = (user.bag || [])?.map((club) =>
    club.id === clubId
      ? { ...club, distances: [...(club.distances || []), distance] }
      : club
  );
  return {
    ...user,
    bag: userBag,
  };
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
  const { user, editUser } = useUser();
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
        if (user && prevShot.club?.id) {
          editUser(
            updateUserBagClubDistance(prevShot.club.id || '', newDistance, user)
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

  const handleValidate = async () => {
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
      <SaveMenu
        onClose={onClose}
        onValidate={handleValidate}
        status={game.status}
      />
      <Alerts
        onClose={() => setError(null)}
        open={Boolean(error)}
        message={error || 'Erreur'}
        severity="error"
      />
    </>
  );
};
