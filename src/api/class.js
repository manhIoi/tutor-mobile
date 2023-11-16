import {
  callApiClass,
  callApiClassList,
  callApi,
  callApiList,
} from '../utils/apiCaller.util';

export function getProvinces(page, limit) {
  return callApiClass(`/cities?page=${page}&limit=${limit}`);
}
export function getTypeClassAPI(page, limit) {
  return callApiClass(`/typeclass?page=${page}&limit=${limit}`);
}

export function requestCreateClass(data) {
  return callApiClass('/classes', 'post', data);
}

export function userRequestClass(data, idTeacher) {
  return callApi(`/tutor-request/add${idTeacher ? `/${idTeacher}` : ''}`, 'post', data);
}

export function getDetailRequestCreated(idClass) {
  return callApi(`/tutor-request/detail/${idClass}`)
}

export function getListClass(page, limit, keyword = '') {
  return callApiClassList(`/classes/all?page=${page}&limit=${limit}`);
}

export function teacherGetListClass(id, status, page, limit, keyword = '') {
  return callApiClassList(
    `/classes/teacher/${id}?status=${status}&page=${page}&limit=${limit}&keyword=${keyword}`,
  );
}

export function getClassByTeacher(id, page, limit, keyword = '') {
  const date = new Date();
  const day = date?.getDate();
  const month = date?.getMonth();
  const year = date?.getFullYear();
  return callApiClassList(
    `/classes/teacher/${id}?status=${'upcoming'}&page=${page}&limit=${limit}&date=${new Date(
      year,
      month,
      day,
    ).toISOString()}`,
  );
}

export function getListClassRecommend(
  page = 1,
  limit = 4,
  status = 'upcoming',
  all = true,
) {
  return callApiClassList(
    `/classes/suggest/info?page=${page}&limit=${limit}&status=${status}&all=${all}`,
    'get',
  );
}

export function getListClassByDistance(page, limit, status = '', all = true) {
  return callApiClassList(
    `/classes/suggest/distance?page=${page}&limit=${limit}&status=${status}&all=${all}`,
    'get',
  );
}

export function getListClassByRate(page, limit, status = '', all = true) {
  return callApiClassList(
    `/classes/suggest/rate?page=${page}&limit=${limit}&status=${status}&all=${all}`,
    'get',
  );
}

export function userEditRequest(data, id) {
  return callApiClass(`/user/managementrequest/request/${id}`, 'put', data);
}

export function searchListClass(data, page = 1, limit = 10, isRequest) {
  const date = new Date();
  const day = date?.getDate();
  const month = date?.getMonth();
  const year = date?.getFullYear();
  return callApiClassList(
    `/classes/filter/class/list?date=${new Date(
      year,
      month,
      day,
    ).toISOString()}&page=${page}&limit=${limit}&isRequest=${isRequest}${
      data.city.length !== 0 ? `&city=${data.city}` : ''
    }${data.maxDistance.length !== 0 ? `&distance=${data.maxDistance}` : ''}${
      data.typeTeacher.length !== 0 ? `&type_teacher=${data.typeTeacher}` : ''
    }${data.text.length !== 0 ? `&text=${data.text}` : ''}${
      data.isOnline.length !== 0 ? `&isOnline=${data.isOnline}` : ''
    }${data.subject.length !== 0 ? `&subject=${data.subject}` : ''}${
      data.topic.length !== 0 ? `&topic=${data.topic}` : ''
    }${data.typeClass.length !== 0 ? `&typeClass=${data.typeClass}` : ''}`,
    'get',
  );
}

export function getTeacherManagementRequest(
  page = 1,
  limit = 10,
  keyword = '',
  status = 'pending',
  invite: true,
) {
  return callApiClassList(
    `/teacher/managementrequest?page=${page}&limit=${limit}&text=${keyword}&status=${status}&isInvite=${invite}`,
  );
}

export function teacherManageRegistry(id, page, limit) {
  return callApiClassList(
    `/teacher/managementclass/${id}?page=${page}&limit=${limit}`,
  );
}

export function getClassById(id) {
  return callApiClass(`/teacher/managementclass/class/${id}`);
}

export function studentGetClassById(id) {
  return callApiClass(`/classes/${id}`);
}

