import React, { useEffect, useState } from 'react';
import Swatch from './Swatch';
import rough from 'roughjs/bundled/rough.esm';
import {
  createElement,
  adjustElementCoordinates,
  cursorForPosition,
  resizedCoordinates,
  midPointBtw,
  getElementAtPosition,
} from './Element';

export const Sketch = () => {
  const [points, setPoints] = useState<any>([]);
  const [path, setPath] = useState<any>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [elements, setElements] = useState<any>([]);
  const [action, setAction] = useState('none');
  const [toolType, setToolType] = useState('pencil');
  const [selectedElement, setSelectedElement] = useState<any>(null);
  const [colorWidth, setColorWidth] = useState({
    hex: '#000',
    hsv: {},
    rgb: {},
  });
  const [width, setWidth] = useState(1);
  const [shapeWidth, setShapeWidth] = useState(1);
  const [popped, setPopped] = useState(false);

  useEffect(() => {
    const canvas = document.getElementById('canvas');
    const context = (canvas as any).getContext('2d');
    context.lineCap = 'round';
    context.lineJoin = 'round';

    context.save();

    const drawpath = () => {
      path.forEach((stroke: any) => {
        context.beginPath();

        stroke.forEach((point: any) => {
          context.strokeStyle = point.newColour;
          context.lineWidth = point.newLinewidth;

          const midPoint = midPointBtw(point.clientX, point.clientY);

          context.quadraticCurveTo(
            point.clientX,
            point.clientY,
            midPoint.x,
            midPoint.y
          );
          context.lineTo(point.clientX, point.clientY);
          context.stroke();
        });
        context.closePath();
        context.save();
      });
    };

    if (toolType === 'eraser' && popped === true) {
      context.clearRect(0, 0, (canvas as any).width, (canvas as any).height);
      setPopped(false);
    }

    const roughCanvas = rough.canvas?.(canvas as any);

    if (path !== undefined) drawpath();

    context.lineWidth = shapeWidth;

    elements.forEach((el: any) => {
      if (el) {
        const { roughElement } = el;
        context.globalAlpha = '1';
        context.strokeStyle = roughElement.options.stroke;
        roughCanvas.draw(roughElement);
      }
    });

    return () => {
      context.clearRect(0, 0, (canvas as any).width, (canvas as any).height);
    };
  }, [popped, elements, path, width]);

  const updateElement = (
    index: any,
    x1: any,
    y1: any,
    x2: any,
    y2: any,
    toolType: any,
    strokeWidth: any,
    strokeColor: any
  ) => {
    const updatedElement = createElement(
      index,
      x1,
      y1,
      x2,
      y2,
      toolType,
      strokeWidth,
      strokeColor
    );
    const elementsCopy = [...elements];
    elementsCopy[index] = updatedElement;
    setElements(elementsCopy);
  };

  const checkPresent = (clientX: any, clientY: any) => {
    if (path === undefined) return;
    const newPath = path;
    path.forEach((stroke: any, index: number) => {
      stroke.forEach((point: any) => {
        if (
          clientY < point.clientY + 10 &&
          clientY > point.clientY - 10 &&
          clientX < point.clientX + 10 &&
          clientX > point.clientX - 10
        ) {
          //console.log("Popped");
          newPath.splice(index, 1);
          setPopped(true);
          setPath(newPath);
          return;
        }
      });
    });
    const newElements = elements;
    newElements.forEach((ele: any, index: number) => {
      if (
        clientX >= ele.x1 &&
        clientX <= ele.x2 &&
        clientY >= ele.y1 &&
        clientY <= ele.y2
      ) {
        newElements.splice(index, 1);
        setPopped(true);
        setElements(newElements);
      }
    });
  };

  const handleMouseDown = (e: any) => {
    const { clientX, clientY } = e;
    const canvas = document.getElementById('canvas');
    const context = (canvas as any).getContext('2d');

    if (toolType === 'selection') {
      const element = getElementAtPosition(clientX, clientY, elements);
      if (element) {
        const offsetX = clientX - element.x1;
        const offsetY = clientY - element.y1;
        setSelectedElement({ ...element, offsetX, offsetY });
        if (element.position === 'inside') {
          setAction('moving');
        } else {
          setAction('resize');
        }
      }
    } else if (toolType === 'eraser') {
      setAction('erasing');

      checkPresent(clientX, clientY);
    } else {
      const id = elements.length;
      if (toolType === 'pencil' || toolType === 'brush') {
        setAction('sketching');
        setIsDrawing(true);

        const newColour = colorWidth.hex;
        const newLinewidth = width;
        const transparency = toolType === 'brush' ? '0.1' : '1.0';
        const newEle = {
          clientX,
          clientY,
          newColour,
          newLinewidth,
          transparency,
        };
        setPoints((state: any) => [...state, newEle]);

        context.strokeStyle = newColour;
        context.lineWidth = newLinewidth;
        context.lineCap = 5;
        context.moveTo(clientX, clientY);
        context.beginPath();
      } else {
        setAction('drawing');
        const newColour = colorWidth.hex;
        const newWidth = shapeWidth;
        const element = createElement(
          id,
          clientX,
          clientY,
          clientX,
          clientY,
          toolType,
          newWidth,
          newColour
        );

        setElements((prevState: any) => [...prevState, element]);
        setSelectedElement(element);
      }
    }
  };

  const handleMouseMove = (
    event:
      | React.MouseEvent<HTMLCanvasElement, MouseEvent>
      | React.TouchEvent<HTMLCanvasElement>,
    touch?: {
      clientX: number;
      clientY: number;
    }
  ) => {
    const canvas = document.getElementById('canvas');
    const context = (canvas as any).getContext('2d');
    const { currentTarget } = event;
    const clientX = touch
      ? touch.clientX
      : (event as React.MouseEvent<HTMLCanvasElement, MouseEvent>).clientX;
    const clientY = touch
      ? touch.clientY
      : (event as React.MouseEvent<HTMLCanvasElement, MouseEvent>).clientY;
    if (toolType === 'selection') {
      const element = getElementAtPosition(clientX, clientY, elements);
      currentTarget.style.cursor = element
        ? cursorForPosition(element.position)
        : 'default';
    }
    if (action === 'erasing') {
      checkPresent(clientX, clientY);
    }
    if (action === 'sketching') {
      if (!isDrawing) return;
      const colour = points[points.length - 1].newColour;
      const linewidth = points[points.length - 1].newLinewidth;
      const transparency = points[points.length - 1].transparency;
      const newEle = { clientX, clientY, colour, linewidth, transparency };

      setPoints((state: any) => [...state, newEle]);
      const midPoint = midPointBtw(clientX, clientY);
      context.quadraticCurveTo(clientX, clientY, midPoint.x, midPoint.y);
      context.lineTo(clientX, clientY);
      context.stroke();
    } else if (action === 'drawing') {
      const index = elements.length - 1;
      const { x1, y1 } = elements[index];
      elements[index].strokeColor = colorWidth.hex;
      elements[index].strokeWidth = shapeWidth;
      updateElement(
        index,
        x1,
        y1,
        clientX,
        clientY,
        toolType,
        shapeWidth,
        colorWidth.hex
      );
    } else if (action === 'moving') {
      const {
        id,
        x1,
        x2,
        y1,
        y2,
        type,
        offsetX,
        offsetY,
        shapeWidth,
        strokeColor,
      } = selectedElement;
      const offsetWidth = x2 - x1;
      const offsetHeight = y2 - y1;
      const newX = clientX - offsetX;
      const newY = clientY - offsetY;
      updateElement(
        id,
        newX,
        newY,
        newX + offsetWidth,
        newY + offsetHeight,
        type,
        shapeWidth,
        strokeColor
      );
    } else if (action === 'resize') {
      const { id, type, position, ...coordinates } = selectedElement;
      const newCoords = resizedCoordinates(
        clientX,
        clientY,
        position,
        coordinates
      );
      if (newCoords) {
        const { x1, y1, x2, y2 } = newCoords;
        updateElement(id, x1, y1, x2, y2, type, shapeWidth, colorWidth.hex);
      }
    }
  };

  const handleMouseUp = () => {
    if (action === 'resize') {
      const index = selectedElement.id;
      const { id, type, strokeWidth, strokeColor } = elements[index];
      const { x1, y1, x2, y2 } = adjustElementCoordinates(elements[index]);
      updateElement(id, x1, y1, x2, y2, type, strokeWidth, strokeColor);
    } else if (action === 'drawing') {
      const index = selectedElement.id;
      const { id, type, strokeWidth } = elements[index];
      const { x1, y1, x2, y2 } = adjustElementCoordinates(elements[index]);
      updateElement(id, x1, y1, x2, y2, type, strokeWidth, colorWidth.hex);
    } else if (action === 'sketching') {
      const canvas = document.getElementById('canvas');
      const context = (canvas as any).getContext('2d');
      context.closePath();
      const element = points;
      setPoints([]);
      setPath((prevState: any) => [...prevState, element]); //tuple
      setIsDrawing(false);
    }
    setAction('none');
  };

  return (
    <div>
      <Swatch
        toolType={toolType}
        setToolType={setToolType}
        width={width}
        setWidth={setWidth}
        setElements={setElements}
        setColorWidth={setColorWidth}
        setPath={setPath}
        colorWidth={colorWidth}
        setShapeWidth={setShapeWidth}
      />
      <canvas
        id="canvas"
        className="App"
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={(e) => handleMouseMove(e)}
        onMouseUp={handleMouseUp}
        onTouchStart={(e) => {
          const touch = e.touches[0];
          handleMouseDown({ clientX: touch.clientX, clientY: touch.clientY });
        }}
        onTouchMove={(event) => {
          const touch = event.touches[0];
          handleMouseMove(event, {
            clientX: touch.clientX,
            clientY: touch.clientY,
          });
        }}
        onTouchEnd={handleMouseUp}
      >
        Canvas
      </canvas>
    </div>
  );
};
