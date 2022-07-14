import styled from "@emotion/styled";
import { theme } from "../../style/theme";

export const RoleTag = styled.span`
  display: flex;
  border-radius: 100px;
  background-color: ${theme.colors.blueGreen};
  padding: 5px 10px;
  align-items: center;
  border-radius: 10px;
  margin: 0 5px;
  padding: 3px 10px;
  box-shadow: ${theme.shadows.flatButton};
`;

export const NameTag = styled.span`
  font-weight: 700;
  font-size: 20px;
`;