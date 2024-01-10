import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    rooms: [],
};

const chatSlice = createSlice({
    name: 'chat',
    initialState: initialState,
    reducers: {
        setListRoom: (state, action) => {
            return {
                ...state,
                rooms: action.payload
            };
        },
    },
});

export const { setListRoom } = chatSlice.actions;
export default chatSlice.reducer;
