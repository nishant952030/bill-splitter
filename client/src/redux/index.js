import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user:null,
    token: null,
    contacts:[]
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: { 
        setUser: (state, action) => {
            state.user=action.payload
        },
        setToken: (state, action) => {
            state.token = action.payload;
        },
        setFriends: (state, action) => {
            state.contacts=action.payload
        },
        logout: () => initialState,
    }
});

export const { setUser, setToken, logout,setFriends} = userSlice.actions;
export default userSlice.reducer;