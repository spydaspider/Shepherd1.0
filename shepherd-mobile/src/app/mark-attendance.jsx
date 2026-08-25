import {
    useCallback,
    useState,
} from "react";

import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    ActivityIndicator,
} from "react-native";

import {
    useFocusEffect,
    useRouter,
} from "expo-router";

import api from "../api/axios";


// =====================================================
// MARK ATTENDANCE SCREEN
// =====================================================

export default function MarkAttendanceScreen() {

    const router = useRouter();


    // =================================================
    // State
    // =================================================

    const [code, setCode] =
        useState("");

    const [member, setMember] =
        useState(null);

    const [children, setChildren] =
        useState([]);

    const [selectedChildren, setSelectedChildren] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [submitting, setSubmitting] =
        useState(false);

    const [error, setError] =
        useState("");

    const [successMessage, setSuccessMessage] =
        useState("");


    // =================================================
    // Fetch Current Member + Children
    // =================================================

    const fetchMemberData =
        useCallback(
            async () => {

                try {

                    setLoading(true);

                    setError("");

                    setSuccessMessage("");


                    const response =
                        await api.get(
                            "/members/me/dashboard"
                        );


                    if (
                        response.data?.success
                    ) {

                        const currentMember =
                            response.data.member;


                        setMember(
                            currentMember
                        );


                        setChildren(
                            currentMember?.children || []
                        );

                    }
                    else {

                        setError(
                            "Unable to load your family information."
                        );

                    }

                }
                catch (error) {

                    console.log(
                        "MARK ATTENDANCE MEMBER ERROR:",
                        error.response?.data ||
                        error.message
                    );


                    setError(
                        error.response?.data?.message ||
                        "Unable to load your family information."
                    );

                }
                finally {

                    setLoading(false);

                }

            },
            []
        );


    // =================================================
    // Load Data When Screen Gets Focus
    // =================================================

    useFocusEffect(
        useCallback(() => {

            fetchMemberData();

        }, [fetchMemberData])
    );


    // =================================================
    // Toggle Child
    // =================================================

    const toggleChild = (
        childId
    ) => {

        setSelectedChildren(
            current => {

                if (
                    current.includes(childId)
                ) {

                    return current.filter(
                        id => id !== childId
                    );

                }


                return [
                    ...current,
                    childId,
                ];

            }
        );

    };


    // =================================================
    // Submit Attendance
    // =================================================

    const handleMarkAttendance =
        async () => {

            setError("");

            setSuccessMessage("");


            // -----------------------------------------
            // Validate Code
            // -----------------------------------------

            const trimmedCode =
                code.trim();


            if (!trimmedCode) {

                setError(
                    "Please enter the attendance code."
                );

                return;

            }


            // -----------------------------------------
            // Validate Code Format
            // -----------------------------------------

            if (
                !/^\d+$/.test(trimmedCode)
            ) {

                setError(
                    "Attendance code must contain numbers only."
                );

                return;

            }


            // -----------------------------------------
            // Make Sure Member Exists
            // -----------------------------------------

            if (!member?.id) {

                setError(
                    "Unable to identify your account. Please try again."
                );

                return;

            }


            try {

                setSubmitting(true);


                // -------------------------------------
                // Parent + Selected Children
                // -------------------------------------

                const members = [
                    member.id,
                    ...selectedChildren,
                ];


                // -------------------------------------
                // Remove Duplicate IDs
                // -------------------------------------

                const uniqueMembers =
                    [...new Set(members)];


                // -------------------------------------
                // Send Attendance
                // -------------------------------------

                const response =
                    await api.post(
                        "/attendance/mark",
                        {
                            code: trimmedCode,
                            members: uniqueMembers,
                        }
                    );


                if (
                    response.data?.success
                ) {

                    const created =
                        response.data.created || 0;

                    const alreadyPresent =
                        response.data.alreadyPresent || 0;


                    let message =
                        "Attendance marked successfully.";


                    if (
                        created > 0 &&
                        alreadyPresent > 0
                    ) {

                        message =
                            `${created} attendance record${created === 1 ? "" : "s"} marked successfully. ${alreadyPresent} already marked.`;

                    }
                    else if (
                        created === 0 &&
                        alreadyPresent > 0
                    ) {

                        message =
                            "Attendance has already been marked for the selected members.";

                    }


                    setSuccessMessage(
                        message
                    );


                    // ---------------------------------
                    // Clear Code
                    // ---------------------------------

                    setCode("");


                    // ---------------------------------
                    // Clear Child Selection
                    // ---------------------------------

                    setSelectedChildren([]);


                    // ---------------------------------
                    // Return to Dashboard
                    // ---------------------------------

                    setTimeout(() => {

                        router.back();

                    }, 1200);

                }
                else {

                    setError(
                        response.data?.message ||
                        "Unable to mark attendance."
                    );

                }

            }
            catch (error) {

                console.log(
                    "MARK ATTENDANCE ERROR:",
                    error.response?.data ||
                    error.message
                );


                setError(
                    error.response?.data?.message ||
                    "Unable to mark attendance. Please try again."
                );

            }
            finally {

                setSubmitting(false);

            }

        };


    // =================================================
    // Loading
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
                    Loading your family...
                </Text>

            </View>

        );

    }


    // =================================================
    // Error Loading Member
    // =================================================

    if (
        error &&
        !member
    ) {

        return (

            <View
                style={
                    styles.errorContainer
                }
            >

                <Text
                    style={
                        styles.errorIcon
                    }
                >
                    !
                </Text>


                <Text
                    style={
                        styles.errorTitle
                    }
                >
                    Something went wrong
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
                        fetchMemberData
                    }
                >

                    <Text
                        style={
                            styles.retryText
                        }
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
            style={
                styles.container
            }
            contentContainerStyle={
                styles.content
            }
            showsVerticalScrollIndicator={
                false
            }
            keyboardShouldPersistTaps="handled"
        >

            {/* =========================================
                Header
            ========================================== */}

            <View
                style={
                    styles.header
                }
            >

                <Text
                    style={
                        styles.title
                    }
                >
                    Mark Attendance
                </Text>


                <Text
                    style={
                        styles.subtitle
                    }
                >
                    Enter today's attendance code
                </Text>

            </View>


            {/* =========================================
                Attendance Code
            ========================================== */}

            <View
                style={
                    styles.card
                }
            >

                <Text
                    style={
                        styles.cardTitle
                    }
                >
                    Attendance Code
                </Text>


                <Text
                    style={
                        styles.cardDescription
                    }
                >
                    Enter the code displayed at
                    today's service.
                </Text>


                <TextInput
                    value={code}
                    onChangeText={
                        value => {

                            setCode(
                                value.replace(
                                    /[^0-9]/g,
                                    ""
                                )
                            );

                            setError("");

                            setSuccessMessage("");

                        }
                    }
                    placeholder="Enter code"
                    placeholderTextColor="#999"
                    keyboardType="number-pad"
                    maxLength={10}
                    style={
                        styles.codeInput
                    }
                    editable={
                        !submitting
                    }
                />

            </View>


            {/* =========================================
                Who Is Attending
            ========================================== */}

            <View
                style={
                    styles.section
                }
            >

                <Text
                    style={
                        styles.sectionTitle
                    }
                >
                    Who is attending?
                </Text>


                <Text
                    style={
                        styles.sectionDescription
                    }
                >
                    Select any children who are
                    attending with you.
                </Text>


                {/* =====================================
                    Parent
                ====================================== */}

                <View
                    style={[
                        styles.memberCard,
                        styles.selectedMemberCard,
                    ]}
                >

                    <View
                        style={
                            styles.memberInfo
                        }
                    >

                        <Text
                            style={
                                styles.memberName
                            }
                        >
                            {member?.firstName}{" "}
                            {member?.lastName}
                        </Text>


                        <Text
                            style={
                                styles.memberRole
                            }
                        >
                            You
                        </Text>

                    </View>


                    <View
                        style={
                            styles.checkedBox
                        }
                    >

                        <Text
                            style={
                                styles.checkmark
                            }
                        >
                            ✓
                        </Text>

                    </View>

                </View>


                {/* =====================================
                    Children
                ====================================== */}

                {children.length > 0 ? (

                    children.map(
                        child => {

                            const childId =
                                child._id ||
                                child.id;


                            const selected =
                                selectedChildren.includes(
                                    childId
                                );


                            return (

                                <TouchableOpacity
                                    key={
                                        childId
                                    }
                                    style={[
                                        styles.memberCard,
                                        selected
                                            ? styles.selectedMemberCard
                                            : null,
                                    ]}
                                    onPress={() =>
                                        toggleChild(
                                            childId
                                        )
                                    }
                                    activeOpacity={
                                        0.8
                                    }
                                    disabled={
                                        submitting
                                    }
                                >

                                    <View
                                        style={
                                            styles.memberInfo
                                        }
                                    >

                                        <Text
                                            style={
                                                styles.memberName
                                            }
                                        >
                                            {
                                                child.firstName
                                            }{" "}
                                            {
                                                child.lastName
                                            }
                                        </Text>


                                        <Text
                                            style={
                                                styles.memberRole
                                            }
                                        >
                                            Child
                                        </Text>

                                    </View>


                                    <View
                                        style={[
                                            styles.checkbox,
                                            selected
                                                ? styles.checkedBox
                                                : null,
                                        ]}
                                    >

                                        {selected ? (

                                            <Text
                                                style={
                                                    styles.checkmark
                                                }
                                            >
                                                ✓
                                            </Text>

                                        ) : null}

                                    </View>

                                </TouchableOpacity>

                            );

                        }
                    )

                ) : (

                    <View
                        style={
                            styles.noChildrenCard
                        }
                    >

                        <Text
                            style={
                                styles.noChildrenTitle
                            }
                        >
                            No children linked
                        </Text>


                        <Text
                            style={
                                styles.noChildrenText
                            }
                        >
                            Only your attendance will
                            be recorded.
                        </Text>

                    </View>

                )}

            </View>


            {/* =========================================
                Error
            ========================================== */}

            {error ? (

                <View
                    style={
                        styles.errorBox
                    }
                >

                    <Text
                        style={
                            styles.errorBoxIcon
                        }
                    >
                        !
                    </Text>


                    <Text
                        style={
                            styles.errorBoxText
                        }
                    >
                        {error}
                    </Text>

                </View>

            ) : null}


            {/* =========================================
                Success
            ========================================== */}

            {successMessage ? (

                <View
                    style={
                        styles.successBox
                    }
                >

                    <Text
                        style={
                            styles.successIcon
                        }
                    >
                        ✓
                    </Text>


                    <Text
                        style={
                            styles.successText
                        }
                    >
                        {successMessage}
                    </Text>

                </View>

            ) : null}


            {/* =========================================
                Submit
            ========================================== */}

            <TouchableOpacity
                style={[
                    styles.submitButton,
                    submitting
                        ? styles.submitButtonDisabled
                        : null,
                ]}
                onPress={
                    handleMarkAttendance
                }
                disabled={
                    submitting
                }
                activeOpacity={
                    0.8
                }
            >

                {submitting ? (

                    <ActivityIndicator
                        color="#fff"
                    />

                ) : (

                    <Text
                        style={
                            styles.submitButtonText
                        }
                    >
                        Mark Attendance
                    </Text>

                )}

            </TouchableOpacity>


            {/* =========================================
                Information
            ========================================== */}

            <View
                style={
                    styles.infoCard
                }
            >

                <Text
                    style={
                        styles.infoTitle
                    }
                >
                    Attendance Information
                </Text>


                <Text
                    style={
                        styles.infoText
                    }
                >
                    Your attendance will be recorded
                    automatically. If you selected
                    children, their attendance will be
                    recorded at the same time.
                </Text>

            </View>


            <View
                style={
                    styles.bottomSpacing
                }
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

        marginBottom: 25,

    },


    title: {

        fontSize: 28,

        fontWeight: "800",

        color: "#0f2a5f",

    },


    subtitle: {

        marginTop: 6,

        color: "#777",

        fontSize: 14,

    },


    // =================================================
    // Attendance Code Card
    // =================================================

    card: {

        backgroundColor: "#fff",

        borderRadius: 16,

        padding: 20,

        marginBottom: 25,

    },


    cardTitle: {

        fontSize: 17,

        fontWeight: "800",

        color: "#222",

    },


    cardDescription: {

        color: "#777",

        fontSize: 13,

        lineHeight: 19,

        marginTop: 6,

        marginBottom: 16,

    },


    codeInput: {

        backgroundColor: "#f4f6fb",

        borderWidth: 1,

        borderColor: "#d7dce5",

        borderRadius: 12,

        height: 55,

        paddingHorizontal: 16,

        fontSize: 22,

        fontWeight: "700",

        color: "#0f2a5f",

        textAlign: "center",

        letterSpacing: 4,

    },


    // =================================================
    // Section
    // =================================================

    section: {

        marginBottom: 20,

    },


    sectionTitle: {

        fontSize: 20,

        fontWeight: "800",

        color: "#222",

    },


    sectionDescription: {

        fontSize: 13,

        color: "#777",

        marginTop: 5,

        marginBottom: 12,

    },


    // =================================================
    // Member Cards
    // =================================================

    memberCard: {

        backgroundColor: "#fff",

        borderRadius: 14,

        padding: 17,

        marginBottom: 10,

        flexDirection: "row",

        alignItems: "center",

        justifyContent: "space-between",

        borderWidth: 1,

        borderColor: "#fff",

    },


    selectedMemberCard: {

        borderColor: "#0f2a5f",

        backgroundColor: "#f5f7ff",

    },


    memberInfo: {

        flex: 1,

        paddingRight: 15,

    },


    memberName: {

        fontSize: 16,

        fontWeight: "700",

        color: "#222",

    },


    memberRole: {

        marginTop: 4,

        fontSize: 12,

        color: "#777",

    },


    checkbox: {

        width: 27,

        height: 27,

        borderRadius: 7,

        borderWidth: 2,

        borderColor: "#cbd5e1",

        justifyContent: "center",

        alignItems: "center",

        backgroundColor: "#fff",

    },


    checkedBox: {

        backgroundColor: "#0f2a5f",

        borderColor: "#0f2a5f",

    },


    checkmark: {

        color: "#fff",

        fontSize: 17,

        fontWeight: "800",

    },


    // =================================================
    // No Children
    // =================================================

    noChildrenCard: {

        backgroundColor: "#fff",

        borderRadius: 14,

        padding: 20,

        marginTop: 5,

    },


    noChildrenTitle: {

        fontSize: 15,

        fontWeight: "700",

        color: "#333",

    },


    noChildrenText: {

        marginTop: 5,

        fontSize: 13,

        color: "#777",

    },


    // =================================================
    // Error
    // =================================================

    errorBox: {

        backgroundColor: "#fee2e2",

        borderRadius: 12,

        padding: 14,

        flexDirection: "row",

        alignItems: "center",

        marginBottom: 15,

    },


    errorBoxIcon: {

        width: 25,

        height: 25,

        borderRadius: 13,

        backgroundColor: "#dc2626",

        color: "#fff",

        textAlign: "center",

        lineHeight: 25,

        fontWeight: "800",

        marginRight: 10,

    },


    errorBoxText: {

        flex: 1,

        color: "#991b1b",

        fontSize: 13,

        lineHeight: 19,

    },


    // =================================================
    // Success
    // =================================================

    successBox: {

        backgroundColor: "#dcfce7",

        borderRadius: 12,

        padding: 14,

        flexDirection: "row",

        alignItems: "center",

        marginBottom: 15,

    },


    successIcon: {

        width: 25,

        height: 25,

        borderRadius: 13,

        backgroundColor: "#16a34a",

        color: "#fff",

        textAlign: "center",

        lineHeight: 25,

        fontWeight: "800",

        marginRight: 10,

    },


    successText: {

        flex: 1,

        color: "#166534",

        fontSize: 13,

        lineHeight: 19,

        fontWeight: "600",

    },


    // =================================================
    // Submit Button
    // =================================================

    submitButton: {

        backgroundColor: "#0f2a5f",

        borderRadius: 13,

        height: 55,

        justifyContent: "center",

        alignItems: "center",

        marginTop: 5,

    },


    submitButtonDisabled: {

        opacity: 0.7,

    },


    submitButtonText: {

        color: "#fff",

        fontSize: 16,

        fontWeight: "800",

    },


    // =================================================
    // Information
    // =================================================

    infoCard: {

        backgroundColor: "#eef2ff",

        borderRadius: 14,

        padding: 17,

        marginTop: 18,

    },


    infoTitle: {

        fontSize: 14,

        fontWeight: "800",

        color: "#0f2a5f",

    },


    infoText: {

        fontSize: 12,

        color: "#4b5563",

        lineHeight: 18,

        marginTop: 6,

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
    // Full Error
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