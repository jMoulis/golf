import { theme } from '../../../style/theme';
import { Flexbox } from '../../commons';
import { PageHeader } from '../../commons/Core/PageHeader';
import { PageHeaderTitle } from '../../commons/Core/PageHeaderTitle';

export const GameIndexHeader = () => {
  return (
    <PageHeader backgroundColor={theme.headers.games.linear}>
      <Flexbox style={{ maxHeight: '100%' }} flex='1' flexDirection='column'>
        <PageHeaderTitle>Parties</PageHeaderTitle>
      </Flexbox>
    </PageHeader>
  );
};
