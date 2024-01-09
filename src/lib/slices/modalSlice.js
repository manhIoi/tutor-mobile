import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isShowApprovePopup: false,
    approvePopupData: null,
    isShowLoading: false,
};

const modalSlice = createSlice({
    name: 'modal',
    initialState: initialState,
    reducers: {
        showApprovePopup: (state, action) => {
            return {
                ...state,
                isShowApprovePopup: true,
                approvePopupData: action.payload,
            }
        },
        hideApprovePopup: (state) => {
            return {
                ...state,
                isShowApprovePopup: false,
                approvePopupData: null,
            }
        },
        showLoadingModal: (state, action) => {
            return {
                ...state,
                isShowLoading: true,
            }
        },
        hideLoadingModal: (state, action) => {
            return {
                ...state,
                isShowLoading: false,
            }
        }
    },
});

export const {
    showApprovePopup,
    hideApprovePopup,
    showLoadingModal,
    hideLoadingModal
} = modalSlice.actions;
export default modalSlice.reducer;
