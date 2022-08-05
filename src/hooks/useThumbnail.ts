import * as PDFJS from 'pdfjs-dist';
import { useCallback, useMemo } from 'react';
import { generateVideoThumbnails } from '.';
import { resizeFile, ResizeFileOptionsType } from '../utils/global.utils';

export const useThumbnail = () => {

  const createCanvas = useCallback(async (pdf: PDFJS.PDFDocumentProxy, filename: string) => {
    const firstPage = await pdf.getPage(1);
    const viewport = firstPage.getViewport({ scale: 0.5 });
    const canvas = document.createElement('canvas');
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    const canvasContext: any = canvas.getContext('2d');
    return firstPage.render({
      canvasContext,
      viewport,
    }).promise.then(() => createImage(canvas, filename));
  }, []);

  const createImage = async (canvas: HTMLCanvasElement, filename: string) => {
    const image = canvas.toDataURL();

    const toBlob = (canvas: HTMLCanvasElement): Promise<File> => {
      return new Promise((resolve, reject) => {
        canvas.toBlob(blob => {
          if (blob) resolve(new File([blob], filename, {
            type: 'image/png'
          }));
          reject('No blob found');
        });
      });
    }
    const file = await toBlob(canvas);
    let imageUrl = '';
    if (file) {
      imageUrl = URL.createObjectURL(file);
    }
    return [!!file, file, image, imageUrl];
  };

  const generatePdfThumbnail = useCallback(async (file: File, filename: string, extension: string) => {
    if (extension !== 'pdf') return null;
    PDFJS.GlobalWorkerOptions.workerSrc =
      window.location.origin + '/js/thirdparty/pdf.worker.min.js';

    const fileReader = new FileReader();

    const arrayBuffer: () => Promise<Uint8Array> = () => new Promise((resolve, reject) => {
      fileReader.onerror = () => {
        fileReader.abort();
        reject(new DOMException("Problem parsing input file."));
      };
      fileReader.onload = () => {
        resolve(new Uint8Array(fileReader.result as any))
      };
      fileReader.readAsArrayBuffer(file);
    });

    const typedArray = await arrayBuffer();

    const loadingTask = PDFJS.getDocument(typedArray);

    return loadingTask.promise.then(async (pdf) => {
      return createCanvas(pdf, filename);
    }).catch((error: any) => error);
  }, [createCanvas]);

  const generateImageThumbnail = async (file: File) => {
    const options: ResizeFileOptionsType = {
      maxWidth: 200,
      maxHeight: 200,
      compressFormat: 'JPEG',
      quality: 50,
      rotation: 0,
      outputType: 'file',
    };
    const image = await resizeFile(file, options);
    const imageBase64 = await resizeFile(file, { ...options, outputType: 'base64' });
    return [true, image, imageBase64];
  }

  const generateVideoThumbnail = useCallback(async (file: File, fileName: string) => {
    return generateVideoThumbnails(file, 4, 'base64').then(async (snapshots) => {
      const snapshot = snapshots[0];
      if (snapshot) {
        const base64Reponse = await fetch(snapshot);
        const blob = await base64Reponse.blob();
        const file = new File([blob], fileName, { type: 'image/png' });
        const resizedImage = await generateImageThumbnail(file);
        return resizedImage;
      }
    }).catch((error) => [false, null, null, null, error]);
  }, [])
  const generators: {
    [key: string]: (file: File, filename: string, extension: string) => Promise<any>
  } = useMemo(() => ({
    'pdf': (file, filename, extension) => generatePdfThumbnail(file, filename, extension),
    'image': (file) => generateImageThumbnail(file),
    'video': (file, fileName) => generateVideoThumbnail(file, fileName),
  }), [generatePdfThumbnail, generateVideoThumbnail])

  return {
    generators
  }
}