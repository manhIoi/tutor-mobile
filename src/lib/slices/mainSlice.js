import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    tutorRequestList: [],
    teacherList: [],
    myRequestList: [],
    notificationList: [],
};

const mainSlice = createSlice({
    name: 'main',
    initialState: initialState,
    reducers: {
        setAll: (state, action) => {
            return {
                ...state,
                ...action.payload,
            }
        },
        setTeacherList: (state, action) => {
            return {
                ...state,
                teacherList: action.payload
            }
        },
        setTutorRequestList: (state, action) => {
            return {
                ...state,
                tutorRequestList: action.payload,
            }
        },
        setMyRequestList(state, action) {
            return {
                ...state,
                myRequestList: action.payload
            }
        },
        setNotificationList(state,action) {
            return {
                ...state,
                notificationList: action.payload
            }
        }
    },
});

export const {
    setTeacherList,
    setTutorRequestList ,
    setMyRequestList, setAll,
    setNotificationList
} = mainSlice.actions;
export default mainSlice.reducer;
