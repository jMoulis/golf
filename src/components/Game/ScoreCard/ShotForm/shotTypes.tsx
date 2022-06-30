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
  gridColumnStart: string;
  gridColumnEnd: string;
};

export const shotTypes = [
  {
    type: 'tee',
    icon: <FontAwesomeIcon icon={faGolfBallTee} />,
    color: '#B0D959',
    gridColumnEnd: '1',
    gridColumnStart: '-1',
  },
  {
    type: 'rough-left',
    icon: <FontAwesomeIcon icon={faSquareUpLeft} />,
    color: '#02732A',
    gridColumnEnd: '2',
    gridColumnStart: '1',
  },
  {
    type: 'fairway',
    icon: <FontAwesomeIcon icon={faRoad} />,
    color: '#8CBF1F',
    gridColumnEnd: '4',
    gridColumnStart: '2',
  },
  {
    type: 'rough-right',
    icon: <FontAwesomeIcon icon={faSquareUpRight} />,
    color: '#02732A',
    gridColumnEnd: '5',
    gridColumnStart: '4',
  },
  {
    type: 'penalty',
    icon: <FontAwesomeIcon icon={faBan} />,
    color: '#FF6F69',
    gridColumnEnd: '3',
    gridColumnStart: '1',
  },
  {
    type: 'bunker',
    icon: <FontAwesomeIcon icon={faUmbrellaBeach} />,
    color: '#D98C71',
    gridColumnEnd: '-1',
    gridColumnStart: '3',
  },
  {
    type: 'putt',
    icon: <FontAwesomeIcon icon={faGolfFlagHole} />,
    color: '#B0D959',
    gridColumnEnd: '-1',
    gridColumnStart: '1',
  },
  {
    type: 'regul',
    icon: <FontAwesomeIcon icon={faBullseyeArrow} />,
    color: '#02732A',
    gridColumnEnd: '-1',
    gridColumnStart: '1',
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
