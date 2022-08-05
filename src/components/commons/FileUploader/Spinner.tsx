import React from 'react';
import styled from '@emotion/styled';
import Icon from '../../../assets/spinner.svg';

const Root = styled.span<{
  color?: string;
  position?: string;
  top?: string;
  left?: string;
  bottom?: string;
  right?: string;
  zIndex?: number;
}>`
  display: block;
  position: ${({ position }) => position || 'relative'};
  z-index: ${({ zIndex }) => zIndex};
  top: ${({ top }) => top};
  left: ${({ left }) => left};
  bottom: ${({ bottom }) => bottom};
  right: ${({ right }) => right};
`;

interface Props {
  color?: string;
  className?: string;
  position?: string;
  top?: string;
  left?: string;
  bottom?: string;
  right?: string;
  width?: string;
  zIndex?: number;
}

export const Spinner = ({
  color,
  className,
  position,
  top,
  left,
  bottom,
  right,
  width,
  zIndex,
}: Props): JSX.Element => (
  <Root
    color={color}
    className={className}
    position={position}
    top={top}
    left={left}
    bottom={bottom}
    right={right}
    zIndex={zIndex}
  >
    <object width={width || '30'} type="image/svg+xml" data={Icon}>
      svg-animation
    </object>
  </Root>
);
