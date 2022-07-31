import styled from '@emotion/styled';
import { useMemo } from 'react';
import { Flexbox } from '../../commons';
import { PelzTestItemForm } from './PelzTestItemForm';
import { PelzType } from './types';
import { getGlobalHCP } from './utils';

const Root = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 5px;
  padding: 10px;
`;

type Props = {
  pelz: PelzType | null;
};

export const PelzTest = ({ pelz }: Props) => {
  const globalStat = useMemo(() => {
    if (!pelz)
      return {
        hcp: 0,
        total: 0,
      };
    return getGlobalHCP(pelz.theme, pelz.tests);
  }, [pelz]);

  if (!pelz) return null;

  return (
    <>
      <Root>
        {Object.values(pelz?.tests || {}).map((test, key) => (
          <PelzTestItemForm
            pelzTheme={pelz.theme}
            pelzID={pelz.id}
            key={key}
            test={test}
          />
        ))}
      </Root>
      <Flexbox flexDirection="column">
        <Flexbox>
          <span>TOTAL</span>
          <span>{globalStat.total}</span>
        </Flexbox>
        <Flexbox>
          <span>HCP</span>
          <span>{globalStat.hcp}</span>
        </Flexbox>
      </Flexbox>
    </>
  );
};
