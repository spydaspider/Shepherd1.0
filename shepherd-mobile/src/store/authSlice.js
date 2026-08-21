import { createSlice } from "@reduxjs/toolkit";


const initialState = {

    user: null,

    token: null,

    isAuthenticated: false,

};


const authSlice = createSlice({

    name: "auth",

    initialState,

    reducers: {

        loginSuccess: (state, action) => {

            state.user = action.payload.user;

            state.token = action.payload.token;

            state.isAuthenticated = true;

        },


        logout: (state) => {

            state.user = null;

            state.token = null;

            state.isAuthenticated = false;

        },


        restoreSession: (state, action) => {

            state.user = action.payload.user;

            state.token = action.payload.token;

            state.isAuthenticated = true;

        },

    },

});


export const {

    loginSuccess,

    logout,

    restoreSession,

} = authSlice.actions;


export default authSlice.reducer;