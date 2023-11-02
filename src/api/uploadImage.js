import {callApi, uploadFile} from '../utils/apiCaller.util';

export const uploadImage = async (data) => {
  return await uploadFile(`/files/images`, data);
};

export const uploadFileData = async (data) => {
  return await uploadFile('/files', data);
};
export async function handleUploadImage(image) {
  try {
    const formData = new FormData();
    formData.append('file', {
      name: `${new Date()}.jpg`,
      type: image.mime,
      uri: image.path,
    });
    const upload = await uploadImage(formData);
    return upload?.data?.images[0] || {};
  } catch (error) {
    console.log('handleUploadImage =>', error);
  }
}

export async function handleUploadFile(file) {
  try {
    const formData = new FormData();
    formData.append('file', {
      name: file.name,
      type: file.type,
      uri: file.url,
    });
    const upload = await uploadFileData(formData);
    return upload?.data?.files[0] || '';
  } catch (error) {
    console.log('handleUploadImage =>', error);
  }
}
