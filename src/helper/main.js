import {getTeacherSuggest} from "../api/users";
import {getAvailableClasses, getRequestByTeacherId, userGetListRequest} from "../api/class";
import {
    setAll,
    setMyRequestList,
    setNotificationList,
    setTeacherList,
    setTutorRequestList
} from "../lib/slices/mainSlice";
import {getNotification} from "../api/chat";

export const syncAll = async (dispatch, payload) => {
    try {
        const { _id, role } = payload || {}
        const funcGetMyRequest = role === 'teacher' ? getRequestByTeacherId : userGetListRequest
        const teacherList = await getTeacherSuggest()
        const tutorRequestList = await getAvailableClasses(_id)
        const myRequestList = await funcGetMyRequest(_id);
        dispatch(setAll({
            teacherList,
            tutorRequestList,
            myRequestList,
        }))
    } catch (e) {
        console.info(`LOG_IT:: e syncAll helper`, e);
    }
}

export const syncAllAsync = async (dispatch, payload) => {
    try {
        const { _id, role } = payload || {}
        const funcGetMyRequest = role === 'teacher' ? getRequestByTeacherId : userGetListRequest
        getTeacherSuggest().then(teacherList => dispatch(setTeacherList(teacherList)))
        getAvailableClasses(_id).then(tutorRequestList => dispatch(setTutorRequestList(tutorRequestList)))
        funcGetMyRequest(_id).then(myRequestList => dispatch(setMyRequestList(myRequestList)));
    } catch (e) {
        console.info(`LOG_IT:: e sync all async helper`, e);
    }
}

export const syncMyRequestList = async (dispatch, payload) => {
    try {
        const { _id, role } = payload || {}
        const funcGetMyRequest = role === 'teacher' ? getRequestByTeacherId : userGetListRequest
        const myRequestList = await funcGetMyRequest(_id);
        dispatch(setMyRequestList(myRequestList))
    } catch (e) {
        console.info(`LOG_IT:: e syncMyRequestList helper`, e);
    }
}

export const syncTeacherList = async (dispatch, payload) => {
    try {
        const teacherList = await getTeacherSuggest();
        dispatch(setTeacherList(teacherList))
    } catch (e) {
        console.info(`LOG_IT:: e syncTeacherList helper`, e);
    }
}

export const syncTutorRequestList = async (dispatch, payload) => {
    try {
        const teacherList = await getAvailableClasses(payload?._id);
        dispatch(setTutorRequestList(teacherList))
    } catch (e) {
        console.info(`LOG_IT:: e syncTutorRequestList helper`, e);
    }
}

export const getNotificationList = async (dispatch, payload) => {
    try {
        const notificationList = await getNotification(payload?._id)
        dispatch(setNotificationList(notificationList));
    } catch (e) {
        console.info(`LOG_IT:: e getNotificationList helper`, e);
    }
}


