import React, {
    useCallback,
    useState,
} from "react";

import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
} from "react-native";

import {
    useLocalSearchParams,
    useRouter,
    useFocusEffect,
} from "expo-router";

import {
    useSelector,
} from "react-redux";

import api from "../../api/axios";


// =====================================================
// FOLLOW UP DETAILS
// =====================================================

export default function FollowUpDetailsScreen() {

    const router = useRouter();

    const { id } =
        useLocalSearchParams();

    const user =
        useSelector(
            state => state.auth.user
        );


    // =================================================
    // STATE
    // =================================================

    const [
        followUp,
        setFollowUp,
    ] = useState(null);

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        updating,
        setUpdating,
    ] = useState(false);

    const [
        error,
        setError,
    ] = useState("");


    // =================================================
    // ROLE
    // =================================================

    const userRole =
        String(
            user?.role ||
            user?.userType ||
            user?.membershipRole ||
            ""
        )
            .trim()
            .toLowerCase();

    // =================================================
    // FOLLOW-UP MANAGEMENT ACCESS
    // =================================================
    // Admin, Pastor, Leader and Secretary
    // can manage follow-ups.

    const canManageFollowUps =
        [
            "admin",
            "pastor",
            "leader",
            "secretary",
        ].includes(userRole);


    // =================================================
    // FETCH FOLLOW UP
    // =================================================

    const fetchFollowUp =
        useCallback(
            async () => {

                if (!id) {

                    setError(
                        "Follow up ID is missing."
                    );

                    setLoading(false);

                    return;
                }

                try {

                    setLoading(true);

                    setError("");

                    const response =
                        await api.get(
                            `/followups/${id}`
                        );

                    setFollowUp(
                        response.data.followUp
                    );

                }
                catch (err) {

                    console.error(
                        "Fetch Follow Up Error:",
                        err
                    );

                    setError(
                        err?.response?.data?.message ||
                        "Unable to load follow up."
                    );

                }
                finally {

                    setLoading(false);

                }

            },
            [id]
        );


    // =================================================
    // REFRESH WHEN SCREEN OPENS
    // =================================================

    useFocusEffect(
        useCallback(
            () => {

                fetchFollowUp();

            },
            [fetchFollowUp]
        )
    );


    // =================================================
    // UPDATE STATUS
    // =================================================

    const updateStatus =
        async (status) => {

            if (!followUp?._id) {
                return;
            }

            try {

                setUpdating(true);

                const response =
                    await api.patch(
                        `/followups/${followUp._id}`,
                        {
                            status,
                        }
                    );

                setFollowUp(
                    response.data.followUp
                );

                Alert.alert(
                    "Success",
                    `Follow up marked as ${status}.`
                );

            }
            catch (err) {

                console.error(
                    "Update Follow Up Error:",
                    err
                );

                Alert.alert(
                    "Update Failed",
                    err?.response?.data?.message ||
                    "Unable to update follow up."
                );

            }
            finally {

                setUpdating(false);

            }
        };


    // =================================================
    // CONFIRM STATUS UPDATE
    // =================================================

    const confirmStatusUpdate =
        (status) => {

            const message =
                status === "Contacted"
                    ? "Mark this follow up as contacted?"
                    : "Mark this follow up as completed?";

            Alert.alert(
                "Confirm",
                message,
                [
                    {
                        text: "Cancel",
                        style: "cancel",
                    },
                    {
                        text: "Confirm",
                        onPress: () =>
                            updateStatus(status),
                    },
                ]
            );
        };


    // =================================================
    // HELPERS
    // =================================================

    const getMemberName =
        () => {

            if (!followUp?.member) {
                return "Unknown Member";
            }

            return [
                followUp.member.firstName,
                followUp.member.lastName,
            ]
                .filter(Boolean)
                .join(" ");
        };


    const getAssignedToName =
        () => {

            if (!followUp?.assignedTo) {
                return "Not Assigned";
            }

            return [
                followUp.assignedTo.firstName,
                followUp.assignedTo.lastName,
            ]
                .filter(Boolean)
                .join(" ");
        };


    const formatDate =
        (date) => {

            if (!date) {
                return "Not available";
            }

            const parsedDate =
                new Date(date);

            if (
                Number.isNaN(
                    parsedDate.getTime()
                )
            ) {
                return "Not available";
            }

            return parsedDate.toLocaleDateString(
                "en-GB",
                {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                }
            );
        };


    const getStatusStyle =
        (status) => {

            switch (status) {

                case "Completed":
                    return styles.statusCompleted;

                case "Contacted":
                    return styles.statusContacted;

                case "Unable To Reach":
                    return styles.statusUnable;

                default:
                    return styles.statusPending;
            }
        };


    const getPriorityStyle =
        (priority) => {

            switch (priority) {

                case "High":
                    return styles.priorityHigh;

                case "Medium":
                    return styles.priorityMedium;

                default:
                    return styles.priorityLow;
            }
        };


    // =================================================
    // LOADING
    // =================================================

    if (loading) {

        return (
            <View style={styles.centerContainer}>

                <ActivityIndicator
                    size="large"
                />

                <Text style={styles.loadingText}>
                    Loading follow up...
                </Text>

            </View>
        );
    }


    // =================================================
    // ERROR
    // =================================================

    if (error || !followUp) {

        return (
            <View style={styles.centerContainer}>

                <Text style={styles.errorTitle}>
                    Unable to Load Follow Up
                </Text>

                <Text style={styles.errorText}>
                    {error ||
                        "Follow up not found."}
                </Text>

                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() =>
                        router.replace(
                            "/followups"
                        )
                    }
                >
                    <Text style={styles.backButtonText}>
                        Back to Follow Ups
                    </Text>
                </TouchableOpacity>

            </View>
        );
    }


    // =================================================
    // SCREEN
    // =================================================

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={
                styles.contentContainer
            }
        >

            {/* =========================================
                HEADER
            ========================================= */}

            <View style={styles.header}>

                <TouchableOpacity
                    onPress={() =>
                        router.replace(
                            "/followups"
                        )
                    }
                    activeOpacity={0.7}
                >
                    <Text style={styles.backText}>
                        ← Back
                    </Text>
                </TouchableOpacity>

                <Text style={styles.title}>
                    Follow Up Details
                </Text>

                <Text style={styles.subtitle}>
                    Review member follow-up information
                </Text>

            </View>


            {/* =========================================
                MEMBER
            ========================================= */}

            <View style={styles.card}>

                <Text style={styles.sectionTitle}>
                    Member
                </Text>

                <Text style={styles.memberName}>
                    {getMemberName()}
                </Text>

                {followUp.member?.phone && (
                    <Text style={styles.secondaryText}>
                        {followUp.member.phone}
                    </Text>
                )}

                {followUp.member?.email && (
                    <Text style={styles.secondaryText}>
                        {followUp.member.email}
                    </Text>
                )}

            </View>


            {/* =========================================
                SERVICE
            ========================================= */}

            <View style={styles.card}>

                <Text style={styles.sectionTitle}>
                    Missed Service
                </Text>

                <Text style={styles.primaryText}>
                    {followUp.service?.name ||
                        "Unknown Service"}
                </Text>

                <Text style={styles.secondaryText}>
                    {formatDate(
                        followUp.service?.serviceDate
                    )}
                </Text>

                {followUp.service?.serviceType && (
                    <Text style={styles.secondaryText}>
                        {followUp.service.serviceType}
                    </Text>
                )}

            </View>


            {/* =========================================
                FOLLOW UP INFORMATION
            ========================================= */}

            <View style={styles.card}>

                <Text style={styles.sectionTitle}>
                    Follow Up Information
                </Text>


                <View style={styles.infoRow}>

                    <Text style={styles.infoLabel}>
                        Type
                    </Text>

                    <Text style={styles.infoValue}>
                        {followUp.type ||
                            "Not specified"}
                    </Text>

                </View>


                <View style={styles.infoRow}>

                    <Text style={styles.infoLabel}>
                        Priority
                    </Text>

                    <View
                        style={[
                            styles.badge,
                            getPriorityStyle(
                                followUp.priority
                            ),
                        ]}
                    >

                        <Text style={styles.badgeText}>
                            {followUp.priority ||
                                "Low"}
                        </Text>

                    </View>

                </View>


                <View style={styles.infoRow}>

                    <Text style={styles.infoLabel}>
                        Status
                    </Text>

                    <View
                        style={[
                            styles.badge,
                            getStatusStyle(
                                followUp.status
                            ),
                        ]}
                    >

                        <Text style={styles.badgeText}>
                            {followUp.status ||
                                "Pending"}
                        </Text>

                    </View>

                </View>


                <View style={styles.infoRow}>

                    <Text style={styles.infoLabel}>
                        Assigned To
                    </Text>

                    <Text style={styles.infoValue}>
                        {getAssignedToName()}
                    </Text>

                </View>


                {followUp.followUpDate && (
                    <View style={styles.infoRow}>

                        <Text style={styles.infoLabel}>
                            Follow Up Date
                        </Text>

                        <Text style={styles.infoValue}>
                            {formatDate(
                                followUp.followUpDate
                            )}
                        </Text>

                    </View>
                )}

            </View>


            {/* =========================================
                NOTES
            ========================================= */}

            <View style={styles.card}>

                <Text style={styles.sectionTitle}>
                    Notes
                </Text>

                <Text style={styles.notesText}>
                    {followUp.notes ||
                        "No notes have been added."}
                </Text>

            </View>


            {/* =========================================
                OUTCOME
            ========================================= */}

            {followUp.outcome && (
                <View style={styles.card}>

                    <Text style={styles.sectionTitle}>
                        Outcome
                    </Text>

                    <Text style={styles.notesText}>
                        {followUp.outcome}
                    </Text>

                </View>
            )}


            {/* =========================================
                DATES
            ========================================= */}

            {(followUp.contactedDate ||
                followUp.completedDate) && (

                <View style={styles.card}>

                    <Text style={styles.sectionTitle}>
                        Follow Up History
                    </Text>


                    {followUp.contactedDate && (
                        <View style={styles.infoRow}>

                            <Text style={styles.infoLabel}>
                                Contacted
                            </Text>

                            <Text style={styles.infoValue}>
                                {formatDate(
                                    followUp.contactedDate
                                )}
                            </Text>

                        </View>
                    )}


                    {followUp.completedDate && (
                        <View style={styles.infoRow}>

                            <Text style={styles.infoLabel}>
                                Completed
                            </Text>

                            <Text style={styles.infoValue}>
                                {formatDate(
                                    followUp.completedDate
                                )}
                            </Text>

                        </View>
                    )}

                </View>
            )}


            {/* =========================================
                MANAGEMENT ACTIONS
            ========================================= */}

            {canManageFollowUps && (
                <View style={styles.actionsCard}>

                    <Text style={styles.sectionTitle}>
                        Manage Follow Up
                    </Text>


                    {/* =================================
                        MARK CONTACTED
                    ================================= */}

                    {followUp.status !== "Contacted" &&
                        followUp.status !== "Completed" && (

                        <TouchableOpacity
                            style={[
                                styles.actionButton,
                                styles.contactButton,
                            ]}
                            disabled={updating}
                            activeOpacity={0.8}
                            onPress={() =>
                                confirmStatusUpdate(
                                    "Contacted"
                                )
                            }
                        >

                            {updating ? (
                                <ActivityIndicator
                                    color="#ffffff"
                                />
                            ) : (
                                <Text
                                    style={
                                        styles.actionButtonText
                                    }
                                >
                                    Mark Contacted
                                </Text>
                            )}

                        </TouchableOpacity>
                    )}


                    {/* =================================
                        COMPLETE FOLLOW UP
                    ================================= */}

                    {followUp.status !== "Completed" && (

                        <TouchableOpacity
                            style={[
                                styles.actionButton,
                                styles.completeButton,
                            ]}
                            disabled={updating}
                            activeOpacity={0.8}
                            onPress={() =>
                                confirmStatusUpdate(
                                    "Completed"
                                )
                            }
                        >

                            {updating ? (
                                <ActivityIndicator
                                    color="#ffffff"
                                />
                            ) : (
                                <Text
                                    style={
                                        styles.actionButtonText
                                    }
                                >
                                    Complete Follow Up
                                </Text>
                            )}

                        </TouchableOpacity>
                    )}

                </View>
            )}

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

    contentContainer: {
        padding: 20,
        paddingBottom: 40,
    },

    centerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 30,
        backgroundColor: "#f4f6fb",
    },

    loadingText: {
        marginTop: 12,
        fontSize: 15,
        color: "#666666",
    },

    errorTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#222222",
        textAlign: "center",
        marginBottom: 10,
    },

    errorText: {
        fontSize: 15,
        color: "#777777",
        textAlign: "center",
        marginBottom: 20,
    },

    header: {
        marginBottom: 20,
    },

    backText: {
        marginTop: 20,
        fontSize: 16,
        fontWeight: "600",
        color: "#0f2a5f",
        marginBottom: 15,
    },

    title: {
        fontSize: 28,
        fontWeight: "800",
        color: "#1f2937",
    },

    subtitle: {
        fontSize: 14,
        color: "#6b7280",
        marginTop: 5,
    },

    card: {
        backgroundColor: "#ffffff",
        borderRadius: 14,
        padding: 18,
        marginBottom: 15,
        elevation: 2,
        shadowColor: "#000000",
        shadowOpacity: 0.06,
        shadowRadius: 5,
        shadowOffset: {
            width: 0,
            height: 2,
        },
    },

    sectionTitle: {
        fontSize: 17,
        fontWeight: "700",
        color: "#1f2937",
        marginBottom: 14,
    },

    memberName: {
        fontSize: 21,
        fontWeight: "700",
        color: "#111827",
        marginBottom: 5,
    },

    primaryText: {
        fontSize: 18,
        fontWeight: "700",
        color: "#111827",
        marginBottom: 5,
    },

    secondaryText: {
        fontSize: 14,
        color: "#6b7280",
        marginTop: 3,
    },

    infoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#eeeeee",
    },

    infoLabel: {
        fontSize: 14,
        fontWeight: "600",
        color: "#6b7280",
        flex: 1,
    },

    infoValue: {
        fontSize: 14,
        fontWeight: "600",
        color: "#111827",
        flex: 1.5,
        textAlign: "right",
    },

    badge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },

    badgeText: {
        color: "#ffffff",
        fontSize: 12,
        fontWeight: "700",
    },

    statusPending: {
        backgroundColor: "#f59e0b",
    },

    statusContacted: {
        backgroundColor: "#2563eb",
    },

    statusCompleted: {
        backgroundColor: "#16a34a",
    },

    statusUnable: {
        backgroundColor: "#dc2626",
    },

    priorityLow: {
        backgroundColor: "#16a34a",
    },

    priorityMedium: {
        backgroundColor: "#f59e0b",
    },

    priorityHigh: {
        backgroundColor: "#dc2626",
    },

    notesText: {
        fontSize: 15,
        lineHeight: 23,
        color: "#4b5563",
    },

    actionsCard: {
        backgroundColor: "#ffffff",
        borderRadius: 14,
        padding: 18,
        marginBottom: 15,
    },

    actionButton: {
        minHeight: 52,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
    },

    contactButton: {
        backgroundColor: "#2563eb",
    },

    completeButton: {
        backgroundColor: "#16a34a",
    },

    actionButtonText: {
        color: "#ffffff",
        fontSize: 15,
        fontWeight: "700",
    },

    backButton: {
        backgroundColor: "#0f2a5f",
        paddingHorizontal: 20,
        paddingVertical: 13,
        borderRadius: 10,
    },

    backButtonText: {
        color: "#ffffff",
        fontSize: 15,
        fontWeight: "700",
    },

});