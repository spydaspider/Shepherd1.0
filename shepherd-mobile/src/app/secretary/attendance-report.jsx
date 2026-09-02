import React, {
    useEffect,
    useState,
} from "react";

import {
    ActivityIndicator,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import {
    useRouter,
} from "expo-router";

import {
    useSelector,
} from "react-redux";

import {
    Ionicons,
} from "@expo/vector-icons";

import api from "../../api/axios";


// =====================================================
// SECRETARY ATTENDANCE REPORT
// =====================================================

export default function SecretaryAttendanceReportScreen() {

    const router = useRouter();


    // =====================================================
    // AUTHENTICATION / USER
    // =====================================================

    const user = useSelector(
        (state) => state.auth.user
    );

    const isAuthenticated = useSelector(
        (state) => state.auth.isAuthenticated
    );

    const authChecked = useSelector(
        (state) => state.auth.authChecked
    );


    // =====================================================
    // PERMISSION
    // =====================================================

    const canViewAttendanceReport =
        user?.role === "Secretary" ||
        user?.role === "Pastor" ||
        user?.role === "Admin";


    // =====================================================
    // STATE
    // =====================================================

    const [services, setServices] = useState([]);

    const [selectedService, setSelectedService] = useState(null);

    const [report, setReport] = useState(null);

    const [loadingServices, setLoadingServices] = useState(true);

    const [loadingReport, setLoadingReport] = useState(false);

    const [refreshing, setRefreshing] = useState(false);

    const [error, setError] = useState("");

    const [showServices, setShowServices] = useState(false);


    // =====================================================
    // PROTECT SCREEN
    // =====================================================

    useEffect(() => {

        if (!authChecked) {
            return;
        }


        // -------------------------------------------------
        // NOT LOGGED IN
        // -------------------------------------------------

        if (!isAuthenticated) {

            router.replace("/login");

            return;
        }


        // -------------------------------------------------
        // LOGGED IN BUT NO PERMISSION
        // -------------------------------------------------

        if (!canViewAttendanceReport) {

            router.replace("/");

            return;
        }

    }, [
        authChecked,
        isAuthenticated,
        canViewAttendanceReport,
    ]);


    // =====================================================
    // LOAD SERVICES
    // =====================================================

    const loadServices = async () => {

        // Never make the request if the user
        // does not have permission.

        if (!canViewAttendanceReport) {
            return;
        }

        try {

            setError("");

            const response = await api.get(
                "/services"
            );

            const data = response.data;

            let serviceList = [];


            if (Array.isArray(data)) {

                serviceList = data;

            } else if (
                Array.isArray(data?.services)
            ) {

                serviceList = data.services;

            } else if (
                data?.success &&
                Array.isArray(data?.data)
            ) {

                serviceList = data.data;

            } else if (
                data?.success &&
                Array.isArray(data?.services)
            ) {

                serviceList = data.services;
            }


            setServices(serviceList);


            // -------------------------------------------------
            // SELECT FIRST SERVICE
            // -------------------------------------------------

            if (
                serviceList.length > 0 &&
                !selectedService
            ) {

                setSelectedService(
                    serviceList[0]
                );
            }

        } catch (err) {

            console.error(
                "Load Services Error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to load services."
            );

        } finally {

            setLoadingServices(false);

            setRefreshing(false);
        }
    };


    // =====================================================
    // LOAD REPORT
    // =====================================================

    const loadReport = async (serviceId) => {

        if (
            !serviceId ||
            !canViewAttendanceReport
        ) {

            return;
        }


        try {

            setLoadingReport(true);

            setError("");


            const response = await api.get(
                `/attendance/secretary-report/${serviceId}`
            );


            if (
                response.data?.success
            ) {

                setReport(
                    response.data.report
                );

            } else {

                setReport(null);

                setError(
                    response.data?.message ||
                    "Unable to load attendance report."
                );
            }

        } catch (err) {

            console.error(
                "Load Attendance Report Error:",
                err
            );

            setReport(null);

            setError(
                err.response?.data?.message ||
                "Unable to load attendance report."
            );

        } finally {

            setLoadingReport(false);
        }
    };


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        if (
            authChecked &&
            isAuthenticated &&
            canViewAttendanceReport
        ) {

            loadServices();
        }

    }, [
        authChecked,
        isAuthenticated,
        canViewAttendanceReport,
    ]);


    // =====================================================
    // LOAD REPORT WHEN SERVICE CHANGES
    // =====================================================

    useEffect(() => {

        if (
            authChecked &&
            isAuthenticated &&
            canViewAttendanceReport &&
            selectedService?._id
        ) {

            loadReport(
                selectedService._id
            );
        }

    }, [
        selectedService,
        authChecked,
        isAuthenticated,
        canViewAttendanceReport,
    ]);


    // =====================================================
    // REFRESH
    // =====================================================

    const handleRefresh = async () => {

        if (!canViewAttendanceReport) {
            return;
        }

        setRefreshing(true);

        await loadServices();

        if (selectedService?._id) {

            await loadReport(
                selectedService._id
            );
        }

        setRefreshing(false);
    };


    // =====================================================
    // SELECT SERVICE
    // =====================================================

    const handleSelectService = (
        service
    ) => {

        setSelectedService(service);

        setShowServices(false);

        setReport(null);
    };


    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate = (date) => {

        if (!date) {
            return "N/A";
        }

        try {

            return new Date(
                date
            ).toLocaleDateString(
                "en-GB",
                {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                }
            );

        } catch {

            return "N/A";
        }
    };


    // =====================================================
    // SERVICE STATUS
    // =====================================================

    const getStatusStyle = (
        status
    ) => {

        switch (status) {

            case "Active":
                return styles.statusActive;

            case "Completed":
                return styles.statusCompleted;

            case "Cancelled":
                return styles.statusCancelled;

            default:
                return styles.statusScheduled;
        }
    };


    // =====================================================
    // WAIT FOR AUTH CHECK
    // =====================================================

    if (!authChecked) {

        return (
            <SafeAreaView
                style={styles.safeArea}
            >

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
                        Checking permissions...
                    </Text>

                </View>

            </SafeAreaView>
        );
    }


    // =====================================================
    // NOT AUTHENTICATED
    // =====================================================

    if (!isAuthenticated) {

        return (
            <SafeAreaView
                style={styles.safeArea}
            >

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
                        Redirecting to login...
                    </Text>

                </View>

            </SafeAreaView>
        );
    }


    // =====================================================
    // UNAUTHORIZED
    // =====================================================

    if (!canViewAttendanceReport) {

        return (
            <SafeAreaView
                style={styles.safeArea}
            >

                <View
                    style={styles.accessDeniedContainer}
                >

                    <View
                        style={styles.accessDeniedIcon}
                    >

                        <Ionicons
                            name="lock-closed"
                            size={42}
                            color="#b42318"
                        />

                    </View>

                    <Text
                        style={styles.accessDeniedTitle}
                    >
                        Access Denied
                    </Text>

                    <Text
                        style={styles.accessDeniedText}
                    >
                        You do not have permission to
                        view the attendance report.
                    </Text>

                    <TouchableOpacity
                        style={styles.backHomeButton}
                        onPress={() =>
                            router.replace("/")
                        }
                    >

                        <Text
                            style={styles.backHomeButtonText}
                        >
                            Go to Home
                        </Text>

                    </TouchableOpacity>

                </View>

            </SafeAreaView>
        );
    }


    // =====================================================
    // LOADING SERVICES
    // =====================================================

    if (loadingServices) {

        return (
            <SafeAreaView
                style={styles.safeArea}
            >

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
                        Loading services...
                    </Text>

                </View>

            </SafeAreaView>
        );
    }


    // =====================================================
    // STAT CARD
    // =====================================================

    const StatCard = ({
        icon,
        label,
        value,
        description,
    }) => {

        return (
            <View
                style={styles.statCard}
            >

                <View
                    style={styles.statIcon}
                >

                    <Ionicons
                        name={icon}
                        size={24}
                        color="#0f2a5f"
                    />

                </View>

                <View
                    style={styles.statContent}
                >

                    <Text
                        style={styles.statValue}
                    >
                        {value}
                    </Text>

                    <Text
                        style={styles.statLabel}
                    >
                        {label}
                    </Text>

                    {description ? (

                        <Text
                            style={
                                styles.statDescription
                            }
                        >
                            {description}
                        </Text>

                    ) : null}

                </View>

            </View>
        );
    };


    // =====================================================
    // SCREEN
    // =====================================================

    return (
        <SafeAreaView
            style={styles.safeArea}
        >

            {/* ========================================= */}
            {/* HEADER */}
            {/* ========================================= */}

            <View
                style={styles.header}
            >

                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >

                    <Ionicons
                        name="arrow-back"
                        size={24}
                        color="#ffffff"
                    />

                </TouchableOpacity>


                <View
                    style={styles.headerTextContainer}
                >

                    <Text
                        style={styles.headerTitle}
                    >
                        Attendance Report
                    </Text>

                    <Text
                        style={styles.headerSubtitle}
                    >
                        Secretary Report
                    </Text>

                </View>


                <TouchableOpacity
                    style={styles.refreshButton}
                    onPress={handleRefresh}
                >

                    <Ionicons
                        name="refresh"
                        size={23}
                        color="#ffffff"
                    />

                </TouchableOpacity>

            </View>


            {/* ========================================= */}
            {/* CONTENT */}
            {/* ========================================= */}

            <ScrollView
                style={styles.container}
                contentContainerStyle={
                    styles.content
                }
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                    />
                }
                showsVerticalScrollIndicator={false}
            >

                {/* ===================================== */}
                {/* SERVICE SELECTOR */}
                {/* ===================================== */}

                <Text
                    style={styles.sectionTitle}
                >
                    Select Service
                </Text>


                <TouchableOpacity
                    style={
                        styles.serviceSelector
                    }
                    onPress={() =>
                        setShowServices(
                            !showServices
                        )
                    }
                >

                    <View
                        style={
                            styles.serviceSelectorLeft
                        }
                    >

                        <View
                            style={styles.serviceIcon}
                        >

                            <Ionicons
                                name="calendar"
                                size={22}
                                color="#0f2a5f"
                            />

                        </View>


                        <View>

                            <Text
                                style={
                                    styles.selectorLabel
                                }
                            >
                                Service
                            </Text>

                            <Text
                                style={
                                    styles.selectorValue
                                }
                            >
                                {
                                    selectedService?.name ||
                                    "Select a service"
                                }
                            </Text>

                        </View>

                    </View>


                    <Ionicons
                        name={
                            showServices
                                ? "chevron-up"
                                : "chevron-down"
                        }
                        size={22}
                        color="#555"
                    />

                </TouchableOpacity>


                {/* ===================================== */}
                {/* SERVICE LIST */}
                {/* ===================================== */}

                {showServices && (

                    <View
                        style={styles.serviceList}
                    >

                        {services.length === 0 ? (

                            <Text
                                style={
                                    styles.emptyText
                                }
                            >
                                No services available.
                            </Text>

                        ) : (

                            services.map(
                                (service) => (

                                    <TouchableOpacity
                                        key={service._id}
                                        style={[
                                            styles.serviceItem,
                                            selectedService?._id ===
                                                service._id &&
                                                styles.selectedServiceItem,
                                        ]}
                                        onPress={() =>
                                            handleSelectService(
                                                service
                                            )
                                        }
                                    >

                                        <View>

                                            <Text
                                                style={
                                                    styles.serviceItemName
                                                }
                                            >
                                                {
                                                    service.name
                                                }
                                            </Text>

                                            <Text
                                                style={
                                                    styles.serviceItemDate
                                                }
                                            >
                                                {
                                                    service.serviceDate
                                                        ? formatDate(
                                                            service.serviceDate
                                                        )
                                                        : "Date unavailable"
                                                }
                                            </Text>

                                        </View>


                                        {
                                            selectedService?._id ===
                                            service._id && (

                                                <Ionicons
                                                    name="checkmark-circle"
                                                    size={22}
                                                    color="#0f2a5f"
                                                />

                                            )
                                        }

                                    </TouchableOpacity>

                                )
                            )

                        )}

                    </View>
                )}


                {/* ===================================== */}
                {/* ERROR */}
                {/* ===================================== */}

                {error ? (

                    <View
                        style={styles.errorBox}
                    >

                        <Ionicons
                            name="alert-circle"
                            size={22}
                            color="#b42318"
                        />

                        <Text
                            style={styles.errorText}
                        >
                            {error}
                        </Text>

                    </View>

                ) : null}


                {/* ===================================== */}
                {/* REPORT LOADING */}
                {/* ===================================== */}

                {loadingReport ? (

                    <View
                        style={styles.reportLoading}
                    >

                        <ActivityIndicator
                            size="large"
                            color="#0f2a5f"
                        />

                        <Text
                            style={styles.loadingText}
                        >
                            Preparing attendance report...
                        </Text>

                    </View>

                ) : report ? (

                    <>

                        {/* ================================= */}
                        {/* SERVICE INFORMATION */}
                        {/* ================================= */}

                        <View
                            style={styles.serviceCard}
                        >

                            <View
                                style={
                                    styles.serviceCardHeader
                                }
                            >

                                <View
                                    style={
                                        styles.serviceCardIcon
                                    }
                                >

                                    <Ionicons
                                        name="business"
                                        size={25}
                                        color="#ffffff"
                                    />

                                </View>


                                <View
                                    style={
                                        styles.serviceCardTitleArea
                                    }
                                >

                                    <Text
                                        style={
                                            styles.serviceName
                                        }
                                    >
                                        {
                                            report.service.name
                                        }
                                    </Text>

                                    <Text
                                        style={
                                            styles.serviceType
                                        }
                                    >
                                        {
                                            report.service
                                                .serviceType
                                        }
                                    </Text>

                                </View>


                                <View
                                    style={[
                                        styles.statusBadge,
                                        getStatusStyle(
                                            report.service
                                                .status
                                        ),
                                    ]}
                                >

                                    <Text
                                        style={
                                            styles.statusText
                                        }
                                    >
                                        {
                                            report.service
                                                .status
                                        }
                                    </Text>

                                </View>

                            </View>


                            <View
                                style={
                                    styles.serviceDetails
                                }
                            >

                                <View
                                    style={styles.detailRow}
                                >

                                    <Ionicons
                                        name="calendar-outline"
                                        size={19}
                                        color="#666"
                                    />

                                    <Text
                                        style={
                                            styles.detailText
                                        }
                                    >
                                        {
                                            formatDate(
                                                report.service
                                                    .date
                                            )
                                        }
                                    </Text>

                                </View>


                                <View
                                    style={styles.detailRow}
                                >

                                    <Ionicons
                                        name="time-outline"
                                        size={19}
                                        color="#666"
                                    />

                                    <Text
                                        style={
                                            styles.detailText
                                        }
                                    >

                                        {
                                            report.service
                                                .startTime ||
                                            "N/A"
                                        }

                                        {" - "}

                                        {
                                            report.service
                                                .endTime ||
                                            "N/A"
                                        }

                                    </Text>

                                </View>


                                <View
                                    style={styles.detailRow}
                                >

                                    <Ionicons
                                        name="person-outline"
                                        size={19}
                                        color="#666"
                                    />

                                    <Text
                                        style={
                                            styles.detailText
                                        }
                                    >

                                        Generated by{" "}

                                        {
                                            report.service
                                                .generatedBy
                                                ?.fullName ||
                                            "System"
                                        }

                                    </Text>

                                </View>

                            </View>

                        </View>


                        {/* ================================= */}
                        {/* ATTENDANCE OVERVIEW */}
                        {/* ================================= */}

                        <Text
                            style={styles.sectionTitle}
                        >
                            Attendance Overview
                        </Text>


                        <View
                            style={styles.statsGrid}
                        >

                            <StatCard
                                icon="man"
                                label="Male Adults"
                                value={
                                    report.attendance
                                        .maleAdults
                                }
                                description="Adult men present"
                            />


                            <StatCard
                                icon="woman"
                                label="Female Adults"
                                value={
                                    report.attendance
                                        .femaleAdults
                                }
                                description="Adult women present"
                            />


                            <StatCard
                                icon="people"
                                label="Children"
                                value={
                                    report.attendance
                                        .children
                                }
                                description="Children present"
                            />


                            <StatCard
                                icon="checkmark-circle"
                                label="Total Present"
                                value={
                                    report.attendance
                                        .totalPresent
                                }
                                description="People present"
                            />


                            <StatCard
                                icon="close-circle"
                                label="Total Absent"
                                value={
                                    report.attendance
                                        .totalAbsent
                                }
                                description="People absent"
                            />


                            <StatCard
                                icon="people-circle"
                                label="Total Members"
                                value={
                                    report.attendance
                                        .totalMembers
                                }
                                description="Active members"
                            />

                        </View>


                        {/* ================================= */}
                        {/* ATTENDANCE RATE */}
                        {/* ================================= */}

                        <View
                            style={styles.rateCard}
                        >

                            <View
                                style={styles.rateHeader}
                            >

                                <View>

                                    <Text
                                        style={
                                            styles.rateTitle
                                        }
                                    >
                                        Attendance Rate
                                    </Text>

                                    <Text
                                        style={
                                            styles.rateSubtitle
                                        }
                                    >
                                        Overall service attendance
                                    </Text>

                                </View>


                                <Text
                                    style={styles.rateValue}
                                >
                                    {
                                        Number(
                                            report.attendance
                                                .attendanceRate ||
                                            0
                                        ).toFixed(2)
                                    }%
                                </Text>

                            </View>


                            <View
                                style={
                                    styles.progressBackground
                                }
                            >

                                <View
                                    style={[
                                        styles.progressBar,
                                        {
                                            width:
                                                `${Math.min(
                                                    Number(
                                                        report.attendance
                                                            .attendanceRate ||
                                                        0
                                                    ),
                                                    100
                                                )}%`,
                                        },
                                    ]}
                                />

                            </View>


                            <View
                                style={styles.rateFooter}
                            >

                                <Text
                                    style={
                                        styles.rateFooterText
                                    }
                                >
                                    {
                                        report.attendance
                                            .totalPresent
                                    } present
                                </Text>


                                <Text
                                    style={
                                        styles.rateFooterText
                                    }
                                >
                                    {
                                        report.attendance
                                            .totalMembers
                                    } members
                                </Text>

                            </View>

                        </View>


                        {/* ================================= */}
                        {/* REPORT SUMMARY */}
                        {/* ================================= */}

                        <View
                            style={styles.summaryCard}
                        >

                            <View
                                style={styles.summaryHeader}
                            >

                                <Ionicons
                                    name="document-text-outline"
                                    size={22}
                                    color="#0f2a5f"
                                />

                                <Text
                                    style={
                                        styles.summaryTitle
                                    }
                                >
                                    Report Summary
                                </Text>

                            </View>


                            <Text
                                style={styles.summaryText}
                            >

                                {
                                    report.attendance
                                        .totalPresent
                                }
                                {" "}of{" "}
                                {
                                    report.attendance
                                        .totalMembers
                                }
                                {" "}members attended{" "}
                                {
                                    report.service.name
                                }.
                                {" "}

                                The attendance rate was{" "}

                                {
                                    Number(
                                        report.attendance
                                            .attendanceRate ||
                                        0
                                    ).toFixed(2)
                                }%.

                            </Text>

                        </View>

                    </>

                ) : (

                    <View
                        style={styles.emptyReport}
                    >

                        <Ionicons
                            name="document-text-outline"
                            size={55}
                            color="#b0b7c3"
                        />

                        <Text
                            style={
                                styles.emptyReportTitle
                            }
                        >
                            No Report Available
                        </Text>

                        <Text
                            style={
                                styles.emptyReportText
                            }
                        >
                            Select a service to view its
                            attendance report.
                        </Text>

                    </View>

                )}

            </ScrollView>

        </SafeAreaView>
    );
}


