import moment from 'moment';

export function formatTime(dateString) {
  return moment(dateString).format('h:mm:ss A');
}

export function formatDate(dateString) {
  return moment(dateString).format('DD/MM/YYYY');
}
export function formatDate2(dateString) {
  return moment(dateString).format('DD/MM/YY');
}

export function formatDateTime(dateString) {
  return moment(dateString).format('MMM D, YYYY, h:mm:ss A');
}

export function formatBirthDay(dateString) {
  return moment(dateString).format('MMM-DD-YYYY');
}

export function formatDateRequest(dateString) {
  return moment(dateString).format('DD | MM | YY');
}

export function formatHHMM(dateString) {
  return moment(dateString).format('HH:mm');
}
export function formatDDMMYYY(dateString) {
  return moment(dateString).format('DD-MM-YYYY');
}
export function formatYYYYMMDD(dateString) {
  return moment(dateString).format('YYYY-MM-DD');
}
export function formatdddDDMMYYYY(dateString) {
  return moment(dateString).format('dd-DD-MM-YYYY');
}
export function addTime(dateString, time) {
  return moment(dateString).add(time, 'minute').format('HH:mm');
}
export function formatMMDDYYYY(dateString) {
  return moment(dateString).format('MM-DD-YYYY');
}
