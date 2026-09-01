import React, {
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
    Alert,
    TextInput,
} from "react-native";

import {
    useLocalSearchParams,
    useRouter,
} from "expo-router";

import {
    Ionicons,
} from "@expo/vector-icons";

import api from "../api/axios";


// =====================================================
// CHILD DETAILS SCREEN
// =====================================================

export default function ChildDetailsScreen() {

    const router = useRouter();

    const {
        childId,
    } = useLocalSearchParams();


    // =================================================
    // STATE
    // =================================================

    const [child, setChild] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [editing, setEditing] =
        useState(false);

    const [saving, setSaving] =
        useState(false);

    const [removing, setRemoving] =
        useState(false);

    const [error, setError] =
        useState("");


    // =================================================
    // EDIT FORM STATE
    // =================================================

    const [firstName, setFirstName] =
        useState("");

    const [lastName, setLastName] =
        useState("");

    const [gender, setGender] =
        useState("");

    const [dateOfBirth, setDateOfBirth] =
        useState("");


    // =================================================
    // LOAD CHILD
    // =================================================

    const fetchChild = async () => {

        try {

            setLoading(true);

            setError("");


            if (!childId) {

                setError(
                    "Child information is missing."
                );

                return;
            }


            console.log(
                "LOADING CHILD:",
                childId
            );


            const response =
                await api.get(
                    "/users/family"
                );


            const family =
                response?.data?.family;


            const children =
                family?.children || [];


            console.log(
                "FAMILY CHILDREN:",
                children
            );


            // =========================================
            // FIND EXACT CHILD BY ID
            // =========================================

            const selectedChild =
                children.find(
                    (item) =>
                        String(item._id) ===
                        String(childId)
                );


            if (!selectedChild) {

                setError(
                    "This child could not be found."
                );

                setChild(null);

                return;
            }


            console.log(
                "SELECTED CHILD:",
                selectedChild
            );


            setChild(
                selectedChild
            );


            // =========================================
            // SET EDIT FORM
            // =========================================

            setFirstName(
                selectedChild.firstName || ""
            );

            setLastName(
                selectedChild.lastName || ""
            );

            setGender(
                selectedChild.gender || ""
            );

            setDateOfBirth(
                selectedChild.dateOfBirth || ""
            );

        }
        catch (error) {

            console.log(
                "FETCH CHILD DETAILS ERROR:",
                error?.response?.data ||
                error?.message
            );


            setError(
                error?.response?.data?.message ||
                "Unable to load child details."
            );

        }
        finally {

            setLoading(false);

        }

    };


    // =================================================
    // LOAD ON SCREEN OPEN
    // =================================================

    useEffect(() => {

        fetchChild();

    }, [
        childId,
    ]);


    // =================================================
    // UPDATE CHILD
    // =================================================

    const handleUpdateChild = async () => {

        setError("");


        if (!firstName.trim()) {

            setError(
                "Please enter the child's first name."
            );

            return;
        }


        if (!gender) {

            setError(
                "Please select the child's gender."
            );

            return;
        }


        try {

            setSaving(true);


            const childData = {

                firstName:
                    firstName.trim(),

                lastName:
                    lastName.trim(),

                gender:
                    gender,

                dateOfBirth:
                    dateOfBirth.trim()
                        ? dateOfBirth.trim()
                        : null,

            };


            console.log(
                "UPDATING CHILD:",
                childId,
                childData
            );


            const response =
                await api.patch(
                    `/users/family/children/${childId}`,
                    childData
                );


            console.log(
                "UPDATE CHILD RESPONSE:",
                response?.data
            );


            if (
                response?.data?.success
            ) {

                Alert.alert(
                    "Child Updated",
                    response?.data?.message ||
                    "Child details updated successfully."
                );


                setEditing(false);


                // =====================================
                // RELOAD ACTUAL CHILD
                // =====================================

                await fetchChild();

                return;
            }


            setError(
                response?.data?.message ||
                "Unable to update child."
            );

        }
        catch (error) {

            console.log(
                "UPDATE CHILD ERROR:",
                error?.response?.data ||
                error?.message
            );


            setError(
                error?.response?.data?.message ||
                "Unable to update child. Please try again."
            );

        }
        finally {

            setSaving(false);

        }

    };


    // =================================================
    // REMOVE CHILD
    // =================================================

    const handleRemoveChild = () => {

        if (
            !childId ||
            removing
        ) {

            return;
        }


        const name =
            `${child?.firstName || ""} ${
                child?.lastName || ""
            }`.trim();


        Alert.alert(
            "Remove Child",
            `Are you sure you want to remove ${
                name || "this child"
            } from your family?`,
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },

                {
                    text: "Remove",
                    style: "destructive",

                    onPress:
                        confirmRemoveChild,
                },
            ]
        );

    };


    // =================================================
    // CONFIRM REMOVE
    // =================================================

    const confirmRemoveChild =
        async () => {

            try {

                setRemoving(true);

                setError("");


                console.log(
                    "REMOVING CHILD:",
                    childId
                );


                const response =
                    await api.patch(
                        `/users/family/children/${childId}/remove`
                    );


                console.log(
                    "REMOVE CHILD RESPONSE:",
                    response?.data
                );


                if (
                    response?.data?.success
                ) {

                    Alert.alert(
                        "Child Removed",
                        response?.data?.message ||
                        "Child has been removed.",
                        [
                            {
                                text: "OK",

                                onPress: () => {

                                    router.replace(
                                        "/my-children"
                                    );

                                },
                            },
                        ]
                    );

                    return;
                }


                setError(
                    response?.data?.message ||
                    "Unable to remove child."
                );

            }
            catch (error) {

                console.log(
                    "REMOVE CHILD ERROR:",
                    error?.response?.data ||
                    error?.message
                );


                setError(
                    error?.response?.data?.message ||
                    "Unable to remove child. Please try again."
                );

            }
            finally {

                setRemoving(false);

            }

        };


    // =================================================
    // CANCEL EDIT
    // =================================================

    const handleCancelEdit = () => {

        if (!child) {
            return;
        }


        setFirstName(
            child.firstName || ""
        );

        setLastName(
            child.lastName || ""
        );

        setGender(
            child.gender || ""
        );

        setDateOfBirth(
            child.dateOfBirth || ""
        );

        setError("");

        setEditing(false);

    };


    // =================================================
    // BACK
    // =================================================

    const handleBack = () => {
    if (router.canGoBack()) {
        router.back();
    } else {
        router.replace("/profile");
    }
};


    // =================================================
    // ATTENDANCE
    // =================================================
