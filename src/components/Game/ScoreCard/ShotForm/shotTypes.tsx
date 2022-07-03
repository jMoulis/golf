import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBan,
  faBullseyeArrow,
  faGolfBallTee,
  faGolfFlagHole,
  faRoad,
  faSquareUpLeft,
  faSquareUpRight,
  faUmbrellaBeach,
} from '@fortawesome/pro-duotone-svg-icons';

type ShotyType = {
  type: string;
  icon: any;
  color: string;
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

  {
    type: 'regul',
    icon: <FontAwesomeIcon icon={faBullseyeArrow} />,
    color: '#02732A',
  },
];

export const shotTypesByTypes = shotTypes.reduce(
  (acc: Record<string, ShotyType>, shotType) => {
    return {
      ...acc,
      [shotType.type]: shotType,
    };
  },
  {},
);
