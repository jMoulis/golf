import { faArrowLeft } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Flexbox } from '../commons';
import { PageHeader } from '../commons/Core/PageHeader';
import { DeleteButton } from '../commons/DeleteButton';

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
        <DeleteButton onClick={onNavigate}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </DeleteButton>
        {headerTitle}
      </Flexbox>
    </PageHeader>
  );
};
