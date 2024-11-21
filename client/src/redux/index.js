import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    token: null,
    profilePic: '',
    contacts: []
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            console.log("Setting user:", action.payload);
            state.user = action.payload;
        },
        setLatestTransaction: (state, action) => {
            const contactId = action.payload.createdWith[0];
            const contactIndex = state.contacts.findIndex(contact =>
                contact.contactId === contactId
            );
            if (contactIndex !== -1) {
                state.contacts[contactIndex].expense = action.payload;
            }
        },

        setToken: (state, action) => {
            state.token = action.payload;
        },
        setFriends: (state, action) => {
            console.log("Setting friends:",state);
            state.contacts = action.payload
        },

        setProfilePic: (state, action) => {
            if (state.user) {
                state.user.profilePic = action.payload;
            } else {
                console.error('User object is null or undefined. Cannot update profilePic.');
            }
        },

        logout: () => initialState,
    }
});

export const { setUser, setToken, logout, setFriends, setProfilePic, setLatestTransaction } = userSlice.actions;
export default userSlice.reducer;