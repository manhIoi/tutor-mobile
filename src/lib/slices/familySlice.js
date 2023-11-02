import {createSlice} from '@reduxjs/toolkit';
import {callApi} from '../../utils/apiCaller.util';
import {USER_TOKEN} from '../../utils/auth.util';
import {
  getfamilyaccount,
  updateFamilyProfileId,
  getFamilyProfileId,
} from '../../api/familyProfile';
import {getprofile} from '../../api/users';

const initialState = {
  familyProfile: {},
  userprofile: {},
  isRefresh: false,
};

const FamilySlice = createSlice({
  name: 'family',
  initialState: initialState,
  reducers: {
    getFamily: (state, action) => {
      state.family = action.payload;
    },
    getFamilyById: (state, action) => {
      state.familyId = action.payload;
    },
    addData: (state, action) => {
      state.Data = state.push();
    },
    getProfile: (state, action) => {
      state.profile = action.payload;
    },
    editProfile: (state) => {
      state.isClick = !state.isClick;
    },
    uploadImage: (state) => {
      state.image = action.payload;
    },
    updateRefresh: (state) => {
      state.isRefresh = !state.isRefresh;
    },
  },
});

// get State
export const selectfamily = (state) => state.family.family;
export const selectfamilyId = (state) => state.family.familyId;
export const selectDataStore = (state) => state.family.Data;
export const slectProfile = (state) => state.family.profile;
export const IsChecked = (state) => state.family.isClick;
export const selectImage = (state) => state.family.image;
export const selectIsRefresh = (state) => state.family.isRefresh;

export const {
  getFamily,
  getFamilyById,
  getProfile,
  editProfile,
  uploadImage,
  updateRefresh,
} = FamilySlice.actions;
export default FamilySlice.reducer;

// async action

export const getFamlilyProfile = () => async (dispatch) => {
  const familyProfile = await getfamilyaccount();
  return dispatch(getFamily(familyProfile));
};
export const updatefamilyProfile = (id, data) => async (dispatch) => {
  // console.log(updateFamilyProfileId(id,data))
  const familyProfile = await updateFamilyProfileId(id, data);
  return dispatch(getFamily(familyProfile));
};
export const getFamlilyProfileById = (id) => async (dispatch) => {
  const familyProfileId = await getFamilyProfileId(id);
  return dispatch(getFamilyById(familyProfileId));
};
export const getUserProfile = () => async (dispatch) => {
  const profile = await getprofile();
  return dispatch(getProfile(profile));
};
