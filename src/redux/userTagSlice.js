import { createSlice } from "@reduxjs/toolkit";

const iniState = {
    selectedUserTagList: []
}

export const userTagSlice = createSlice({
    name: 'userTag',
    initialState: iniState,
    reducers: {
        setSelectedUserTagList: (state, { payload }) => {
            state.selectedUserTagList = payload;
        }
    }
})

export const {
    setSelectedUserTagList
} = userTagSlice.actions;

export default userTagSlice.reducer;