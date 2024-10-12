import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user:null,
    token: null,
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

        logout: () => initialState,
    }
});

export const { setUser, setToken, logout} = userSlice.actions;
export default userSlice.reducer;