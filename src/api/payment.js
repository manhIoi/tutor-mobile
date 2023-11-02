import {callApiPayment, callApiPaymentList} from '../utils/apiCaller.util';

export function createPayment(data) {
  return callApiPayment('/payment/create', 'post', data);
}

export function getBalance() {
  return callApiPayment('/user/get-balance');
}
export function getTransaction(
  page = 1,
  limit = 10,
  sort = 'createdAt:asc',
  profit = true,
) {
  return callApiPaymentList(
    `/transaction?page=${page}&limit=${limit}&sort=${sort}&profit=${profit}`,
    'get',
  );
}
export function createWithDraw(data) {
  return callApiPaymentList(`/withdraw/create`, 'post', data);
}
export function getWithDraw(page = 1, limit = 10, status) {
  return callApiPaymentList(
    `/withdraw?page=${page}&limit=${limit}&status=${status}`,
  );
}
