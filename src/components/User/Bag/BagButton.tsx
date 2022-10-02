import BagIcon from 'assets/images/golf-bag.png';
import styled from '@emotion/styled';

const Root = styled.button`
  background-color: transparent;
  border: none;
`;

const Image = styled.img`
  width: 40px;
  height: 40px;
`;

type Props = {
  onOpen: () => void;
};

export const BagButton = ({ onOpen }: Props) => {
  return (
    <Root onClick={onOpen}>
      <Image src={BagIcon} />
    </Root>
  );
};
