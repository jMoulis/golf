import styled from '@emotion/styled';
import React, { useEffect } from 'react';
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

const Content = styled.div`
  width: 70%;
  height: 70%;
  background-color: #282c34;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
`;

type Props = {
  isOpen: boolean;
  onClose: () => void;
  children: any;
};

export const Modal = ({ isOpen, onClose, children }: Props) => {
  useEffect(() => {
    // const closeOnEscapeKey = (e: any) =>
    //   e.key === 'Escape' ? onClose() : null;
    // document.body.addEventListener('keydown', closeOnEscapeKey);
    // return () => {
    //   document.body.removeEventListener('keydown', closeOnEscapeKey);
    // };
  }, [onClose]);

  console.log(isOpen);

  if (!isOpen) return null;

  return (
    <Portal wrapperID='react-portal-modal-container'>
      <Root className='modal'>
        <button onClick={onClose} className='close-btn'>
          Close
        </button>
        <Content className='modal-content'>{children}</Content>
      </Root>
    </Portal>
  );
};
