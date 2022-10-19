import styled from '@emotion/styled';
import React from 'react';
import { theme } from 'style/theme';

const Header = styled.header`
  background-color: ${theme.headers.statistics.primary};
  padding: 10px;
  border-radius: 5px 5px 0 0;
  margin-bottom: 10px;
  & p {
    color: #fff;
  }
`;

const Title = styled.span`
  font-weight: bold;
  display: block;
  text-transform: uppercase;
  color: #fff;
`;

type Props = {
  entry: any;
};

export const StatCardHeader = ({ entry }: Props) => {
  return entry.type ? (
    <Header>
      <Title>{`${entry.type} Trous`}</Title>
      <p>Total parties jouées: {entry.gameCount}</p>
      <p>Score brut: {Math.ceil(entry.score / entry.gameCount)}</p>
    </Header>
  ) : (
    <Header>
      <Title>Tout type confondus</Title>
      <p>Total parties jouées: {entry.gameCount}</p>
    </Header>
  );
};
