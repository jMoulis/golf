import styled from '@emotion/styled';
import { theme } from '../../../style/theme';

export const TitleInput = styled.input`
  font-size: 15px;
  border-radius: 5px;
  background-color: #fff;
  padding: 5px;
  border: 1px solid ${theme.colors.deleteButton};
  margin-bottom: 5px;
`;
export const DateInput = styled.input`
  border-radius: 5px;
  font-size: 15px;
  background-color: #fff;
  padding: 5px;
  border: 1px solid ${theme.colors.deleteButton};
  margin-bottom: 5px;
`;
export const FormInput = styled.textarea`
  font-size: 20px;
  border: none;
  background-color: transparent;
  flex: 1;
  height: fit-content;
`;
export const Checkbox = styled.input`
  border: none;
  background-color: transparent;
  height: 25px;
  width: 25px;
  margin-right: 5px;
`;
