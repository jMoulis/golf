import styled from '@emotion/styled';

export const Toolbar = styled.div`
  position: fixed;
  z-index: 2000;
  height: auto;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
`;

export const RecordButton = styled.button`
  border-radius: 100rem;
  height: 70px;
  width: 70px;
  border: none;
  background-color: #ff0000;
  color: #fff;
  font-size: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px;
  padding: 0;
  &:disabled {
    background-color: gray;
  }
`;
export const SwitchCamera = styled.button`
  padding: 0;
  border-radius: 100rem;
  min-height: 50px;
  min-width: 50px;
  border: 3px solid #fff;
  background-color: transparent;
  color: #fff;
  font-size: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px;
`;
