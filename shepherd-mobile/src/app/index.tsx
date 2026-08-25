import React, { useCallback, useState } from "react";

import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
} from "react-native";

import {
    useRouter,
    useFocusEffect,
} from "expo-router";

import { useSelector } from "react-redux";

import api from "../api/axios";


// =====================================================
// MEMBER HOME DASHBOARD
// =====================================================

export default function HomeScreen() {

    const router = useRouter();

    const user = useSelector(
        (state) => state.auth.user
    );

    const [dashboard, setDashboard] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // =================================================
    // FETCH DASHBOARD
    // =================================================

    const fetchDashboard = useCallback(async () => {

        try {

            setLoading(true);

            setError("");

            const response = await api.get(
                "/members/me/dashboard"
            );

            if (response.data?.success) {

                setDashboard(response.data);

            } else {

                setError(
                    "Unable to load your dashboard."
                );

            }

        } catch (err) {

            console.log(
                "MEMBER DASHBOARD ERROR:",
                err.response?.data || err.message
            );

            setError(
                err.response?.data?.message ||
                "Unable to load your dashboard."
            );

        } finally {

            setLoading(false);

        }

    }, []);


    // =================================================
    // REFRESH WHEN SCREEN GETS FOCUS
    // =================================================

    useFocusEffect(
        useCallback(() => {

            fetchDashboard();

        }, [fetchDashboard])
    );


    // =================================================
    // FORMAT DATE
    // =================================================

    const formatDate = (value) => {

        if (!value) {

            return "No attendance recorded";

        }

        let dateValue = value;


        // If the backend returns an attendance object,
        // get the actual date from it.

        if (
            typeof value === "object" &&
            value !== null
        ) {

            dateValue =
                value.serviceDate ||
                value.attendanceDate ||
                value.date ||
                value.createdAt ||
                value.updatedAt;

        }


        if (!dateValue) {

            return "No attendance recorded";

        }


        const parsedDate = new Date(dateValue);


        if (Number.isNaN(parsedDate.getTime())) {

            return "Date unavailable";

        }


        return parsedDate.toLocaleDateString(
            "en-GB",
            {
                day: "numeric",
                month: "long",
                year: "numeric",
            }
        );

    };


    // =================================================
    // LOADING
    // =================================================

    if (loading) {

        return (
            <View style={styles.loadingContainer}>

                <ActivityIndicator
                    size="large"
                    color="#0f2a5f"
                />

                <Text style={styles.loadingText}>
                    Loading your dashboard...
                </Text>

            </View>
        );

    }


    // =================================================
    // ERROR
    // =================================================

    if (error) {

        return (
            <View style={styles.errorContainer}>

                <View style={styles.errorCircle}>

                    <Text style={styles.errorIcon}>
                        !
                    </Text>

                </View>

                <Text style={styles.errorTitle}>
                    Something went wrong
                </Text>

                <Text style={styles.errorMessage}>
                    {error}
                </Text>

                <TouchableOpacity
                    style={styles.retryButton}
                    onPress={fetchDashboard}
                    activeOpacity={0.8}
                >

                    <Text style={styles.retryText}>
                        Try Again
                    </Text>

                </TouchableOpacity>

            </View>
        );

    }


    // =================================================
    // DASHBOARD DATA
    // =================================================

    const member = dashboard?.member;

    const activeService =
        dashboard?.activeService;

    const today =
        dashboard?.today;

    const attendance =
        dashboard?.attendance;


    // =================================================
    // MEMBER NAME
    // =================================================

    const firstName =
        member?.firstName ||
        user?.firstName ||
        "Member";

    const lastName =
        member?.lastName ||
        user?.lastName ||
        "";

    const fullName =
        `${firstName} ${lastName}`.trim();


    // =================================================
    // ATTENDANCE DATA
    // =================================================

    const attended =
        Number(attendance?.thisMonth || 0);

    const services =
        Number(
            attendance?.thisMonthServices || 0
        );

    const missed =
        Math.max(
            services - attended,
            0
        );

    const attendanceRate =
        Number(
            attendance?.thisMonthRate || 0
        );

    const safeAttendanceRate =
        Math.min(
            Math.max(
                attendanceRate,
                0
            ),
            100
        );


    // =================================================
    // LAST ATTENDANCE
    // =================================================

    const lastAttendance =
        attendance?.lastAttendance;


    // =================================================
    // RENDER
    // =================================================

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
        >

            {/* HEADER */}

            <View style={styles.header}>

                <View style={styles.headerText}>

                    <Text style={styles.greeting}>
                        Welcome back
                    </Text>

                    <Text style={styles.memberName}>
                        {fullName}
                    </Text>

                </View>

                <View style={styles.profileCircle}>

                    <Text style={styles.profileLetter}>
                        {firstName
                            .charAt(0)
                            .toUpperCase()}
                    </Text>

                </View>

            </View>


            {/* TODAY'S SERVICE */}

            <View style={styles.serviceCard}>

                <View style={styles.serviceTopRow}>

                    <View style={styles.serviceInformation}>

                        <Text style={styles.serviceLabel}>
                            TODAY'S SERVICE
                        </Text>

                        <Text style={styles.serviceName}>
                            {activeService?.name ||
                                "No Active Service"}
                        </Text>

                    </View>

                    <View style={styles.serviceIcon}>

                        <Text style={styles.serviceIconText}>
                            Church
                        </Text>

                    </View>

                </View>


                {activeService ? (

                    <View style={styles.timeContainer}>

                        <Text style={styles.clockIcon}>
                            Time
                        </Text>

                        <Text style={styles.serviceTime}>
                            {activeService.startTime}
                            {" - "}
                            {activeService.endTime}
                        </Text>

                    </View>

                ) : (

                    <Text style={styles.noServiceText}>
                        There is currently no active service.
                    </Text>

                )}


                {/* ATTENDANCE STATUS */}

                {today?.attended ? (

                    <View style={styles.attendanceMarked}>

                        <View style={styles.checkCircle}>

                            <Text style={styles.checkText}>
                                ✓
                            </Text>

                        </View>

                        <View style={styles.markedInformation}>

                            <Text style={styles.markedTitle}>
                                Attendance Marked
                            </Text>

                            <Text style={styles.markedSubtitle}>
                                You are recorded for today's service
                            </Text>

                        </View>

                    </View>

                ) : activeService?.attendanceOpen ? (

                    <TouchableOpacity
                        style={styles.markButton}
                        onPress={() => {
                            router.push(
                                "/mark-attendance"
                            );
                        }}
                        activeOpacity={0.85}
                    >

                        <Text style={styles.markButtonText}>
                            Mark Attendance
                        </Text>

                        <Text style={styles.markButtonArrow}>
                            →
                        </Text>

                    </TouchableOpacity>

                ) : (

                    <View style={styles.closedContainer}>

                        <Text style={styles.closedText}>
                            Attendance is currently closed
                        </Text>

                    </View>

                )}

            </View>


            {/* ATTENDANCE OVERVIEW */}

            <View style={styles.sectionHeader}>

                <View>

                    <Text style={styles.sectionTitle}>
                        Attendance Overview
                    </Text>

                    <Text style={styles.sectionSubtitle}>
                        Your attendance this month
                    </Text>

                </View>

                <TouchableOpacity
                    onPress={() => {
                        router.push("/attendance");
                    }}
                    activeOpacity={0.7}
                >

                    <Text style={styles.viewHistory}>
                        History
                    </Text>

                </TouchableOpacity>

            </View>


            {/* ATTENDANCE RATE */}

            <View style={styles.overviewCard}>

                <View style={styles.rateSection}>

                    <View style={styles.rateCircle}>

                        <Text style={styles.rateNumber}>
                            {attendanceRate}%
                        </Text>

                        <Text style={styles.rateSmallText}>
                            rate
                        </Text>

                    </View>

                    <View style={styles.rateInfo}>

                        <Text style={styles.rateTitle}>
                            Monthly Attendance
                        </Text>

                        <Text style={styles.rateDescription}>
                            You attended{" "}

                            <Text style={styles.boldText}>
                                {attended}
                            </Text>

                            {" "}out of{" "}

                            <Text style={styles.boldText}>
                                {services}
                            </Text>

                            {" "}services this month.
                        </Text>

                    </View>

                </View>


                <View style={styles.progressBackground}>

                    <View
                        style={[
                            styles.progressFill,
                            {
                                width:
                                    `${safeAttendanceRate}%`,
                            },
                        ]}
                    />

                </View>

            </View>


            {/* STATISTICS */}

            <View style={styles.statsRow}>

                <View style={styles.statCard}>

                    <View
                        style={[
                            styles.statIcon,
                            styles.presentIcon,
                        ]}
                    >

                        <Text style={styles.presentSymbol}>
                            ✓
                        </Text>

                    </View>

                    <Text style={styles.statNumber}>
                        {attended}
                    </Text>

                    <Text style={styles.statLabel}>
                        Attended
                    </Text>

                </View>


                <View style={styles.statCard}>

                    <View
                        style={[
                            styles.statIcon,
                            styles.missedIcon,
                        ]}
                    >

                        <Text style={styles.missedSymbol}>
                            ×
                        </Text>

                    </View>

                    <Text style={styles.statNumber}>
                        {missed}
                    </Text>

                    <Text style={styles.statLabel}>
                        Missed
                    </Text>

                </View>


                <View style={styles.statCard}>

                    <View
                        style={[
                            styles.statIcon,
                            styles.serviceCountIcon,
                        ]}
                    >

                        <Text style={styles.serviceCountSymbol}>
                            #
                        </Text>

                    </View>

                    <Text style={styles.statNumber}>
                        {services}
                    </Text>

                    <Text style={styles.statLabel}>
                        Services
                    </Text>

                </View>

            </View>


            {/* LAST ATTENDANCE */}

            <View style={styles.lastAttendanceCard}>

                <View style={styles.lastIcon}>

                    <Text style={styles.lastIconText}>
                        ✓
                    </Text>

                </View>

                <View style={styles.lastInfo}>

                    <Text style={styles.lastTitle}>
                        Last Attendance
                    </Text>

                    <Text style={styles.lastDate}>
                        {formatDate(lastAttendance)}
                    </Text>

                </View>

            </View>


            {/* QUICK ACTIONS */}

            <Text style={styles.quickTitle}>
                Quick Actions
            </Text>


            <View style={styles.quickActions}>

                <TouchableOpacity
                    style={styles.quickCard}
                    onPress={() => {
                        router.push("/attendance");
                    }}
                    activeOpacity={0.8}
                >

                    <View style={styles.quickIcon}>

                        <Text style={styles.quickIconText}>
                            ✓
                        </Text>

                    </View>

                    <Text style={styles.quickCardTitle}>
                        Attendance
                    </Text>

                    <Text style={styles.quickCardText}>
                        View your history
                    </Text>

                </TouchableOpacity>


                <TouchableOpacity
                    style={styles.quickCard}
                    onPress={() => {
                        router.push("/profile");
                    }}
                    activeOpacity={0.8}
                >

                    <View style={styles.quickIcon}>

                        <Text style={styles.quickIconText}>
                            P
                        </Text>

                    </View>

                    <Text style={styles.quickCardTitle}>
                        My Profile
                    </Text>

                    <Text style={styles.quickCardText}>
                        View your profile
                    </Text>

                </TouchableOpacity>

            </View>


            <View style={styles.bottomSpacing} />

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


    // HEADER

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 25,
    },

    headerText: {
        flex: 1,
    },

    greeting: {
        color: "#777",
        fontSize: 14,
        marginBottom: 3,
    },

    memberName: {
        color: "#0f2a5f",
        fontSize: 28,
        fontWeight: "800",
    },

    profileCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#0f2a5f",
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 12,
    },

    profileLetter: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "800",
    },


    // SERVICE CARD

    serviceCard: {
        backgroundColor: "#0f2a5f",
        borderRadius: 20,
        padding: 22,
        marginBottom: 28,
    },

    serviceTopRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },

    serviceInformation: {
        flex: 1,
        paddingRight: 10,
    },

    serviceLabel: {
        color: "#aebedb",
        fontSize: 11,
        fontWeight: "800",
        letterSpacing: 1.2,
    },

    serviceName: {
        color: "#fff",
        fontSize: 23,
        fontWeight: "800",
        marginTop: 7,
    },

    serviceIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "rgba(255, 255, 255, 0.12)",
        justifyContent: "center",
        alignItems: "center",
    },

    serviceIconText: {
        color: "#fff",
        fontSize: 10,
        fontWeight: "700",
    },

    timeContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 13,
    },

    clockIcon: {
        color: "#dbe4f5",
        fontSize: 12,
        marginRight: 8,
        fontWeight: "700",
    },

    serviceTime: {
        color: "#dbe4f5",
        fontSize: 14,
    },

    noServiceText: {
        color: "#cbd5e1",
        fontSize: 14,
        marginTop: 13,
    },


    // MARK ATTENDANCE

    markButton: {
        backgroundColor: "#fff",
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 16,
        marginTop: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    markButtonText: {
        color: "#0f2a5f",
        fontSize: 15,
        fontWeight: "800",
    },

    markButtonArrow: {
        color: "#0f2a5f",
        fontSize: 21,
        fontWeight: "700",
    },


    // ATTENDANCE MARKED

    attendanceMarked: {
        backgroundColor: "#dcfce7",
        borderRadius: 12,
        padding: 13,
        marginTop: 20,
        flexDirection: "row",
        alignItems: "center",
    },

    checkCircle: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: "#22c55e",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
    },

    checkText: {
        color: "#fff",
        fontSize: 17,
        fontWeight: "800",
    },

    markedInformation: {
        flex: 1,
    },

    markedTitle: {
        color: "#166534",
        fontSize: 14,
        fontWeight: "800",
    },

    markedSubtitle: {
        color: "#15803d",
        fontSize: 11,
        marginTop: 2,
    },


    // CLOSED

    closedContainer: {
        backgroundColor: "#e5e7eb",
        borderRadius: 12,
        paddingVertical: 14,
        marginTop: 20,
        alignItems: "center",
    },

    closedText: {
        color: "#4b5563",
        fontSize: 13,
        fontWeight: "700",
    },


    // SECTION HEADER

    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },

    sectionTitle: {
        color: "#222",
        fontSize: 20,
        fontWeight: "800",
    },

    sectionSubtitle: {
        color: "#888",
        fontSize: 12,
        marginTop: 3,
    },

    viewHistory: {
        color: "#0f2a5f",
        fontSize: 13,
        fontWeight: "800",
    },


    // OVERVIEW CARD

    overviewCard: {
        backgroundColor: "#fff",
        borderRadius: 18,
        padding: 20,
        marginBottom: 12,
    },

    rateSection: {
        flexDirection: "row",
        alignItems: "center",
    },

    rateCircle: {
        width: 78,
        height: 78,
        borderRadius: 39,
        backgroundColor: "#eef2ff",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 15,
    },

    rateNumber: {
        color: "#0f2a5f",
        fontSize: 20,
        fontWeight: "800",
    },

    rateSmallText: {
        color: "#777",
        fontSize: 10,
        marginTop: 1,
    },

    rateInfo: {
        flex: 1,
    },

    rateTitle: {
        color: "#222",
        fontSize: 16,
        fontWeight: "800",
    },

    rateDescription: {
        color: "#777",
        fontSize: 13,
        lineHeight: 19,
        marginTop: 5,
    },

    boldText: {
        color: "#222",
        fontWeight: "800",
    },

    progressBackground: {
        height: 8,
        backgroundColor: "#e5e7eb",
        borderRadius: 4,
        overflow: "hidden",
        marginTop: 18,
    },

    progressFill: {
        height: "100%",
        backgroundColor: "#0f2a5f",
        borderRadius: 4,
    },


    // STATISTICS

    statsRow: {
        flexDirection: "row",
        marginBottom: 15,
    },

    statCard: {
        flex: 1,
        backgroundColor: "#fff",
        borderRadius: 15,
        padding: 15,
        marginHorizontal: 4,
    },

    statIcon: {
        width: 34,
        height: 34,
        borderRadius: 17,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 9,
    },

    presentIcon: {
        backgroundColor: "#dcfce7",
    },

    missedIcon: {
        backgroundColor: "#fee2e2",
    },

    serviceCountIcon: {
        backgroundColor: "#eef2ff",
    },

    presentSymbol: {
        color: "#15803d",
        fontSize: 17,
        fontWeight: "800",
    },

    missedSymbol: {
        color: "#dc2626",
        fontSize: 20,
        fontWeight: "800",
    },

    serviceCountSymbol: {
        color: "#0f2a5f",
        fontSize: 17,
        fontWeight: "800",
    },

    statNumber: {
        color: "#0f2a5f",
        fontSize: 25,
        fontWeight: "800",
    },

    statLabel: {
        color: "#777",
        fontSize: 12,
        marginTop: 2,
    },


    // LAST ATTENDANCE

    lastAttendanceCard: {
        backgroundColor: "#fff",
        borderRadius: 15,
        padding: 17,
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 24,
    },

    lastIcon: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: "#eef2ff",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },

    lastIconText: {
        color: "#0f2a5f",
        fontSize: 18,
        fontWeight: "800",
    },

    lastInfo: {
        flex: 1,
    },

    lastTitle: {
        color: "#222",
        fontSize: 14,
        fontWeight: "800",
    },

    lastDate: {
        color: "#777",
        fontSize: 13,
        marginTop: 3,
    },


    // QUICK ACTIONS

    quickTitle: {
        color: "#222",
        fontSize: 18,
        fontWeight: "800",
        marginBottom: 12,
    },

    quickActions: {
        flexDirection: "row",
    },

    quickCard: {
        flex: 1,
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 17,
        marginHorizontal: 5,
    },

    quickIcon: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: "#eef2ff",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10,
    },

    quickIconText: {
        color: "#0f2a5f",
        fontSize: 17,
        fontWeight: "800",
    },

    quickCardTitle: {
        color: "#222",
        fontSize: 14,
        fontWeight: "800",
    },

    quickCardText: {
        color: "#888",
        fontSize: 11,
        marginTop: 3,
    },


    // LOADING

    loadingContainer: {
        flex: 1,
        backgroundColor: "#f4f6fb",
        justifyContent: "center",
        alignItems: "center",
    },

    loadingText: {
        color: "#666",
        fontSize: 14,
        marginTop: 12,
    },


    // ERROR

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


    // BOTTOM

    bottomSpacing: {
        height: 25,
    },

});