import {
    useCallback,
    useState,
} from "react";

import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    RefreshControl,
    ActivityIndicator,
    Alert,
} from "react-native";

import {
    useFocusEffect,
} from "expo-router";

import {
    useDispatch,
} from "react-redux";

import {
    setUnreadCount,
    decreaseUnreadCount,
    clearUnreadCount,
} from "../store/notificationSlice";

import api from "../api/axios";


// =====================================================
// NOTIFICATIONS SCREEN
// =====================================================

export default function NotificationsScreen() {

    const dispatch = useDispatch();


    // =================================================
    // STATE
    // =================================================

    const [notifications, setNotifications] =
        useState([]);

    const [unreadCount, setUnreadCountLocal] =
        useState(0);

    const [loading, setLoading] =
        useState(true);

    const [refreshing, setRefreshing] =
        useState(false);

    const [error, setError] =
        useState("");


    // =================================================
    // FETCH NOTIFICATIONS
    // =================================================

    const fetchNotifications =
        useCallback(
            async (
                showLoading = true
            ) => {

                try {

                    if (showLoading) {

                        setLoading(true);

                    }


                    setError("");


                    const response =
                        await api.get(
                            "/notifications"
                        );


                    if (
                        response.data?.success
                    ) {

                        const notificationList =
                            Array.isArray(
                                response.data.notifications
                            )
                                ? response.data.notifications
                                : [];


                        const count =
                            Number(
                                response.data.unreadCount ||
                                0
                            );


                        setNotifications(
                            notificationList
                        );


                        setUnreadCountLocal(
                            count
                        );


                        // =================================
                        // UPDATE REDUX BADGE
                        // =================================

                        dispatch(
                            setUnreadCount(
                                count
                            )
                        );

                    }
                    else {

                        setError(
                            "Unable to load your notifications."
                        );

                    }

                }
                catch (error) {

                    console.log(
                        "MOBILE NOTIFICATIONS ERROR:",
                        error?.response?.data ||
                        error?.message
                    );


                    setError(
                        error?.response?.data?.message ||
                        "Unable to load your notifications."
                    );

                }
                finally {

                    setLoading(false);

                    setRefreshing(false);

                }

            },
            [dispatch]
        );


    // =================================================
    // REFRESH WHEN SCREEN GETS FOCUS
    // =================================================

    useFocusEffect(

        useCallback(() => {

            fetchNotifications();

        }, [fetchNotifications])

    );


    // =================================================
    // PULL TO REFRESH
    // =================================================

    const handleRefresh = async () => {

        setRefreshing(true);

        await fetchNotifications(false);

    };


    // =================================================
    // MARK SINGLE NOTIFICATION AS READ
    // =================================================

    const handleMarkAsRead =
        async (
            notification
        ) => {

            if (
                notification?.isRead
            ) {

                return;

            }


            try {

                const response =
                    await api.patch(
                        `/notifications/${notification._id}/read`
                    );


                if (
                    response.data?.success
                ) {

                    // =================================
                    // UPDATE NOTIFICATION
                    // =================================

                    setNotifications(
                        previous =>
                            previous.map(
                                item =>
                                    item._id ===
                                    notification._id
                                        ? {
                                            ...item,
                                            isRead: true,
                                            readAt:
                                                new Date().toISOString(),
                                        }
                                        : item
                            )
                    );


                    // =================================
                    // UPDATE LOCAL COUNT
                    // =================================

                    setUnreadCountLocal(
                        previous =>
                            Math.max(
                                previous - 1,
                                0
                            )
                    );


                    // =================================
                    // UPDATE REDUX BADGE
                    // =================================

                    dispatch(
                        decreaseUnreadCount()
                    );

                }

            }
            catch (error) {

                console.log(
                    "MARK NOTIFICATION READ ERROR:",
                    error?.response?.data ||
                    error?.message
                );


                Alert.alert(
                    "Unable to update",
                    "This notification could not be marked as read."
                );

            }

        };


    // =================================================
    // MARK ALL AS READ
    // =================================================

    const handleMarkAllAsRead =
        async () => {

            if (
                unreadCount === 0
            ) {

                return;

            }


            try {

                const response =
                    await api.patch(
                        "/notifications/read-all"
                    );


                if (
                    response.data?.success
                ) {

                    const now =
                        new Date().toISOString();


                    // =================================
                    // UPDATE NOTIFICATIONS
                    // =================================

                    setNotifications(
                        previous =>
                            previous.map(
                                notification => ({
                                    ...notification,
                                    isRead: true,
                                    readAt: now,
                                })
                            )
                    );


                    // =================================
                    // UPDATE LOCAL COUNT
                    // =================================

                    setUnreadCountLocal(0);


                    // =================================
                    // UPDATE REDUX BADGE
                    // =================================

                    dispatch(
                        clearUnreadCount()
                    );

                }

            }
            catch (error) {

                console.log(
                    "MARK ALL NOTIFICATIONS READ ERROR:",
                    error?.response?.data ||
                    error?.message
                );


                Alert.alert(
                    "Unable to update",
                    "Your notifications could not be updated."
                );

            }

        };


    // =================================================
    // DELETE NOTIFICATION
    // =================================================

    const handleDelete =
        (
            notification
        ) => {

            Alert.alert(
                "Delete Notification",
                "Are you sure you want to delete this notification?",
                [

                    {
                        text: "Cancel",
                        style: "cancel",
                    },


                    {
                        text: "Delete",
                        style: "destructive",

                        onPress:
                            async () => {

                                try {

                                    const response =
                                        await api.delete(
                                            `/notifications/${notification._id}`
                                        );


                                    if (
                                        response.data?.success
                                    ) {

                                        setNotifications(
                                            previous =>
                                                previous.filter(
                                                    item =>
                                                        item._id !==
                                                        notification._id
                                                )
                                        );


                                        if (
                                            !notification.isRead
                                        ) {

                                            setUnreadCountLocal(
                                                previous =>
                                                    Math.max(
                                                        previous - 1,
                                                        0
                                                    )
                                            );


                                            dispatch(
                                                decreaseUnreadCount()
                                            );

                                        }

                                    }

                                }
                                catch (error) {

                                    console.log(
                                        "DELETE NOTIFICATION ERROR:",
                                        error?.response?.data ||
                                        error?.message
                                    );


                                    Alert.alert(
                                        "Delete Failed",
                                        "Unable to delete this notification."
                                    );

                                }

                            },

                    },

                ]
            );

        };


    // =================================================
    // FORMAT DATE
    // =================================================

    const formatDate =
        (
            value
        ) => {

            if (!value) {

                return "";

            }


            const date =
                new Date(value);


            if (
                Number.isNaN(
                    date.getTime()
                )
            ) {

                return "";

            }


            const now =
                new Date();


            const difference =
                now.getTime() -
                date.getTime();


            const minute =
                60 * 1000;

            const hour =
                60 * minute;

            const day =
                24 * hour;


            if (
                difference < minute
            ) {

                return "Just now";

            }


            if (
                difference < hour
            ) {

                const minutes =
                    Math.floor(
                        difference / minute
                    );


                return `${minutes} min ago`;

            }


            if (
                difference < day
            ) {

                const hours =
                    Math.floor(
                        difference / hour
                    );


                return `${hours} hr ago`;

            }


            if (
                difference < 7 * day
            ) {

                const days =
                    Math.floor(
                        difference / day
                    );


                return `${days} day${
                    days === 1
                        ? ""
                        : "s"
                } ago`;

            }


            return date.toLocaleDateString(
                "en-GB",
                {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                }
            );

        };


    // =================================================
    // NOTIFICATION TYPE
    // =================================================

    const getTypeInfo =
        (
            type
        ) => {

            switch (type) {

                case "Attendance":

                    return {
                        icon: "✓",
                        label: "Attendance",
                        style:
                            styles.attendanceType,
                        iconStyle:
                            styles.attendanceIcon,
                    };


                case "Service":

                    return {
                        icon: "S",
                        label: "Service",
                        style:
                            styles.serviceType,
                        iconStyle:
                            styles.serviceIcon,
                    };


                case "FollowUp":

                    return {
                        icon: "F",
                        label: "Follow Up",
                        style:
                            styles.followUpType,
                        iconStyle:
                            styles.followUpIcon,
                    };


                case "Announcement":

                    return {
                        icon: "!",
                        label: "Announcement",
                        style:
                            styles.announcementType,
                        iconStyle:
                            styles.announcementIcon,
                    };


                case "Reminder":

                    return {
                        icon: "R",
                        label: "Reminder",
                        style:
                            styles.reminderType,
                        iconStyle:
                            styles.reminderIcon,
                    };


                default:

                    return {
                        icon: "i",
                        label: "System",
                        style:
                            styles.systemType,
                        iconStyle:
                            styles.systemIcon,
                    };

            }

        };


    // =================================================
    // LOADING
    // =================================================

    if (loading) {

        return (

            <View
                style={
                    styles.loadingContainer
                }
            >

                <ActivityIndicator
                    size="large"
                    color="#0f2a5f"
                />


                <Text
                    style={
                        styles.loadingText
                    }
                >
                    Loading notifications...
                </Text>

            </View>

        );

    }


    // =================================================
    // ERROR
    // =================================================

    if (error) {

        return (

            <View
                style={
                    styles.errorContainer
                }
            >

                <View
                    style={
                        styles.errorCircle
                    }
                >

                    <Text
                        style={
                            styles.errorIcon
                        }
                    >
                        !
                    </Text>

                </View>


                <Text
                    style={
                        styles.errorTitle
                    }
                >
                    Something went wrong
                </Text>


                <Text
                    style={
                        styles.errorMessage
                    }
                >
                    {error}
                </Text>


                <TouchableOpacity
                    style={
                        styles.retryButton
                    }
                    onPress={() =>
                        fetchNotifications()
                    }
                    activeOpacity={0.8}
                >

                    <Text
                        style={
                            styles.retryText
                        }
                    >
                        Try Again
                    </Text>

                </TouchableOpacity>

            </View>

        );

    }


    // =================================================
    // RENDER
    // =================================================

    return (

        <ScrollView

            style={
                styles.container
            }

            contentContainerStyle={
                styles.content
            }

            showsVerticalScrollIndicator={
                false
            }

            refreshControl={

                <RefreshControl
                    refreshing={
                        refreshing
                    }
                    onRefresh={
                        handleRefresh
                    }
                    tintColor="#0f2a5f"
                />

            }

        >

            {/* =========================================
                HEADER
            ========================================== */}

            <View
                style={
                    styles.header
                }
            >

                <View
                    style={
                        styles.headerText
                    }
                >

                    <Text
                        style={
                            styles.title
                        }
                    >
                        Notifications
                    </Text>


                    <Text
                        style={
                            styles.subtitle
                        }
                    >
                        Stay updated with church activities
                    </Text>

                </View>


                {unreadCount > 0 && (

                    <View
                        style={
                            styles.unreadHeaderBadge
                        }
                    >

                        <Text
                            style={
                                styles.unreadHeaderText
                            }
                        >
                            {unreadCount}
                        </Text>

                    </View>

                )}

            </View>


            {/* =========================================
                MARK ALL AS READ
            ========================================== */}

            {unreadCount > 0 && (

                <TouchableOpacity
                    style={
                        styles.markAllButton
                    }
                    onPress={
                        handleMarkAllAsRead
                    }
                    activeOpacity={0.75}
                >

                    <Text
                        style={
                            styles.markAllText
                        }
                    >
                        Mark all as read
                    </Text>

                </TouchableOpacity>

            )}


            {/* =========================================
                EMPTY STATE
            ========================================== */}

            {notifications.length === 0 ? (

                <View
                    style={
                        styles.emptyCard
                    }
                >

                    <View
                        style={
                            styles.emptyIconCircle
                        }
                    >

                        <Text
                            style={
                                styles.emptyIcon
                            }
                        >
                            ✓
                        </Text>

                    </View>


                    <Text
                        style={
                            styles.emptyTitle
                        }
                    >
                        No Notifications
                    </Text>


                    <Text
                        style={
                            styles.emptyText
                        }
                    >
                        You don't have any notifications
                        at the moment.
                    </Text>

                </View>

            ) : (

                <View>

                    {notifications.map(
                        (
                            notification
                        ) => {

                            const typeInfo =
                                getTypeInfo(
                                    notification.type
                                );


                            const sender =
                                notification.sender;


                            const senderName =
                                sender
                                    ? `${sender.firstName || ""} ${
                                        sender.lastName || ""
                                    }`.trim()
                                    : "";


                            return (

                                <TouchableOpacity
                                    key={
                                        notification._id
                                    }

                                    style={[
                                        styles.notificationCard,

                                        !notification.isRead &&
                                            styles.unreadCard,
                                    ]}

                                    onPress={() =>
                                        handleMarkAsRead(
                                            notification
                                        )
                                    }

                                    activeOpacity={0.85}
                                >

                                    {/* =================================
                                        UNREAD DOT
                                    ================================== */}

                                    {!notification.isRead && (

                                        <View
                                            style={
                                                styles.unreadDot
                                            }
                                        />

                                    )}


                                    {/* =================================
                                        ICON
                                    ================================== */}

                                    <View
                                        style={[
                                            styles.notificationIcon,
                                            typeInfo.style,
                                        ]}
                                    >

                                        <Text
                                            style={[
                                                styles.notificationIconText,
                                                typeInfo.iconStyle,
                                            ]}
                                        >
                                            {
                                                typeInfo.icon
                                            }
                                        </Text>

                                    </View>


                                    {/* =================================
                                        CONTENT
                                    ================================== */}

                                    <View
                                        style={
                                            styles.notificationContent
                                        }
                                    >

                                        <View
                                            style={
                                                styles.notificationTopRow
                                            }
                                        >

                                            <Text
                                                style={
                                                    styles.notificationTitle
                                                }
                                                numberOfLines={2}
                                            >
                                                {
                                                    notification.title
                                                }
                                            </Text>


                                            {!notification.isRead && (

                                                <View
                                                    style={
                                                        styles.newBadge
                                                    }
                                                >

                                                    <Text
                                                        style={
                                                            styles.newBadgeText
                                                        }
                                                    >
                                                        NEW
                                                    </Text>

                                                </View>

                                            )}

                                        </View>


                                        <Text
                                            style={
                                                styles.notificationMessage
                                            }
                                        >
                                            {
                                                notification.message
                                            }
                                        </Text>


                                        <View
                                            style={
                                                styles.notificationFooter
                                            }
                                        >

                                            <Text
                                                style={
                                                    styles.typeText
                                                }
                                            >
                                                {
                                                    typeInfo.label
                                                }
                                            </Text>


                                            <Text
                                                style={
                                                    styles.dotSeparator
                                                }
                                            >
                                                •
                                            </Text>


                                            <Text
                                                style={
                                                    styles.dateText
                                                }
                                            >
                                                {
                                                    formatDate(
                                                        notification.createdAt
                                                    )
                                                }
                                            </Text>

                                        </View>


                                        {senderName && (

                                            <Text
                                                style={
                                                    styles.senderText
                                                }
                                            >
                                                From {senderName}
                                            </Text>

                                        )}

                                    </View>


                                    {/* =================================
                                        DELETE
                                    ================================== */}

                                    <TouchableOpacity
                                        style={
                                            styles.deleteButton
                                        }
                                        onPress={() =>
                                            handleDelete(
                                                notification
                                            )
                                        }
                                        activeOpacity={0.7}
                                    >

                                        <Text
                                            style={
                                                styles.deleteText
                                            }
                                        >
                                            ×
                                        </Text>

                                    </TouchableOpacity>

                                </TouchableOpacity>

                            );

                        }
                    )}

                </View>

            )}


            <View
                style={
                    styles.bottomSpacing
                }
            />

        </ScrollView>

    );

}


