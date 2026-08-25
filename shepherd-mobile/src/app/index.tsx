import {
    useCallback,
    useEffect,
    useState,
} from "react";

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

import {
    useSelector,
} from "react-redux";

import api from "../api/axios";


// =====================================================
// HOME SCREEN
// =====================================================

export default function HomeScreen() {

    const router = useRouter();


    // =====================================================
    // Redux User
    // =====================================================

    const user = useSelector(
        state => state.auth.user
    );


    // =====================================================
    // Dashboard State
    // =====================================================

    const [dashboard, setDashboard] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // =====================================================
    // Fetch Dashboard
    // =====================================================

    const fetchDashboard = useCallback(
        async () => {

            try {

                setLoading(true);

                setError("");

                // Clear previous user's dashboard data
                setDashboard(null);


                const response = await api.get(
                    "/members/me/dashboard"
                );


                if (
                    response.data?.success
                ) {

                    setDashboard(
                        response.data
                    );

                }
                else {

                    setError(
                        "Unable to load your dashboard."
                    );

                }

            }
            catch (error) {

                console.log(
                    "MOBILE DASHBOARD ERROR:",
                    error.response?.data ||
                    error.message
                );


                setError(
                    error.response?.data?.message ||
                    "Unable to load your dashboard."
                );

            }
            finally {

                setLoading(false);

            }

        },
        []
    );


    // =====================================================
    // Refresh Dashboard When Screen Gets Focus
    // =====================================================

    useFocusEffect(
        useCallback(() => {

            fetchDashboard();

        }, [fetchDashboard])
    );


    // =====================================================
    // Format Attendance Date
    // =====================================================

    const formatAttendanceDate = (
        attendanceRecord
    ) => {

        if (!attendanceRecord) {

            return "No attendance recorded yet.";

        }


        const date =
            attendanceRecord?.service?.serviceDate ||
            attendanceRecord?.attendanceDate;


        if (!date) {

            return "No attendance date available.";

        }


        const parsedDate =
            new Date(date);


        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {

            return "No attendance date available.";

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


    // =====================================================
    // Loading
    // =====================================================

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


    // =====================================================
    // Error
    // =====================================================

    if (error) {

        return (

            <View style={styles.errorContainer}>

                <Text style={styles.errorIcon}>
                    !
                </Text>


                <Text style={styles.errorTitle}>
                    Something went wrong
                </Text>


                <Text style={styles.errorMessage}>
                    {error}
                </Text>


                <TouchableOpacity
                    style={styles.retryButton}
                    onPress={fetchDashboard}
                >

                    <Text style={styles.retryText}>
                        Try Again
                    </Text>

                </TouchableOpacity>

            </View>

        );

    }


    // =====================================================
    // Dashboard Data
    // =====================================================

    const member =
        dashboard?.member;

    const activeService =
        dashboard?.activeService;

    const today =
        dashboard?.today;

    const attendance =
        dashboard?.attendance;


    // =====================================================
    // Member Name
    // =====================================================

    const firstName =
        member?.firstName ||
        user?.firstName ||
        "Member";


    // =====================================================
    // Attendance Statistics
    // =====================================================

    const attendedThisMonth =
        attendance?.thisMonth || 0;


    const totalServices =
        attendance?.thisMonthServices || 0;


    const missedThisMonth =
        Math.max(
            totalServices -
            attendedThisMonth,
            0
        );


    const attendanceRate =
        attendance?.thisMonthRate || 0;


    // =====================================================
    // Home Screen
    // =====================================================

    return (

        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
        >

            {/* =================================================
                Header
            ================================================= */}

            <View style={styles.header}>

                <Text style={styles.welcome}>
                    Welcome back 👋
                </Text>


                <Text style={styles.name}>
                    {firstName}
                </Text>


                <Text style={styles.headerSubtitle}>
                    Here's your attendance overview.
                </Text>

            </View>


            {/* =================================================
                Today's Service
            ================================================= */}

            <View style={styles.serviceCard}>

                <Text style={styles.smallText}>
                    TODAY'S SERVICE
                </Text>


                <Text style={styles.serviceTitle}>
                    {activeService?.name ||
                        "No Active Service"}
                </Text>


                {activeService ? (

                    <Text style={styles.serviceTime}>

                        {activeService.startTime}

                        {" - "}

                        {activeService.endTime}

                    </Text>

                ) : (

                    <Text style={styles.serviceTime}>
                        No service currently available
                    </Text>

                )}


                {/* =============================================
                    Attendance Already Marked
                ============================================= */}

                {today?.attended ? (

                    <View style={styles.attendedBadge}>

                        <Text style={styles.attendedText}>
                            ✓ Attendance Marked
                        </Text>

                    </View>

                ) : activeService?.attendanceOpen ? (

                    <TouchableOpacity
                        style={styles.attendanceButton}
                        onPress={() =>
                            router.push(
                                "/mark-attendance"
                            )
                        }
                        activeOpacity={0.8}
                    >

                        <Text
                            style={
                                styles.attendanceButtonText
                            }
                        >
                            Mark Attendance
                        </Text>

                    </TouchableOpacity>

                ) : (

                    <View style={styles.closedBadge}>

                        <Text style={styles.closedText}>
                            Attendance Closed
                        </Text>

                    </View>

                )}

            </View>


            {/* =================================================
                Overview
            ================================================= */}

            <View style={styles.sectionHeader}>

                <Text style={styles.sectionTitle}>
                    Your Overview
                </Text>


                <TouchableOpacity
                    onPress={() =>
                        router.push(
                            "/attendance"
                        )
                    }
                >

                    <Text style={styles.viewAllText}>
                        View History
                    </Text>

                </TouchableOpacity>

            </View>


            <View style={styles.statsRow}>

                {/* =============================================
                    Attended
                ============================================= */}

                <View style={styles.statCard}>

                    <View style={styles.statIconCircle}>

                        <Text style={styles.statIcon}>
                            ✓
                        </Text>

                    </View>


                    <Text style={styles.statNumber}>
                        {attendedThisMonth}
                    </Text>


                    <Text style={styles.statLabel}>
                        Attended
                    </Text>

                </View>


                {/* =============================================
                    Missed
                ============================================= */}

                <View style={styles.statCard}>

                    <View style={styles.statIconCircle}>

                        <Text style={styles.statIcon}>
                            ×
                        </Text>

                    </View>


                    <Text style={styles.statNumber}>
                        {missedThisMonth}
                    </Text>


                    <Text style={styles.statLabel}>
                        Missed
                    </Text>

                </View>

            </View>


            {/* =================================================
                Attendance Rate
            ================================================= */}

            <View style={styles.rateCard}>

                <View style={styles.rateHeader}>

                    <View>

                        <Text style={styles.rateTitle}>
                            Attendance this month
                        </Text>

                        <Text style={styles.rateDescription}>
                            You attended{" "}

                            <Text style={styles.boldText}>
                                {attendedThisMonth}
                            </Text>

                            {" "}of{" "}

                            <Text style={styles.boldText}>
                                {totalServices}
                            </Text>

                            {" "}services.
                        </Text>

                    </View>


                    <View style={styles.rateCircle}>

                        <Text style={styles.rateNumber}>
                            {attendanceRate}%
                        </Text>

                    </View>

                </View>


                {/* =============================================
                    Progress Bar
                ============================================= */}

                <View style={styles.progressBackground}>

                    <View
                        style={[
                            styles.progressFill,
                            {
                                width: `${Math.min(
                                    Math.max(
                                        attendanceRate,
                                        0
                                    ),
                                    100
                                )}%`,
                            },
                        ]}
                    />

                </View>


                <Text style={styles.rateLabel}>
                    Attendance Rate
                </Text>

            </View>


            {/* =================================================
                Last Attendance
            ================================================= */}

            <View style={styles.infoCard}>

                <Text style={styles.infoTitle}>
                    Last Attendance
                </Text>


                {attendance?.lastAttendance ? (

                    <Text style={styles.infoText}>
                        {formatAttendanceDate(
                            attendance.lastAttendance
                        )}
                    </Text>

                ) : (

                    <Text style={styles.infoText}>
                        No attendance recorded yet.
                    </Text>

                )}

            </View>


            {/* =================================================
                Quick Action
            ================================================= */}

            <TouchableOpacity
                style={styles.historyButton}
                onPress={() =>
                    router.push(
                        "/attendance"
                    )
                }
                activeOpacity={0.8}
            >

                <View>

                    <Text style={styles.historyTitle}>
                        Attendance History
                    </Text>

                    <Text style={styles.historySubtitle}>
                        View your previous attendance
                    </Text>

                </View>


                <Text style={styles.arrow}>
                    →
                </Text>

            </TouchableOpacity>


            {/* =================================================
                Bottom Spacing
            ================================================= */}

            <View style={styles.bottomSpacing} />

        </ScrollView>

    );

}


// =====================================================
// Styles
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


    // =====================================================
    // Header
    // =====================================================

    header: {
        marginBottom: 24,
    },


    welcome: {
        fontSize: 15,
        color: "#666",
    },


    name: {
        fontSize: 30,
        fontWeight: "800",
        color: "#0f2a5f",
        marginTop: 3,
    },


    headerSubtitle: {
        color: "#777",
        fontSize: 14,
        marginTop: 6,
    },


    // =====================================================
    // Today's Service
    // =====================================================

    serviceCard: {
        backgroundColor: "#0f2a5f",
        borderRadius: 18,
        padding: 22,
        marginBottom: 28,
    },


    smallText: {
        color: "#cbd5e1",
        fontSize: 12,
        fontWeight: "700",
        letterSpacing: 1,
    },


    serviceTitle: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "800",
        marginTop: 8,
    },


    serviceTime: {
        color: "#dbe4f5",
        fontSize: 15,
        marginTop: 5,
    },


    // =====================================================
    // Mark Attendance
    // =====================================================

    attendanceButton: {
        backgroundColor: "#fff",
        paddingVertical: 14,
        borderRadius: 11,
        marginTop: 20,
        alignItems: "center",
    },


    attendanceButtonText: {
        color: "#0f2a5f",
        fontWeight: "800",
        fontSize: 15,
    },


    // =====================================================
    // Attendance Marked
    // =====================================================

    attendedBadge: {
        backgroundColor: "#dcfce7",
        paddingVertical: 14,
        borderRadius: 11,
        marginTop: 20,
        alignItems: "center",
    },


    attendedText: {
        color: "#166534",
        fontSize: 15,
        fontWeight: "700",
    },


    // =====================================================
    // Attendance Closed
    // =====================================================

    closedBadge: {
        backgroundColor: "#e5e7eb",
        paddingVertical: 14,
        borderRadius: 11,
        marginTop: 20,
        alignItems: "center",
    },


    closedText: {
        color: "#4b5563",
        fontSize: 15,
        fontWeight: "700",
    },


    // =====================================================
    // Section Header
    // =====================================================

    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },


    sectionTitle: {
        fontSize: 20,
        fontWeight: "800",
        color: "#222",
    },


    viewAllText: {
        color: "#0f2a5f",
        fontSize: 13,
        fontWeight: "700",
    },


    // =====================================================
    // Statistics
    // =====================================================

    statsRow: {
        flexDirection: "row",
        gap: 12,
    },


    statCard: {
        flex: 1,
        backgroundColor: "#fff",
        borderRadius: 15,
        padding: 18,
    },


    statIconCircle: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: "#eef2ff",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10,
    },


    statIcon: {
        color: "#0f2a5f",
        fontSize: 18,
        fontWeight: "800",
    },


    statNumber: {
        fontSize: 30,
        fontWeight: "800",
        color: "#0f2a5f",
    },


    statLabel: {
        color: "#666",
        marginTop: 4,
        fontSize: 14,
    },


    // =====================================================
    // Attendance Rate
    // =====================================================

    rateCard: {
        backgroundColor: "#fff",
        borderRadius: 15,
        padding: 20,
        marginTop: 15,
    },


    rateHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },


    rateTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: "#222",
    },


    rateDescription: {
        color: "#666",
        marginTop: 7,
        lineHeight: 21,
        maxWidth: 230,
    },


    boldText: {
        fontWeight: "800",
        color: "#222",
    },


    rateCircle: {
        width: 65,
        height: 65,
        borderRadius: 33,
        backgroundColor: "#eef2ff",
        justifyContent: "center",
        alignItems: "center",
    },


    rateNumber: {
        fontSize: 17,
        fontWeight: "800",
        color: "#0f2a5f",
    },


    progressBackground: {
        height: 8,
        backgroundColor: "#e5e7eb",
        borderRadius: 4,
        overflow: "hidden",
        marginTop: 20,
    },


    progressFill: {
        height: "100%",
        backgroundColor: "#0f2a5f",
        borderRadius: 4,
    },


    rateLabel: {
        color: "#777",
        fontSize: 12,
        marginTop: 8,
    },


    // =====================================================
    // Last Attendance
    // =====================================================

    infoCard: {
        backgroundColor: "#fff",
        borderRadius: 15,
        padding: 20,
        marginTop: 15,
    },


    infoTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: "#222",
    },


    infoText: {
        color: "#666",
        marginTop: 7,
        lineHeight: 21,
    },


    // =====================================================
    // Attendance History Quick Action
    // =====================================================

    historyButton: {
        backgroundColor: "#fff",
        borderRadius: 15,
        padding: 20,
        marginTop: 15,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },


    historyTitle: {
        color: "#222",
        fontSize: 16,
        fontWeight: "700",
    },


    historySubtitle: {
        color: "#777",
        fontSize: 13,
        marginTop: 5,
    },


    arrow: {
        color: "#0f2a5f",
        fontSize: 25,
        fontWeight: "600",
    },


    bottomSpacing: {
        height: 20,
    },


    // =====================================================
    // Loading
    // =====================================================

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


    // =====================================================
    // Error
    // =====================================================

    errorContainer: {
        flex: 1,
        backgroundColor: "#f4f6fb",
        justifyContent: "center",
        alignItems: "center",
        padding: 30,
    },


    errorIcon: {
        width: 45,
        height: 45,
        borderRadius: 23,
        backgroundColor: "#fee2e2",
        color: "#dc2626",
        fontSize: 26,
        fontWeight: "800",
        textAlign: "center",
        lineHeight: 45,
        marginBottom: 15,
    },


    errorTitle: {
        fontSize: 22,
        fontWeight: "800",
        color: "#222",
        textAlign: "center",
    },
 

    errorMessage: {
        color: "#666",
        textAlign: "center",
        marginTop: 10,
        lineHeight: 21,
    },


    retryButton: {
        backgroundColor: "#0f2a5f",
        paddingHorizontal: 30,
        paddingVertical: 13,
        borderRadius: 10,
        marginTop: 25,
    },


    retryText: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "700",
    },

});