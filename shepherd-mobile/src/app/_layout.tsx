import { Provider } from "react-redux";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import store from "../store/store";

export default function RootLayout() {
    return (
        <Provider store={store}>
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

                {/* ==============================
                    HOME
                ============================== */}

                <Tabs.Screen
                    name="index"
                    options={{
                        title: "Home",

                        tabBarIcon: ({ color, size }) => (
                            <Ionicons
                                name="home-outline"
                                size={size}
                                color={color}
                            />
                        ),
                    }}
                />


                {/* ==============================
                    ATTENDANCE
                ============================== */}

                <Tabs.Screen
                    name="attendance"
                    options={{
                        title: "Attendance",

                        tabBarIcon: ({ color, size }) => (
                            <Ionicons
                                name="calendar-outline"
                                size={size}
                                color={color}
                            />
                        ),
                    }}
                />


                {/* ==============================
                    NOTIFICATIONS
                ============================== */}

                <Tabs.Screen
                    name="notifications"
                    options={{
                        title: "Notifications",

                        tabBarIcon: ({ color, size }) => (
                            <Ionicons
                                name="notifications-outline"
                                size={size}
                                color={color}
                            />
                        ),
                    }}
                />


                {/* ==============================
                    PROFILE
                ============================== */}

                <Tabs.Screen
                    name="profile"
                    options={{
                        title: "Profile",

                        tabBarIcon: ({ color, size }) => (
                            <Ionicons
                                name="person-outline"
                                size={size}
                                color={color}
                            />
                        ),
                    }}
                />


                {/* ==============================
                    HIDDEN ROUTES
                ============================== */}

                <Tabs.Screen
                    name="login"
                    options={{
                        href: null,
                    }}
                />

                <Tabs.Screen
                    name="explore"
                    options={{
                        href: null,
                    }}
                />

                <Tabs.Screen
                    name="mark-attendance"
                    options={{
                        href: null,
                    }}
                />

            </Tabs>
        </Provider>
    );
}