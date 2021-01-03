import axios from "axios";
import { setting } from '../config/constants';

const api = axios.create({
  baseURL: setting.BASE_URL,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

const ENDPOINT = '/v1_1/dvx12uxn1/image/upload';

export const uploadPhoto = (img, onUploadProgress) => {
  const data = new FormData();

  data.append('file', img);
  data.append('upload_preset', setting.UPLOAD_PRESET);
  data.append('cloud_name', setting.UPLOAD_SECRET);

  return api.post(ENDPOINT, data, {
    onUploadProgress: (progress) =>
      onUploadProgress(progress.loaded / progress.total),
  });
};