const handleAttendance = () => {
    if (!childId) {
        Alert.alert(
            "Error",
            "Child information is missing."
        );

        return;
    }

    router.push({
        pathname: "/child-attendance",
        params: {
            childId: String(childId),
        },
    });
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
                    Loading child details...
                </Text>

            </View>

        );

    }


    // =================================================
    // ERROR WITHOUT CHILD
    // =================================================

    if (
        error &&
        !child
    ) {

        return (

            <View
                style={
                    styles.loadingContainer
                }
            >

                <Ionicons
                    name="alert-circle-outline"
                    size={45}
                    color="#dc2626"
                />

                <Text
                    style={
                        styles.errorTitle
                    }
                >
                    Unable to Load Child
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
                        fetchChild
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


                <TouchableOpacity
                    style={
                        styles.backTextButton
                    }
                    onPress={
                        handleBack
                    }
                >

                    <Text
                        style={
                            styles.backText
                        }
                    >
                        Go Back
                    </Text>

                </TouchableOpacity>

            </View>

        );

    }


    // =================================================
    // DISPLAY DATA
    // =================================================

    const displayName =
        `${child?.firstName || ""} ${
            child?.lastName || ""
        }`.trim();


    const formattedDate =
        child?.dateOfBirth
            ? new Date(
                child.dateOfBirth
            ).toLocaleDateString()
            : "Not provided";


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
                    disabled={
                        saving ||
                        removing
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
                        Child Details
                    </Text>

                    <Text
                        style={
                            styles.subtitle
                        }
                    >
                        Manage child information
                    </Text>

                </View>

            </View>


            <ScrollView
                contentContainerStyle={
                    styles.scrollContent
                }
                showsVerticalScrollIndicator={
                    false
                }
            >

                {/* =====================================
                    ERROR
                ====================================== */}

                {error ? (

                    <View
                        style={
                            styles.errorBox
                        }
                    >

                        <Ionicons
                            name="alert-circle-outline"
                            size={22}
                            color="#dc2626"
                        />

                        <Text
                            style={
                                styles.errorText
                            }
                        >
                            {error}
                        </Text>

                    </View>

                ) : null}


                {/* =====================================
                    PROFILE
                ====================================== */}

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
                            {child?.firstName
                                ? child.firstName
                                    .charAt(0)
                                    .toUpperCase()
                                : "C"}
                        </Text>

                    </View>


                    <Text
                        style={
                            styles.profileName
                        }
                    >
                        {displayName}
                    </Text>


                    <Text
                        style={
                            styles.profileType
                        }
                    >
                        Family Member
                    </Text>

                </View>


                {/* =====================================
                    EDIT FORM
                ====================================== */}

                {editing ? (

                    <View
                        style={
                            styles.card
                        }
                    >

                        <Text
                            style={
                                styles.sectionTitle
                            }
                        >
                            Edit Child
                        </Text>


                        {/* FIRST NAME */}

                        <Text
                            style={
                                styles.label
                            }
                        >
                            First Name *
                        </Text>

                        <View
                            style={
                                styles.inputContainer
                            }
                        >

                            <Ionicons
                                name="person-outline"
                                size={20}
                                color="#777777"
                            />

                            <TextInput
                                style={
                                    styles.input
                                }
                                value={
                                    firstName
                                }
                                onChangeText={
                                    setFirstName
                                }
                                placeholder="First name"
                                placeholderTextColor="#999999"
                                autoCapitalize="words"
                                editable={
                                    !saving
                                }
                            />

                        </View>


                        {/* LAST NAME */}

                        <Text
                            style={
                                styles.label
                            }
                        >
                            Last Name
                        </Text>

                        <View
                            style={
                                styles.inputContainer
                            }
                        >

                            <Ionicons
                                name="person-outline"
                                size={20}
                                color="#777777"
                            />

                            <TextInput
                                style={
                                    styles.input
                                }
                                value={
                                    lastName
                                }
                                onChangeText={
                                    setLastName
                                }
                                placeholder="Last name"
                                placeholderTextColor="#999999"
                                autoCapitalize="words"
                                editable={
                                    !saving
                                }
                            />

                        </View>


                        {/* GENDER */}

                        <Text
                            style={
                                styles.label
                            }
                        >
                            Gender *
                        </Text>

                        <View
                            style={
                                styles.genderContainer
                            }
                        >

                            <TouchableOpacity
                                style={[
                                    styles.genderButton,

                                    gender === "Male" &&
                                    styles.genderButtonSelected,
                                ]}
                                onPress={() =>
                                    setGender("Male")
                                }
                                disabled={
                                    saving
                                }
                            >

                                <Ionicons
                                    name="male-outline"
                                    size={21}
                                    color={
                                        gender === "Male"
                                            ? "#ffffff"
                                            : "#0f2a5f"
                                    }
                                />

                                <Text
                                    style={[
                                        styles.genderText,

                                        gender === "Male" &&
                                        styles.genderTextSelected,
                                    ]}
                                >
                                    Male
                                </Text>

                            </TouchableOpacity>


                            <TouchableOpacity
                                style={[
                                    styles.genderButton,

                                    gender === "Female" &&
                                    styles.genderButtonSelected,
                                ]}
                                onPress={() =>
                                    setGender("Female")
                                }
                                disabled={
                                    saving
                                }
                            >

                                <Ionicons
                                    name="female-outline"
                                    size={21}
                                    color={
                                        gender === "Female"
                                            ? "#ffffff"
                                            : "#0f2a5f"
                                    }
                                />

                                <Text
                                    style={[
                                        styles.genderText,

                                        gender === "Female" &&
                                        styles.genderTextSelected,
                                    ]}
                                >
                                    Female
                                </Text>

                            </TouchableOpacity>

                        </View>


                        {/* DATE OF BIRTH */}

                        <Text
                            style={
                                styles.label
                            }
                        >
                            Date of Birth
                        </Text>

                        <View
                            style={
                                styles.inputContainer
                            }
                        >

                            <Ionicons
                                name="calendar-outline"
                                size={20}
                                color="#777777"
                            />

                            <TextInput
                                style={
                                    styles.input
                                }
                                value={
                                    dateOfBirth
                                }
                                onChangeText={
                                    setDateOfBirth
                                }
                                placeholder="YYYY-MM-DD"
                                placeholderTextColor="#999999"
                                keyboardType="numbers-and-punctuation"
                                maxLength={10}
                                editable={
                                    !saving
                                }
                            />

                        </View>


                        {/* SAVE */}

                        <TouchableOpacity
                            style={[
                                styles.primaryButton,

                                saving &&
                                styles.disabledButton,
                            ]}
                            onPress={
                                handleUpdateChild
                            }
                            disabled={
                                saving
                            }
                            activeOpacity={0.8}
                        >

                            {saving ? (

                                <ActivityIndicator
                                    size="small"
                                    color="#ffffff"
                                />

                            ) : (

                                <Ionicons
                                    name="checkmark-outline"
                                    size={21}
                                    color="#ffffff"
                                />

                            )}

                            <Text
                                style={
                                    styles.primaryButtonText
                                }
                            >
                                {saving
                                    ? "Saving..."
                                    : "Save Changes"}
                            </Text>

                        </TouchableOpacity>


                        {/* CANCEL */}

                        <TouchableOpacity
                            style={
                                styles.cancelButton
                            }
                            onPress={
                                handleCancelEdit
                            }
                            disabled={
                                saving
                            }
                        >

                            <Text
                                style={
                                    styles.cancelButtonText
                                }
                            >
                                Cancel
                            </Text>

                        </TouchableOpacity>

                    </View>

                ) : (

                    <>
                        {/* =================================
                            INFORMATION
                        ================================== */}

                        <View
                            style={
                                styles.card
                            }
                        >

                            <View
                                style={
                                    styles.sectionHeader
                                }
                            >

                                <Text
                                    style={
                                        styles.sectionTitle
                                    }
                                >
                                    Information
                                </Text>


                                <TouchableOpacity
                                    style={
                                        styles.editIconButton
                                    }
                                    onPress={() =>
                                        setEditing(true)
                                    }
                                >

                                    <Ionicons
                                        name="create-outline"
                                        size={20}
                                        color="#0f2a5f"
                                    />

                                </TouchableOpacity>

                            </View>


                            {/* NAME */}

                            <View
                                style={
                                    styles.infoRow
                                }
                            >

                                <Ionicons
                                    name="person-outline"
                                    size={21}
                                    color="#0f2a5f"
                                />

                                <View
                                    style={
                                        styles.infoContent
                                    }
                                >

                                    <Text
                                        style={
                                            styles.infoLabel
                                        }
                                    >
                                        Full Name
                                    </Text>

                                    <Text
                                        style={
                                            styles.infoValue
                                        }
                                    >
                                        {displayName}
                                    </Text>

                                </View>

                            </View>


                            {/* GENDER */}

                            <View
                                style={
                                    styles.infoRow
                                }
                            >

                                <Ionicons
                                    name={
                                        child?.gender ===
                                        "Female"
                                            ? "female-outline"
                                            : "male-outline"
                                    }
                                    size={21}
                                    color="#0f2a5f"
                                />

                                <View
                                    style={
                                        styles.infoContent
                                    }
                                >

                                    <Text
                                        style={
                                            styles.infoLabel
                                        }
                                    >
                                        Gender
                                    </Text>

                                    <Text
                                        style={
                                            styles.infoValue
                                        }
                                    >
                                        {child?.gender ||
                                            "Not provided"}
                                    </Text>

                                </View>

                            </View>


                            {/* DOB */}

                            <View
                                style={
                                    styles.infoRow
                                }
                            >

                                <Ionicons
                                    name="calendar-outline"
                                    size={21}
                                    color="#0f2a5f"
                                />

                                <View
                                    style={
                                        styles.infoContent
                                    }
                                >

                                    <Text
                                        style={
                                            styles.infoLabel
                                        }
                                    >
                                        Date of Birth
                                    </Text>

                                    <Text
                                        style={
                                            styles.infoValue
                                        }
                                    >
                                        {formattedDate}
                                    </Text>

                                </View>

                            </View>


                            {/* MEMBERSHIP NUMBER */}

                            {child?.membershipNumber ? (

                                <View
                                    style={
                                        styles.infoRow
                                    }
                                >

                                    <Ionicons
                                        name="card-outline"
                                        size={21}
                                        color="#0f2a5f"
                                    />

                                    <View
                                        style={
                                            styles.infoContent
                                        }
                                    >

                                        <Text
                                            style={
                                                styles.infoLabel
                                            }
                                        >
                                            Membership Number
                                        </Text>

                                        <Text
                                            style={
                                                styles.infoValue
                                            }
                                        >
                                            {
                                                child.membershipNumber
                                            }
                                        </Text>

                                    </View>

                                </View>

                            ) : null}

                        </View>


                        {/* =================================
                            ATTENDANCE
                        ================================== */}

                        <TouchableOpacity
                            style={
                                styles.actionCard
                            }
                            onPress={
                                handleAttendance
                            }
                            activeOpacity={0.8}
                        >

                            <View
                                style={
                                    styles.actionIcon
                                }
                            >

                                <Ionicons
                                    name="calendar-outline"
                                    size={25}
                                    color="#0f2a5f"
                                />

                            </View>


                            <View
                                style={
                                    styles.actionContent
                                }
                            >

                                <Text
                                    style={
                                        styles.actionTitle
                                    }
                                >
                                    Attendance
                                </Text>

                                <Text
                                    style={
                                        styles.actionText
                                    }
                                >
                                    View this child's attendance
                                    history
                                </Text>

                            </View>


                            <Ionicons
                                name="chevron-forward"
                                size={22}
                                color="#8a8a8a"
                            />

                        </TouchableOpacity>


                        {/* =================================
                            REMOVE
                        ================================== */}

                        <TouchableOpacity
                            style={
                                styles.removeButton
                            }
                            onPress={
                                handleRemoveChild
                            }
                            disabled={
                                removing
                            }
                            activeOpacity={0.8}
                        >

                            {removing ? (

                                <ActivityIndicator
                                    size="small"
                                    color="#dc2626"
                                />

                            ) : (

                                <Ionicons
                                    name="trash-outline"
                                    size={20}
                                    color="#dc2626"
                                />

                            )}

                            <Text
                                style={
                                    styles.removeButtonText
                                }
                            >
                                {removing
                                    ? "Removing..."
                                    : "Remove Child"}
                            </Text>

                        </TouchableOpacity>

                    </>

                )}

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

        fontSize: 26,

        fontWeight: "800",

        color: "#0f2a5f",

    },

    subtitle: {

        marginTop: 3,

        fontSize: 13,

        color: "#777777",

    },

    scrollContent: {

        padding: 20,

        paddingBottom: 45,

    },

    profileCard: {

        backgroundColor: "#ffffff",

        borderRadius: 16,

        padding: 25,

        alignItems: "center",

        marginBottom: 20,

    },

    avatar: {

        width: 80,

        height: 80,

        borderRadius: 40,

        backgroundColor: "#0f2a5f",

        justifyContent: "center",

        alignItems: "center",

        marginBottom: 12,

    },

    avatarText: {

        color: "#ffffff",

        fontSize: 30,

        fontWeight: "800",

    },

    profileName: {

        fontSize: 21,

        fontWeight: "800",

        color: "#222222",

        textAlign: "center",

    },

    profileType: {

        marginTop: 4,

        fontSize: 13,

        color: "#777777",

    },

    card: {

        backgroundColor: "#ffffff",

        borderRadius: 16,

        padding: 20,

        marginBottom: 15,

    },

    sectionHeader: {

        flexDirection: "row",

        alignItems: "center",

        justifyContent: "space-between",

        marginBottom: 8,

    },

    sectionTitle: {

        fontSize: 18,

        fontWeight: "800",

        color: "#222222",

    },

    editIconButton: {

        width: 38,

        height: 38,

        borderRadius: 19,

        backgroundColor: "#eef3ff",

        justifyContent: "center",

        alignItems: "center",

    },

    infoRow: {

        flexDirection: "row",

        alignItems: "center",

        paddingVertical: 13,

        borderBottomWidth: 1,

        borderBottomColor: "#f0f0f0",

    },

    infoContent: {

        flex: 1,

        marginLeft: 13,

    },

    infoLabel: {

        fontSize: 11,

        color: "#999999",

        marginBottom: 3,

    },

    infoValue: {

        fontSize: 14,

        fontWeight: "700",

        color: "#222222",

    },

    actionCard: {

        backgroundColor: "#ffffff",

        borderRadius: 16,

        padding: 18,

        flexDirection: "row",

        alignItems: "center",

        marginBottom: 15,

    },

    actionIcon: {

        width: 50,

        height: 50,

        borderRadius: 25,

        backgroundColor: "#eef3ff",

        justifyContent: "center",

        alignItems: "center",

    },

    actionContent: {

        flex: 1,

        marginLeft: 14,

        marginRight: 10,

    },

    actionTitle: {

        fontSize: 16,

        fontWeight: "800",

        color: "#222222",

    },

    actionText: {

        marginTop: 4,

        fontSize: 12,

        lineHeight: 17,

        color: "#777777",

    },

    removeButton: {

        height: 52,

        borderRadius: 12,

        borderWidth: 1,

        borderColor: "#fecaca",

        backgroundColor: "#fef2f2",

        flexDirection: "row",

        justifyContent: "center",

        alignItems: "center",

        marginTop: 5,

    },

    removeButtonText: {

        marginLeft: 8,

        color: "#dc2626",

        fontSize: 14,

        fontWeight: "800",

    },

    label: {

        fontSize: 14,

        fontWeight: "700",

        color: "#222222",

        marginTop: 15,

        marginBottom: 8,

    },

    inputContainer: {

        height: 52,

        backgroundColor: "#ffffff",

        borderWidth: 1,

        borderColor: "#dddddd",

        borderRadius: 12,

        paddingHorizontal: 15,

        flexDirection: "row",

        alignItems: "center",

    },

    input: {

        flex: 1,

        marginLeft: 10,

        fontSize: 15,

        color: "#222222",

    },

    genderContainer: {

        flexDirection: "row",

        gap: 12,

    },

    genderButton: {

        flex: 1,

        height: 52,

        backgroundColor: "#ffffff",

        borderWidth: 1,

        borderColor: "#dddddd",

        borderRadius: 12,

        flexDirection: "row",

        alignItems: "center",

        justifyContent: "center",

        gap: 8,

    },

    genderButtonSelected: {

        backgroundColor: "#0f2a5f",

        borderColor: "#0f2a5f",

    },

    genderText: {

        fontSize: 14,

        fontWeight: "700",

        color: "#0f2a5f",

    },

    genderTextSelected: {

        color: "#ffffff",

    },

    primaryButton: {

        height: 54,

        backgroundColor: "#0f2a5f",

        borderRadius: 12,

        flexDirection: "row",

        alignItems: "center",

        justifyContent: "center",

        gap: 9,

        marginTop: 22,

    },

    disabledButton: {

        opacity: 0.7,

    },

    primaryButtonText: {

        color: "#ffffff",

        fontSize: 15,

        fontWeight: "800",

    },

    cancelButton: {

        height: 48,

        justifyContent: "center",

        alignItems: "center",

        marginTop: 5,

    },

    cancelButtonText: {

        color: "#666666",

        fontSize: 14,

        fontWeight: "700",

    },

    errorBox: {

        backgroundColor: "#fef2f2",

        borderWidth: 1,

        borderColor: "#fecaca",

        borderRadius: 12,

        padding: 14,

        flexDirection: "row",

        alignItems: "center",

        marginBottom: 15,

    },

    errorText: {

        flex: 1,

        marginLeft: 9,

        fontSize: 13,

        lineHeight: 19,

        color: "#dc2626",

        fontWeight: "600",

    },

    errorTitle: {

        marginTop: 15,

        fontSize: 18,

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

        paddingHorizontal: 25,

        paddingVertical: 12,

        marginTop: 20,

    },

    retryText: {

        color: "#ffffff",

        fontSize: 14,

        fontWeight: "700",

    },

    backTextButton: {

        marginTop: 15,

        padding: 10,

    },

    backText: {

        color: "#0f2a5f",

        fontSize: 14,

        fontWeight: "700",

    },

});