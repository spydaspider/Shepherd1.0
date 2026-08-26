import { useEffect } from "react";

import {
    View,
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


// =====================================================
// AUTHENTICATION GATE
// =====================================================

function AppTabs() {

    const dispatch = useDispatch();

    const router = useRouter();

    const pathname = usePathname();


    const authChecked = useSelector(
        (state) => state.auth.authChecked
    );

    const isAuthenticated = useSelector(
        (state) => state.auth.isAuthenticated
    );


    // =================================================
    // CHECK CURRENT ROUTE
    // =================================================

    const isLoginScreen =
        pathname === "/login";


    // =================================================
    // RESTORE SAVED SESSION
    // =================================================

    useEffect(() => {

        const restoreSavedSession = async () => {

            console.log(
                "CHECKING SAVED AUTH SESSION..."
            );


            try {

                const token =
                    await AsyncStorage.getItem("token");


                const userString =
                    await AsyncStorage.getItem("user");


                console.log(
                    "TOKEN:",
                    token ? "FOUND" : "NOT FOUND"
                );


                // =========================================
                // NO TOKEN
                // =========================================

                if (!token) {

                    console.log(
                        "NO SAVED AUTH TOKEN"
                    );


                    dispatch(
                        sessionExpired()
                    );


                    return;

                }


                // =========================================
                // RESTORE USER
                // =========================================

                let user = null;


                if (userString) {

                    try {

                        user = JSON.parse(
                            userString
                        );

                    } catch (error) {

                        console.log(
                            "USER DATA COULD NOT BE PARSED:",
                            error
                        );

                    }

                }


                // =========================================
                // RESTORE REDUX SESSION
                // =========================================

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

        // ---------------------------------------------
        // Wait until AsyncStorage has been checked
        // ---------------------------------------------

        if (!authChecked) {

            return;

        }


        // ---------------------------------------------
        // USER IS NOT LOGGED IN
        // ---------------------------------------------

        if (!isAuthenticated) {

            // Already on login.
            // Do absolutely nothing.

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


        // ---------------------------------------------
        // USER IS LOGGED IN
        // ---------------------------------------------

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
    // TABS NAVIGATOR
    // =================================================
    //
    // IMPORTANT:
    // The Tabs navigator ALWAYS remains mounted.
    //
    // This prevents the previous:
    //
    // "REPLACE was not handled by any navigator"
    //
    // and:
    //
    // "Unmatched Route"
    //
    // problems.
    //
    // =================================================

    return (

        <Tabs
            screenOptions={{
                headerShown: false,

                tabBarActiveTintColor: "#0f2a5f",

                tabBarInactiveTintColor: "#8a8a8a",

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

                        <Ionicons
                            name="notifications-outline"
                            size={size}
                            color={color}
                        />

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

                    // Hide the tab bar on login.

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

});