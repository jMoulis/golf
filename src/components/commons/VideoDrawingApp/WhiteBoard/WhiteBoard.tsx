import styled from '@emotion/styled';
import {
  faSave,
  faXmark,
  faXmarksLines,
} from '@fortawesome/free-solid-svg-icons';
import {
  faDrawCircle,
  faDrawSquare,
  faPipe,
  faWaveSine,
} from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Flexbox } from '../../Flexbox';
import { useFabricJSEditor } from './editor';
import { FabricCanvas } from './FabricCanvas';

const ToolbarButton = styled.button`
  border: none;
  background-color: transparent;
  color: #fff;
  font-size: 20px;
`;

const ColorButton = styled.div<{ color: string }>`
  background-color: ${({ color }) => color};
  height: 40px;
  width: 40px;
  min-width: 40px;
  min-height: 40px;
  border-radius: 5px;
  margin: 3px;
`;
export const WhiteBoard = () => {
  const { editor, onReady } = useFabricJSEditor({
    defaultStrokeColor: 'red',
  });
  const resetDrawingMode = () => {
    if (editor?.canvas) {
      editor.canvas.isDrawingMode = false;
    }
  };
  const onAddCircle = () => {
    editor?.addCircle();
    resetDrawingMode();
  };
  const onAddRectangle = () => {
    editor?.addRectangle();
    resetDrawingMode();
  };
  const onAddLine = () => {
    editor?.addLine();
    resetDrawingMode();
  };
  const onDeleteAll = () => {
    editor?.deleteAll();
    resetDrawingMode();
  };
  const onDeleteSelected = () => {
    editor?.deleteSelected();
    resetDrawingMode();
  };

  const onDrawingMode = () => {
    if (editor?.canvas) {
      editor.canvas.isDrawingMode = !editor.canvas.isDrawingMode;
      const { canvas } = editor;
      const width = '20';
      const brush = canvas.freeDrawingBrush;
      brush.width = parseInt(width, 10);
      brush.color = '#eaeaea';
    }
  };

  const onSelectColor = (color: string) => {
    if (editor?.canvas) {
      const { canvas } = editor;
      if (canvas.getActiveObject()) {
        canvas.getActiveObject().set({ stroke: color });
        canvas.renderAll();
      }
    }
  };
  const onSave = () => {
    // if (editor) {
    //   const { canvas } = editor;
    //   // const imageURI = canvas.toDataURL({
    //   //   format: 'png',
    //   // });
    // }
  };
  const menus = [
    {
      onClick: () => onAddCircle(),
      icon: faDrawCircle,
    },
    {
      onClick: () => onAddRectangle(),
      icon: faDrawSquare,
    },
    {
      onClick: () => onAddLine(),
      icon: faPipe,
    },
    {
      onClick: () => onDrawingMode(),
      icon: faWaveSine,
    },
    {
      onClick: () => onDeleteSelected(),
      icon: faXmark,
    },
    {
      onClick: () => onDeleteAll(),
      icon: faXmarksLines,
    },
    {
      onClick: () => onSave(),
      icon: faSave,
    },
  ];
  const colorPicker = ['yellow', 'red', 'blue', 'green', 'white'];
  return (
    <>
      {editor ? (
        <Flexbox flexWrap="wrap">
          {menus.map((menu, index) => (
            <ToolbarButton type="button" key={index} onClick={menu.onClick}>
              <FontAwesomeIcon icon={menu.icon} />
            </ToolbarButton>
          ))}
          <Flexbox flexWrap="wrap">
            {colorPicker.map((color, key) => (
              <ColorButton
                onClick={() => onSelectColor(color)}
                key={key}
                color={color}
              />
            ))}
          </Flexbox>
        </Flexbox>
      ) : (
        <>Loading...</>
      )}
      <FabricCanvas className="sample-canvas" onReady={onReady} />
    </>
  );
};
