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
    ActivityIndicator,
} from "react-native";

import {
    useFocusEffect,
} from "expo-router";

import api from "../api/axios";


// =====================================================
// ATTENDANCE HISTORY SCREEN
// =====================================================

export default function AttendanceHistoryScreen() {


    // =================================================
    // State
    // =================================================

    const [attendance, setAttendance] =
        useState([]);

    const [summary, setSummary] =
        useState({
            total: 0,
            present: 0,
            absent: 0,
            excused: 0,
            attendanceRate: 0,
        });

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // =================================================
    // Fetch Attendance History
    // =================================================

    const fetchAttendanceHistory =
        useCallback(
            async () => {

                try {

                    setLoading(true);

                    setError("");


                    const response =
                        await api.get(
                            "/attendance/my-history"
                        );


                    if (
                        response.data?.success
                    ) {

                        setAttendance(
                            response.data.attendance || []
                        );


                        setSummary(
                            response.data.summary || {
                                total: 0,
                                present: 0,
                                absent: 0,
                                excused: 0,
                                attendanceRate: 0,
                            }
                        );

                    }
                    else {

                        setError(
                            "Unable to load your attendance history."
                        );

                    }

                }
                catch (error) {

                    console.log(
                        "MOBILE ATTENDANCE HISTORY ERROR:",
                        error.response?.data ||
                        error.message
                    );


                    setError(
                        error.response?.data?.message ||
                        "Unable to load your attendance history."
                    );

                }
                finally {

                    setLoading(false);

                }

            },
            []
        );


    // =================================================
    // Refresh When Screen Gets Focus
    // =================================================

    useFocusEffect(
        useCallback(() => {

            fetchAttendanceHistory();

        }, [fetchAttendanceHistory])
    );


    // =================================================
    // Format Date
    // =================================================

    const formatDate = (
        date
    ) => {

        if (!date) {

            return "Date unavailable";

        }


        const parsedDate =
            new Date(date);


        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {

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
    // Get Status Information
    // =================================================

    const getStatusInfo = (
        status
    ) => {

        switch (status) {

            case "Present":

                return {

                    icon: "✓",

                    label: "Present",

                    container:
                        styles.presentBadge,

                    text:
                        styles.presentText,

                };


            case "Excused":

                return {

                    icon: "−",

                    label: "Excused",

                    container:
                        styles.excusedBadge,

                    text:
                        styles.excusedText,

                };


            case "Absent":

                return {

                    icon: "×",

                    label: "Absent",

                    container:
                        styles.absentBadge,

                    text:
                        styles.absentText,

                };


            default:

                return {

                    icon: "?",

                    label:
                        status || "Unknown",

                    container:
                        styles.unknownBadge,

                    text:
                        styles.unknownText,

                };

        }

    };


    // =================================================
    // Loading
    // =================================================

    if (loading) {

        return (

            <View
                style={styles.loadingContainer}
            >

                <ActivityIndicator
                    size="large"
                    color="#0f2a5f"
                />


                <Text
                    style={styles.loadingText}
                >
                    Loading attendance history...
                </Text>

            </View>

        );

    }


    // =================================================
    // Error
    // =================================================

    if (error) {

        return (

            <View
                style={styles.errorContainer}
            >

                <Text
                    style={styles.errorIcon}
                >
                    !
                </Text>


                <Text
                    style={styles.errorTitle}
                >
                    Something went wrong
                </Text>


                <Text
                    style={styles.errorMessage}
                >
                    {error}
                </Text>


                <TouchableOpacity
                    style={styles.retryButton}
                    onPress={
                        fetchAttendanceHistory
                    }
                >

                    <Text
                        style={styles.retryText}
                    >
                        Try Again
                    </Text>

                </TouchableOpacity>

            </View>

        );

    }


    // =================================================
    // Render
    // =================================================

    return (

        <ScrollView
            style={styles.container}
            contentContainerStyle={
                styles.content
            }
            showsVerticalScrollIndicator={
                false
            }
        >

            {/* =========================================
                Header
            ========================================== */}

            <View
                style={styles.header}
            >

                <Text
                    style={styles.title}
                >
                    Attendance History
                </Text>


                <Text
                    style={styles.subtitle}
                >
                    View your attendance records
                </Text>

            </View>


            {/* =========================================
                Summary Cards
            ========================================== */}

            <View
                style={styles.summaryRow}
            >

                {/* Total */}

                <View
                    style={styles.summaryCard}
                >

                    <Text
                        style={styles.summaryNumber}
                    >
                        {summary.total}
                    </Text>


                    <Text
                        style={styles.summaryLabel}
                    >
                        Services
                    </Text>

                </View>


                {/* Present */}

                <View
                    style={styles.summaryCard}
                >

                    <Text
                        style={styles.summaryNumber}
                    >
                        {summary.present}
                    </Text>


                    <Text
                        style={styles.summaryLabel}
                    >
                        Present
                    </Text>

                </View>

            </View>


            {/* =========================================
                Second Summary Row
            ========================================== */}

            <View
                style={styles.summaryRow}
            >

                {/* Absent */}

                <View
                    style={styles.summaryCard}
                >

                    <Text
                        style={styles.summaryNumber}
                    >
                        {summary.absent}
                    </Text>


                    <Text
                        style={styles.summaryLabel}
                    >
                        Absent
                    </Text>

                </View>


                {/* Excused */}

                <View
                    style={styles.summaryCard}
                >

                    <Text
                        style={styles.summaryNumber}
                    >
                        {summary.excused}
                    </Text>


                    <Text
                        style={styles.summaryLabel}
                    >
                        Excused
                    </Text>

                </View>

            </View>


            {/* =========================================
                Attendance Rate
            ========================================== */}

            <View
                style={styles.rateCard}
            >

                <View
                    style={styles.rateHeader}
                >

                    <View>

                        <Text
                            style={styles.rateTitle}
                        >
                            Attendance Rate
                        </Text>


                        <Text
                            style={styles.rateDescription}
                        >
                            Your overall attendance
                        </Text>

                    </View>


                    <View
                        style={styles.rateCircle}
                    >

                        <Text
                            style={styles.rateNumber}
                        >
                            {
                                summary.attendanceRate
                            }%
                        </Text>

                    </View>

                </View>


                {/* Progress */}

                <View
                    style={
                        styles.progressBackground
                    }
                >

                    <View
                        style={[
                            styles.progressFill,
                            {
                                width:
                                    `${Math.min(
                                        Math.max(
                                            summary.attendanceRate,
                                            0
                                        ),
                                        100
                                    )}%`,
                            },
                        ]}
                    />

                </View>

            </View>


            {/* =========================================
                Attendance Records
            ========================================== */}

            <View
                style={styles.recordsHeader}
            >

                <Text
                    style={styles.recordsTitle}
                >
                    Attendance Records
                </Text>


                <Text
                    style={styles.recordsCount}
                >
                    {attendance.length} records
                </Text>

            </View>


            {/* =========================================
                Empty State
            ========================================== */}

            {attendance.length === 0 ? (

                <View
                    style={styles.emptyCard}
                >

                    <Text
                        style={styles.emptyIcon}
                    >
                        📋
                    </Text>


                    <Text
                        style={styles.emptyTitle}
                    >
                        No Attendance Records
                    </Text>


                    <Text
                        style={styles.emptyText}
                    >
                        Your attendance records
                        will appear here once
                        you attend a service.
                    </Text>

                </View>

            ) : (

                attendance.map(
                    (
                        record,
                        index
                    ) => {

                        const status =
                            getStatusInfo(
                                record.status
                            );


                        const service =
                            record.service;


                        const serviceDate =
                            service?.serviceDate ||
                            record.attendanceDate;


                        return (

                            <View
                                key={
                                    record._id ||
                                    index
                                }
                                style={
                                    styles.recordCard
                                }
                            >

                                {/* Service Information */}

                                <View
                                    style={
                                        styles.recordMain
                                    }
                                >

                                    <Text
                                        style={
                                            styles.serviceName
                                        }
                                    >
                                        {
                                            service?.name ||
                                            "Church Service"
                                        }
                                    </Text>


                                    <Text
                                        style={
                                            styles.serviceDate
                                        }
                                    >
                                        {
                                            formatDate(
                                                serviceDate
                                            )
                                        }
                                    </Text>


                                    {service?.startTime &&
                                        service?.endTime ? (

                                        <Text
                                            style={
                                                styles.serviceTime
                                            }
                                        >
                                            {
                                                service.startTime
                                            }

                                            {" - "}

                                            {
                                                service.endTime
                                            }
                                        </Text>

                                    ) : null}


                                    {record.attendanceMethod ? (

                                        <Text
                                            style={
                                                styles.methodText
                                            }
                                        >
                                            Method:{" "}
                                            {
                                                record.attendanceMethod
                                            }
                                        </Text>

                                    ) : null}

                                </View>


                                {/* Status */}

                                <View
                                    style={[
                                        styles.statusBadge,
                                        status.container,
                                    ]}
                                >

                                    <Text
                                        style={[
                                            styles.statusIcon,
                                            status.text,
                                        ]}
                                    >
                                        {
                                            status.icon
                                        }
                                    </Text>


                                    <Text
                                        style={
                                            status.text
                                        }
                                    >
                                        {
                                            status.label
                                        }
                                    </Text>

                                </View>

                            </View>

                        );

                    }
                )

            )}


            {/* =========================================
                Bottom Spacing
            ========================================== */}

            <View
                style={styles.bottomSpacing}
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


    // =================================================
    // Header
    // =================================================

    header: {

        marginBottom: 24,

    },


    title: {

        fontSize: 28,

        fontWeight: "800",

        color: "#0f2a5f",

    },


    subtitle: {

        color: "#777",

        fontSize: 14,

        marginTop: 6,

    },


    // =================================================
    // Summary
    // =================================================

    summaryRow: {

        flexDirection: "row",

        gap: 12,

        marginBottom: 12,

    },


    summaryCard: {

        flex: 1,

        backgroundColor: "#fff",

        borderRadius: 15,

        padding: 18,

    },


    summaryNumber: {

        fontSize: 28,

        fontWeight: "800",

        color: "#0f2a5f",

    },


    summaryLabel: {

        fontSize: 13,

        color: "#666",

        marginTop: 4,

    },


    // =================================================
    // Attendance Rate
    // =================================================

    rateCard: {

        backgroundColor: "#fff",

        borderRadius: 15,

        padding: 20,

        marginTop: 3,

        marginBottom: 25,

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

        color: "#777",

        fontSize: 13,

        marginTop: 5,

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


    // =================================================
    // Records Header
    // =================================================

    recordsHeader: {

        flexDirection: "row",

        justifyContent: "space-between",

        alignItems: "center",

        marginBottom: 12,

    },


    recordsTitle: {

        fontSize: 20,

        fontWeight: "800",

        color: "#222",

    },


    recordsCount: {

        fontSize: 13,

        color: "#777",

    },


    // =================================================
    // Record Card
    // =================================================

    recordCard: {

        backgroundColor: "#fff",

        borderRadius: 15,

        padding: 18,

        marginBottom: 12,

        flexDirection: "row",

        justifyContent: "space-between",

        alignItems: "center",

    },


    recordMain: {

        flex: 1,

        paddingRight: 12,

    },


    serviceName: {

        fontSize: 16,

        fontWeight: "700",

        color: "#222",

    },


    serviceDate: {

        fontSize: 14,

        color: "#555",

        marginTop: 6,

    },


    serviceTime: {

        fontSize: 12,

        color: "#888",

        marginTop: 4,

    },


    methodText: {

        fontSize: 11,

        color: "#999",

        marginTop: 6,

    },


    // =================================================
    // Status
    // =================================================

    statusBadge: {

        minWidth: 82,

        paddingHorizontal: 10,

        paddingVertical: 8,

        borderRadius: 10,

        flexDirection: "row",

        alignItems: "center",

        justifyContent: "center",

    },


    statusIcon: {

        fontSize: 14,

        fontWeight: "800",

        marginRight: 5,

    },


    presentBadge: {

        backgroundColor: "#dcfce7",

    },


    presentText: {

        color: "#166534",

        fontWeight: "700",

        fontSize: 12,

    },


    absentBadge: {

        backgroundColor: "#fee2e2",

    },


    absentText: {

        color: "#b91c1c",

        fontWeight: "700",

        fontSize: 12,

    },


    excusedBadge: {

        backgroundColor: "#fef3c7",

    },


    excusedText: {

        color: "#92400e",

        fontWeight: "700",

        fontSize: 12,

    },


    unknownBadge: {

        backgroundColor: "#e5e7eb",

    },


    unknownText: {

        color: "#4b5563",

        fontWeight: "700",

        fontSize: 12,

    },


    // =================================================
    // Empty State
    // =================================================

    emptyCard: {

        backgroundColor: "#fff",

        borderRadius: 15,

        padding: 30,

        alignItems: "center",

    },


    emptyIcon: {

        fontSize: 35,

        marginBottom: 12,

    },


    emptyTitle: {

        fontSize: 18,

        fontWeight: "800",

        color: "#222",

        textAlign: "center",

    },


    emptyText: {

        color: "#777",

        fontSize: 14,

        lineHeight: 21,

        textAlign: "center",

        marginTop: 8,

    },


    // =================================================
    // Loading
    // =================================================

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


    // =================================================
    // Error
    // =================================================

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


    // =================================================
    // Bottom Spacing
    // =================================================

    bottomSpacing: {

        height: 20,

    },

});