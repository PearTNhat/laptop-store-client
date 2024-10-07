// cái này xài mấy cái biến global khác
import { createSlice } from '@reduxjs/toolkit';
const appSlice = createSlice({
    name: 'app',
    initialState: {
        isShowModal: false,
        childrenModal: null,
    },
    reducers: {
        toggleModal: (state,action) => {
            state.isShowModal = action.payload.isShowModal;
            state.childrenModal = action.payload.childrenModal
        },
    },
});
const appReducer = appSlice.reducer;
const appActions = appSlice.actions;
export { appReducer, appActions };