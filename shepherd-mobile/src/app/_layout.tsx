import { useEffect } from "react";

import {
    View,
    Text,
    ActivityIndicator,
    StyleSheet,
    Pressable,
} from "react-native";

import {
    Provider,
    useDispatch,
    useSelector,
} from "react-redux";

import {
    Stack,
    useRouter,
    usePathname,
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


function CustomTabBar() {
    const router = useRouter();
    const pathname = usePathname();

    const unreadCount = useSelector(
        (state) => state.notifications.unreadCount
    );

    const tabs = [
        {
            route: "/",
            label: "Home",
            icon: "home-outline",
            activeIcon: "home",
        },
        {
            route: "/attendance",
            label: "Attendance",
            icon: "calendar-outline",
            activeIcon: "calendar",
        },
        {
            route: "/notifications",
            label: "Notifications",
            icon: "notifications-outline",
            activeIcon: "notifications",
        },
        {
            route: "/profile",
            label: "Profile",
            icon: "person-outline",
            activeIcon: "person",
        },
    ];

    return (
        <View style={styles.tabBar}>
            {tabs.map((tab) => {
                const isActive = pathname === tab.route;

                return (
                    <Pressable
                        key={tab.route}
                        style={styles.tabButton}
                        onPress={() => {
                            if (!isActive) {
                                router.replace(tab.route);
                            }
                        }}
                    >
                        <View style={styles.tabIconContainer}>
                            <Ionicons
                                name={
                                    isActive
                                        ? tab.activeIcon
                                        : tab.icon
                                }
                                size={24}
                                color={
                                    isActive
                                        ? "#0f2a5f"
                                        : "#8a8a8a"
                                }
                            />

                            {tab.route === "/notifications" &&
                                unreadCount > 0 && (
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
                                            {unreadCount > 99
                                                ? "99+"
                                                : unreadCount}
                                        </Text>
                                    </View>
                                )}
                        </View>

                        <Text
                            style={[
                                styles.tabLabel,
                                isActive &&
                                    styles.activeTabLabel,
                            ]}
                        >
                            {tab.label}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    );
}


function AppLayout() {
    const dispatch = useDispatch();
    const router = useRouter();
    const pathname = usePathname();

    const authChecked = useSelector(
        (state) => state.auth.authChecked
    );

    const isAuthenticated = useSelector(
        (state) => state.auth.isAuthenticated
    );


    // =====================================================
    // RESTORE SAVED LOGIN SESSION
    // =====================================================

    useEffect(() => {
        let mounted = true;

        const restoreSavedSession = async () => {
            console.log("CHECKING SAVED AUTH SESSION...");

            try {
                const token =
                    await AsyncStorage.getItem("token");

                const userString =
                    await AsyncStorage.getItem("user");

                console.log(
                    "TOKEN:",
                    token ? "FOUND" : "NOT FOUND"
                );

                if (!token) {
                    console.log("NO SAVED AUTH TOKEN");

                    if (mounted) {
                        dispatch(sessionExpired());
                    }

                    return;
                }

                let user = null;

                if (userString) {
                    try {
                        user = JSON.parse(userString);
                    } catch (error) {
                        console.log(
                            "USER DATA COULD NOT BE PARSED:",
                            error
                        );
                    }
                }

                if (mounted) {
                    dispatch(
                        restoreSession({
                            token,
                            user,
                        })
                    );
                }

                console.log("AUTH SESSION RESTORED");

            } catch (error) {
                console.log(
                    "SESSION RESTORATION ERROR:",
                    error?.message || error
                );

                try {
                    await AsyncStorage.multiRemove([
                        "token",
                        "user",
                    ]);
                } catch (storageError) {
                    console.log(
                        "STORAGE CLEAR ERROR:",
                        storageError
                    );
                }

                if (mounted) {
                    dispatch(sessionExpired());
                }
            }
        };

        restoreSavedSession();

        return () => {
            mounted = false;
        };
    }, [dispatch]);


    // =====================================================
    // AUTHENTICATION NAVIGATION
    // =====================================================

    useEffect(() => {
        if (!authChecked) {
            return;
        }

        // User is NOT logged in
        if (!isAuthenticated) {
            if (pathname !== "/login") {
                console.log("USER NOT AUTHENTICATED");
                console.log("REDIRECTING TO LOGIN...");

                router.replace("/login");
            }

            return;
        }

        // User is already logged in
        if (
            isAuthenticated &&
            pathname === "/login"
        ) {
            console.log("USER IS ALREADY AUTHENTICATED");
            console.log("REDIRECTING TO HOME...");

            router.replace("/");
        }

    }, [
        authChecked,
        isAuthenticated,
        pathname,
        router,
    ]);


    // =====================================================
    // NOTIFICATION COUNT
    // =====================================================

    useEffect(() => {
        let intervalId = null;

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
                        error?.message ||
                        error
                    );
                }
            };


        if (
            authChecked &&
            isAuthenticated
        ) {
            fetchUnreadNotificationCount();

            intervalId = setInterval(
                fetchUnreadNotificationCount,
                30000
            );

        } else {
            dispatch(
                setUnreadCount(0)
            );
        }


        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };

    }, [
        authChecked,
        isAuthenticated,
        dispatch,
    ]);


    // =====================================================
    // LOADING SCREEN
    // =====================================================

    if (!authChecked) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator
                    size="large"
                    color="#0f2a5f"
                />

                <Text style={styles.loadingText}>
                    Loading...
                </Text>
            </View>
        );
    }


    // =====================================================
    // SHOW BOTTOM TAB BAR ONLY ON MAIN SCREENS
    // =====================================================

    const showTabBar =
        isAuthenticated &&
        (
            pathname === "/" ||
            pathname === "/attendance" ||
            pathname === "/notifications" ||
            pathname === "/profile"
        );


    return (
        <View style={styles.appContainer}>
            <View style={styles.stackContainer}>
                <Stack
                    screenOptions={{
                        headerShown: false,
                    }}
                />
            </View>

            {showTabBar && (
                <CustomTabBar />
            )}
        </View>
    );
}


// =========================================================
// ROOT LAYOUT
// =========================================================

export default function RootLayout() {
    return (
        <Provider store={store}>
            <AppLayout />
        </Provider>
    );
}


// =========================================================
// STYLES
// =========================================================

const styles = StyleSheet.create({

    appContainer: {
        flex: 1,
        backgroundColor: "#f4f6fb",
    },

    stackContainer: {
        flex: 1,
    },

    loadingContainer: {
        flex: 1,
        backgroundColor: "#f4f6fb",
        justifyContent: "center",
        alignItems: "center",
    },

    loadingText: {
        marginTop: 12,
        fontSize: 15,
        color: "#555555",
    },

    // =====================================================
    // BOTTOM TAB BAR
    // =====================================================

    tabBar: {
        height: 70,
        backgroundColor: "#ffffff",
        borderTopWidth: 1,
        borderTopColor: "#e5e5e5",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        paddingTop: 5,
        paddingBottom: 5,
    },

    tabButton: {
        flex: 1,
        height: 65,
        justifyContent: "center",
        alignItems: "center",
    },

    tabIconContainer: {
        position: "relative",
        justifyContent: "center",
        alignItems: "center",
    },

    tabLabel: {
        marginTop: 3,
        fontSize: 11,
        fontWeight: "500",
        color: "#8a8a8a",
    },

    activeTabLabel: {
        color: "#0f2a5f",
        fontWeight: "700",
    },

    // =====================================================
    // NOTIFICATION BADGE
    // =====================================================

    notificationBadge: {
        position: "absolute",
        right: -10,
        top: -7,
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