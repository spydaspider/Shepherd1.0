import {
    useEffect,
    useState,
} from "react";

import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView,
} from "react-native";

import {
    useRouter,
} from "expo-router";

import {
    Ionicons,
} from "@expo/vector-icons";

import api from "../api/axios";


// =====================================================
// MY CHILDREN SCREEN
// =====================================================

export default function MyChildrenScreen() {

    const router = useRouter();


    // =================================================
    // STATE
    // =================================================

    const [children, setChildren] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [refreshing, setRefreshing] = useState(false);


    // =================================================
    // GET FAMILY
    // GET /api/users/family
    // =================================================

    const fetchChildren = async () => {

        try {

            setError("");

            const response = await api.get(
                "/users/family"
            );

            const family =
                response?.data?.family;

            if (!family) {

                setChildren([]);

                return;
            }

            setChildren(
                Array.isArray(family.children)
                    ? family.children
                    : []
            );

        }
        catch (error) {

            console.log(
                "FETCH CHILDREN ERROR:",
                error?.response?.data ||
                error?.message
            );

            setError(
                error?.response?.data?.message ||
                "Unable to load your children."
            );

        }
        finally {

            setLoading(false);

            setRefreshing(false);

        }

    };


    // =================================================
    // LOAD CHILDREN
    // =================================================

    useEffect(() => {

        fetchChildren();

    }, []);


    // =================================================
    // REFRESH
    // =================================================

    const handleRefresh = () => {

        if (refreshing) {
            return;
        }

        setRefreshing(true);

        fetchChildren();

    };


    // =================================================
    // ADD CHILD
    // =================================================

    const handleAddChild = () => {

        router.push("/add-child");

    };


    // =================================================
    // CHILD DETAILS
    // =================================================

    const handleChildPress = (child) => {

        console.log(
            "SELECTED CHILD:",
            child
        );

    };


    // =================================================
    // GO BACK
    // =================================================

    const handleBack = () => {

        router.back();

    };


    // =================================================
    // LOADING SCREEN
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
                    Loading your children...
                </Text>

            </View>

        );

    }


    // =================================================
    // MAIN SCREEN
    // =================================================

    return (

        <View
            style={styles.container}
        >

            {/* =========================================
                HEADER
            ========================================== */}

            <View
                style={styles.header}
            >

                <TouchableOpacity
                    style={styles.backButton}
                    onPress={handleBack}
                    activeOpacity={0.7}
                >

                    <Ionicons
                        name="arrow-back"
                        size={24}
                        color="#0f2a5f"
                    />

                </TouchableOpacity>


                <View
                    style={styles.headerText}
                >

                    <Text
                        style={styles.title}
                    >
                        My Children
                    </Text>

                    <Text
                        style={styles.subtitle}
                    >
                        Manage your children
                    </Text>

                </View>


                {/* =====================================
                    ADD CHILD HEADER BUTTON
                ====================================== */}

                <TouchableOpacity
                    style={styles.headerAddButton}
                    onPress={handleAddChild}
                    activeOpacity={0.8}
                >

                    <Ionicons
                        name="person-add-outline"
                        size={21}
                        color="#ffffff"
                    />

                </TouchableOpacity>

            </View>


            {/* =========================================
                CONTENT
            ========================================== */}

            <ScrollView
                contentContainerStyle={
                    styles.scrollContent
                }
                showsVerticalScrollIndicator={false}
            >

                {/* =====================================
                    ERROR
                ====================================== */}

                {error ? (

                    <View
                        style={styles.errorCard}
                    >

                        <View
                            style={styles.errorIcon}
                        >

                            <Ionicons
                                name="alert-circle-outline"
                                size={34}
                                color="#dc2626"
                            />

                        </View>


                        <Text
                            style={styles.errorTitle}
                        >
                            Unable to Load Children
                        </Text>


                        <Text
                            style={styles.errorMessage}
                        >
                            {error}
                        </Text>


                        <TouchableOpacity
                            style={styles.retryButton}
                            onPress={handleRefresh}
                            activeOpacity={0.8}
                        >

                            <Ionicons
                                name="refresh-outline"
                                size={19}
                                color="#ffffff"
                            />

                            <Text
                                style={styles.retryText}
                            >
                                Try Again
                            </Text>

                        </TouchableOpacity>

                    </View>

                ) : null}


                {/* =====================================
                    CHILDREN SUMMARY
                ====================================== */}

                {!error ? (

                    <View
                        style={styles.summaryCard}
                    >

                        <View
                            style={styles.summaryIcon}
                        >

                            <Ionicons
                                name="people-outline"
                                size={26}
                                color="#0f2a5f"
                            />

                        </View>


                        <View
                            style={styles.summaryInfo}
                        >

                            <Text
                                style={styles.summaryNumber}
                            >
                                {children.length}
                            </Text>


                            <Text
                                style={styles.summaryLabel}
                            >
                                {children.length === 1
                                    ? "Child registered"
                                    : "Children registered"}
                            </Text>

                        </View>


                        <TouchableOpacity
                            style={styles.summaryAddButton}
                            onPress={handleAddChild}
                            activeOpacity={0.8}
                        >

                            <Ionicons
                                name="add"
                                size={22}
                                color="#ffffff"
                            />

                        </TouchableOpacity>

                    </View>

                ) : null}


                {/* =====================================
                    CHILDREN LIST
                ====================================== */}

                {!error &&
                children.length > 0 ? (

                    <View
                        style={styles.childrenSection}
                    >

                        <View
                            style={styles.sectionHeader}
                        >

                            <Text
                                style={styles.sectionTitle}
                            >
                                Your Children
                            </Text>


                            <View
                                style={styles.sectionCount}
                            >

                                <Text
                                    style={styles.sectionCountText}
                                >
                                    {children.length}
                                </Text>

                            </View>

                        </View>


                        {children.map(
                            (child, index) => {

                                const fullName =
                                    `${child.firstName || ""} ${
                                        child.lastName || ""
                                    }`.trim();


                                const avatarLetter =
                                    child.firstName
                                        ? child.firstName
                                            .charAt(0)
                                            .toUpperCase()
                                        : "C";


                                return (

                                    <TouchableOpacity
                                        key={
                                            child._id ||
                                            index
                                        }
                                        style={
                                            styles.childCard
                                        }
                                        onPress={() =>
                                            handleChildPress(
                                                child
                                            )
                                        }
                                        activeOpacity={0.75}
                                    >

                                        {/* =================
                                            AVATAR
                                        ================== */}

                                        <View
                                            style={
                                                styles.childAvatar
                                            }
                                        >

                                            <Text
                                                style={
                                                    styles.childAvatarText
                                                }
                                            >
                                                {avatarLetter}
                                            </Text>

                                        </View>


                                        {/* =================
                                            CHILD INFORMATION
                                        ================== */}

                                        <View
                                            style={
                                                styles.childInfo
                                            }
                                        >

                                            <Text
                                                style={
                                                    styles.childName
                                                }
                                                numberOfLines={1}
                                            >
                                                {fullName ||
                                                    "Child"}
                                            </Text>


                                            {child.gender ? (

                                                <View
                                                    style={
                                                        styles.detailRow
                                                    }
                                                >

                                                    <Ionicons
                                                        name={
                                                            child.gender ===
                                                            "Male"
                                                                ? "male-outline"
                                                                : "female-outline"
                                                        }
                                                        size={14}
                                                        color="#777777"
                                                    />

                                                    <Text
                                                        style={
                                                            styles.childDetails
                                                        }
                                                    >
                                                        {child.gender}
                                                    </Text>

                                                </View>

                                            ) : null}


                                            {child.dateOfBirth ? (

                                                <View
                                                    style={
                                                        styles.detailRow
                                                    }
                                                >

                                                    <Ionicons
                                                        name="calendar-outline"
                                                        size={14}
                                                        color="#777777"
                                                    />

                                                    <Text
                                                        style={
                                                            styles.childDetails
                                                        }
                                                    >
                                                        {new Date(
                                                            child.dateOfBirth
                                                        ).toLocaleDateString()}
                                                    </Text>

                                                </View>

                                            ) : null}


                                            {child.membershipNumber ? (

                                                <View
                                                    style={
                                                        styles.detailRow
                                                    }
                                                >

                                                    <Ionicons
                                                        name="card-outline"
                                                        size={14}
                                                        color="#777777"
                                                    />

                                                    <Text
                                                        style={
                                                            styles.childDetails
                                                        }
                                                    >
                                                        {child.membershipNumber}
                                                    </Text>

                                                </View>

                                            ) : null}

                                        </View>


                                        {/* =================
                                            ARROW
                                        ================== */}

                                        <Ionicons
                                            name="chevron-forward"
                                            size={21}
                                            color="#8a8a8a"
                                        />

                                    </TouchableOpacity>

                                );

                            }
                        )}

                    </View>

                ) : null}


                {/* =====================================
                    EMPTY STATE
                ====================================== */}

                {!error &&
                children.length === 0 ? (

                    <View
                        style={styles.emptyCard}
                    >

                        <View
                            style={styles.emptyIcon}
                        >

                            <Ionicons
                                name="people-outline"
                                size={42}
                                color="#0f2a5f"
                            />

                        </View>


                        <Text
                            style={styles.emptyTitle}
                        >
                            No Children Registered
                        </Text>


                        <Text
                            style={styles.emptyMessage}
                        >
                            You currently have no children
                            linked to your account.
                        </Text>


                        <TouchableOpacity
                            style={styles.addChildButton}
                            onPress={handleAddChild}
                            activeOpacity={0.8}
                        >

                            <Ionicons
                                name="person-add-outline"
                                size={21}
                                color="#ffffff"
                            />

                            <Text
                                style={
                                    styles.addChildButtonText
                                }
                            >
                                Add Child
                            </Text>

                        </TouchableOpacity>

                    </View>

                ) : null}


                {/* =====================================
                    ADD ANOTHER CHILD
                ====================================== */}

                {!error &&
                children.length > 0 ? (

                    <TouchableOpacity
                        style={
                            styles.addAnotherButton
                        }
                        onPress={handleAddChild}
                        activeOpacity={0.8}
                    >

                        <Ionicons
                            name="person-add-outline"
                            size={20}
                            color="#0f2a5f"
                        />

                        <Text
                            style={
                                styles.addAnotherText
                            }
                        >
                            Add Another Child
                        </Text>

                    </TouchableOpacity>

                ) : null}


                {/* =====================================
                    REFRESH BUTTON
                ====================================== */}

                {!error ? (

                    <TouchableOpacity
                        style={
                            styles.refreshButton
                        }
                        onPress={handleRefresh}
                        disabled={refreshing}
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
                            style={styles.refreshText}
                        >
                            {refreshing
                                ? "Refreshing..."
                                : "Refresh"}
                        </Text>

                    </TouchableOpacity>

                ) : null}

            </ScrollView>

        </View>

    );

}


