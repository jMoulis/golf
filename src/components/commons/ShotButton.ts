import styled from "@emotion/styled";
import { theme } from "../../style/theme";

export const ShotButton = styled.button<{
  color?: string;
  backgroundColor?: string;
  styling?: any
}>`
  border: none;
  font-size: 30px;
  margin: 0.25rem;
  height: 50px;
  width: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${({ color }) => color};
  border-radius: 10px;
  background-color: ${({ backgroundColor }) => backgroundColor || "#fff"};
  box-shadow: ${theme.shadows.flatButton};
  ${({ styling }) => styling};
`;