export function teacherApproveStudent(id) {
  return callApiClass(`/teacher/managementclass/approve/${id}`, 'put');
}

export function teacherRejectStudent(id) {
  return callApiClass(`/teacher/managementclass/reject/${id}`, 'put');
}

export function registerClass(id) {
  return callApiClass(`/user/managementclass/${id}`, 'post');
}

export function cancelRegistryClass(id) {
  return callApiClass(`/user/managementclass/${id}`, 'delete');
}

export function studentGetRegisteredClass(page, limit, keyword) {
  return callApiClassList(
    `/user/managementclass?page=${page}&limit=${limit}&keyword=${keyword}`,
  );
}

export function getListClassByTeacher(id) {
  return callApi(`/teacherInfo/${id}`);
}
export function removeClassOfTeacher(id) {
  return callApiClassList(`/teacher/managementclass/cancel/${id}`, 'delete');
}

//
export function userGetListRequest(id) {
  return callApi(
    `/tutor-request/${id}`,
  );
}

export function teacherEditClass(id, data) {
  return callApiClass(`/teacher/managementclass/${id}`, 'put', data);
}

export function teacherInvite(page = 1, limit = 10, keyword = '') {
  return callApiClassList(
    `/teacher/managementrequest/invite?page=${page}&limit=${limit}`,
    'get',
  );
}

export function rejectManagementRequest(id) {
  return callApiClassList(`/teacher/managementrequest/reject/${id}`, 'put');
}
export function teacherAcceptInvite(data) {
  return callApiClassList(
    `/teacher/managementrequest/acceptInvite`,
    'put',
    data,
  );
}

export function deleteManagmentRequest(id) {
  return callApiClassList(`/teacher/managementrequest/delete/${id}`, 'put');
}
export function getLessonByDate(date) {
  return callApiClassList(`/lesson?date=${date}`);
}

export function teacherGetLessonByDate(date) {
  return callApiClassList(`/lesson/teacher/class?date=${date}`);
}

export function cancelManagementRequest(id) {
  return callApiClassList(
    `/teacher/managementrequest/request/reject/${id}`,
    'put',
  );
}
export function getLessonById(id) {
  return callApiClassList(`/lesson/${id}`, 'get');
}

export function teacherDeleteClassById(id) {
  return callApiClass(`/teacher/managementclass/cancel/${id}`, 'delete');
}
//

export function getLessonByMonth(firstDay, lastDay) {
  return callApiClassList(
    `/lesson/class/month?limit=${500}&firstDay=${firstDay}&lastDay=${lastDay}`,
  );
}

export function userInviteTeacher(data) {
  return callApiClass('/user/managementrequest', 'post', data);
}

export function teacherGetAllRequest(page, limit, status = '') {
  return callApiClassList(`/classes/request/all?page=${page}&limit=${limit}`);
}

export function userDeleteRequest(id) {
  return callApiClass(`/user/managementrequest/cancel/${id}`, 'delete');
}

export function getClassId(id) {
  return callApiClass(`/classes/${id}`, 'get');
}
export function getClassOfUser(page = 1, limit = 10, status = 'pending') {
  return callApiClassList(
    `/user/managementrequest/class/management?page=${page}&limit=${limit}&status=${status}`,
    'get',
  );
}
export function getManagementRequestOfUser(id) {
  return callApiClass(`/user/managementrequest/${id}`, 'get');
}
//

export function teacherGetRequestById(id) {
  return callApiClass(`/classes/request/${id}`);
}

export function teacherRegistryRequest(data) {
  return callApiClass('/teacher/managementrequest', 'post', data);
}

export function userInviteTeacherByIdClass(data) {
  return callApiClass('/user/managementrequest', 'post', data);
}

export function getRequestById(id) {
  return callApiClass(`/user/managementrequest/${id}`);
}

