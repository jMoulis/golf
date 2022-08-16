import styled from '@emotion/styled';
import { Flexbox } from '../../../commons';
import { ButtonPill } from '../../../commons/Buttons/ButtonPill';
import { DeleteButton } from '../../../commons/Buttons/DeleteButton';
import { PelzType } from '../types';
import { usePelz } from '../usePelz';

const Title = styled.span`
  display: inline-block;
  font-size: 25px;
  font-weight: 700;
  margin-right: 5px;
`;
const Value = styled.span`
  display: inline-block;
  font-size: 25px;
`;
const CustomPillButton = styled(ButtonPill)`
  flex: 1;
`;

type Props = {
  pelz: PelzType | null;
  onClose: () => void;
};

export const StatFooter = ({ pelz, onClose }: Props) => {
  const { globalStat, onDeletePelz } = usePelz();
  return (
    <Flexbox flexDirection="column" styling={{ minWidth: '100%' }}>
      <Flexbox>
        <Flexbox alignItems="center" style={{ marginRight: '10px' }}>
          <Title>TOTAL:</Title>
          <Value>{globalStat(pelz).total}</Value>
        </Flexbox>
        <Flexbox alignItems="center">
          <Title>HCP:</Title>
          <Value>{globalStat(pelz).hcp}</Value>
        </Flexbox>
      </Flexbox>
      <Flexbox>
        <CustomPillButton onClick={onClose}>Enregistrer</CustomPillButton>
        {pelz ? (
          <DeleteButton
            onClick={() => {
              onDeletePelz(pelz.id);
              onClose();
            }}
          />
        ) : null}
      </Flexbox>
    </Flexbox>
  );
};
