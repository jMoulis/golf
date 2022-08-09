import Resizer from "react-image-file-resizer";
import mime from 'mime';

export const iOS =
  typeof navigator !== "undefined" &&
  /iPad|iPhone|iPod/.test(navigator.userAgent);

export type ResizeFileOptionsType = {
  maxWidth: number,
  maxHeight: number,
  compressFormat: string,
  quality: number,
  rotation: number,
  outputType?: string,
  minWidth?: number,
  minHeight?: number
}
export const resizeFile = (file: File, options: ResizeFileOptionsType) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      options.maxWidth,
      options.maxHeight,
      options.compressFormat,
      options.quality,
      options.rotation,
      (uri) => {
        resolve(uri);
      },
      options.outputType,
      options.minWidth,
      options.minHeight
    );
  });

export const generateFileName = ({ file, fileName }: { fileName?: string, file: File }) => {
  const createdAt = Date.now();
  const fileNameTimestamp = fileName || `${createdAt}-${file.name}`;
  const cleanFilename = fileNameTimestamp.replace(/(\W+)/gi, '-');
  const extension: string = (mime as any).getExtension(file.type);
  return {
    extension,
    fileName: cleanFilename
  }
}

export const generatorsKey = (fileType: string) => {
  if (fileType.includes('image')) {
    return 'image';
  }
  if (fileType.includes('video')) return 'video';
  return (mime as any).getExtension(fileType);
}

export const removeForbiddenKeys = (object: any, keys: string[]): any => {
  if (!object) return {};
  return Object.keys(object).reduce((acc: any, objectKey: string) => {
    if (keys.includes(objectKey)) return acc;
    return { ...acc, [objectKey]: object[objectKey] };
  }, {});
};