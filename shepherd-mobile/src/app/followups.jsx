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
    RefreshControl,
    ActivityIndicator,
} from "react-native";

import {
    useFocusEffect,
    useRouter,
} from "expo-router";

import {
    useSelector,
} from "react-redux";

import api from "../api/axios";


// =====================================================
// FOLLOW UPS SCREEN
// =====================================================

export default function FollowUpsScreen() {

    const router = useRouter();


    // =================================================
    // CURRENT USER
    // =================================================

    const user = useSelector(
        (state) => state.auth.user
    );


    const userRole = String(
        user?.role || ""
    )
        .trim()
        .toLowerCase();


    // =================================================
    // PERMISSIONS
    // =================================================

    const canManageFollowUps = [
        "admin",
        "pastor",
        "leader",
    ].includes(userRole);


    const canViewFollowUps = [
        "admin",
        "pastor",
        "leader",
        "secretary",
    ].includes(userRole);


    // =================================================
    // STATE
    // =================================================

    const [followUps, setFollowUps] = useState([]);

    const [stats, setStats] = useState({
        pending: 0,
        completed: 0,
        overdue: 0,
    });

    const [loading, setLoading] = useState(true);

    const [refreshing, setRefreshing] = useState(false);


    // =================================================
    // FETCH FOLLOW UPS
    // =================================================

    const fetchFollowUps = async () => {

        try {

            const response = await api.get(
                "/followups"
            );

            setFollowUps(
                response.data?.followUps || []
            );

        } catch (error) {

            console.log(
                "FOLLOW UPS ERROR:",
                error.response?.data ||
                error.message
            );

            setFollowUps([]);

        }

    };


    // =================================================
    // FETCH STATS
    // =================================================

    const fetchStats = async () => {

        try {

            const response = await api.get(
                "/followups/stats"
            );

            setStats(
                response.data?.stats || {
                    pending: 0,
                    completed: 0,
                    overdue: 0,
                }
            );

        } catch (error) {

            console.log(
                "FOLLOW UP STATS ERROR:",
                error.response?.data ||
                error.message
            );

        }

    };


    // =================================================
    // LOAD DATA
    // =================================================

    const loadData = async () => {

        try {

            setLoading(true);

            await Promise.all([
                fetchFollowUps(),
                fetchStats(),
            ]);

        } catch (error) {

            console.log(
                "FOLLOW UP LOAD ERROR:",
                error
            );

        } finally {

            setLoading(false);

        }

    };


    // =================================================
    // REFRESH
    // =================================================

    const refreshData = async () => {

        try {

            setRefreshing(true);

            await Promise.all([
                fetchFollowUps(),
                fetchStats(),
            ]);

        } catch (error) {

            console.log(
                "FOLLOW UP REFRESH ERROR:",
                error
            );

        } finally {

            setRefreshing(false);

        }

    };


    // =================================================
    // LOAD WHEN SCREEN OPENS
    // =================================================

    useFocusEffect(
        useCallback(() => {

            if (canViewFollowUps) {

                loadData();

            }

        }, [canViewFollowUps])
    );


    // =================================================
    // GO BACK TO PROFILE
    // =================================================

    const handleBack = () => {

        console.log(
            "FOLLOW UPS: GOING BACK TO PROFILE"
        );

        router.back();

    };


    // =================================================
    // OPEN FOLLOW UP
    // =================================================

    const openFollowUp = (id) => {

        if (!id) {
            return;
        }

        router.push(
            `/followups/${id}`
        );

    };


    // =================================================
    // ACCESS DENIED
    // =================================================

    if (!canViewFollowUps) {

        return (

            <View
                style={styles.centerContainer}
            >

                <TouchableOpacity
                    style={styles.backButton}
                    onPress={handleBack}
                    activeOpacity={0.7}
                >

                    <Text
                        style={styles.backButtonText}
                    >
                        ← Back to Profile
                    </Text>

                </TouchableOpacity>


                <Text
                    style={styles.accessIcon}
                >
                    🔒
                </Text>


                <Text
                    style={styles.accessTitle}
                >
                    Access Denied
                </Text>


                <Text
                    style={styles.accessText}
                >
                    You do not have permission
                    to view follow-ups.
                </Text>

            </View>

        );

    }


    // =================================================
    // LOADING
    // =================================================

    if (loading) {

        return (

            <View
                style={styles.centerContainer}
            >

                <TouchableOpacity
                    style={styles.backButton}
                    onPress={handleBack}
                    activeOpacity={0.7}
                >

                    <Text
                        style={styles.backButtonText}
                    >
                        ← Back to Profile
                    </Text>

                </TouchableOpacity>


                <ActivityIndicator
                    size="large"
                    color="#3157a5"
                />


                <Text
                    style={styles.loadingText}
                >
                    Loading follow-ups...
                </Text>

            </View>

        );

    }


    // =================================================
    // RENDER
    // =================================================

    return (

        <View
            style={styles.container}
        >

            <ScrollView
                contentContainerStyle={
                    styles.content
                }
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={refreshData}
                    />
                }
                showsVerticalScrollIndicator={false}
            >

                {/* =================================
                    BACK BUTTON
                ================================= */}

                <TouchableOpacity
                    style={styles.backButton}
                    onPress={handleBack}
                    activeOpacity={0.7}
                >

                    <Text
                        style={styles.backButtonText}
                    >
                        ← Back to Profile
                    </Text>

                </TouchableOpacity>


                {/* =================================
                    HEADER
                ================================= */}

                <View
                    style={styles.header}
                >

                    <Text
                        style={styles.title}
                    >
                        Follow Up Management
                    </Text>


                    <Text
                        style={styles.subtitle}
                    >
                        Track and manage members
                        requiring follow-up
                    </Text>

                </View>


                {/* =================================
                    STATISTICS
                ================================= */}

                <View
                    style={styles.statsContainer}
                >

                    <StatCard
                        title="Pending"
                        value={stats.pending}
                    />


                    <StatCard
                        title="Completed"
                        value={stats.completed}
                    />


                    <StatCard
                        title="Overdue"
                        value={stats.overdue}
                    />

                </View>


                {/* =================================
                    SECTION HEADER
                ================================= */}

                <View
                    style={styles.sectionHeader}
                >

                    <Text
                        style={styles.sectionTitle}
                    >
                        Follow Ups
                    </Text>


                    <Text
                        style={styles.countText}
                    >
                        {followUps.length} total
                    </Text>

                </View>


                {/* =================================
                    EMPTY STATE
                ================================= */}

                {followUps.length === 0 ? (

                    <View
                        style={styles.emptyCard}
                    >

                        <Text
                            style={styles.emptyIcon}
                        >
                            ✓
                        </Text>


                        <Text
                            style={styles.emptyTitle}
                        >
                            No Follow Ups
                        </Text>


                        <Text
                            style={styles.emptyText}
                        >
                            There are currently no
                            follow-ups to display.
                        </Text>

                    </View>

                ) : (

                    followUps.map((item) => (

                        <FollowUpCard
                            key={item._id}
                            item={item}
                            onPress={() =>
                                openFollowUp(
                                    item._id
                                )
                            }
                            canManage={
                                canManageFollowUps
                            }
                        />

                    ))

                )}

            </ScrollView>

        </View>

    );

}


