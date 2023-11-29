import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    value: [],
};

const subjectSlice = createSlice({
    name: 'subject',
    initialState: initialState,
    reducers: {
        setSubjectsValue: (state, action) => {
            console.info(`🔥🔥🔥LOGGER::  action`, action.payload);
            state.value = action.payload;
        },

        getSubjectsValue: (state) => {
            return state.value;
        }
    },
});

export const { setSubjectsValue, getSubjectsValue } = subjectSlice.actions;
export default subjectSlice.reducer;
