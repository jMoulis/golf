import { fabric } from 'fabric';
import { useEffect, useRef } from 'react';
import './style.css';

export interface Props {
  className?: string;
  onReady?: (canvas: fabric.Canvas) => void;
}

export const FabricCanvas = ({ onReady, className }: Props) => {
  const canvasEl = useRef(null);
  const canvasElParent = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const canvas = new fabric.Canvas(canvasEl.current, { selection: false });
    const setCurrentDimensions = () => {
      canvas.setHeight(canvasElParent.current?.clientHeight || 0);
      canvas.setWidth(canvasElParent.current?.clientWidth || 0);
      canvas.renderAll();
    };
    const resizeCanvas = () => {
      setCurrentDimensions();
    };
    setCurrentDimensions();
    window.addEventListener('resize', resizeCanvas, false);
    if (onReady) {
      onReady(canvas);
    }

    return () => {
      canvas.dispose();
      window.removeEventListener('resize', resizeCanvas);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={canvasElParent} className={className}>
      <canvas ref={canvasEl} />
    </div>
  );
};
