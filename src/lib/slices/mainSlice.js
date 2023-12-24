import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    tutorRequestList: [],
    teacherList: [],
    myRequestList: []
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
            console.info(`LOG_IT:: state setTeacherList`, state);
            return {
                ...state,
                teacherList: action.payload
            }
        },
        setTutorRequestList: (state, action) => {
            console.info(`LOG_IT:: statesetTutorRequestList`, state);
            console.info(`LOG_IT:: action.payload`, action.payload);
            return {
                ...state,
                tutorRequestList: action.payload,
            }
        },
        setMyRequestList(state, action) {
            console.info(`LOG_IT:: state setMyRequestList`, state);
            return {
                ...state,
                myRequestList: action.payload
            }
        }
    },
});

export const {
    setTeacherList,
    setTutorRequestList ,
    setMyRequestList, setAll
} = mainSlice.actions;
export default mainSlice.reducer;
