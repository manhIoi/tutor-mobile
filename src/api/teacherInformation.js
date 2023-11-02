import {callApi, callApiWithToken} from '../utils/apiCaller.util';

export const getTeacherInfo = async () => {
  return await callApi('/teacherInfo/type/teacher', 'get');
};

export const getTeacherInfoWidthToken = async (token) => {
  return await callApiWithToken('/teacherInfo/type/teacher', 'get', {}, token);
};
