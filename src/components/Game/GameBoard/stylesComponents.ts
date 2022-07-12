import styled from "@emotion/styled";
import { theme } from "../../../style/theme";

export const Stat = styled.span`
  margin-right: 10px;
  font-size: 15px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;

export const Tag = styled.div<{ scoreColor?: { bk: string; color: string } }>`
  background-color: ${({ scoreColor }) => scoreColor?.bk};
  color: ${({ scoreColor }) => scoreColor?.color};
  border-radius: 7px;
  font-size: 15px;
  height: 40px;
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${theme.shadows.flatButton};
`;
