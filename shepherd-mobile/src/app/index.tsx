import {
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
} from "expo-router";

import {
    useSelector,
    useDispatch,
} from "react-redux";

import AsyncStorage from "@react-native-async-storage/async-storage";

import api from "../api/axios";

import {
    logout,
} from "../store/authSlice";


export default function HomeScreen() {

    const router = useRouter();

    const dispatch = useDispatch();


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
    // Fetch Member Dashboard
    // =====================================================

    useEffect(() => {

        fetchDashboard();

    }, []);


    const fetchDashboard = async () => {

        try {

            setLoading(true);

            setError("");


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

    };


    // =====================================================
    // Logout
    // =====================================================

    const handleLogout = async () => {

        try {

            await AsyncStorage.removeItem(
                "token"
            );

            await AsyncStorage.removeItem(
                "user"
            );


            dispatch(
                logout()
            );


            router.replace(
                "/login"
            );

        }
        catch (error) {

            console.log(
                "LOGOUT ERROR:",
                error
            );

        }

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


                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={handleLogout}
                >

                    <Text style={styles.logoutText}>
                        Logout
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


    const firstName =
        member?.firstName ||
        user?.firstName ||
        "Member";


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
                    Attendance Status
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
                                "/attendance"
                            )
                        }
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

            <Text style={styles.sectionTitle}>
                Your Overview
            </Text>


            <View style={styles.statsRow}>

                {/* =============================================
                    Attended
                ============================================= */}

                <View style={styles.statCard}>

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

                    <Text style={styles.statNumber}>
                        {missedThisMonth}
                    </Text>


                    <Text style={styles.statLabel}>
                        Missed
                    </Text>

                </View>

            </View>


            {/* =================================================
                Monthly Attendance
            ================================================= */}

            <View style={styles.infoCard}>

                <Text style={styles.infoTitle}>
                    Attendance this month
                </Text>


                <Text style={styles.infoText}>

                    You have attended{" "}

                    <Text style={styles.boldText}>
                        {attendedThisMonth}
                    </Text>

                    {" "}of{" "}

                    <Text style={styles.boldText}>
                        {totalServices}
                    </Text>

                    {" "}services this month.

                </Text>


                <View style={styles.rateContainer}>

                    <Text style={styles.rateNumber}>
                        {attendanceRate}%
                    </Text>


                    <Text style={styles.rateLabel}>
                        Attendance Rate
                    </Text>

                </View>

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

                        {new Date(
                            attendance.lastAttendance
                        ).toLocaleDateString()}

                    </Text>

                ) : (

                    <Text style={styles.infoText}>
                        No attendance recorded yet.
                    </Text>

                )}

            </View>


            {/* =================================================
                Logout
            ================================================= */}

            <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
            >

                <Text style={styles.logoutText}>
                    Logout
                </Text>

            </TouchableOpacity>


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
        paddingBottom: 50,
    },


    // =====================================================
    // Header
    // =====================================================

    header: {
        marginBottom: 25,
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


    // =====================================================
    // Service Card
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
    // Attendance Button
    // =====================================================

    attendanceButton: {
        backgroundColor: "#fff",
        paddingVertical: 13,
        borderRadius: 10,
        marginTop: 20,
        alignItems: "center",
    },


    attendanceButtonText: {
        color: "#0f2a5f",
        fontWeight: "700",
        fontSize: 15,
    },


    // =====================================================
    // Attendance Marked
    // =====================================================

    attendedBadge: {
        backgroundColor: "#dcfce7",
        paddingVertical: 13,
        borderRadius: 10,
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
        paddingVertical: 13,
        borderRadius: 10,
        marginTop: 20,
        alignItems: "center",
    },


    closedText: {
        color: "#4b5563",
        fontSize: 15,
        fontWeight: "700",
    },


    // =====================================================
    // Overview
    // =====================================================

    sectionTitle: {
        fontSize: 20,
        fontWeight: "800",
        color: "#222",
        marginBottom: 12,
    },


    statsRow: {
        flexDirection: "row",
        gap: 12,
    },


    statCard: {
        flex: 1,
        backgroundColor: "#fff",
        borderRadius: 15,
        padding: 20,
    },


    statNumber: {
        fontSize: 30,
        fontWeight: "800",
        color: "#0f2a5f",
    },


    statLabel: {
        color: "#666",
        marginTop: 5,
    },


    // =====================================================
    // Information Cards
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


    boldText: {
        fontWeight: "800",
        color: "#222",
    },


    // =====================================================
    // Attendance Rate
    // =====================================================

    rateContainer: {
        marginTop: 18,
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: "#eee",
    },


    rateNumber: {
        fontSize: 28,
        fontWeight: "800",
        color: "#0f2a5f",
    },


    rateLabel: {
        color: "#666",
        marginTop: 3,
    },


    // =====================================================
    // Logout
    // =====================================================

    logoutButton: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#ddd",
        paddingVertical: 14,
        borderRadius: 12,
        marginTop: 25,
        alignItems: "center",
    },


    logoutText: {
        color: "#d32f2f",
        fontSize: 15,
        fontWeight: "700",
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