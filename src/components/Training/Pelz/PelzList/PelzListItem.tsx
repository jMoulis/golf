import styled from '@emotion/styled';
import React, { useRef } from 'react';
import { Flexbox } from '../../../commons';
import { DateDisplay } from '../../../commons/DateDisplay';
import { DeleteButton } from '../../../commons/Buttons/DeleteButton';
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
            <DateDisplay margin="5px">{`- ${dateFormat.current.format(
              pelz.date
            )}`}</DateDisplay>
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
        <DeleteButton type="button" onClick={() => onDeletePelz(pelz.id)} />
      </Flexbox>
    </ListItem>
  );
};
