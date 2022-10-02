import { StorageReference } from "firebase/storage";
import { LoadingType } from "../../Training/Session/types";

export type FileUploadType = { file?: File; customName?: string };
export interface PreviewType {
  name?: string;
  url?: string;
  loading?: LoadingType;
  customName?: string;
  file?: File;
  mimeType?: string;
}
export interface PreviewTypeWithStorageRef extends PreviewType {
  storageThumbnailRef: StorageReference
  storageImageRef: StorageReference
}