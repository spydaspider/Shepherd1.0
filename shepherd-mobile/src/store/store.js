import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./authSlice";

import notificationReducer from "./notificationSlice";


// =====================================================
// REDUX STORE
// =====================================================

const store = configureStore({

    reducer: {

        auth: authReducer,

        notifications: notificationReducer,

    },

});


export default store;