import {
  callApi,
  callApiClassList,
  callApiList,
  callApiWithToken,
} from '../utils/apiCaller.util';
import axios from "axios";

export const getVoteByTeacher = (id) => {
  return callApi(`/vote/teacher/${id}`)
}

export const register = async (data) => {
  return callApi('/user/register', 'post', data);
};

export const login = async (data) => {
  return callApi(`/user/login`, 'post', data);
};

export const active = async (data) => {
  return callApi('/users/active-account', 'post', data);
};

export const resendVerifyCode = async (data) => {
  return callApi('/users/resend-verify-phone-code', 'post', data);
};

export const verifyToResetPassword = async (data) => {
  return callApi('/users/verify-to-reset-password', 'post', data);
};

export const resendCode = async (data) => {
  return callApi('/users/resendVerifyByPhone', 'post', data);
};

export const verifyPhone = async (data) => {
  return callApi('/users/verify-code-phone', 'post', data);
};

export const checkPhoneNumber = async (data) => {
  return callApi('/users/check-phoneNumber', 'post', data);
};

export const getprofile = async () => {
  return await callApi('/users/profile', 'get');
};

export const resetPassword = async (data) => {
  return await callApi('/users/forgotPassword', 'post', data);
};
export const changePassword = async (data) => {
  return await callApi('/users/changePassword', 'put', data);
};
export const updateProfile = async (data) => {
  return await callApi('/users/updateProfile', 'put', data);
};
export const updateAvatar = async (data) => {
  return await callApi('/users/avatar', 'put', data);
};
export const logoutUser = async () => {
  return callApi('/users/logout', 'post');
};
export const getListTeacherOnline = (page, limit) => {
  return callApi(`/users/listOnlineTeacher?page=${page}&limit=${limit}`);
};

export const createNewFollow = (data) => {
  return callApi('/follower', 'post', data);
};

export const deleteFollow = (id) => {
  return callApi(`/follower/${id}`, 'delete');
};

export const getListTeacher = (page, limit, text) => {
  return callApiList(
    `/teacherInfo/list/teacher?page=${page}&limit=${limit}&keyword=${text}`,
  );
};

export const getTeacherById = (id) => {
  return callApi(`/teacherInfo/${id}`);
};

export const teacherGetInfo = () => {
  return callApi('/teacherInfo');
};

export const addTeacherInfo = (data) => {
  return callApi('/teacherInfo', 'post', data);
};

export const updateTeacherInfo = (id, data) => {
  return callApi(`/user/update/${id}`, 'post', data);
};
export const updatForm = (data) => {
  return callApi('/users/form', 'put', data);
};

export const upDateFormWithToken = (data, token) => {
  return callApiWithToken('/users/form', 'put', data, token);
};

export function filterTeacher(data, page, limit) {
  return callApiList(
    `/users/filterTeacher?page=${page}&limit=${limit}`,
    'post',
    data,
  );
}
export function userFollow(data) {
  return callApi('/follow', 'post', data);
}

export function userUnFollow(data) {
  return callApi('/follow/unfollow', 'delete', data);
}

export function userGetListFollow(page, limit, keyword = '') {
  return callApiList(
    `/follow/filter?page=${page}&limit=${limit}&text=${keyword}`,
  );
}

export function userCreateReviewClass(data) {
  return callApi('/review/classes', 'post', data);
}

export function userCreateReviewTeacher(data) {
  return callApi('/review/teacher', 'post', data);
}

export function getReviewByClass(id, page, limit, keyword = '') {
  return callApiList(
    `/review/classes/${id}?page=${page}&limit=${limit}&keyword=${keyword}`,
  );
}

export function getReviewByTeacher(id, page, limit, keyword = '') {
  return callApiList(
    `/review/teacher/${id}?page=${page}&limit=${limit}&keyword=${keyword}`,
  );
}
export function teacherSuggestInfo(
  limit = 4,
  page = 1,
  keyword = '',
  all = true,
) {
  return callApiList(
    `/teacherInfo/suggest/info?limit=${limit}&page=${page}&keyword=${keyword}&all=${true}`,
    'get',
  );
}
export function teacherSuggestDistance(
  limit = 4,
  page = 1,
  keyword = '',
  all = true,
) {
  return callApiList(
    `/teacherInfo/suggest/distance?limit=${limit}&page=${page}&keyword=${keyword}&all=${true}`,
    'get',
  );
}

export function teacherSuggestRating(
  limit = 4,
  page = 1,
  keyword = '',
  all = true,
) {
  return callApiList(
    `/teacherInfo/suggest/rating?limit=${limit}&page=${page}&keyword=${keyword}&all=${true}`,
    'get',
  );
}
export function searchListTeacher(data, page = 1, limit = 10) {
  return callApiList(
    `/teacherInfo/filter/teacher/?type=teacher&page=${page}&limit=${limit}${
      data.city.length !== 0 ? `&city=${data.city}` : ''
    }${data.maxDistance.length !== 0 ? `&distance=${data.maxDistance}` : ''}${
      data.typeTeacher.length !== 0 ? `&type_teacher=${data.typeTeacher}` : ''
    }${data.text.length !== 0 ? `&searchString=${data.text}` : ''}${
      data.isOnline.length !== 0 ? `&trainingForm=${data.isOnline}` : ''
    }${data.subject.length !== 0 ? `&subject=${data.subject}` : ''}${
      data.topic.length !== 0 ? `&topic=${data.topic}` : ''
    }${data.typeClass.length !== 0 ? `&typeClass=${data.typeClass}` : ''}`,
    'get',
  );
}
export async function getTeacherByRequestId(
  id,
  page = 1,
  limit = 10,
  text = '',
) {
  return callApiList(
    `/teacherInfo/request/list/${id}?limit=${limit}&page=${page}&text=${text}`,
  );
}
export async function getTeacherSuggest() {
  return callApi(`/user/teacher`);
}
export async function getSubjectWithTopic(id, page = 1, limit = 50) {
  return callApiList(`/subjects/topic/${id}?page=${page}&limit=${limit}`);
}
export async function getConfig() {
  return callApi('/app-config', 'get');
}

export function reportUser(data) {
  return callApi('/users/report', 'post', data);
}
