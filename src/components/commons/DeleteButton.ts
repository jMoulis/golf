import styled from "@emotion/styled";
import { theme } from "../../style/theme";

export const DeleteButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  font-size: 20px;
  margin: 0.25rem;
  color: #fff;
  border-radius: 200px;
  height: 40px;
  width: 40px;
  background-color: ${theme.colors.deleteButton};
  box-shadow: ${theme.shadows.button};
  & span {
    display: inline-block;
    margin-left: 5px;
    font-size: 15px;
  }
`;