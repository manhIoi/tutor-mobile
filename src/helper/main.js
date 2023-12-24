import {getTeacherSuggest} from "../api/users";
import {getAvailableClasses, getRequestByTeacherId, userGetListRequest} from "../api/class";
import {setAll, setMyRequestList, setTeacherList, setTutorRequestList} from "../lib/slices/mainSlice";

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
        console.info(`LOG_IT:: e syncAll helper`, e);
    }
}

export const syncTeacherList = async (dispatch, payload) => {
    try {
        const teacherList = await getTeacherSuggest();
        dispatch(setTeacherList(teacherList))
    } catch (e) {
        console.info(`LOG_IT:: e syncAll helper`, e);
    }
}

export const syncTutorRequestList = async (dispatch, payload) => {
    try {
        const teacherList = await getAvailableClasses(payload?._id);
        dispatch(setTutorRequestList(teacherList))
    } catch (e) {
        console.info(`LOG_IT:: e syncAll helper`, e);
    }
}


