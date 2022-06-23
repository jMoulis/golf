import styled from "@emotion/styled";
import { theme } from "../../../style/theme";
import { Flexbox } from "../../commons";

export const TabWrapper = styled(Flexbox)`
  justify-content: space-around;
`;
export const Tab = styled.div<{ selected: boolean }>`
  flex: 1;
  padding: 0.5rem;
  text-align: center;
  position: relative;
  &:after {
    position: absolute;
    bottom: 0;
    right: 0;
    left: 0;
    content: ${({ selected }) => selected ? `' '` : ''};
    height: 3px;
    background-color: ${theme.colors.pink};
  }
`;