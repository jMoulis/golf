import { useLayoutEffect, useState } from 'react';
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
  const [wrapperElement, setWrapperElement] = useState<HTMLElement | null>(
    null,
  );

  useLayoutEffect(() => {
    let element = document.getElementById(wrapperID);

    let systemCreated = false;
    if (!element) {
      systemCreated = true;
      element = createWrapperAndAppendToBody(wrapperID);
    }
    setWrapperElement(element);
    return () => {
      if (systemCreated && element?.parentNode) {
        element.parentNode.removeChild(element);
      }
    };
  }, [wrapperID]);

  if (!wrapperElement) return null;

  return createPortal(children, wrapperElement as any);
};
