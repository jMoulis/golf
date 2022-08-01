import styled from '@emotion/styled';
import { PelzTestItemForm } from './PelzTestItem/PelzTestItemForm';
import { PelzType } from '../types';

const Root = styled.div`
  overflow: auto;
  height: calc(100% - 155px - 50px);
`;

type Props = {
  pelz: PelzType | null;
};

export const PelzTest = ({ pelz }: Props) => {
  if (!pelz) return null;

  return (
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
  );
};
