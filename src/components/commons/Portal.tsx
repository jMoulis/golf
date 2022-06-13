import { useEffect, useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

const createWrapperAndAppendToBody = (wrapperID: string) => {
  const wrapperElement = document.createElement('div');
  wrapperElement.setAttribute('id', wrapperID);
  document.body.appendChild(wrapperElement);
  return wrapperElement;
};

type Props = {
  children: any;
  wrapperID: string;
};

export const Portal = ({
  children,
  wrapperID = 'react-portal-wrapper',
}: Props) => {
  const element = useRef<HTMLElement | null>(
    document.getElementById(wrapperID),
  );

  useLayoutEffect(() => {
    let systemCreated = false;
    if (!element.current) {
      systemCreated = true;
      element.current = createWrapperAndAppendToBody(wrapperID);
    }
    return () => {
      if (systemCreated && element.current?.parentNode) {
        element.current.parentNode.removeChild(element.current);
      }
    };
  }, [element, wrapperID]);

  if (!element.current) return null;
  console.log(element.current);
  return createPortal(children, element.current as any);
};
