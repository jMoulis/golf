import styled from "@emotion/styled";

export const ShotButton = styled.button<{
  color?: string;
  backgroundColor?: string;
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
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
`;