import {callApi, callApiWithToken} from '../utils/apiCaller.util';

export const getSubjects = async (page = 1, limit = 20) => {
  return await callApi(`/subjects?page=${page}&limit=${limit}`, 'get');
};

export const getSubjectsWithToken = async (
  page = 1,
  limit = 20,
  token = '',
) => {
  return await callApiWithToken(
    `/subjects?page=${page}&limit=${limit}`,
    'get',
    {},
    token,
  );
};
