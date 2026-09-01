import React, {
    useCallback,
    useState,
} from "react";

import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView,
    RefreshControl,
} from "react-native";

import {
    useLocalSearchParams,
    useRouter,
    useFocusEffect,
} from "expo-router";

import {
    Ionicons,
} from "@expo/vector-icons";

import api from "../api/axios";


// =====================================================
// CHILD ATTENDANCE SCREEN
// =====================================================

export default function ChildAttendanceScreen() {

    const router = useRouter();

    const {
        childId,
    } = useLocalSearchParams();


    // =================================================
    // STATE
    // =================================================

    const [child, setChild] =
        useState(null);

    const [attendance, setAttendance] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [refreshing, setRefreshing] =
        useState(false);

    const [error, setError] =
        useState("");


    // =================================================
    // FETCH CHILD ATTENDANCE
    // =================================================

    const fetchAttendance = async (
        showLoading = true
    ) => {

        try {

            if (showLoading) {

                setLoading(true);

            }

            setError("");


            if (!childId) {

                setError(
                    "Child information is missing."
                );

                return;

            }


            console.log(
                "LOADING CHILD ATTENDANCE:",
                childId
            );


            // =================================================
            // GET FAMILY
            // Used to obtain the child's basic information
            // =================================================

            const familyResponse =
                await api.get(
                    "/users/family"
                );


            const family =
                familyResponse?.data?.family;


            const children =
                family?.children || [];


            const selectedChild =
                children.find(
                    (item) =>
                        String(item?._id) ===
                        String(childId)
                );


            if (!selectedChild) {

                setError(
                    "This child could not be found."
                );

                setChild(null);

                return;

            }


            setChild(
                selectedChild
            );


            // =================================================
            // GET CHILD ATTENDANCE
            // =================================================

            const response =
                await api.get(
                    `/attendance/child/${childId}`
                );


            console.log(
                "CHILD ATTENDANCE RESPONSE:",
                response?.data
            );


            // =================================================
            // SUPPORT COMMON RESPONSE FORMATS
            // =================================================

            const responseData =
                response?.data || {};


            let attendanceData = [];


            if (
                Array.isArray(
                    responseData.attendance
                )
            ) {

                attendanceData =
                    responseData.attendance;

            }
            else if (
                Array.isArray(
                    responseData.records
                )
            ) {

                attendanceData =
                    responseData.records;

            }
            else if (
                Array.isArray(
                    responseData.history
                )
            ) {

                attendanceData =
                    responseData.history;

            }
            else if (
                Array.isArray(
                    responseData.data
                )
            ) {

                attendanceData =
                    responseData.data;

            }


            setAttendance(
                attendanceData
            );


            console.log(
                "CHILD ATTENDANCE RECORDS:",
                attendanceData.length
            );

        }
        catch (error) {

            console.log(
                "FETCH CHILD ATTENDANCE ERROR:",
                error?.response?.data ||
                error?.message
            );


            setError(
                error?.response?.data?.message ||
                "Unable to load this child's attendance."
            );

        }
        finally {

            setLoading(false);

            setRefreshing(false);

        }

    };


    // =================================================
    // LOAD WHEN SCREEN OPENS
    // =================================================

    useFocusEffect(
        useCallback(() => {

            fetchAttendance();

        }, [
            childId,
        ])
    );


    // =================================================
    // REFRESH
    // =================================================

    const handleRefresh = async () => {

        if (refreshing) {

            return;

        }


        setRefreshing(true);


        await fetchAttendance(false);

    };


    // =================================================
    // BACK
    // =================================================

    const handleBack = () => {

        if (router.canGoBack()) {

            router.back();

            return;

        }


        if (childId) {

            router.replace({
                pathname: "/child-details",
                params: {
                    childId: String(
                        childId
                    ),
                },
            });

            return;

        }


        router.replace(
            "/my-children"
        );

    };


    // =================================================
    // FORMAT DATE
    // =================================================

    const formatDate = (
        value
    ) => {

        if (!value) {

            return "Date unavailable";

        }


        const date =
            new Date(value);


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return "Date unavailable";

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
    // FORMAT TIME
    // =================================================

    const formatTime = (
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


        return date.toLocaleTimeString(
            "en-GB",
            {
                hour: "2-digit",
                minute: "2-digit",
            }
        );

    };


    // =================================================
    // GET SERVICE DATE
    // =================================================

    const getServiceDate = (
        record
    ) => {

        return (
            record?.service?.serviceDate ||
            record?.serviceDate ||
            record?.date ||
            record?.createdAt
        );

    };


    // =================================================
    // GET SERVICE NAME
    // =================================================

    const getServiceName = (
        record
    ) => {

        return (
            record?.service?.name ||
            record?.serviceName ||
            "Church Service"
        );

    };


    // =================================================
    // GET STATUS
    // =================================================

    const getStatus = (
        record
    ) => {

        const status =
            record?.status ||
            record?.attendanceStatus ||
            "Present";


        return String(
            status
        );

    };


    // =================================================
    // STATUS ICON
    // =================================================

    const getStatusIcon = (
        status
    ) => {

        switch (
            String(status).toLowerCase()
        ) {

            case "present":

                return "checkmark-circle";


            case "absent":

                return "close-circle";


            case "excused":

                return "remove-circle";


            default:

                return "help-circle";

        }

    };


    // =================================================
    // STATUS COLOR
    // =================================================

    const getStatusColor = (
        status
    ) => {

        switch (
            String(status).toLowerCase()
        ) {

            case "present":

                return "#15803d";


            case "absent":

                return "#dc2626";


            case "excused":

                return "#d97706";


            default:

                return "#777777";

        }

    };


    // =================================================
    // STATUS BACKGROUND
    // =================================================

    const getStatusBackground = (
        status
    ) => {

        switch (
            String(status).toLowerCase()
        ) {

            case "present":

                return "#dcfce7";


            case "absent":

                return "#fef2f2";


            case "excused":

                return "#fff7ed";


            default:

                return "#f4f4f5";

        }

    };


    // =================================================
    // ATTENDANCE SUMMARY
    // =================================================

    const presentCount =
        attendance.filter(
            (record) =>
                getStatus(record)
                    .toLowerCase() ===
                "present"
        ).length;


    const absentCount =
        attendance.filter(
            (record) =>
                getStatus(record)
                    .toLowerCase() ===
                "absent"
        ).length;


    const excusedCount =
        attendance.filter(
            (record) =>
                getStatus(record)
                    .toLowerCase() ===
                "excused"
        ).length;


    const totalCount =
        attendance.length;


    const attendanceRate =
        totalCount > 0
            ? Math.round(
                (
                    presentCount /
                    totalCount
                ) * 100
            )
            : 0;


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
                    Loading attendance...
                </Text>

            </View>

        );

    }


    // =================================================
    // SCREEN
    // =================================================

    return (

        <View
            style={
                styles.container
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

                <TouchableOpacity
                    style={
                        styles.backButton
                    }
                    onPress={
                        handleBack
                    }
                    activeOpacity={0.7}
                >

                    <Ionicons
                        name="arrow-back"
                        size={24}
                        color="#0f2a5f"
                    />

                </TouchableOpacity>


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
                        Child Attendance
                    </Text>

                    <Text
                        style={
                            styles.subtitle
                        }
                    >
                        {
                            child
                                ? `${child.firstName || ""} ${
                                    child.lastName || ""
                                }`.trim()
                                : "Attendance history"
                        }
                    </Text>

                </View>


                <TouchableOpacity
                    style={
                        styles.headerRefreshButton
                    }
                    onPress={
                        handleRefresh
                    }
                    disabled={
                        refreshing
                    }
                    activeOpacity={0.7}
                >

                    {refreshing ? (

                        <ActivityIndicator
                            size="small"
                            color="#0f2a5f"
                        />

                    ) : (

                        <Ionicons
                            name="refresh-outline"
                            size={23}
                            color="#0f2a5f"
                        />

                    )}

                </TouchableOpacity>

            </View>


            {/* =========================================
                CONTENT
            ========================================== */}

            <ScrollView
                contentContainerStyle={
                    styles.scrollContent
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
                        colors={[
                            "#0f2a5f",
                        ]}
                    />
                }
            >

                {/* =====================================
                    ERROR
                ====================================== */}

                {error ? (

                    <View
                        style={
                            styles.errorCard
                        }
                    >

                        <View
                            style={
                                styles.errorIcon
                            }
                        >

                            <Ionicons
                                name="alert-circle-outline"
                                size={34}
                                color="#dc2626"
                            />

                        </View>


                        <Text
                            style={
                                styles.errorTitle
                            }
                        >
                            Unable to Load Attendance
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
                            onPress={
                                () =>
                                    fetchAttendance()
                            }
                            activeOpacity={0.8}
                        >

                            <Ionicons
                                name="refresh-outline"
                                size={19}
                                color="#ffffff"
                            />

                            <Text
                                style={
                                    styles.retryText
                                }
                            >
                                Try Again
                            </Text>

                        </TouchableOpacity>

                    </View>

                ) : null}


                {!error ? (

                    <>

                        {/* =============================
                            CHILD PROFILE
                        ============================== */}

                        <View
                            style={
                                styles.profileCard
                            }
                        >

                            <View
                                style={
                                    styles.avatar
                                }
                            >

                                <Text
                                    style={
                                        styles.avatarText
                                    }
                                >
                                    {
                                        child?.firstName
                                            ? child.firstName
                                                .charAt(0)
                                                .toUpperCase()
                                            : "C"
                                    }
                                </Text>

                            </View>


                            <View
                                style={
                                    styles.profileInfo
                                }
                            >

                                <Text
                                    style={
                                        styles.profileName
                                    }
                                >
                                    {
                                        `${child?.firstName || ""} ${
                                            child?.lastName || ""
                                        }`.trim() ||
                                        "Child"
                                    }
                                </Text>


                                <Text
                                    style={
                                        styles.profileSubtitle
                                    }
                                >
                                    Attendance History
                                </Text>

                            </View>

                        </View>


                        {/* =============================
                            SUMMARY
                        ============================== */}

                        <View
                            style={
                                styles.summarySection
                            }
                        >

                            <Text
                                style={
                                    styles.sectionTitle
                                }
                            >
                                Attendance Overview
                            </Text>


                            <View
                                style={
                                    styles.summaryGrid
                                }
                            >

                                {/* TOTAL */}

                                <View
                                    style={
                                        styles.summaryCard
                                    }
                                >

                                    <View
                                        style={[
                                            styles.summaryCircle,
                                            styles.totalCircle,
                                        ]}
                                    >

                                        <Ionicons
                                            name="calendar-outline"
                                            size={22}
                                            color="#0f2a5f"
                                        />

                                    </View>


                                    <Text
                                        style={
                                            styles.summaryNumber
                                        }
                                    >
                                        {
                                            totalCount
                                        }
                                    </Text>


                                    <Text
                                        style={
                                            styles.summaryLabel
                                        }
                                    >
                                        Total Services
                                    </Text>

                                </View>


                                {/* PRESENT */}

                                <View
                                    style={
                                        styles.summaryCard
                                    }
                                >

                                    <View
                                        style={[
                                            styles.summaryCircle,
                                            styles.presentCircle,
                                        ]}
                                    >

                                        <Ionicons
                                            name="checkmark-circle-outline"
                                            size={22}
                                            color="#15803d"
                                        />

                                    </View>


                                    <Text
                                        style={
                                            styles.summaryNumber
                                        }
                                    >
                                        {
                                            presentCount
                                        }
                                    </Text>


                                    <Text
                                        style={
                                            styles.summaryLabel
                                        }
                                    >
                                        Present
                                    </Text>

                                </View>


                                {/* ABSENT */}

                                <View
                                    style={
                                        styles.summaryCard
                                    }
                                >

                                    <View
                                        style={[
                                            styles.summaryCircle,
                                            styles.absentCircle,
                                        ]}
                                    >

                                        <Ionicons
                                            name="close-circle-outline"
                                            size={22}
                                            color="#dc2626"
                                        />

                                    </View>


                                    <Text
                                        style={
                                            styles.summaryNumber
                                        }
                                    >
                                        {
                                            absentCount
                                        }
                                    </Text>


                                    <Text
                                        style={
                                            styles.summaryLabel
                                        }
                                    >
                                        Absent
                                    </Text>

                                </View>


                                {/* RATE */}

                                <View
                                    style={
                                        styles.summaryCard
                                    }
                                >

                                    <View
                                        style={[
                                            styles.summaryCircle,
                                            styles.rateCircle,
                                        ]}
                                    >

                                        <Ionicons
                                            name="trending-up-outline"
                                            size={22}
                                            color="#0f2a5f"
                                        />

                                    </View>


                                    <Text
                                        style={
                                            styles.summaryNumber
                                        }
                                    >
                                        {
                                            attendanceRate
                                        }%
                                    </Text>


                                    <Text
                                        style={
                                            styles.summaryLabel
                                        }
                                    >
                                        Attendance Rate
                                    </Text>

                                </View>

                            </View>

                        </View>


                        {/* =============================
                            EXCUSED COUNT
                        ============================== */}

                        {excusedCount > 0 ? (

                            <View
                                style={
                                    styles.excusedCard
                                }
                            >

                                <Ionicons
                                    name="information-circle-outline"
                                    size={20}
                                    color="#d97706"
                                />


                                <Text
                                    style={
                                        styles.excusedText
                                    }
                                >
                                    {
                                        excusedCount
                                    } service{
                                        excusedCount === 1
                                            ? ""
                                            : "s"
                                    } marked as excused.
                                </Text>

                            </View>

                        ) : null}


                        {/* =============================
                            HISTORY
                        ============================== */}

                        <View
                            style={
                                styles.historySection
                            }
                        >

                            <View
                                style={
                                    styles.historyHeader
                                }
                            >

                                <Text
                                    style={
                                        styles.sectionTitle
                                    }
                                >
                                    Attendance History
                                </Text>


                                <Text
                                    style={
                                        styles.recordCount
                                    }
                                >
                                    {
                                        totalCount
                                    } record{
                                        totalCount === 1
                                            ? ""
                                            : "s"
                                    }
                                </Text>

                            </View>


                            {attendance.length === 0 ? (

                                <View
                                    style={
                                        styles.emptyCard
                                    }
                                >

                                    <View
                                        style={
                                            styles.emptyIcon
                                        }
                                    >

                                        <Ionicons
                                            name="calendar-outline"
                                            size={40}
                                            color="#0f2a5f"
                                        />

                                    </View>


                                    <Text
                                        style={
                                            styles.emptyTitle
                                        }
                                    >
                                        No Attendance Records
                                    </Text>


                                    <Text
                                        style={
                                            styles.emptyMessage
                                        }
                                    >
                                        There are currently no
                                        attendance records for this
                                        child.
                                    </Text>

                                </View>

                            ) : (

                                attendance.map(
                                    (
                                        record,
                                        index
                                    ) => {

                                        const status =
                                            getStatus(
                                                record
                                            );


                                        const statusColor =
                                            getStatusColor(
                                                status
                                            );


                                        const statusBackground =
                                            getStatusBackground(
                                                status
                                            );


                                        const serviceDate =
                                            getServiceDate(
                                                record
                                            );


                                        const serviceName =
                                            getServiceName(
                                                record
                                            );


                                        return (

                                            <View
                                                key={
                                                    record?._id ||
                                                    record?.id ||
                                                    `attendance-${index}`
                                                }
                                                style={
                                                    styles.attendanceCard
                                                }
                                            >

                                                {/* DATE ICON */}

                                                <View
                                                    style={
                                                        styles.dateIcon
                                                    }
                                                >

                                                    <Ionicons
                                                        name="calendar-outline"
                                                        size={24}
                                                        color="#0f2a5f"
                                                    />

                                                </View>


                                                {/* INFORMATION */}

                                                <View
                                                    style={
                                                        styles.attendanceInfo
                                                    }
                                                >

                                                    <Text
                                                        style={
                                                            styles.serviceName
                                                        }
                                                        numberOfLines={
                                                            2
                                                        }
                                                    >
                                                        {
                                                            serviceName
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

                                                        {
                                                            formatTime(
                                                                record?.createdAt
                                                            )
                                                                ? ` • ${formatTime(
                                                                    record.createdAt
                                                                )}`
                                                                : ""
                                                        }
                                                    </Text>


                                                    {record?.attendanceMethod ? (

                                                        <View
                                                            style={
                                                                styles.methodRow
                                                            }
                                                        >

                                                            <Ionicons
                                                                name="person-outline"
                                                                size={13}
                                                                color="#999999"
                                                            />


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

                                                        </View>

                                                    ) : null}

                                                </View>


                                                {/* STATUS */}

                                                <View
                                                    style={[
                                                        styles.statusBadge,
                                                        {
                                                            backgroundColor:
                                                                statusBackground,
                                                        },
                                                    ]}
                                                >

                                                    <Ionicons
                                                        name={
                                                            getStatusIcon(
                                                                status
                                                            )
                                                        }
                                                        size={17}
                                                        color={
                                                            statusColor
                                                        }
                                                    />


                                                    <Text
                                                        style={[
                                                            styles.statusText,
                                                            {
                                                                color:
                                                                    statusColor,
                                                            },
                                                        ]}
                                                    >
                                                        {
                                                            status
                                                        }
                                                    </Text>

                                                </View>

                                            </View>

                                        );

                                    }
                                )

                            )}

                        </View>


                        {/* =============================
                            REFRESH
                        ============================== */}

                        <TouchableOpacity
                            style={[
                                styles.refreshButton,
                                refreshing &&
                                styles.refreshButtonDisabled,
                            ]}
                            onPress={
                                handleRefresh
                            }
                            disabled={
                                refreshing
                            }
                            activeOpacity={0.8}
                        >

                            {refreshing ? (

                                <ActivityIndicator
                                    size="small"
                                    color="#ffffff"
                                />

                            ) : (

                                <Ionicons
                                    name="refresh-outline"
                                    size={20}
                                    color="#ffffff"
                                />

                            )}


                            <Text
                                style={
                                    styles.refreshText
                                }
                            >
                                {
                                    refreshing
                                        ? "Refreshing..."
                                        : "Refresh Attendance"
                                }
                            </Text>

                        </TouchableOpacity>

                    </>

                ) : null}

            </ScrollView>

        </View>

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


    loadingContainer: {

        flex: 1,

        backgroundColor: "#f4f6fb",

        justifyContent: "center",

        alignItems: "center",

        padding: 30,

    },


    loadingText: {

        marginTop: 12,

        fontSize: 14,

        color: "#777777",

    },


    // =================================================
    // HEADER
    // =================================================

    header: {

        flexDirection: "row",

        alignItems: "center",

        backgroundColor: "#ffffff",

        paddingHorizontal: 20,

        paddingTop: 55,

        paddingBottom: 20,

        borderBottomWidth: 1,

        borderBottomColor: "#eeeeee",

    },


    backButton: {

        width: 42,

        height: 42,

        borderRadius: 21,

        backgroundColor: "#f4f6fb",

        justifyContent: "center",

        alignItems: "center",

    },


    headerText: {

        flex: 1,

        marginLeft: 14,

    },


    title: {

        fontSize: 24,

        fontWeight: "800",

        color: "#0f2a5f",

    },


    subtitle: {

        marginTop: 3,

        fontSize: 13,

        color: "#777777",

    },


    headerRefreshButton: {

        width: 42,

        height: 42,

        borderRadius: 21,

        backgroundColor: "#eef3ff",

        justifyContent: "center",

        alignItems: "center",

    },


    // =================================================
    // CONTENT
    // =================================================

    scrollContent: {

        padding: 20,

        paddingBottom: 45,

    },


    // =================================================
    // PROFILE
    // =================================================

    profileCard: {

        backgroundColor: "#ffffff",

        borderRadius: 16,

        padding: 20,

        flexDirection: "row",

        alignItems: "center",

        marginBottom: 20,

    },


    avatar: {

        width: 60,

        height: 60,

        borderRadius: 30,

        backgroundColor: "#0f2a5f",

        justifyContent: "center",

        alignItems: "center",

    },


    avatarText: {

        color: "#ffffff",

        fontSize: 25,

        fontWeight: "800",

    },


    profileInfo: {

        flex: 1,

        marginLeft: 15,

    },


    profileName: {

        fontSize: 19,

        fontWeight: "800",

        color: "#222222",

    },


    profileSubtitle: {

        marginTop: 4,

        fontSize: 13,

        color: "#777777",

    },


    // =================================================
    // SECTION
    // =================================================

    summarySection: {

        marginBottom: 20,

    },


    sectionTitle: {

        fontSize: 18,

        fontWeight: "800",

        color: "#222222",

        marginBottom: 12,

    },


    // =================================================
    // SUMMARY GRID
    // =================================================

    summaryGrid: {

        flexDirection: "row",

        flexWrap: "wrap",

        justifyContent: "space-between",

    },


    summaryCard: {

        width: "48%",

        backgroundColor: "#ffffff",

        borderRadius: 16,

        padding: 17,

        alignItems: "center",

        marginBottom: 12,

    },


    summaryCircle: {

        width: 45,

        height: 45,

        borderRadius: 23,

        justifyContent: "center",

        alignItems: "center",

        marginBottom: 8,

    },


    totalCircle: {

        backgroundColor: "#eef3ff",

    },


    presentCircle: {

        backgroundColor: "#dcfce7",

    },


    absentCircle: {

        backgroundColor: "#fef2f2",

    },


    rateCircle: {

        backgroundColor: "#eef3ff",

    },


    summaryNumber: {

        fontSize: 22,

        fontWeight: "800",

        color: "#222222",

    },


    summaryLabel: {

        marginTop: 3,

        fontSize: 11,

        color: "#777777",

        textAlign: "center",

    },


    // =================================================
    // EXCUSED
    // =================================================

    excusedCard: {

        backgroundColor: "#fff7ed",

        borderWidth: 1,

        borderColor: "#fed7aa",

        borderRadius: 12,

        padding: 13,

        flexDirection: "row",

        alignItems: "center",

        marginBottom: 20,

    },


    excusedText: {

        flex: 1,

        marginLeft: 8,

        fontSize: 13,

        color: "#9a3412",

        fontWeight: "600",

    },


    // =================================================
    // HISTORY
    // =================================================

    historySection: {

        marginBottom: 10,

    },


    historyHeader: {

        flexDirection: "row",

        alignItems: "center",

        justifyContent: "space-between",

        marginBottom: 12,

    },


    recordCount: {

        fontSize: 12,

        color: "#999999",

    },


    attendanceCard: {

        backgroundColor: "#ffffff",

        borderRadius: 16,

        padding: 16,

        marginBottom: 12,

        flexDirection: "row",

        alignItems: "center",

    },


    dateIcon: {

        width: 48,

        height: 48,

        borderRadius: 24,

        backgroundColor: "#eef3ff",

        justifyContent: "center",

        alignItems: "center",

    },


    attendanceInfo: {

        flex: 1,

        marginLeft: 13,

        marginRight: 8,

    },


    serviceName: {

        fontSize: 15,

        fontWeight: "800",

        color: "#222222",

    },


    serviceDate: {

        marginTop: 5,

        fontSize: 12,

        color: "#777777",

    },


    methodRow: {

        flexDirection: "row",

        alignItems: "center",

        marginTop: 5,

    },


    methodText: {

        marginLeft: 4,

        fontSize: 11,

        color: "#999999",

    },


    // =================================================
    // STATUS
    // =================================================

    statusBadge: {

        minWidth: 75,

        paddingHorizontal: 8,

        paddingVertical: 7,

        borderRadius: 10,

        flexDirection: "row",

        alignItems: "center",

        justifyContent: "center",

    },


    statusText: {

        marginLeft: 4,

        fontSize: 11,

        fontWeight: "800",

    },


    // =================================================
    // EMPTY
    // =================================================

    emptyCard: {

        backgroundColor: "#ffffff",

        borderRadius: 16,

        padding: 30,

        alignItems: "center",

    },


    emptyIcon: {

        width: 75,

        height: 75,

        borderRadius: 38,

        backgroundColor: "#eef3ff",

        justifyContent: "center",

        alignItems: "center",

        marginBottom: 15,

    },


    emptyTitle: {

        fontSize: 18,

        fontWeight: "800",

        color: "#222222",

        textAlign: "center",

    },


    emptyMessage: {

        marginTop: 8,

        fontSize: 13,

        lineHeight: 20,

        color: "#777777",

        textAlign: "center",

    },


    // =================================================
    // ERROR
    // =================================================

    errorCard: {

        backgroundColor: "#ffffff",

        borderRadius: 16,

        padding: 25,

        alignItems: "center",

        marginBottom: 20,

    },


    errorIcon: {

        width: 65,

        height: 65,

        borderRadius: 33,

        backgroundColor: "#fef2f2",

        justifyContent: "center",

        alignItems: "center",

    },


    errorTitle: {

        marginTop: 12,

        fontSize: 18,

        fontWeight: "800",

        color: "#222222",

        textAlign: "center",

    },


    errorMessage: {

        marginTop: 8,

        fontSize: 13,

        color: "#777777",

        lineHeight: 19,

        textAlign: "center",

    },


    retryButton: {

        backgroundColor: "#0f2a5f",

        borderRadius: 10,

        paddingHorizontal: 25,

        paddingVertical: 12,

        marginTop: 18,

        flexDirection: "row",

        alignItems: "center",

        justifyContent: "center",

    },


    retryText: {

        marginLeft: 7,

        color: "#ffffff",

        fontSize: 14,

        fontWeight: "700",

    },


    // =================================================
    // REFRESH
    // =================================================

    refreshButton: {

        backgroundColor: "#0f2a5f",

        borderRadius: 12,

        paddingVertical: 14,

        flexDirection: "row",

        justifyContent: "center",

        alignItems: "center",

        marginTop: 10,

    },


    refreshButtonDisabled: {

        opacity: 0.7,

    },


    refreshText: {

        color: "#ffffff",

        fontSize: 15,

        fontWeight: "700",

        marginLeft: 8,

    },

});