import {callApi, callApiWithToken} from '../utils/apiCaller.util';

export const gettopics = async (page = 1, limit = 20) => {
  return await callApi(`/topics?page=${page}&limit=${limit}`, 'get');
};

export const getTopicsWithToken = async (page = 1, limit = 20, token = '') => {
  return await callApiWithToken(
    `/topics?page=${page}&limit=${limit}`,
    'get',
    {},
    token,
  );
};
