import {
  deleteObject,
  getBlob,
  getDownloadURL,
  ref,
  uploadBytes,
  uploadBytesResumable,
  uploadString,
} from 'firebase/storage';
import { useCallback } from 'react';
import { toast } from 'react-toastify';
import { storage } from '../firebaseConfig/firebase';
import { storageErrors } from '../utils/storageErrors';

export const useFileStorage = () => {
  const getFileURL = useCallback(async (filePath: string) => {
    const storageRef = ref(storage, filePath);
    try {
      const downloadedUrl = await getDownloadURL(storageRef);
      return downloadedUrl;
    } catch (error: any) {
      toast.error(`Getting file: ${error.message}`);
      return null;
    }
  }, []);

  const getFileAsBlob = useCallback(async (filePath: string) => {
    const storageRef = ref(storage, filePath);
    try {
      const blob = await getBlob(storageRef);
      return blob;
    } catch (error: any) {
      toast.error(`Getting file: ${error.message}`);
      return null;
    }
  }, []);

  const updloadBase64File = useCallback(
    async (fileName: string, base64: string, contentType: string) => {
      const storageRef = ref(storage, fileName);
      return uploadString(storageRef, base64, 'base64', {
        contentType,
      });
    },
    []
  );

  const uploadFile = useCallback(
    async (file: File | Blob, fileName: string) => {
      const storageRef = ref(storage, fileName);
      return uploadBytes(storageRef, file);
    },
    []
  );

  const uploadFileWithFeedback = useCallback(
    (file: File | Blob, fileName: string) => {
      const storageRef = ref(storage, fileName);
      return uploadBytesResumable(storageRef, file);
    },
    []
  );

  const deleteFile = useCallback(async (storageRef: string) => {
    const fileRef = ref(storage, storageRef);
    return deleteObject(fileRef).catch(storageErrors);
  }, []);

  return {
    getFileURL,
    updloadBase64File,
    uploadFile,
    deleteFile,
    uploadFileWithFeedback,
    getFileAsBlob,
  };
};
