import { Tabs } from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import { Provider } from "react-redux";

import store from "../store/store";


export default function RootLayout() {

    return (

        <Provider store={store}>

            <Tabs
                screenOptions={{
                    headerShown: false,

                    tabBarActiveTintColor: "#0f2a5f",

                    tabBarInactiveTintColor: "#888",

                    tabBarLabelStyle: {
                        fontSize: 12,
                        fontWeight: "600",
                    },

                    tabBarStyle: {
                        height: 65,
                        paddingBottom: 8,
                        paddingTop: 5,
                    },
                }}
            >

                {/* =====================================================
                    Home
                ===================================================== */}

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


                {/* =====================================================
                    Attendance
                ===================================================== */}

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


                {/* =====================================================
                    Notifications
                ===================================================== */}

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


                {/* =====================================================
                    Profile
                ===================================================== */}

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


                {/* =====================================================
                    Hidden Explore Screen
                ===================================================== */}

                <Tabs.Screen
                    name="explore"
                    options={{
                        href: null,
                    }}
                />

            </Tabs>

        </Provider>

    );

}