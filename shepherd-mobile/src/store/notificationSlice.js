import { createSlice } from "@reduxjs/toolkit";


// =====================================================
// INITIAL STATE
// =====================================================

const initialState = {
    unreadCount: 0,
};


// =====================================================
// NOTIFICATION SLICE
// =====================================================

const notificationSlice = createSlice({

    name: "notifications",

    initialState,

    reducers: {

        // =================================================
        // SET UNREAD COUNT
        // =================================================

        setUnreadCount: (state, action) => {

            state.unreadCount =
                Number(action.payload) || 0;

        },


        // =================================================
        // DECREASE UNREAD COUNT
        // =================================================

        decreaseUnreadCount: (state) => {

            if (state.unreadCount > 0) {

                state.unreadCount -= 1;

            }

        },


        // =================================================
        // MARK ALL AS READ
        // =================================================

        clearUnreadCount: (state) => {

            state.unreadCount = 0;

        },


        // =================================================
        // RESET NOTIFICATIONS
        // =================================================

        resetNotifications: (state) => {

            state.unreadCount = 0;

        },

    },

});


// =====================================================
// EXPORT ACTIONS
// =====================================================

export const {
    setUnreadCount,
    decreaseUnreadCount,
    clearUnreadCount,
    resetNotifications,
} = notificationSlice.actions;


// =====================================================
// EXPORT REDUCER
// =====================================================

export default notificationSlice.reducer;