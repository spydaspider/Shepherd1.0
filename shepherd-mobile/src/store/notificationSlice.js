import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    notifications: [],
    unreadCount: 0,
    loading: false,
    error: null,
};

const notificationSlice = createSlice({
    name: "notifications",
    initialState,

    reducers: {
        setNotifications: (state, action) => {
            state.notifications = action.payload.notifications || [];
            state.unreadCount = action.payload.unreadCount || 0;
            state.loading = false;
            state.error = null;
        },

        setNotificationLoading: (state, action) => {
            state.loading = action.payload;
        },

        setNotificationError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },

        markNotificationAsRead: (state, action) => {
            const notificationId = action.payload;

            const notification = state.notifications.find(
                (item) => item._id === notificationId
            );

            if (notification && !notification.isRead) {
                notification.isRead = true;
                notification.readAt = new Date().toISOString();

                state.unreadCount = Math.max(
                    state.unreadCount - 1,
                    0
                );
            }
        },

        markAllNotificationsAsRead: (state) => {
            state.notifications.forEach((notification) => {
                notification.isRead = true;
                notification.readAt = new Date().toISOString();
            });

            state.unreadCount = 0;
        },

        removeNotification: (state, action) => {
            const notificationId = action.payload;

            const notification = state.notifications.find(
                (item) => item._id === notificationId
            );

            state.notifications = state.notifications.filter(
                (item) => item._id !== notificationId
            );

            if (notification && !notification.isRead) {
                state.unreadCount = Math.max(
                    state.unreadCount - 1,
                    0
                );
            }
        },

        clearNotifications: (state) => {
            state.notifications = [];
            state.unreadCount = 0;
            state.loading = false;
            state.error = null;
        },
    },
});

export const {
    setNotifications,
    setNotificationLoading,
    setNotificationError,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    removeNotification,
    clearNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;