// =====================================================
// STYLES
// =====================================================

const styles = StyleSheet.create({

    safeArea: {
        flex: 1,
        backgroundColor: "#f4f6fb",
    },

    container: {
        flex: 1,
    },

    content: {
        padding: 16,
        paddingBottom: 40,
    },


    // =================================================
    // HEADER
    // =================================================

    header: {
        height: 72,
        backgroundColor: "#0f2a5f",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
    },

    backButton: {
        width: 42,
        height: 42,
        borderRadius: 21,
        justifyContent: "center",
        alignItems: "center",
    },

    headerTextContainer: {
        flex: 1,
        marginLeft: 8,
    },

    headerTitle: {
        color: "#ffffff",
        fontSize: 20,
        fontWeight: "700",
    },

    headerSubtitle: {
        color: "#d8e2f3",
        fontSize: 13,
        marginTop: 2,
    },

    refreshButton: {
        width: 42,
        height: 42,
        borderRadius: 21,
        justifyContent: "center",
        alignItems: "center",
    },


    // =================================================
    // SECTION
    // =================================================

    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#172033",
        marginBottom: 12,
        marginTop: 8,
    },


    // =================================================
    // SERVICE SELECTOR
    // =================================================

    serviceSelector: {
        backgroundColor: "#ffffff",
        borderRadius: 14,
        padding: 14,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderWidth: 1,
        borderColor: "#e1e5eb",
        marginBottom: 8,
    },

    serviceSelectorLeft: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },

    serviceIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: "#edf2fa",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },

    selectorLabel: {
        color: "#7a8494",
        fontSize: 12,
        marginBottom: 3,
    },

    selectorValue: {
        color: "#172033",
        fontSize: 16,
        fontWeight: "600",
    },


    // =================================================
    // SERVICE LIST
    // =================================================

    serviceList: {
        backgroundColor: "#ffffff",
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "#e1e5eb",
        marginBottom: 18,
        overflow: "hidden",
    },

    serviceItem: {
        padding: 15,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottomWidth: 1,
        borderBottomColor: "#edf0f4",
    },

    selectedServiceItem: {
        backgroundColor: "#f0f4fb",
    },

    serviceItemName: {
        fontSize: 15,
        fontWeight: "600",
        color: "#172033",
    },

    serviceItemDate: {
        fontSize: 13,
        color: "#7a8494",
        marginTop: 4,
    },


    // =================================================
    // ERROR
    // =================================================

    errorBox: {
        backgroundColor: "#fff1f0",
        borderWidth: 1,
        borderColor: "#f5c2c0",
        borderRadius: 12,
        padding: 13,
        flexDirection: "row",
        alignItems: "center",
        marginTop: 10,
        marginBottom: 15,
    },

    errorText: {
        color: "#b42318",
        fontSize: 14,
        marginLeft: 9,
        flex: 1,
    },


    // =================================================
    // SERVICE CARD
    // =================================================

    serviceCard: {
        backgroundColor: "#ffffff",
        borderRadius: 16,
        marginTop: 14,
        marginBottom: 24,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "#e1e5eb",
    },

    serviceCardHeader: {
        backgroundColor: "#0f2a5f",
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
    },

    serviceCardIcon: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: "rgba(255,255,255,0.16)",
        justifyContent: "center",
        alignItems: "center",
    },

    serviceCardTitleArea: {
        flex: 1,
        marginLeft: 12,
    },

    serviceName: {
        color: "#ffffff",
        fontSize: 17,
        fontWeight: "700",
    },

    serviceType: {
        color: "#d7e1f1",
        fontSize: 13,
        marginTop: 3,
    },

    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
        marginLeft: 8,
    },

    statusActive: {
        backgroundColor: "#d1fadf",
    },

    statusCompleted: {
        backgroundColor: "#e0e7ff",
    },

    statusCancelled: {
        backgroundColor: "#fee4e2",
    },

    statusScheduled: {
        backgroundColor: "#fef0c7",
    },

    statusText: {
        fontSize: 11,
        fontWeight: "700",
        color: "#172033",
    },

    serviceDetails: {
        padding: 16,
    },

    detailRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },

    detailText: {
        color: "#596273",
        fontSize: 14,
        marginLeft: 10,
        flex: 1,
    },


    // =================================================
    // STATS
    // =================================================

    statsGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },

    statCard: {
        width: "48%",
        backgroundColor: "#ffffff",
        borderRadius: 15,
        padding: 14,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#e1e5eb",
        flexDirection: "row",
        alignItems: "center",
    },

    statIcon: {
        width: 42,
        height: 42,
        borderRadius: 12,
        backgroundColor: "#edf2fa",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 9,
    },

    statContent: {
        flex: 1,
    },

    statValue: {
        fontSize: 22,
        fontWeight: "800",
        color: "#172033",
    },

    statLabel: {
        fontSize: 12,
        fontWeight: "700",
        color: "#4d5868",
        marginTop: 1,
    },

    statDescription: {
        fontSize: 10,
        color: "#8a93a1",
        marginTop: 2,
    },


    // =================================================
    // RATE
    // =================================================

    rateCard: {
        backgroundColor: "#ffffff",
        borderRadius: 16,
        padding: 18,
        marginTop: 12,
        borderWidth: 1,
        borderColor: "#e1e5eb",
    },

    rateHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    rateTitle: {
        fontSize: 17,
        fontWeight: "700",
        color: "#172033",
    },

    rateSubtitle: {
        fontSize: 12,
        color: "#7a8494",
        marginTop: 3,
    },

    rateValue: {
        fontSize: 27,
        fontWeight: "800",
        color: "#0f2a5f",
    },

    progressBackground: {
        height: 10,
        backgroundColor: "#e8ecf2",
        borderRadius: 10,
        marginTop: 18,
        overflow: "hidden",
    },

    progressBar: {
        height: "100%",
        backgroundColor: "#0f2a5f",
        borderRadius: 10,
    },

    rateFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 8,
    },

    rateFooterText: {
        color: "#7a8494",
        fontSize: 12,
    },


    // =================================================
    // SUMMARY
    // =================================================

    summaryCard: {
        backgroundColor: "#ffffff",
        borderRadius: 16,
        padding: 18,
        marginTop: 14,
        borderWidth: 1,
        borderColor: "#e1e5eb",
    },

    summaryHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },

    summaryTitle: {
        color: "#172033",
        fontSize: 16,
        fontWeight: "700",
        marginLeft: 9,
    },

    summaryText: {
        color: "#596273",
        fontSize: 14,
        lineHeight: 21,
    },


    // =================================================
    // LOADING
    // =================================================

    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 30,
    },

    reportLoading: {
        minHeight: 220,
        justifyContent: "center",
        alignItems: "center",
    },

    loadingText: {
        color: "#687386",
        fontSize: 14,
        marginTop: 10,
    },


    // =================================================
    // ACCESS DENIED
    // =================================================

    accessDeniedContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 35,
    },

    accessDeniedIcon: {
        width: 86,
        height: 86,
        borderRadius: 43,
        backgroundColor: "#fff1f0",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
    },

    accessDeniedTitle: {
        fontSize: 24,
        fontWeight: "800",
        color: "#172033",
        marginBottom: 10,
    },

    accessDeniedText: {
        fontSize: 15,
        color: "#687386",
        textAlign: "center",
        lineHeight: 22,
        marginBottom: 25,
    },

    backHomeButton: {
        backgroundColor: "#0f2a5f",
        paddingHorizontal: 25,
        paddingVertical: 13,
        borderRadius: 10,
    },

    backHomeButtonText: {
        color: "#ffffff",
        fontSize: 15,
        fontWeight: "700",
    },


    // =================================================
    // EMPTY
    // =================================================

    emptyText: {
        padding: 18,
        textAlign: "center",
        color: "#7a8494",
    },

    emptyReport: {
        backgroundColor: "#ffffff",
        borderRadius: 16,
        padding: 35,
        marginTop: 20,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#e1e5eb",
    },

    emptyReportTitle: {
        color: "#172033",
        fontSize: 18,
        fontWeight: "700",
        marginTop: 14,
    },

    emptyReportText: {
        color: "#7a8494",
        fontSize: 14,
        textAlign: "center",
        lineHeight: 21,
        marginTop: 6,
    },

});