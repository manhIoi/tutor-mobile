import {
  callApiNotification,
  callApiListNotification, callApi,
} from '../utils/apiCaller.util';

export function createChatSingle(id) {
  return callApiNotification(`/group-chat/${id}`);
}

export function deleteGroupChat(id) {
  return callApiNotification(`/group-chat/${id}`, 'delete');
}

export function getListBoxChat(idUser) {
  return callApi(`/room/${idUser}`,"get");
}

export function createMessage(data, id) {
  return callApiNotification(`/message/${id}`, 'post', data);
}
export function getListMessageByGroup(id, page, limit, keyword, message = '') {
  return callApiListNotification(
    `/message/${id}?page=${page}&limit=${limit}&keyword=${keyword}${
      message ? `&message=${message}` : ''
    }`,
  );
}

export function requestCall(data) {
  return callApiNotification('/message/request-call', 'post', data);
}
export function getNotification(id) {
  return callApi(`/notification/${id}`,'get');
}

export const readNotificationApi = (id) => {
  return callApi(`/notification/read/${id}`,'post')
}


export function getNotificationById(id) {
  return callApiNotification(`/notification/${id}`, 'get');
}
export function deleteNotificationById(id) {
  return callApiNotification(`/notification/${id}`, 'delete');
}

export function hideMessage(data) {
  return callApiNotification('/message/hide-message', 'delete', data);
}

export function blockUser(data) {
  return callApiNotification('/group-chat/block-user', 'put', data);
}

export function unBlockUser(data) {
  return callApiNotification('/group-chat/unblock-user', 'delete', data);
}

export function getMessageByRoom(data) {
  return callApi('/chat/room','post', data);
}

export function joinRoomApi(data) {
  return callApi(`/room/join`, 'post', data)
}
