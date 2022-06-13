import React, { useMemo } from 'react';
import { RenderNine } from './RenderNine';

type Props = {
  holes: any[];
  onSelectHole: (hole: any) => void;
  holeShots: Record<string, any[]>;
  selectedHole: any | null;
};

export const RenderHolesTable = ({
  holes,
  onSelectHole,
  holeShots,
  selectedHole,
}: Props) => {
  const frontNine = useMemo(() => {
    return holes.slice(0, 9);
  }, [holes]);
  const backNine = useMemo(() => {
    return holes.slice(9, 18);
  }, [holes]);

  return (
    <div>
      <RenderNine
        holes={frontNine}
        shots={holeShots}
        selectedHole={selectedHole}
        onSelectHole={onSelectHole}
      />
      <RenderNine
        holes={backNine}
        shots={holeShots}
        selectedHole={selectedHole}
        onSelectHole={onSelectHole}
      />

      {/* <tfoot>
          <tr>
            <TableCell style={{ textAlign: 'left' }}>PAR</TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell>
              {holes.reduce((acc: any, hole: any) => acc + hole.par, 0)}
            </TableCell>
          </tr>
          <tr>
            <TableCell style={{ textAlign: 'left' }}>SCORE</TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell>
              {holes.reduce(
                (acc: any, hole: any) =>
                  acc + (holeShots[hole.ref]?.length || 0),
                0,
              )}
            </TableCell>
          </tr>
        </tfoot> */}
    </div>
  );
};
