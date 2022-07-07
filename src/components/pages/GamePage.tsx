import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import { Flexbox } from '../commons';

const CustomLink = styled(Link)<{ backgroundColor?: string }>`
  height: 150px;
  width: 150px;
  background-color: ${({ backgroundColor }) => backgroundColor};
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px;
  color: #fff;
  font-weight: bold;
  font-size: 20px;
  padding: 5px;
  text-align: center;
`;

export const GamePage = () => {
  return (
    <Flexbox justifyContent='space-around'>
      <CustomLink backgroundColor='#3dd988' to='new'>
        New Game
      </CustomLink>
      <CustomLink backgroundColor='#3D80D9' to='list'>
        Previous games
      </CustomLink>
    </Flexbox>
  );
};
