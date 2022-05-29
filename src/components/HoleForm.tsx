import React from 'react';
import { HoleType, ShotType } from '../game';

type Props = {
  hole: HoleType | null;
  onAddShot: (hole: HoleType) => void;
};

export const HoleForm = ({ hole, onAddShot }: Props) => {
  const handleAddShot = (incomingShot: ShotType) => {
    if (hole) {
      const updatedHole = {
        ...hole,
        shots: [...hole?.shots, incomingShot],
      };
      onAddShot(updatedHole);
    }
  };

  const handleDeleteShot = (incomingShotIndex: number) => {
    if (hole) {
      const updatedShots = [...hole.shots];
      updatedShots.splice(incomingShotIndex, 1);
      const updatedHole = {
        ...hole,
        shots: updatedShots,
      };
      onAddShot(updatedHole);
    }
  };

  if (!hole) return null;
  return (
    <div>
      <ul>
        {hole?.shots.map((shot, key) => (
          <li key={key}>
            <div onClick={() => handleDeleteShot(key)}>{shot.type}</div>
          </li>
        ))}
      </ul>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}>
        {[
          { type: 'rough-left' },
          { type: 'rough-right' },
          { type: 'penalty' },
          { type: 'tee' },
          { type: 'putt' },
          { type: 'fairway' },
          { type: 'bunker' },
        ].map((shot, key) => (
          <button
            type='button'
            key={key}
            onClick={() => handleAddShot(shot)}
            style={{
              backgroundColor: 'gray',
              padding: '0.5rem',
              margin: '0.5rem',
              border: 'none',
              cursor: 'pointer',
            }}>
            {shot.type}
          </button>
        ))}
      </div>
    </div>
  );
};