// =====================================================
// STYLES
// =====================================================

const styles = StyleSheet.create({

    container: {

        flex: 1,

        backgroundColor: "#f4f6fb",

    },


    content: {

        padding: 20,

        paddingBottom: 40,

    },


    header: {

        flexDirection: "row",

        justifyContent: "space-between",

        alignItems: "center",

        marginBottom: 8,

    },


    headerText: {

        flex: 1,

    },


    title: {

        fontSize: 28,

        fontWeight: "800",

        color: "#0f2a5f",

    },


    subtitle: {

        color: "#777",

        fontSize: 14,

        marginTop: 5,

    },


    unreadHeaderBadge: {

        minWidth: 34,

        height: 34,

        paddingHorizontal: 8,

        borderRadius: 17,

        backgroundColor: "#0f2a5f",

        justifyContent: "center",

        alignItems: "center",

        marginLeft: 12,

    },


    unreadHeaderText: {

        color: "#fff",

        fontSize: 13,

        fontWeight: "800",

    },


    markAllButton: {

        alignSelf: "flex-end",

        marginBottom: 15,

        paddingVertical: 6,

        paddingHorizontal: 2,

    },


    markAllText: {

        color: "#0f2a5f",

        fontSize: 13,

        fontWeight: "800",

    },


    notificationCard: {

        backgroundColor: "#fff",

        borderRadius: 16,

        padding: 16,

        marginBottom: 12,

        flexDirection: "row",

        alignItems: "flex-start",

        position: "relative",

    },


    unreadCard: {

        borderWidth: 1,

        borderColor: "#dbe4f5",

    },


    unreadDot: {

        width: 8,

        height: 8,

        borderRadius: 4,

        backgroundColor: "#0f2a5f",

        position: "absolute",

        top: 12,

        left: 12,

    },


    notificationIcon: {

        width: 42,

        height: 42,

        borderRadius: 21,

        justifyContent: "center",

        alignItems: "center",

        marginRight: 12,

    },


    notificationIconText: {

        fontSize: 17,

        fontWeight: "800",

    },


    notificationContent: {

        flex: 1,

        paddingRight: 8,

    },


    notificationTopRow: {

        flexDirection: "row",

        alignItems: "flex-start",

    },


    notificationTitle: {

        flex: 1,

        color: "#222",

        fontSize: 15,

        lineHeight: 20,

        fontWeight: "800",

    },


    newBadge: {

        backgroundColor: "#eef2ff",

        borderRadius: 6,

        paddingHorizontal: 6,

        paddingVertical: 3,

        marginLeft: 6,

    },


    newBadgeText: {

        color: "#0f2a5f",

        fontSize: 8,

        fontWeight: "900",

    },


    notificationMessage: {

        color: "#666",

        fontSize: 13,

        lineHeight: 19,

        marginTop: 6,

    },


    notificationFooter: {

        flexDirection: "row",

        alignItems: "center",

        marginTop: 9,

    },


    typeText: {

        color: "#0f2a5f",

        fontSize: 11,

        fontWeight: "700",

    },


    dotSeparator: {

        color: "#aaa",

        marginHorizontal: 6,

        fontSize: 11,

    },


    dateText: {

        color: "#999",

        fontSize: 11,

    },


    senderText: {

        color: "#999",

        fontSize: 10,

        marginTop: 6,

    },


    deleteButton: {

        width: 28,

        height: 28,

        borderRadius: 14,

        justifyContent: "center",

        alignItems: "center",

        marginLeft: 4,

    },


    deleteText: {

        color: "#aaa",

        fontSize: 23,

        lineHeight: 23,

        fontWeight: "400",

    },


    attendanceType: {

        backgroundColor: "#dcfce7",

    },


    attendanceIcon: {

        color: "#15803d",

    },


    serviceType: {

        backgroundColor: "#eef2ff",

    },


    serviceIcon: {

        color: "#0f2a5f",

    },


    followUpType: {

        backgroundColor: "#fef3c7",

    },


    followUpIcon: {

        color: "#92400e",

    },


    announcementType: {

        backgroundColor: "#fee2e2",

    },


    announcementIcon: {

        color: "#dc2626",

    },


    reminderType: {

        backgroundColor: "#e0f2fe",

    },


    reminderIcon: {

        color: "#0369a1",

    },


    systemType: {

        backgroundColor: "#e5e7eb",

    },


    systemIcon: {

        color: "#4b5563",

    },


    emptyCard: {

        backgroundColor: "#fff",

        borderRadius: 16,

        padding: 35,

        alignItems: "center",

        marginTop: 15,

    },


    emptyIconCircle: {

        width: 60,

        height: 60,

        borderRadius: 30,

        backgroundColor: "#eef2ff",

        justifyContent: "center",

        alignItems: "center",

        marginBottom: 15,

    },


    emptyIcon: {

        color: "#0f2a5f",

        fontSize: 26,

        fontWeight: "800",

    },


    emptyTitle: {

        color: "#222",

        fontSize: 19,

        fontWeight: "800",

        textAlign: "center",

    },


    emptyText: {

        color: "#777",

        fontSize: 14,

        lineHeight: 21,

        textAlign: "center",

        marginTop: 8,

    },


    loadingContainer: {

        flex: 1,

        backgroundColor: "#f4f6fb",

        justifyContent: "center",

        alignItems: "center",

        padding: 30,

    },


    loadingText: {

        marginTop: 12,

        color: "#666",

        fontSize: 15,

    },


    errorContainer: {

        flex: 1,

        backgroundColor: "#f4f6fb",

        justifyContent: "center",

        alignItems: "center",

        padding: 30,

    },


    errorCircle: {

        width: 48,

        height: 48,

        borderRadius: 24,

        backgroundColor: "#fee2e2",

        justifyContent: "center",

        alignItems: "center",

        marginBottom: 15,

    },


    errorIcon: {

        color: "#dc2626",

        fontSize: 25,

        fontWeight: "800",

    },


    errorTitle: {

        color: "#222",

        fontSize: 21,

        fontWeight: "800",

        textAlign: "center",

    },


    errorMessage: {

        color: "#666",

        fontSize: 14,

        lineHeight: 21,

        textAlign: "center",

        marginTop: 9,

    },


    retryButton: {

        backgroundColor: "#0f2a5f",

        borderRadius: 11,

        paddingHorizontal: 30,

        paddingVertical: 13,

        marginTop: 22,

    },


    retryText: {

        color: "#fff",

        fontSize: 14,

        fontWeight: "800",

    },


    bottomSpacing: {

        height: 20,

    },

});