export function teacherStartClass(id) {
  return callApiClass(`/teacher/managementclass/startClass/${id}`, 'put');
}
export function favoriteClass(data) {
  return callApiClassList('/favoriteClass', 'post', data);
}
export function deleteRecommend(id) {
  return callApiClassList(
    `/teacher/managementrequest/request/delete/${id}`,
    'delete',
  );
}
export function getFavoriteClass(page, limit, status = true) {
  return callApiClassList(
    `/favoriteClass?page=${page}&limit=${limit}&status=${status}`,
    'get',
  );
}
export function changeSchedule(id, data) {
  return callApiClassList(
    `/teacher/managementclass/changeStartAt/${id}`,
    'put',
    data,
  );
}
export function userGetTeacherOfRequest(limit = 10, page = 1, keyword = '') {
  return callApiClass(
    `/user/managementrequest?limit=${limit}&page=${page}&keyword=${keyword}`,
    'get',
  );
}
export function teacherRegisterRequest(data) {
  return callApiClassList(`/teacher/managementrequest`, 'post', data);
}
export async function teacherGetClassInfo(limit = 10, page = 1, all = true) {
  return callApiClassList(
    `/classes/request/suggest/info/?type=info?limit=${limit}&page=${page}&all=${all}`,
  );
}
export async function teacherGetClassDistance(
  limit = 10,
  page = 1,
  all = true,
) {
  return callApiClassList(
    `/classes/request/suggest/info/?limit=${limit}&page=${page}&all=${all}`,
  );
}
export async function teacherGetManageClass(
  page = 1,
  limit = 10,
  status = 'ongoing',
) {
  return callApiClassList(
    `/teacher/managementclass/list/class/?page=${page}&limit=${limit}&status=${status}`,
    'get',
  );
}

export async function getOtherDataClass() {
  return callApi(`/tutor-request/all`)
}

export async function getClassSuggestService(
  page = 1,
  limit = 10,
  type,
  all = true,
) {
  // const date = new Date();
  const date = new Date();
  const day = date?.getDate();
  const month = date?.getMonth();
  const year = date?.getFullYear();
  return callApiClassList(
    `/classes/suggest/service/?page=${page}&limit=${limit}&type=${type}&all=${all}&isRequest=false&date=${new Date(
      year,
      month,
      day,
    ).toISOString()}`,
    'get',
  );
}
export async function getRequestSuggestService(
  page = 1,
  limit = 10,
  type,
  all = true,
) {
  const date = new Date();
  const day = date?.getDate();
  const month = date?.getMonth();
  const year = date?.getFullYear();
  return callApiClassList(
    `/classes/suggest/service/?page=${page}&limit=${limit}&type=${type}&all=${all}&isRequest=true&date=${new Date(
      year,
      month,
      day,
    ).toISOString()}`,
    'get',
  );
}
// https://tggs-class.tesse.io/v1//filter/request/?text=
export async function searchRequestList(page = 1, limit = 10, text) {
  const date = new Date();
  const day = date?.getDate();
  const month = date?.getMonth();
  const year = date?.getFullYear();
  return callApiClassList(
    `/classes/filter/class/list?isRequest=true&page=${page}&limit=${limit}${
      text.length !== 0 ? `&text=${text}` : ''
    }&date=${new Date(year, month, day).toISOString()}`,
    'get',
  );
}
export async function getTeacherByRequestId(
  id,
  page = 1,
  limit = 10,
  status = true,
) {
  return callApiClassList(
    `/user/managementrequest/${id}/invite?page=${page}&limit=${limit}&isInvite=${status}`,
    'get',
  );
}
export async function userAcceptRequest(id) {
  return callApiClassList(`/user/managementrequest/approve/${id}`, 'put');
}
export async function userRejectRequest(id) {
  return callApiClassList(`/user/managementrequest/reject/${id}`, 'put');
}
export async function teacherGetStudent(id, page = 1, limit = 10) {
  return callApiClassList(
    `/classes/student/${id}?page=${page}&limit=${limit}`,
    'get',
  );
}
export function userChangeSchedule(id, data) {
  return callApiClass(
    `/user/managementrequest/changeLesson/${id}`,
    'put',
    data,
  );
}
export function teacherRemind(id) {
  return callApiClass(`/teacher/managementclass/remindPayment/${id}`, 'get');
}

export function teacherAcceptAndReject(type, data) {
  return callApiClass(
    `/teacher/managementclass/change-lesson/accept-reject-change-lesson?type=${type}`,
    'put',
    data,
  );
}
