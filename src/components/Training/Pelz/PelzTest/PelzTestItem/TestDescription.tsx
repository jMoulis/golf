import styled from '@emotion/styled';
import React from 'react';
import { Flexbox } from '../../../../commons';
import { TestDescriptionType } from '../../types';

const Root = styled.div`
  padding: 10px;
`;
const Title = styled.span`
  font-weight: 700;
  text-transform: uppercase;
`;
const DescriptionDetail = styled.span``;

const InstructionTitle = styled.span`
  font-weight: 700;
  text-transform: uppercase;
  font-size: 20px;
`;
const Detail = styled.span``;

const ListItem = styled.li``;

const Image = styled.img`
  max-width: 100%;
`;

type Props = {
  description: TestDescriptionType;
};

export const TestDescription = ({ description }: Props) => {
  return (
    <Root>
      <Image src={description?.image} />
      <InstructionTitle>{description.instructions.title}</InstructionTitle>
      <Flexbox flexDirection="column">
        <DescriptionDetail>{description.instructions.detail}</DescriptionDetail>
        <Title>SCORING</Title>
        <ul>
          {description.scoring.map((scoreDetail, key) => (
            <ListItem key={key}>
              <Detail>{scoreDetail}</Detail>
            </ListItem>
          ))}
        </ul>
      </Flexbox>
    </Root>
  );
};
