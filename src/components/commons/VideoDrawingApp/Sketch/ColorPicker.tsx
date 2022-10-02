import React, { useEffect } from 'react';
import { ColorPicker as ReactColorPicker, useColor } from 'react-color-palette';
import 'react-color-palette/lib/css/styles.css';
export const ColorPicker = ({ setColorWidth }: any) => {
  const [color, setColor] = useColor('hex', '#121212');
  useEffect(() => {
    setColorWidth(color);
  }, [color]);

  return window.innerWidth < 550 ? (
    <ReactColorPicker
      width={window.innerWidth * 0.073 * 2.5}
      height={window.innerHeight * 0.1}
      color={color}
      onChange={setColor}
      hideHSV
      hideHEX
      dark
    />
  ) : (
    <ReactColorPicker
      width={window.innerWidth * 0.073 * 2}
      height={window.innerWidth * 0.073 * 2}
      color={color}
      onChange={setColor}
      hideHEX
      dark
    />
  );
};
