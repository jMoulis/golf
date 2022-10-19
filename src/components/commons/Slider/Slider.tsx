import React from 'react';
import { Slide } from './Slide';
import { SliderContainer, SliderWrapper } from './styledComponents';

type Props = {
  items: React.ReactNode[];
  currentIndex: number;
  width: number;
};
export const Slider = ({ items, currentIndex, width }: Props) => {
  return (
    <SliderContainer className="slider-instance">
      <SliderWrapper
        style={{
          transform: `translateX(${-(currentIndex * width)}px)`,
          transition: 'transform ease-out 0.30s',
          width: `${width * items.length}px`,
        }}
      >
        {items.map((i: any, index: number) => {
          return (
            <Slide key={index + 1} width={width}>
              {i}
            </Slide>
          );
        })}
      </SliderWrapper>
    </SliderContainer>
  );
};
