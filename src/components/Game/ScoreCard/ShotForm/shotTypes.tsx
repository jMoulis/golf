import React, { useEffect, useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBan,
  faBullseyeArrow,
  faFrenchFries,
  faGolfBallTee,
  faGolfFlagHole,
  faRoad,
  faSquareUpLeft,
  faSquareUpRight,
  faUmbrellaBeach,
} from '@fortawesome/pro-duotone-svg-icons';
import { collection, getDocs, getFirestore, query } from 'firebase/firestore';
import { app } from 'firebaseConfig/firebase';

type ShotType = {
  type: string;
  icon: any;
  color: string;
  toStat?: boolean;
  onlyStat?: boolean;
  order: number;
};

export const useConfig = () => {
  const [config, setConfig] = useState<{ shots: { shotTypes: ShotType[] } }>({
    shots: {
      shotTypes: [],
    },
  });
  useEffect(() => {
    const db = getFirestore(app);
    const q = query(collection(db, 'config'));
    getDocs(q).then((querySnapshot) => {
      let payload: any = {};
      querySnapshot.forEach((doc) => {
        payload = {
          ...payload,
          [doc.id]: doc.data(),
        };
        // payload.push({ id: doc.id, ...doc.data() });
      });
      setConfig(payload);
    });
  }, []);

  const shotTypesByTypes = useMemo(
    () =>
      (config.shots?.shotTypes || []).reduce(
        (acc: Record<string, ShotType>, shotType: ShotType) => {
          return {
            ...acc,
            [shotType.type]: shotType,
          };
        },
        {}
      ),
    [config.shots?.shotTypes]
  );
  return {
    shotTypes: config.shots.shotTypes || [],
    shotTypesByTypes,
  };
};

export const shotTypes = [
  {
    type: 'tee',
    icon: <FontAwesomeIcon icon={faGolfBallTee} />,
    color: '#B0D959',
  },
  {
    type: 'rough-left',
    icon: <FontAwesomeIcon icon={faSquareUpLeft} />,
    color: '#02732A',
  },
  {
    type: 'fairway',
    icon: <FontAwesomeIcon icon={faRoad} />,
    color: '#8CBF1F',
  },
  {
    type: 'rough-right',
    icon: <FontAwesomeIcon icon={faSquareUpRight} />,
    color: '#02732A',
  },
  {
    type: 'chip',
    icon: <FontAwesomeIcon icon={faFrenchFries} />,
    color: '#02732A',
  },
  {
    type: 'putt',
    icon: <FontAwesomeIcon icon={faGolfFlagHole} />,
    color: '#B0D959',
  },
  {
    type: 'penalty',
    icon: <FontAwesomeIcon icon={faBan} />,
    color: '#FF6F69',
  },
  {
    type: 'bunker',
    icon: <FontAwesomeIcon icon={faUmbrellaBeach} />,
    color: '#D98C71',
  },
  // {
  //   type: 'regul',
  //   icon: <FontAwesomeIcon icon={faBullseyeArrow} />,
  //   color: '#02732A',
  // },
];
