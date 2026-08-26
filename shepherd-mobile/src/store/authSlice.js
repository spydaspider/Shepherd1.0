import { createSlice } from "@reduxjs/toolkit";


// =====================================================
// INITIAL AUTH STATE
// =====================================================

const initialState = {
    user: null,
    token: null,
    isAuthenticated: false,

    // Important:
    // false means we have not finished checking
    // AsyncStorage yet.
    authChecked: false,
};


// =====================================================
// AUTH SLICE
// =====================================================

const authSlice = createSlice({

    name: "auth",

    initialState,

    reducers: {

        // =================================================
        // LOGIN SUCCESS
        // =================================================

        loginSuccess: (state, action) => {

            state.user = action.payload.user;

            state.token = action.payload.token;

            state.isAuthenticated = true;

            state.authChecked = true;
        },


        // =================================================
        // RESTORE SAVED SESSION
        // =================================================

        restoreSession: (state, action) => {

            state.user = action.payload.user;

            state.token = action.payload.token;

            state.isAuthenticated = true;

            state.authChecked = true;
        },


        // =================================================
        // NO SAVED SESSION
        // =================================================

        sessionExpired: (state) => {

            state.user = null;

            state.token = null;

            state.isAuthenticated = false;

            state.authChecked = true;
        },


        // =================================================
        // LOGOUT
        // =================================================

        logout: (state) => {

            state.user = null;

            state.token = null;

            state.isAuthenticated = false;

            state.authChecked = true;
        },

    },

});


// =====================================================
// EXPORT ACTIONS
// =====================================================

export const {
    loginSuccess,
    restoreSession,
    sessionExpired,
    logout,
} = authSlice.actions;


// =====================================================
// EXPORT REDUCER
// =====================================================

export default authSlice.reducer;