// =====================================================
// STAT CARD
// =====================================================

const StatCard = ({
    title,
    value,
}) => {

    return (

        <View
            style={styles.statCard}
        >

            <Text
                style={styles.statTitle}
            >
                {title}
            </Text>


            <Text
                style={styles.statValue}
            >
                {value}
            </Text>

        </View>

    );

};


// =====================================================
// FOLLOW UP CARD
// =====================================================

const FollowUpCard = ({
    item,
    onPress,
    canManage,
}) => {

    const memberName = [
        item.member?.firstName,
        item.member?.lastName,
    ]
        .filter(Boolean)
        .join(" ");


    const assignedToName = [
        item.assignedTo?.firstName,
        item.assignedTo?.lastName,
    ]
        .filter(Boolean)
        .join(" ");


    const serviceName =
        item.service?.name ||
        "Unknown Service";


    return (

        <View
            style={styles.followUpCard}
        >

            {/* =================================
                MEMBER
            ================================= */}

            <View
                style={styles.memberSection}
            >

                <View
                    style={styles.avatar}
                >

                    <Text
                        style={styles.avatarText}
                    >

                        {item.member?.firstName
                            ?.charAt(0)
                            ?.toUpperCase() || "?"}

                    </Text>

                </View>


                <View
                    style={styles.memberInfo}
                >

                    <Text
                        style={styles.memberName}
                    >
                        {memberName ||
                            "Unknown Member"}
                    </Text>


                    <Text
                        style={styles.serviceName}
                    >
                        {serviceName}
                    </Text>

                </View>

            </View>


            {/* =================================
                INFORMATION
            ================================= */}

            <View
                style={styles.infoContainer}
            >

                <InfoRow
                    label="Priority"
                    value={
                        item.priority ||
                        "Medium"
                    }
                    priority
                />


                <InfoRow
                    label="Status"
                    value={
                        item.status ||
                        "Pending"
                    }
                />


                <InfoRow
                    label="Assigned To"
                    value={
                        assignedToName ||
                        "Not assigned"
                    }
                />


                {item.type ? (

                    <InfoRow
                        label="Method"
                        value={item.type}
                    />

                ) : null}

            </View>


            {/* =================================
                ACTION
            ================================= */}

            <TouchableOpacity
                style={styles.viewButton}
                onPress={onPress}
                activeOpacity={0.8}
            >

                <Text
                    style={styles.viewButtonText}
                >

                    {canManage
                        ? "View / Manage"
                        : "View"}

                </Text>

            </TouchableOpacity>

        </View>

    );

};


