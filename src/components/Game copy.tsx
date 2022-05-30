import React, { useEffect, useState } from 'react';
import { GameType, HoleType, newGame } from '../game';
import { HoleForm } from './HoleForm';

type Props = {};

export const Game = (props: Props) => {
  const [game, setGame] = useState<GameType | null>(null);
  const [selectedHole, setSelectedHole] = useState<HoleType | null>(null);

  useEffect(() => {
    setGame(newGame);
  }, []);

  const handleSelectHole = (incomingHole: HoleType) => {
    setSelectedHole(incomingHole);
  };

  const handleAddShot = (updatedHole: HoleType) => {
    if (game) {
      const updatedholes = (incomingHole: HoleType, prevHoles: HoleType[]) => {
        return prevHoles.map((prevHole) => {
          if (prevHole.id === incomingHole.id) {
            return incomingHole;
          }
          return prevHole;
        });
      };

      setGame((prevGame) => {
        if (prevGame) {
          return {
            ...prevGame,
            course: {
              ...prevGame.course,
              holes: updatedholes(updatedHole, prevGame.course.holes),
            },
          };
        }
        return prevGame;
      });
      setSelectedHole(updatedHole);
    }
  };

  if (!game) return null;

  return (
    <div>
      <h1>{game.player.firstname}</h1>
      <h2>{game.course.name}</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            {game.course.holes.map((hole) => (
              <th>{hole.name}</th>
            ))}
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Par</td>
            {game.course.holes.map((hole) => (
              <td>{hole.par}</td>
            ))}
            <td>
              {game.course.holes.reduce((acc, hole) => acc + hole.par, 0)}
            </td>
          </tr>
          <tr>
            <td>score</td>
            {game.course.holes.map((hole) => (
              <td onClick={() => handleSelectHole(hole)}>
                {hole.shots.length}
              </td>
            ))}
            <td>
              {game.course.holes.reduce(
                (acc, hole) => acc + hole.shots.length,
                0,
              )}
            </td>
          </tr>
        </tbody>
      </table>
      <HoleForm onAddShot={handleAddShot} hole={selectedHole} />
    </div>
  );
};
