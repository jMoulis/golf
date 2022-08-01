import styled from '@emotion/styled';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRef } from 'react';
import { Flexbox } from '../../../commons';
import { DeleteButton } from '../../../commons/DeleteButton';
import { ListItem } from '../../../commons/List';
import { PelzType } from '../types';
import { usePelz } from '../usePelz';

const Pelz = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.span`
  display: inline-block;
  margin-right: 5px;
`;
const Value = styled.span`
  display: inline-block;
`;
const DateValue = styled.span`
  font-size: 14px;
  margin-left: 5px;
  font-style: italic;
`;
const Theme = styled.span`
  font-weight: 700;
`;

type Props = {
  pelz: PelzType;
  onSelect: (pelz: PelzType) => void;
};

export const PelzListItem = ({ pelz, onSelect }: Props) => {
  const { onDeletePelz, globalStat } = usePelz();
  const dateFormat = useRef<Intl.DateTimeFormat>(new Intl.DateTimeFormat());

  return (
    <ListItem>
      <Flexbox justifyContent="space-between" alignItems="center">
        <Pelz onClick={() => onSelect(pelz)}>
          <Flexbox alignItems="center">
            <Theme>{pelz.theme}</Theme>
            <DateValue>{`- ${dateFormat.current.format(pelz.date)}`}</DateValue>
          </Flexbox>
          <Flexbox>
            <Flexbox
              alignItems="center"
              styling={{
                marginRight: '10px',
              }}
            >
              <Title>TOTAL:</Title>
              <Value>{globalStat(pelz).total}</Value>
            </Flexbox>
            <Flexbox alignItems="center">
              <Title>HCP:</Title>
              <Value>{globalStat(pelz).hcp}</Value>
            </Flexbox>
          </Flexbox>
        </Pelz>
        <DeleteButton type="button" onClick={() => onDeletePelz(pelz.id)}>
          <FontAwesomeIcon icon={faTrash} />
        </DeleteButton>
      </Flexbox>
    </ListItem>
  );
};
