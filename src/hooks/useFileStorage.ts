import { deleteObject, getDownloadURL, ref, uploadBytes, uploadBytesResumable, uploadString } from "firebase/storage";
import { useCallback } from "react";
import { storage } from "../firebase";
import { storageErrors } from "../utils/storageErrors";

export const useFileStorage = () => {
  const getFile = useCallback(async (filePath: string) => {
    const storageRef = ref(storage, filePath);
    try {
      const downloadedUrl = await getDownloadURL(storageRef);
      return downloadedUrl;
    } catch (error) {
      return null;
    }
  }, [])

  const updloadBase64File = useCallback(async (fileName: string, base64: string, contentType: string) => {
    const storageRef = ref(storage, fileName);
    return uploadString(storageRef, base64, 'base64', {
      contentType
    });
  }, [])

  const uploadFile = useCallback(async (file: File | Blob, fileName: string) => {
    const storageRef = ref(storage, fileName);
    return uploadBytes(storageRef, file);
  }, [])

  const uploadFileWithFeedback = useCallback((file: File | Blob, fileName: string) => {
    const storageRef = ref(storage, fileName);
    return uploadBytesResumable(storageRef, file);
  }, [])

  const deleteFile = useCallback(async (storageRef: string) => {
    const fileRef = ref(storage, storageRef);
    return deleteObject(fileRef).catch(storageErrors);
  }, [])

  return { getFile, updloadBase64File, uploadFile, deleteFile, uploadFileWithFeedback }
}