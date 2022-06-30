import styled from '@emotion/styled';
import { HoleType, ShotType } from '../../../../game';
import { shotTypes } from './shotTypes';

const Root = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  flex: 1;
  flex-wrap: wrap;
  grid-gap: 5px;
  padding: 0.5rem;
  box-shadow: 0px -3px 7px -2px rgba(0, 0, 0, 0.25);
  z-index: 1;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #fff;
`;

const ShotButton = styled.button<{
  color?: string;
  gridColumn: {
    start: string;
    end: string;
  };
}>`
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  font-size: 30px;
  color: ${({ color }) => color};
  border-radius: 5px;
  grid-column-start: ${({ gridColumn }) => gridColumn.start};
  grid-column-end: ${({ gridColumn }) => gridColumn.end};
`;

type Props = {
  hole: HoleType | null;
  onAddShot: (shot: any, hole: any) => void;
};

export const ShotForm = ({ hole, onAddShot }: Props) => {
  const handleAddShot = (incomingShot: ShotType, hole: any) => {
    if (hole) {
      onAddShot(incomingShot, hole);
    }
  };
  return (
    <Root>
      {shotTypes.map((shot, key) => (
        <ShotButton
          type='button'
          key={key}
          onClick={() => handleAddShot({ type: shot.type }, hole)}
          color={shot?.color}
          gridColumn={{
            start: shot.gridColumnStart,
            end: shot.gridColumnEnd,
          }}>
          {shot?.icon}
        </ShotButton>
      ))}
    </Root>
  );
};
