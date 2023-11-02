import {callApi, callApiList} from '../utils/apiCaller.util';

export const getfamilyaccount = async (page = 1, limit = 20) => {
  return await callApiList(
    `/familyProfile/?page=${page}&limit=${limit}`,
    'get',
  );
};
export const updateFamilyProfileId = async (id, data) => {
  return await callApi(`/familyProfile/${id}`, 'put', data);
};
export const getFamilyProfileId = async (id) => {
  return await callApi(`/familyProfile/${id}`, 'get');
};
export const addFamilyProfile = async (data) => {
  return await callApi(`/familyProfile`, 'post', data);
};
