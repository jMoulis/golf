import styled from '@emotion/styled';
import { Flexbox } from '../../../commons';
import { ShotButton } from '../../../commons/Buttons/ShotButton';
import { ShotType } from '../../../types';

const Dot = styled.div<{ status: boolean }>`
  height: 14px;
  width: 14px;
  margin: 0 2px;
  border-radius: 20rem;
  font-size: 10px;
  font-weight: bold;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background-color: ${({ status }) => (status ? '#02732A' : '#d73038')};
`;
type Props = {
  typedShot: any;
  shot: ShotType;
  onSelectShot: (shot: ShotType) => void;
};

export const Shot = ({ typedShot, shot, onSelectShot }: Props) => {
  return (
    <Flexbox flexDirection="column" styling={{ position: 'relative' }}>
      <ShotButton color={typedShot?.color} onClick={() => onSelectShot(shot)}>
        {typedShot?.icon}
      </ShotButton>
      <Flexbox
        styling={{
          position: 'absolute',
          bottom: '0',
          left: 0,
          right: 0,
          justifyContent: 'space-around',
        }}
      >
        {Object.keys(shot.themes || {})
          .sort()
          .map((key) => {
            if (!shot?.themes?.[key]) return null;
            return (
              <Dot key={key} status={shot.themes?.[key] === 'OK'}>
                {key[0]}
              </Dot>
            );
          })}
      </Flexbox>
    </Flexbox>
  );
};
