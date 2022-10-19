import React from 'react';
import { SliderItem } from './styledComponents';

type Props = {
  children: any;
  width: number;
};
export const Slide = ({ children, width }: Props) => {
  return <SliderItem width={width}>{children}</SliderItem>;
};
