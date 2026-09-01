import {
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
    Alert,
} from "react-native";

import {
    useFocusEffect,
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

    const [refreshing, setRefreshing] = useState(false);

    const [error, setError] = useState("");


    // =================================================
    // GET FAMILY / CHILDREN
    // =================================================

    const fetchChildren = async (
        showLoading = true
    ) => {

        try {

            if (showLoading) {
                setLoading(true);
            }

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
    // LOAD CHILDREN EVERY TIME SCREEN IS FOCUSED
    // =================================================

    useFocusEffect(
        useCallback(() => {

            fetchChildren();

        }, [])
    );


    // =================================================
    // MANUAL REFRESH
    // =================================================

    const handleRefresh = async () => {

        if (refreshing) {
            return;
        }


        setRefreshing(true);

        await fetchChildren(false);

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

    if (!child?._id) {

        Alert.alert(
            "Error",
            "Unable to open this child's details."
        );

        return;
    }

    router.push({
        pathname: "/child-details",
        params: {
            childId: String(child._id),
        },
    });

};


    // =================================================
    // GO BACK
    // =================================================

    const handleBack = () => {

        router.back();

    };


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
                    Loading your children...
                </Text>

            </View>

        );

    }


    // =================================================
    // SCREEN
    // =================================================

    return (

        <View style={styles.container}>

            {/* =========================================
                HEADER
            ========================================== */}

            <View style={styles.header}>

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


                <View style={styles.headerText}>

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
                    HEADER ADD BUTTON
                ====================================== */}

                <TouchableOpacity
                    style={styles.headerAddButton}
                    onPress={handleAddChild}
                    activeOpacity={0.8}
                >

                    <Ionicons
                        name="person-add-outline"
                        size={22}
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

                        <Ionicons
                            name="alert-circle-outline"
                            size={30}
                            color="#dc2626"
                        />

                        <Text
                            style={styles.errorTitle}
                        >
                            Unable to load children
                        </Text>

                        <Text
                            style={styles.errorMessage}
                        >
                            {error}
                        </Text>


                        <TouchableOpacity
                            style={styles.retryButton}
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

                                <Text
                                    style={styles.retryText}
                                >
                                    Try Again
                                </Text>

                            )}

                        </TouchableOpacity>

                    </View>

                ) : null}


                {/* =====================================
                    SUMMARY CARD
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
                                size={25}
                                color="#0f2a5f"
                            />

                        </View>


                        <View
                            style={styles.summaryInfo}
                        >

                            <Text
                                style={
                                    styles.summaryNumber
                                }
                            >
                                {children.length}
                            </Text>

                            <Text
                                style={
                                    styles.summaryLabel
                                }
                            >
                                {
                                    children.length === 1
                                        ? "Child registered"
                                        : "Children registered"
                                }
                            </Text>

                        </View>

                    </View>

                ) : null}


                {/* =====================================
                    ADD CHILD BUTTON
                ====================================== */}

                {!error ? (

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

                ) : null}


                {/* =====================================
                    CHILDREN LIST
                ====================================== */}

                {!error &&
                children.length > 0 ? (

                    <View
                        style={
                            styles.childrenSection
                        }
                    >

                        <Text
                            style={styles.sectionTitle}
                        >
                            Your Children
                        </Text>


                        {children.map(
                            (child, index) => (

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
                                            {child.firstName
                                                ? child.firstName
                                                    .charAt(0)
                                                    .toUpperCase()
                                                : "C"}
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
                                        >
                                            {child.firstName || ""}
                                            {child.lastName
                                                ? ` ${child.lastName}`
                                                : ""}
                                        </Text>


                                        <Text
                                            style={
                                                styles.childDetails
                                            }
                                        >
                                            {
                                                child.gender ||
                                                "Gender not provided"
                                            }
                                        </Text>


                                        {child.dateOfBirth ? (

                                            <Text
                                                style={
                                                    styles.childDetails
                                                }
                                            >
                                                Date of birth:{" "}
                                                {
                                                    new Date(
                                                        child.dateOfBirth
                                                    ).toLocaleDateString()
                                                }
                                            </Text>

                                        ) : null}


                                        {child.membershipNumber ? (

                                            <Text
                                                style={
                                                    styles.childDetails
                                                }
                                            >
                                                Membership No:{" "}
                                                {
                                                    child.membershipNumber
                                                }
                                            </Text>

                                        ) : null}

                                    </View>


                                    {/* =================
                                        ARROW
                                    ================== */}

                                    <Ionicons
                                        name="chevron-forward"
                                        size={22}
                                        color="#8a8a8a"
                                    />

                                </TouchableOpacity>

                            )
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
                                size={40}
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


                        <Text
                            style={styles.emptyHint}
                        >
                            Add your child using the button
                            below.
                        </Text>


                        <TouchableOpacity
                            style={
                                styles.emptyAddButton
                            }
                            onPress={handleAddChild}
                            activeOpacity={0.8}
                        >

                            <Ionicons
                                name="person-add-outline"
                                size={20}
                                color="#ffffff"
                            />

                            <Text
                                style={
                                    styles.emptyAddButtonText
                                }
                            >
                                Add Child
                            </Text>

                        </TouchableOpacity>

                    </View>

                ) : null}


                {/* =====================================
                    REFRESH BUTTON
                ====================================== */}

                {!error ? (

                    <TouchableOpacity
                        style={[
                            styles.refreshButton,

                            refreshing &&
                                styles.refreshButtonDisabled,
                        ]}
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
                            style={
                                styles.refreshText
                            }
                        >
                            {
                                refreshing
                                    ? "Refreshing..."
                                    : "Refresh"
                            }
                        </Text>

                    </TouchableOpacity>

                ) : null}


                <Text
                    style={styles.footerText}
                >
                    Your children's information is
                    securely linked to your account.
                </Text>

            </ScrollView>

        </View>

    );

}


