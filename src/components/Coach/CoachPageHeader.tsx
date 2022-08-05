import { Flexbox } from '../commons';
import { PageHeader } from '../commons/Core/PageHeader';
import { NavigationButton } from '../commons/Buttons/NavigationButton';

type Props = {
  headerTitle: string;
  headerTheme: string;
  onNavigate: () => void;
};

export const CoachPageHeader = ({
  headerTheme,
  headerTitle,
  onNavigate,
}: Props) => {
  return (
    <PageHeader backgroundColor={headerTheme}>
      <Flexbox alignItems="center">
        <NavigationButton onClick={onNavigate} />
        {headerTitle}
      </Flexbox>
    </PageHeader>
  );
};
