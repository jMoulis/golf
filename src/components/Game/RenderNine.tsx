import styled from '@emotion/styled';
import React, { useMemo } from 'react';
import { scoreResult } from '../../utils/scoreUtils';
import { GameHoleType } from '../types';

const Table = styled.div`
  min-width: 100%;
  display: grid;
  grid-template-columns: repeat(11, 1fr);
  margin-bottom: 1rem;
  grid-gap: 5px 0;
  padding: 10px;
`;

const TableCell = styled.div<{ backgroundColor?: string; color?: string }>`
  text-align: center;
  background-color: ${({ backgroundColor }) => backgroundColor};
  color: ${({ color }) => color};
  border: 1px solid transparent;
  border-top: 0;
  font-size: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px;
  border-radius: 3px;
  margin: 0 3px;
`;

const TableHeadCell = styled.div`
  text-align: center;
  border: 1px solid transparent;
  border-bottom: 0;
`;

const RowHeader = styled.div`
  display: flex;
  align-items: center;
`;

const Title = styled.div`
  font-weight: bold;
  padding: 0 10px;
  padding-top: 10px;
  font-size: 20px;
`;

type Props = {
  holes: GameHoleType[];
  title: string;
};

export const RenderNine = ({ holes, title }: Props) => {
  const sortedholes = useMemo(() => {
    return holes ? holes.sort((a, b) => a.number - b.number) : [];
  }, [holes]);

  const scoreByHole = useMemo(() => {
    const payload: any = sortedholes.reduce((acc, hole: any) => {
      return {
        ...acc,
        [hole.number]: scoreResult(hole.par, hole.shots?.length),
      };
    }, {});
    return payload;
  }, [sortedholes]);

  const totalScore = useMemo(() => {
    const payload =
      sortedholes
        .reduce(
          (acc: any, hole) => (hole.shots ? [...acc, hole.shots] : acc),
          []
        )
        .flat().length || 0;
    return payload;
  }, [sortedholes]);

  if (!holes?.length) return null;

  return (
    <>
      <Title>
        {title} - Par {sortedholes.reduce((acc, hole) => acc + hole.par, 0)}
      </Title>
      <Table>
        <RowHeader
          style={{
            fontWeight: 'bold',
          }}
        >
          TROU
        </RowHeader>
        {sortedholes.map((hole: any, key) => (
          <TableHeadCell
            key={key}
            style={{
              fontWeight: 'bold',
            }}
          >
            {hole.number}
          </TableHeadCell>
        ))}
        <span />
        <RowHeader>PAR</RowHeader>
        {sortedholes.map((hole: any, key) => (
          <TableCell key={key}>{hole.par}</TableCell>
        ))}
        <TableCell>
          {sortedholes.reduce((acc: any, hole) => acc + hole.par, 0)}
        </TableCell>

        <RowHeader>HCP</RowHeader>
        {sortedholes.map((hole: any, key) => (
          <TableCell key={key}>{hole.hcp}</TableCell>
        ))}
        <span />
        <RowHeader
          style={{
            fontWeight: 'bold',
          }}
        >
          BRUT
        </RowHeader>
        {sortedholes.map((hole, key) => {
          return (
            <TableCell
              key={key}
              backgroundColor={(scoreByHole as any)?.[hole.number]?.bk}
              color={(scoreByHole as any)?.[hole.number]?.color}
              style={{
                fontWeight: 'bold',
              }}
            >
              {hole.shots?.length || '-'}
            </TableCell>
          );
        })}
        <TableCell
          style={{
            fontWeight: 'bold',
          }}
        >
          {totalScore || '-'}
        </TableCell>
      </Table>
    </>
  );
};