// =====================================================
// STYLES
// =====================================================

const styles = StyleSheet.create({

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

        color: "#777",

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

        marginLeft: 14,

        flex: 1,

    },


    title: {

        fontSize: 26,

        fontWeight: "800",

        color: "#0f2a5f",

    },


    subtitle: {

        marginTop: 3,

        fontSize: 13,

        color: "#777",

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

        padding: 20,

        flexDirection: "row",

        alignItems: "center",

        marginBottom: 18,

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

        color: "#777",

    },


    // =================================================
    // ADD CHILD BUTTON
    // =================================================

    addChildButton: {

        height: 54,

        backgroundColor: "#0f2a5f",

        borderRadius: 12,

        flexDirection: "row",

        justifyContent: "center",

        alignItems: "center",

        marginBottom: 25,

    },


    addChildButtonText: {

        marginLeft: 9,

        color: "#ffffff",

        fontSize: 15,

        fontWeight: "800",

    },


    // =================================================
    // CHILDREN SECTION
    // =================================================

    childrenSection: {

        marginBottom: 5,

    },


    sectionTitle: {

        fontSize: 18,

        fontWeight: "800",

        color: "#222",

        marginBottom: 12,

    },


    // =================================================
    // CHILD CARD
    // =================================================

    childCard: {

        backgroundColor: "#ffffff",

        borderRadius: 16,

        padding: 18,

        marginBottom: 12,

        flexDirection: "row",

        alignItems: "center",

    },


    childAvatar: {

        width: 55,

        height: 55,

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

        color: "#222",

        marginBottom: 5,

    },


    childDetails: {

        fontSize: 12,

        color: "#777",

        marginTop: 2,

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

        width: 80,

        height: 80,

        borderRadius: 40,

        backgroundColor: "#eef3ff",

        justifyContent: "center",

        alignItems: "center",

        marginBottom: 15,

    },


    emptyTitle: {

        fontSize: 19,

        fontWeight: "800",

        color: "#222",

        textAlign: "center",

    },


    emptyMessage: {

        marginTop: 8,

        fontSize: 14,

        color: "#666",

        textAlign: "center",

        lineHeight: 21,

    },


    emptyHint: {

        marginTop: 12,

        fontSize: 12,

        color: "#999",

        textAlign: "center",

        lineHeight: 18,

    },


    emptyAddButton: {

        marginTop: 20,

        backgroundColor: "#0f2a5f",

        borderRadius: 12,

        paddingHorizontal: 22,

        paddingVertical: 13,

        flexDirection: "row",

        alignItems: "center",

        justifyContent: "center",

    },


    emptyAddButtonText: {

        marginLeft: 8,

        color: "#ffffff",

        fontSize: 14,

        fontWeight: "800",

    },


    // =================================================
    // ERROR
    // =================================================

    errorCard: {

        backgroundColor: "#ffffff",

        borderRadius: 16,

        padding: 25,

        alignItems: "center",

    },


    errorTitle: {

        marginTop: 10,

        fontSize: 17,

        fontWeight: "800",

        color: "#222",

        textAlign: "center",

    },


    errorMessage: {

        marginTop: 7,

        fontSize: 13,

        color: "#777",

        textAlign: "center",

    },


    retryButton: {

        minWidth: 120,

        backgroundColor: "#0f2a5f",

        borderRadius: 10,

        paddingHorizontal: 25,

        paddingVertical: 12,

        marginTop: 18,

        justifyContent: "center",

        alignItems: "center",

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

        height: 52,

        backgroundColor: "#0f2a5f",

        borderRadius: 12,

        paddingHorizontal: 20,

        flexDirection: "row",

        justifyContent: "center",

        alignItems: "center",

        marginTop: 20,

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


    // =================================================
    // FOOTER
    // =================================================

    footerText: {

        marginTop: 18,

        fontSize: 11,

        color: "#999",

        textAlign: "center",

        lineHeight: 17,

    },

});