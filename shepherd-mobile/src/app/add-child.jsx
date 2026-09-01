import React, { useState } from "react";

import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from "react-native";

import { useRouter } from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import api from "../api/axios";


// =====================================================
// ADD CHILD SCREEN
// =====================================================

export default function AddChildScreen() {

    const router = useRouter();

    // =================================================
    // FORM STATE
    // =================================================

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [gender, setGender] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");

    // =================================================
    // UI STATE
    // =================================================

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    // =================================================
    // VALIDATE FORM
    // =================================================

    const validateForm = () => {

        setError("");

        if (!firstName.trim()) {

            setError(
                "Please enter the child's first name."
            );

            return false;
        }

        if (!gender) {

            setError(
                "Please select the child's gender."
            );

            return false;
        }

        if (dateOfBirth.trim()) {

            const date = new Date(
                dateOfBirth.trim()
            );

            if (Number.isNaN(date.getTime())) {

                setError(
                    "Please enter a valid date of birth."
                );

                return false;
            }
        }

        return true;
    };


    // =================================================
    // ADD CHILD
    // POST /api/users/family/children
    // =================================================

    const handleAddChild = async () => {

        if (!validateForm()) {
            return;
        }

        try {

            setLoading(true);
            setError("");

            const childData = {

                firstName: firstName.trim(),

                lastName: lastName.trim(),

                gender: gender,

                dateOfBirth: dateOfBirth.trim()
                    ? dateOfBirth.trim()
                    : null,
            };


            console.log(
                "ADDING CHILD:",
                childData
            );


            // =========================================
            // SEND REQUEST TO BACKEND
            // =========================================

            const response = await api.post(
                "/users/family/children",
                childData
            );


            console.log(
                "ADD CHILD RESPONSE:",
                response?.data
            );


            // =========================================
            // SUCCESS
            // =========================================

            if (response?.data?.success) {

                Alert.alert(
                    "Child Added",
                    response?.data?.message ||
                        "Child added successfully.",
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


            // =========================================
            // BACKEND RETURNED FAILURE
            // =========================================

            setError(
                response?.data?.message ||
                    "Unable to add child."
            );

        }
        catch (error) {

            console.log(
                "ADD CHILD ERROR:",
                error?.response?.data ||
                    error?.message
            );


            setError(
                error?.response?.data?.message ||
                    "Unable to add child. Please try again."
            );

        }
        finally {

            setLoading(false);
        }
    };


    // =================================================
    // CANCEL
    // =================================================

    const handleCancel = () => {

        if (loading) {
            return;
        }

        router.back();
    };


    // =================================================
    // SCREEN
    // =================================================

    return (

        <KeyboardAvoidingView
            style={styles.container}
            behavior={
                Platform.OS === "ios"
                    ? "padding"
                    : undefined
            }
        >

            {/* =========================================
                HEADER
            ========================================== */}

            <View style={styles.header}>

                <TouchableOpacity
                    style={styles.backButton}
                    onPress={handleCancel}
                    disabled={loading}
                    activeOpacity={0.7}
                >

                    <Ionicons
                        name="arrow-back"
                        size={24}
                        color="#0f2a5f"
                    />

                </TouchableOpacity>


                <View style={styles.headerText}>

                    <Text style={styles.title}>
                        Add Child
                    </Text>

                    <Text style={styles.subtitle}>
                        Register a child under your account
                    </Text>

                </View>

            </View>


            {/* =========================================
                FORM
            ========================================== */}

            <ScrollView
                contentContainerStyle={
                    styles.scrollContent
                }
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >

                {/* =====================================
                    INFORMATION
                ====================================== */}

                <View style={styles.infoCard}>

                    <View style={styles.infoIcon}>

                        <Ionicons
                            name="person-add-outline"
                            size={24}
                            color="#0f2a5f"
                        />

                    </View>


                    <View style={styles.infoText}>

                        <Text style={styles.infoTitle}>
                            Child Registration
                        </Text>

                        <Text style={styles.infoMessage}>
                            Add your child's details below.
                            The child will automatically be
                            linked to your family.
                        </Text>

                    </View>

                </View>


                {/* =====================================
                    ERROR
                ====================================== */}

                {error ? (

                    <View style={styles.errorBox}>

                        <Ionicons
                            name="alert-circle-outline"
                            size={22}
                            color="#dc2626"
                        />

                        <Text style={styles.errorText}>
                            {error}
                        </Text>

                    </View>

                ) : null}


                {/* =====================================
                    FIRST NAME
                ====================================== */}

                <View style={styles.fieldContainer}>

                    <Text style={styles.label}>

                        First Name

                        <Text style={styles.required}>
                            {" "}*
                        </Text>

                    </Text>


                    <View style={styles.inputContainer}>

                        <Ionicons
                            name="person-outline"
                            size={20}
                            color="#777"
                        />

                        <TextInput
                            style={styles.input}
                            value={firstName}
                            onChangeText={setFirstName}
                            placeholder="Enter first name"
                            placeholderTextColor="#999"
                            autoCapitalize="words"
                            editable={!loading}
                        />

                    </View>

                </View>


                {/* =====================================
                    LAST NAME
                ====================================== */}

                <View style={styles.fieldContainer}>

                    <Text style={styles.label}>
                        Last Name
                    </Text>


                    <View style={styles.inputContainer}>

                        <Ionicons
                            name="person-outline"
                            size={20}
                            color="#777"
                        />

                        <TextInput
                            style={styles.input}
                            value={lastName}
                            onChangeText={setLastName}
                            placeholder="Enter last name"
                            placeholderTextColor="#999"
                            autoCapitalize="words"
                            editable={!loading}
                        />

                    </View>


                    <Text style={styles.helperText}>
                        If left blank, the parent's last
                        name will be used.
                    </Text>

                </View>


                {/* =====================================
                    GENDER
                ====================================== */}

                <View style={styles.fieldContainer}>

                    <Text style={styles.label}>

                        Gender

                        <Text style={styles.required}>
                            {" "}*
                        </Text>

                    </Text>


                    <View style={styles.genderContainer}>

                        {/* =============================
                            MALE
                        ============================== */}

                        <TouchableOpacity
                            style={[
                                styles.genderButton,

                                gender === "Male" &&
                                    styles.genderButtonSelected,
                            ]}
                            onPress={() =>
                                setGender("Male")
                            }
                            disabled={loading}
                            activeOpacity={0.8}
                        >

                            <Ionicons
                                name="male-outline"
                                size={22}
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


                        {/* =============================
                            FEMALE
                        ============================== */}

                        <TouchableOpacity
                            style={[
                                styles.genderButton,

                                gender === "Female" &&
                                    styles.genderButtonSelected,
                            ]}
                            onPress={() =>
                                setGender("Female")
                            }
                            disabled={loading}
                            activeOpacity={0.8}
                        >

                            <Ionicons
                                name="female-outline"
                                size={22}
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

                </View>


                {/* =====================================
                    DATE OF BIRTH
                ====================================== */}

                <View style={styles.fieldContainer}>

                    <Text style={styles.label}>
                        Date of Birth
                    </Text>


                    <View style={styles.inputContainer}>

                        <Ionicons
                            name="calendar-outline"
                            size={20}
                            color="#777"
                        />

                        <TextInput
                            style={styles.input}
                            value={dateOfBirth}
                            onChangeText={setDateOfBirth}
                            placeholder="YYYY-MM-DD"
                            placeholderTextColor="#999"
                            keyboardType="numbers-and-punctuation"
                            editable={!loading}
                            maxLength={10}
                        />

                    </View>


                    <Text style={styles.helperText}>
                        Use the format YYYY-MM-DD.
                    </Text>

                </View>


                {/* =====================================
                    ADD CHILD BUTTON
                ====================================== */}

                <TouchableOpacity
                    style={[
                        styles.addButton,

                        loading &&
                            styles.addButtonDisabled,
                    ]}
                    onPress={handleAddChild}
                    disabled={loading}
                    activeOpacity={0.8}
                >

                    {loading ? (

                        <ActivityIndicator
                            size="small"
                            color="#ffffff"
                        />

                    ) : (

                        <Ionicons
                            name="person-add-outline"
                            size={21}
                            color="#ffffff"
                        />

                    )}


                    <Text style={styles.addButtonText}>

                        {loading
                            ? "Adding Child..."
                            : "Add Child"}

                    </Text>

                </TouchableOpacity>


                {/* =====================================
                    CANCEL BUTTON
                ====================================== */}

                <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={handleCancel}
                    disabled={loading}
                    activeOpacity={0.7}
                >

                    <Text style={styles.cancelButtonText}>
                        Cancel
                    </Text>

                </TouchableOpacity>


                <Text style={styles.footerText}>
                    Fields marked with * are required.
                </Text>

            </ScrollView>

        </KeyboardAvoidingView>
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

        color: "#777",
    },


    scrollContent: {

        padding: 20,

        paddingBottom: 45,
    },


    infoCard: {

        backgroundColor: "#ffffff",

        borderRadius: 16,

        padding: 18,

        flexDirection: "row",

        alignItems: "center",

        marginBottom: 22,
    },


    infoIcon: {

        width: 50,

        height: 50,

        borderRadius: 25,

        backgroundColor: "#eef3ff",

        justifyContent: "center",

        alignItems: "center",
    },


    infoText: {

        flex: 1,

        marginLeft: 14,
    },


    infoTitle: {

        fontSize: 16,

        fontWeight: "800",

        color: "#222",
    },


    infoMessage: {

        marginTop: 4,

        fontSize: 12,

        lineHeight: 18,

        color: "#777",
    },


    errorBox: {

        backgroundColor: "#fef2f2",

        borderWidth: 1,

        borderColor: "#fecaca",

        borderRadius: 12,

        padding: 14,

        flexDirection: "row",

        alignItems: "center",

        marginBottom: 20,
    },


    errorText: {

        flex: 1,

        marginLeft: 9,

        fontSize: 13,

        lineHeight: 19,

        color: "#dc2626",

        fontWeight: "600",
    },


    fieldContainer: {

        marginBottom: 20,
    },


    label: {

        fontSize: 14,

        fontWeight: "700",

        color: "#222",

        marginBottom: 8,
    },


    required: {

        color: "#dc2626",
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

        color: "#222",
    },


    helperText: {

        marginTop: 6,

        fontSize: 11,

        color: "#999",
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


    addButton: {

        height: 54,

        backgroundColor: "#0f2a5f",

        borderRadius: 12,

        flexDirection: "row",

        alignItems: "center",

        justifyContent: "center",

        gap: 9,

        marginTop: 5,
    },


    addButtonDisabled: {

        opacity: 0.7,
    },


    addButtonText: {

        color: "#ffffff",

        fontSize: 15,

        fontWeight: "800",
    },


    cancelButton: {

        height: 50,

        borderRadius: 12,

        justifyContent: "center",

        alignItems: "center",

        marginTop: 10,
    },


    cancelButtonText: {

        color: "#666666",

        fontSize: 14,

        fontWeight: "700",
    },


    footerText: {

        marginTop: 12,

        fontSize: 11,

        color: "#999",

        textAlign: "center",
    },

});