import styled from '@emotion/styled';
import { faRectangleXmark } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect } from 'react';
import { theme } from '../../style/theme';
import { Portal } from './Portal';

const Root = styled.div`
  position: fixed;
  inset: 0; /* inset sets all 4 values (top right bottom left) much like how we set padding, margin etc., */
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease-in-out;
  overflow: hidden;
  z-index: 999;
  padding: 40px 20px 20px;
`;

const Header = styled.header`
  padding: 10px 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 10px 10px 0 0;
  background-color: ${theme.colors.pink};
  color: #fff;
  & > span {
    font-size: 20px;
  }
`;

const Content = styled.div`
  background-color: #fff;
  border-radius: 10px;
`;

const CloseButton = styled.button`
  border: none;
  background-color: transparent;
  color: #fff;
  font-size: 20px;
`;

type Props = {
  isOpen: boolean;
  onClose: () => void;
  children: any;
  title: string;
};

export const Modal = ({ isOpen, onClose, children, title }: Props) => {
  useEffect(() => {
    const closeOnEscapeKey = (e: any) =>
      e.key === 'Escape' ? onClose() : null;
    document.body.addEventListener('keydown', closeOnEscapeKey);
    return () => {
      document.body.removeEventListener('keydown', closeOnEscapeKey);
    };
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <Portal wrapperID="react-portal-modal-container">
      <Root>
        <Content>
          <Header>
            <span>{title}</span>
            <CloseButton onClick={onClose}>
              <FontAwesomeIcon icon={faRectangleXmark} />
            </CloseButton>
          </Header>
          {children}
        </Content>
      </Root>
    </Portal>
  );
};
