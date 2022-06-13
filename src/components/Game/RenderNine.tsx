import styled from '@emotion/styled';
import React, { useMemo } from 'react';
import { theme } from '../../style/theme';

const Table = styled.div`
  min-width: 100%;
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  margin-bottom: 1rem;
`;

const TableCell = styled.div<{
  selected?: boolean;
}>`
  text-align: center;
  border: ${({ selected }) =>
    selected ? `1px solid ${theme.colors.blue}` : '1px solid transparent'};
  border-top: 0;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px;
`;

const TableHeadCell = styled.div<{
  selected?: boolean;
}>`
  text-align: center;
  border: ${({ selected }) =>
    selected ? `1px solid ${theme.colors.blue}` : '1px solid transparent'};
  border-bottom: 0;
`;

const Tag = styled.div<{ scoreColor?: { bk: string; color: string } }>`
  background-color: ${({ scoreColor }) => scoreColor?.bk};
  color: ${({ scoreColor }) => scoreColor?.color};
  border-radius: 3px;
  font-size: 1rem;
  height: 30px;
  width: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

type Props = {
  holes: any[];
  onSelectHole: (hole: any) => void;
  shots: any;
  selectedHole: any;
};

export const RenderNine = ({
  holes,
  onSelectHole,
  shots,
  selectedHole,
}: Props) => {
  const scoreResult = (par: number, score: number) => {
    // No score
    if (score === 0) return { bk: 'white', color: '#000' };
    // All in one
    if (score === 1) return { bk: 'red', color: '#fff' };
    // Par
    if (par === score) return { bk: 'green', color: '#fff' };
    if (score === par - 3)
      return {
        bk: '#9999f4',
        color: '#fff',
      };
    // Eagle
    if (score === par - 2) return { bk: '#ff8c19', color: '#fff' };
    // Birdie
    if (score === par - 1) return { bk: '#0000e5', color: '#fff' };
    // Boggey
    if (score === par + 1) return { bk: '#a8a8a8', color: '#000' };
    // DoubleBoggey
    if (score === par + 2) return { bk: '#6F6F6F', color: '#fff' };
    // More
    if (score > par + 2) return { bk: '#323232', color: '#fff' };
    return { bk: 'white', color: '#000' };
  };
  const totalScore: { holeRef: string; score: number }[] = useMemo(() => {
    const scores: { holeRef: string; score: number }[] = [];
    holes.reduce((acc: any, hole: any) => {
      const score = acc + (shots[hole.ref]?.length || 0);
      scores.push({ holeRef: hole.ref, score });
      return score;
    }, 0);
    return scores;
  }, [holes, shots]);

  return (
    <Table>
      {holes.map((hole: any, key) => (
        <TableHeadCell
          key={key}
          onClick={() => onSelectHole(hole)}
          selected={hole.ref === selectedHole?.ref}
          style={{
            borderTopLeftRadius: '3px',
            borderTopRightRadius: '3px',
          }}>
          {hole.number}
        </TableHeadCell>
      ))}
      <div
        style={{
          width: '20px',
        }}>
        Total
      </div>

      {holes.map((hole: any, key) => (
        <TableCell
          key={key}
          style={{
            borderBottom: 0,
            borderTop: 0,
          }}
          selected={hole.ref === selectedHole?.ref}>
          {hole.par}
        </TableCell>
      ))}
      <TableCell>
        {holes.reduce((acc: any, hole: any) => acc + hole.par, 0)}
      </TableCell>

      {holes.map((hole: any, key) => (
        <TableCell
          key={key}
          selected={hole.ref === selectedHole?.ref}
          onClick={() => onSelectHole(hole)}
          style={{
            borderBottom: 0,
            borderTop: 0,
          }}>
          <Tag scoreColor={scoreResult(hole.par, shots[hole.ref]?.length || 0)}>
            {shots[hole.ref]?.length || 0}
          </Tag>
        </TableCell>
      ))}
      <TableCell>
        {holes.reduce(
          (acc: any, hole: any) => acc + (shots[hole.ref]?.length || 0),
          0,
        )}
      </TableCell>

      {totalScore.map((total, key) => {
        return (
          <TableCell
            key={key}
            selected={total.holeRef === selectedHole?.ref}
            // onClick={() => onSelectHole(hole)}
            style={{
              borderBottomLeftRadius: '3px',
              borderBottomRightRadius: '3px',
            }}>
            {total.score}
          </TableCell>
        );
      })}
    </Table>
  );
};
