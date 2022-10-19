import styled from '@emotion/styled';
import { SwipeableDrawer } from '@mui/material';
import React, { useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionSquare } from '@fortawesome/pro-duotone-svg-icons';
import { theme } from '../../../../../style/theme';
import { iOS } from '../../../../../utils/global.utils';
import { Button } from '../../../../commons';
import { SwipeMenuHeader } from '../../../../commons/SwipeMenuHeader';
import { ENUM_PELZ_THEME } from '../../enums';
import { TestDescription } from './TestDescription';
import { PelzTestType, TestDescriptionType } from '../../types';
import { calculatePelzHCPByTest, testDescriptionMap } from '../../utils';

const Grid = styled.div`
  white-space: nowrap;
  grid-column: 1 / 6;
  display: block;
  padding: 5px;
`;

const Root = styled(Grid)`
  display: flex;
  justify-content: space-between;
  padding: 0 5px;
`;

const TestTitle = styled.span`
  font-size: 20px;
  font-weight: 700;
  margin-right: 10px;
`;

const LabelHeader = styled.span`
  display: inline-block;
  font-style: italic;
  margin-right: 3px;
  color: ${theme.colors.saveButton};
`;

const QuestionMarkButton = styled(Button)`
  font-size: 25px;
  color: ${theme.colors.blue};
`;

const DescriptionTitle = styled.span`
  padding: 0 5px;
`;

const LabelValue = styled.span`
  display: inline-block;
  margin-right: 3px;
`;

type Props = {
  form: PelzTestType;
  theme: ENUM_PELZ_THEME;
};

export const TestItemShotHeader = ({ form, theme: pelzTheme }: Props) => {
  const [description, setHelper] = useState<TestDescriptionType | null>(null);

  const itemDescription = useMemo(() => {
    return testDescriptionMap[pelzTheme][form.id];
  }, [pelzTheme, form.id]);

  return (
    <>
      <Root
        style={{
          flexDirection: 'column',
        }}
      >
        <Root>
          <TestTitle>{form.id}</TestTitle>
          <QuestionMarkButton onClick={() => setHelper(itemDescription)}>
            <FontAwesomeIcon icon={faQuestionSquare} />
          </QuestionMarkButton>
        </Root>
        <DescriptionTitle>
          {itemDescription.instructions.title}
        </DescriptionTitle>
        <Grid>
          <LabelValue>(</LabelValue>
          <LabelHeader>TOTAL:</LabelHeader>
          <LabelValue>
            {form.shots.reduce((acc: number, shot) => acc + shot.value, 0)}
          </LabelValue>
          <LabelValue>{` - `}</LabelValue>
          <LabelHeader>HCP:</LabelHeader>
          <LabelValue>
            {calculatePelzHCPByTest(
              form.id,
              form.shots.reduce((acc: number, shot) => acc + shot.value, 0),
              pelzTheme
            )}
          </LabelValue>
          <LabelValue>{` - `}</LabelValue>
          {itemDescription?.averagePoint ? (
            <>
              <LabelHeader>Average:</LabelHeader>
              <LabelValue>{itemDescription.averagePoint}</LabelValue>
            </>
          ) : null}
          <LabelValue>)</LabelValue>
        </Grid>
      </Root>

      <SwipeableDrawer
        disableBackdropTransition={!iOS}
        disableDiscovery={iOS}
        anchor="bottom"
        open={Boolean(description)}
        onClose={() => setHelper(null)}
        PaperProps={{
          style: theme.swipeable.paper,
        }}
        onOpen={() => {}}
      >
        <SwipeMenuHeader
          title={`Détails - ${description?.instructions.title}`}
        />
        {description ? <TestDescription description={description} /> : null}
      </SwipeableDrawer>
    </>
  );
};