// =====================================================
// STYLES
// =====================================================

const styles = StyleSheet.create({

    // =================================================
    // COLOR PALETTE
    // =================================================
    //
    // Primary Navy:       #0f2a5f
    // Page Background:    #f4f6fb
    // White:              #ffffff
    // Main Text:          #222222
    // Secondary Text:     #777777
    // Light Text:         #999999
    // Border:             #dddddd
    // Header Border:      #eeeeee
    // Light Navy:         #eef3ff
    // Error Red:          #dc2626
    // Error Background:   #fef2f2
    // Error Border:       #fecaca
    //
    // =================================================


    // =================================================
    // CONTAINER
    // =================================================

    container: {

        flex: 1,

        backgroundColor: "#f4f6fb",

    },


    // =================================================
    // LOADING
    // =================================================

    loadingContainer: {

        flex: 1,

        backgroundColor: "#f4f6fb",

        justifyContent: "center",

        alignItems: "center",

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

        fontSize: 25,

        fontWeight: "800",

        color: "#0f2a5f",

    },


    subtitle: {

        marginTop: 3,

        fontSize: 13,

        color: "#777777",

    },


    headerAddButton: {

        width: 42,

        height: 42,

        borderRadius: 21,

        backgroundColor: "#0f2a5f",

        justifyContent: "center",

        alignItems: "center",

    },


    // =================================================
    // SCROLL CONTENT
    // =================================================

    scrollContent: {

        padding: 20,

        paddingBottom: 45,

    },


    // =================================================
    // SUMMARY CARD
    // =================================================

    summaryCard: {

        backgroundColor: "#ffffff",

        borderRadius: 16,

        padding: 18,

        flexDirection: "row",

        alignItems: "center",

        marginBottom: 25,

    },


    summaryIcon: {

        width: 52,

        height: 52,

        borderRadius: 26,

        backgroundColor: "#eef3ff",

        justifyContent: "center",

        alignItems: "center",

    },


    summaryInfo: {

        flex: 1,

        marginLeft: 15,

    },


    summaryNumber: {

        fontSize: 25,

        fontWeight: "800",

        color: "#0f2a5f",

    },


    summaryLabel: {

        marginTop: 2,

        fontSize: 13,

        color: "#777777",

    },


    summaryAddButton: {

        width: 42,

        height: 42,

        borderRadius: 21,

        backgroundColor: "#0f2a5f",

        justifyContent: "center",

        alignItems: "center",

    },


    // =================================================
    // CHILDREN SECTION
    // =================================================

    childrenSection: {

        marginBottom: 10,

    },


    sectionHeader: {

        flexDirection: "row",

        alignItems: "center",

        marginBottom: 12,

    },


    sectionTitle: {

        flex: 1,

        fontSize: 18,

        fontWeight: "800",

        color: "#222222",

    },


    sectionCount: {

        width: 28,

        height: 28,

        borderRadius: 14,

        backgroundColor: "#eef3ff",

        justifyContent: "center",

        alignItems: "center",

    },


    sectionCountText: {

        fontSize: 12,

        fontWeight: "800",

        color: "#0f2a5f",

    },


    // =================================================
    // CHILD CARD
    // =================================================

    childCard: {

        backgroundColor: "#ffffff",

        borderRadius: 16,

        padding: 17,

        marginBottom: 12,

        flexDirection: "row",

        alignItems: "center",

    },


    childAvatar: {

        width: 56,

        height: 56,

        borderRadius: 28,

        backgroundColor: "#0f2a5f",

        justifyContent: "center",

        alignItems: "center",

    },


    childAvatarText: {

        color: "#ffffff",

        fontSize: 22,

        fontWeight: "800",

    },


    childInfo: {

        flex: 1,

        marginLeft: 15,

        marginRight: 10,

    },


    childName: {

        fontSize: 17,

        fontWeight: "800",

        color: "#222222",

        marginBottom: 5,

    },


    detailRow: {

        flexDirection: "row",

        alignItems: "center",

        marginTop: 3,

    },


    childDetails: {

        marginLeft: 5,

        fontSize: 12,

        color: "#777777",

    },


    // =================================================
    // EMPTY STATE
    // =================================================

    emptyCard: {

        backgroundColor: "#ffffff",

        borderRadius: 16,

        padding: 30,

        alignItems: "center",

    },


    emptyIcon: {

        width: 82,

        height: 82,

        borderRadius: 41,

        backgroundColor: "#eef3ff",

        justifyContent: "center",

        alignItems: "center",

        marginBottom: 16,

    },


    emptyTitle: {

        fontSize: 19,

        fontWeight: "800",

        color: "#222222",

        textAlign: "center",

    },


    emptyMessage: {

        marginTop: 8,

        fontSize: 14,

        color: "#666666",

        textAlign: "center",

        lineHeight: 21,

    },


    addChildButton: {

        marginTop: 22,

        minHeight: 52,

        paddingHorizontal: 28,

        borderRadius: 12,

        backgroundColor: "#0f2a5f",

        flexDirection: "row",

        justifyContent: "center",

        alignItems: "center",

        gap: 8,

    },


    addChildButtonText: {

        color: "#ffffff",

        fontSize: 15,

        fontWeight: "800",

    },


    // =================================================
    // ADD ANOTHER CHILD
    // =================================================

    addAnotherButton: {

        minHeight: 52,

        backgroundColor: "#ffffff",

        borderWidth: 1,

        borderColor: "#0f2a5f",

        borderRadius: 12,

        flexDirection: "row",

        justifyContent: "center",

        alignItems: "center",

        marginTop: 8,

        gap: 8,

    },


    addAnotherText: {

        color: "#0f2a5f",

        fontSize: 14,

        fontWeight: "800",

    },


    // =================================================
    // ERROR
    // =================================================

    errorCard: {

        backgroundColor: "#ffffff",

        borderRadius: 16,

        padding: 28,

        alignItems: "center",

    },


    errorIcon: {

        width: 70,

        height: 70,

        borderRadius: 35,

        backgroundColor: "#fef2f2",

        justifyContent: "center",

        alignItems: "center",

    },


    errorTitle: {

        marginTop: 12,

        fontSize: 17,

        fontWeight: "800",

        color: "#222222",

        textAlign: "center",

    },


    errorMessage: {

        marginTop: 8,

        fontSize: 13,

        color: "#777777",

        textAlign: "center",

        lineHeight: 19,

    },


    retryButton: {

        backgroundColor: "#0f2a5f",

        borderRadius: 10,

        minHeight: 46,

        paddingHorizontal: 24,

        marginTop: 18,

        flexDirection: "row",

        justifyContent: "center",

        alignItems: "center",

        gap: 7,

    },


    retryText: {

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

        minHeight: 52,

        paddingHorizontal: 20,

        flexDirection: "row",

        justifyContent: "center",

        alignItems: "center",

        marginTop: 20,

    },


    refreshText: {

        color: "#ffffff",

        fontSize: 15,

        fontWeight: "700",

        marginLeft: 8,

    },

});