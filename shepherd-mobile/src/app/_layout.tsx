import { useEffect } from "react";

import {
    View,
    Text,
    ActivityIndicator,
    StyleSheet,
} from "react-native";

import {
    Provider,
    useDispatch,
    useSelector,
} from "react-redux";

import {
    Tabs,
    usePathname,
    useRouter,
} from "expo-router";

import {
    Ionicons,
} from "@expo/vector-icons";

import AsyncStorage from "@react-native-async-storage/async-storage";

import store from "../store/store";

import {
    restoreSession,
    sessionExpired,
} from "../store/authSlice";

import {
    setUnreadCount,
} from "../store/notificationSlice";

import api from "../api/axios";


// =====================================================
// AUTHENTICATION GATE
// =====================================================

function AppTabs() {

    const dispatch = useDispatch();

    const router = useRouter();

    const pathname = usePathname();


    // =================================================
    // AUTH STATE
    // =================================================

    const authChecked = useSelector(
        (state) => state.auth.authChecked
    );

    const isAuthenticated = useSelector(
        (state) => state.auth.isAuthenticated
    );


    // =================================================
    // NOTIFICATION STATE FROM REDUX
    // =================================================

    const unreadCount = useSelector(
        (state) => state.notifications.unreadCount
    );


    // =================================================
    // CHECK CURRENT ROUTE
    // =================================================

    const isLoginScreen =
        pathname === "/login";


    // =================================================
    // FETCH UNREAD NOTIFICATION COUNT
    // =================================================

    useEffect(() => {

        const fetchUnreadNotificationCount =
            async () => {

                try {

                    if (!isAuthenticated) {

                        dispatch(
                            setUnreadCount(0)
                        );

                        return;

                    }


                    const response =
                        await api.get(
                            "/notifications"
                        );


                    const count =
                        response?.data?.unreadCount;


                    dispatch(
                        setUnreadCount(
                            Number(count) || 0
                        )
                    );


                } catch (error) {

                    console.log(
                        "FETCH NOTIFICATION COUNT ERROR:",
                        error?.response?.data ||
                        error?.message
                    );

                }

            };


        if (
            authChecked &&
            isAuthenticated
        ) {

            fetchUnreadNotificationCount();

        } else {

            dispatch(
                setUnreadCount(0)
            );

        }

    }, [
        authChecked,
        isAuthenticated,
        dispatch,
    ]);


    // =================================================
    // RESTORE SAVED SESSION
    // =================================================

    useEffect(() => {

        const restoreSavedSession =
            async () => {

                console.log(
                    "CHECKING SAVED AUTH SESSION..."
                );


                try {

                    const token =
                        await AsyncStorage.getItem(
                            "token"
                        );


                    const userString =
                        await AsyncStorage.getItem(
                            "user"
                        );


                    console.log(
                        "TOKEN:",
                        token
                            ? "FOUND"
                            : "NOT FOUND"
                    );


                    // =====================================
                    // NO TOKEN
                    // =====================================

                    if (!token) {

                        console.log(
                            "NO SAVED AUTH TOKEN"
                        );


                        dispatch(
                            sessionExpired()
                        );


                        return;

                    }


                    // =====================================
                    // RESTORE USER
                    // =====================================

                    let user = null;


                    if (userString) {

                        try {

                            user =
                                JSON.parse(
                                    userString
                                );

                        } catch (error) {

                            console.log(
                                "USER DATA COULD NOT BE PARSED:",
                                error
                            );

                        }

                    }


                    // =====================================
                    // RESTORE REDUX SESSION
                    // =====================================

                    dispatch(
                        restoreSession({
                            token,
                            user,
                        })
                    );


                    console.log(
                        "AUTH SESSION RESTORED"
                    );


                } catch (error) {

                    console.log(
                        "SESSION RESTORATION ERROR:",
                        error
                    );


                    dispatch(
                        sessionExpired()
                    );

                }

            };


        restoreSavedSession();

    }, [dispatch]);


    // =================================================
    // HANDLE AUTHENTICATION ROUTING
    // =================================================

    useEffect(() => {

        if (!authChecked) {

            return;

        }


        // =============================================
        // USER NOT AUTHENTICATED
        // =============================================

        if (!isAuthenticated) {

            if (isLoginScreen) {

                return;

            }


            console.log(
                "USER NOT AUTHENTICATED"
            );


            console.log(
                "NAVIGATING TO LOGIN..."
            );


            router.replace("/login");


            return;

        }


        // =============================================
        // USER AUTHENTICATED
        // =============================================

        if (
            isAuthenticated &&
            isLoginScreen
        ) {

            console.log(
                "USER ALREADY AUTHENTICATED"
            );


            console.log(
                "NAVIGATING TO HOME..."
            );


            router.replace("/");

        }

    }, [
        authChecked,
        isAuthenticated,
        isLoginScreen,
        router,
    ]);


    // =================================================
    // WAIT FOR AUTH CHECK
    // =================================================

    if (!authChecked) {

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

            </View>

        );

    }


    // =================================================
    // TABS
    // =================================================

    return (

        <Tabs

            screenOptions={{

                headerShown: false,

                tabBarActiveTintColor:
                    "#0f2a5f",

                tabBarInactiveTintColor:
                    "#8a8a8a",

                tabBarStyle: {

                    height: 65,

                    paddingBottom: 8,

                    paddingTop: 6,

                },

                tabBarLabelStyle: {

                    fontSize: 12,

                    fontWeight: "600",

                },

            }}

        >

            {/* =========================================
                HOME
            ========================================== */}

            <Tabs.Screen
                name="index"
                options={{

                    title: "Home",

                    tabBarIcon: ({
                        color,
                        size,
                    }) => (

                        <Ionicons
                            name="home-outline"
                            size={size}
                            color={color}
                        />

                    ),

                }}
            />


            {/* =========================================
                ATTENDANCE
            ========================================== */}

            <Tabs.Screen
                name="attendance"
                options={{

                    title: "Attendance",

                    tabBarIcon: ({
                        color,
                        size,
                    }) => (

                        <Ionicons
                            name="calendar-outline"
                            size={size}
                            color={color}
                        />

                    ),

                }}
            />


            {/* =========================================
                NOTIFICATIONS
            ========================================== */}

            <Tabs.Screen
                name="notifications"
                options={{

                    title: "Notifications",

                    tabBarIcon: ({
                        color,
                        size,
                    }) => (

                        <View
                            style={
                                styles.notificationIconContainer
                            }
                        >

                            <Ionicons
                                name="notifications-outline"
                                size={size}
                                color={color}
                            />


                            {/* =================================
                                REDUX BADGE
                            ================================= */}

                            {unreadCount > 0 && (

                                <View
                                    style={
                                        styles.notificationBadge
                                    }
                                >

                                    <Text
                                        style={
                                            styles.notificationBadgeText
                                        }
                                    >

                                        {
                                            unreadCount > 99
                                                ? "99+"
                                                : unreadCount
                                        }

                                    </Text>

                                </View>

                            )}

                        </View>

                    ),

                }}
            />


            {/* =========================================
                PROFILE
            ========================================== */}

            <Tabs.Screen
                name="profile"
                options={{

                    title: "Profile",

                    tabBarIcon: ({
                        color,
                        size,
                    }) => (

                        <Ionicons
                            name="person-outline"
                            size={size}
                            color={color}
                        />

                    ),

                }}
            />


            {/* =========================================
                LOGIN
            ========================================== */}

            <Tabs.Screen
                name="login"
                options={{

                    href: null,

                    tabBarStyle: {
                        display: "none",
                    },

                }}
            />


            {/* =========================================
                EXPLORE
            ========================================== */}

            <Tabs.Screen
                name="explore"
                options={{
                    href: null,
                }}
            />


            {/* =========================================
                MARK ATTENDANCE
            ========================================== */}

            <Tabs.Screen
                name="mark-attendance"
                options={{
                    href: null,
                }}
            />

        </Tabs>

    );

}


// =====================================================
// ROOT LAYOUT
// =====================================================

export default function RootLayout() {

    return (

        <Provider store={store}>

            <AppTabs />

        </Provider>

    );

}


// =====================================================
// STYLES
// =====================================================

const styles = StyleSheet.create({

    loadingContainer: {

        flex: 1,

        backgroundColor: "#f4f6fb",

        justifyContent: "center",

        alignItems: "center",

    },


    notificationIconContainer: {

        position: "relative",

        justifyContent: "center",

        alignItems: "center",

    },


    notificationBadge: {

        position: "absolute",

        right: -10,

        top: -6,

        minWidth: 18,

        height: 18,

        paddingHorizontal: 4,

        borderRadius: 9,

        backgroundColor: "#e53935",

        justifyContent: "center",

        alignItems: "center",

        borderWidth: 1,

        borderColor: "#ffffff",

    },


    notificationBadgeText: {

        color: "#ffffff",

        fontSize: 10,

        fontWeight: "700",

        textAlign: "center",

    },

});