// =====================================================
// INFO ROW
// =====================================================

const InfoRow = ({
    label,
    value,
    priority = false,
}) => {

    return (

        <View
            style={styles.infoRow}
        >

            <Text
                style={styles.infoLabel}
            >
                {label}
            </Text>


            {priority ? (

                <View
                    style={[
                        styles.priorityBadge,
                        getPriorityStyle(value),
                    ]}
                >

                    <Text
                        style={styles.priorityText}
                    >
                        {value}
                    </Text>

                </View>

            ) : (

                <Text
                    style={styles.infoValue}
                >
                    {value}
                </Text>

            )}

        </View>

    );

};


// =====================================================
// PRIORITY STYLE
// =====================================================

const getPriorityStyle = (priority) => {

    switch (
        String(priority).toLowerCase()
    ) {

        case "high":

            return styles.highPriority;


        case "low":

            return styles.lowPriority;


        case "medium":

        default:

            return styles.mediumPriority;

    }

};


// =====================================================
// STYLES
// =====================================================

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#f5f7fb",
    },


    content: {
        padding: 20,
        paddingBottom: 40,
    },


    // =================================================
    // BACK BUTTON
    // =================================================

    backButton: {
        marginTop: 20,
        alignSelf: "flex-start",
        paddingVertical: 8,
        paddingHorizontal: 4,
        marginBottom: 12,
    },


    backButtonText: {
        fontSize: 16,
        fontWeight: "700",
        color: "#3157a5",
    },


    // =================================================
    // HEADER
    // =================================================

    header: {
        marginBottom: 24,
    },


    title: {
        fontSize: 26,
        fontWeight: "700",
        color: "#172033",
        marginBottom: 6,
    },


    subtitle: {
        fontSize: 14,
        color: "#6b7280",
        lineHeight: 20,
    },


    // =================================================
    // STATISTICS
    // =================================================

    statsContainer: {
        flexDirection: "row",
        gap: 10,
        marginBottom: 28,
    },


    statCard: {
        flex: 1,
        backgroundColor: "#ffffff",
        borderRadius: 14,
        padding: 16,
        minHeight: 95,
        justifyContent: "center",

        elevation: 2,

        shadowOpacity: 0.06,
        shadowRadius: 5,

        shadowOffset: {
            width: 0,
            height: 2,
        },
    },


    statTitle: {
        fontSize: 13,
        color: "#6b7280",
        marginBottom: 8,
    },


    statValue: {
        fontSize: 28,
        fontWeight: "700",
        color: "#172033",
    },


    // =================================================
    // SECTION HEADER
    // =================================================

    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 14,
    },


    sectionTitle: {
        fontSize: 21,
        fontWeight: "700",
        color: "#172033",
    },


    countText: {
        fontSize: 13,
        color: "#6b7280",
    },


    // =================================================
    // FOLLOW UP CARD
    // =================================================

    followUpCard: {
        backgroundColor: "#ffffff",
        borderRadius: 16,
        padding: 18,
        marginBottom: 16,

        elevation: 2,

        shadowOpacity: 0.06,
        shadowRadius: 5,

        shadowOffset: {
            width: 0,
            height: 2,
        },
    },


    memberSection: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 18,
    },


    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#e8eefc",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },


    avatarText: {
        fontSize: 18,
        fontWeight: "700",
        color: "#3157a5",
    },


    memberInfo: {
        flex: 1,
    },


    memberName: {
        fontSize: 17,
        fontWeight: "700",
        color: "#172033",
        marginBottom: 3,
    },


    serviceName: {
        fontSize: 13,
        color: "#6b7280",
    },


    // =================================================
    // INFORMATION
    // =================================================

    infoContainer: {
        borderTopWidth: 1,
        borderTopColor: "#edf0f5",
        paddingTop: 12,
        marginBottom: 16,
    },


    infoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 7,
    },


    infoLabel: {
        fontSize: 13,
        color: "#6b7280",
    },


    infoValue: {
        fontSize: 14,
        fontWeight: "600",
        color: "#263044",
        maxWidth: "60%",
        textAlign: "right",
    },


    // =================================================
    // PRIORITY
    // =================================================

    priorityBadge: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
    },


    priorityText: {
        fontSize: 12,
        fontWeight: "700",
    },


    highPriority: {
        backgroundColor: "#fde8e8",
    },


    mediumPriority: {
        backgroundColor: "#fff4d6",
    },


    lowPriority: {
        backgroundColor: "#e6f7ed",
    },


    // =================================================
    // VIEW BUTTON
    // =================================================

    viewButton: {
        backgroundColor: "#3157a5",
        borderRadius: 10,
        paddingVertical: 12,
        alignItems: "center",
    },


    viewButtonText: {
        color: "#ffffff",
        fontSize: 14,
        fontWeight: "700",
    },


    // =================================================
    // EMPTY STATE
    // =================================================

    emptyCard: {
        backgroundColor: "#ffffff",
        borderRadius: 16,
        padding: 35,
        alignItems: "center",

        elevation: 2,

        shadowOpacity: 0.05,
        shadowRadius: 5,

        shadowOffset: {
            width: 0,
            height: 2,
        },
    },


    emptyIcon: {
        fontSize: 32,
        marginBottom: 10,
    },


    emptyTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#172033",
        marginBottom: 5,
    },


    emptyText: {
        fontSize: 14,
        color: "#6b7280",
        textAlign: "center",
        lineHeight: 20,
    },


    // =================================================
    // CENTER / LOADING
    // =================================================

    centerContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 30,
        backgroundColor: "#f5f7fb",
    },


    loadingText: {
        marginTop: 12,
        color: "#6b7280",
        fontSize: 14,
    },


    // =================================================
    // ACCESS DENIED
    // =================================================

    accessIcon: {
        fontSize: 40,
        marginBottom: 12,
    },


    accessTitle: {
        fontSize: 22,
        fontWeight: "700",
        color: "#172033",
        marginBottom: 8,
    },


    accessText: {
        fontSize: 14,
        color: "#6b7280",
        textAlign: "center",
        lineHeight: 21,
    },

});