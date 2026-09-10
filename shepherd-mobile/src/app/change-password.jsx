import { useState } from "react";

import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ActivityIndicator,
} from "react-native";

import { useRouter } from "expo-router";

import { useDispatch } from "react-redux";

import AsyncStorage from "@react-native-async-storage/async-storage";

import api from "../api/axios";

import { loginSuccess } from "../store/authSlice";


const ChangePassword = () => {

    const router = useRouter();

    const dispatch = useDispatch();


    const [currentPassword, setCurrentPassword] =
        useState("");

    const [newPassword, setNewPassword] =
        useState("");

    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [showCurrentPassword, setShowCurrentPassword] =
        useState(false);

    const [showNewPassword, setShowNewPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    // =====================================
    // Change Password
    // =====================================

    const handleChangePassword = async () => {

        setError("");
        setSuccess("");


        // =====================================
        // Basic validation
        // =====================================

        if (
            !currentPassword ||
            !newPassword ||
            !confirmPassword
        ) {

            setError(
                "Please complete all password fields."
            );

            return;
        }


        if (newPassword.length < 6) {

            setError(
                "New password must be at least 6 characters."
            );

            return;
        }


        if (newPassword !== confirmPassword) {

            setError(
                "New passwords do not match."
            );

            return;
        }


        try {

            setLoading(true);


            // =====================================
            // Call backend
            // PATCH /api/auth/change-password
            // =====================================

            const response = await api.patch(
                "/auth/change-password",
                {
                    currentPassword,
                    newPassword,
                    confirmPassword,
                }
            );


            const data = response.data;


            console.log(
                "PASSWORD CHANGE RESPONSE:",
                data
            );


            // =====================================
            // Get new token and user
            // =====================================

            const token =
                data?.token;

            const user =
                data?.user;


            if (!token || !user) {

                setError(
                    "Password changed, but the login session could not be updated."
                );

                return;
            }


            // =====================================
            // Save new session
            // =====================================

            await AsyncStorage.setItem(
                "token",
                token
            );

            await AsyncStorage.setItem(
                "user",
                JSON.stringify(user)
            );


            // =====================================
            // Update Redux session
            // =====================================

            dispatch(
                loginSuccess({
                    token,
                    user,
                })
            );


            setSuccess(
                "Password changed successfully."
            );


            // =====================================
            // Go to Home
            // =====================================

            setTimeout(() => {

                router.replace("/");

            }, 500);


        } catch (error) {

            console.log(
                "CHANGE PASSWORD ERROR:",
                error?.response?.data || error
            );


            setError(
                error?.response?.data?.message ||
                "Unable to change password. Please try again."
            );

        } finally {

            setLoading(false);

        }
    };


    return (

        <KeyboardAvoidingView
            style={styles.container}
            behavior={
                Platform.OS === "ios"
                    ? "padding"
                    : undefined
            }
        >

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >

                <View style={styles.card}>

                    {/* =====================================
                        Header
                    ===================================== */}

                    <View style={styles.header}>

                        <Text style={styles.title}>
                            Change Password
                        </Text>

                        <Text style={styles.subtitle}>
                            Please create a new password before
                            continuing to Shepherd.
                        </Text>

                    </View>


                    {/* =====================================
                        First Login Notice
                    ===================================== */}

                    <View style={styles.notice}>

                        <Text style={styles.noticeTitle}>
                            First login
                        </Text>

                        <Text style={styles.noticeText}>
                            You are using a temporary password.
                            Please change it to a password that
                            only you know.
                        </Text>

                    </View>


                    {/* =====================================
                        Error
                    ===================================== */}

                    {error ? (

                        <View style={styles.errorBox}>

                            <Text style={styles.errorText}>
                                {error}
                            </Text>

                        </View>

                    ) : null}


                    {/* =====================================
                        Success
                    ===================================== */}

                    {success ? (

                        <View style={styles.successBox}>

                            <Text style={styles.successText}>
                                {success}
                            </Text>

                        </View>

                    ) : null}


                    {/* =====================================
                        Current Password
                    ===================================== */}

                    <View style={styles.inputGroup}>

                        <Text style={styles.label}>
                            Current Password
                        </Text>

                        <View style={styles.passwordContainer}>

                            <TextInput
                                style={styles.passwordInput}
                                value={currentPassword}
                                onChangeText={
                                    setCurrentPassword
                                }
                                placeholder="Enter temporary password"
                                placeholderTextColor="#888"
                                secureTextEntry={
                                    !showCurrentPassword
                                }
                                autoCapitalize="none"
                                autoCorrect={false}
                            />

                            <TouchableOpacity
                                style={styles.showButton}
                                onPress={() =>
                                    setShowCurrentPassword(
                                        !showCurrentPassword
                                    )
                                }
                            >

                                <Text style={styles.showText}>
                                    {showCurrentPassword
                                        ? "Hide"
                                        : "Show"}
                                </Text>

                            </TouchableOpacity>

                        </View>

                    </View>


                    {/* =====================================
                        New Password
                    ===================================== */}

                    <View style={styles.inputGroup}>

                        <Text style={styles.label}>
                            New Password
                        </Text>

                        <View style={styles.passwordContainer}>

                            <TextInput
                                style={styles.passwordInput}
                                value={newPassword}
                                onChangeText={
                                    setNewPassword
                                }
                                placeholder="Enter new password"
                                placeholderTextColor="#888"
                                secureTextEntry={
                                    !showNewPassword
                                }
                                autoCapitalize="none"
                                autoCorrect={false}
                            />

                            <TouchableOpacity
                                style={styles.showButton}
                                onPress={() =>
                                    setShowNewPassword(
                                        !showNewPassword
                                    )
                                }
                            >

                                <Text style={styles.showText}>
                                    {showNewPassword
                                        ? "Hide"
                                        : "Show"}
                                </Text>

                            </TouchableOpacity>

                        </View>

                    </View>


                    {/* =====================================
                        Confirm Password
                    ===================================== */}

                    <View style={styles.inputGroup}>

                        <Text style={styles.label}>
                            Confirm New Password
                        </Text>

                        <View style={styles.passwordContainer}>

                            <TextInput
                                style={styles.passwordInput}
                                value={confirmPassword}
                                onChangeText={
                                    setConfirmPassword
                                }
                                placeholder="Confirm new password"
                                placeholderTextColor="#888"
                                secureTextEntry={
                                    !showConfirmPassword
                                }
                                autoCapitalize="none"
                                autoCorrect={false}
                            />

                            <TouchableOpacity
                                style={styles.showButton}
                                onPress={() =>
                                    setShowConfirmPassword(
                                        !showConfirmPassword
                                    )
                                }
                            >

                                <Text style={styles.showText}>
                                    {showConfirmPassword
                                        ? "Hide"
                                        : "Show"}
                                </Text>

                            </TouchableOpacity>

                        </View>

                    </View>


                    {/* =====================================
                        Password Requirements
                    ===================================== */}

                    <View style={styles.requirements}>

                        <Text style={styles.requirementsTitle}>
                            Password requirements
                        </Text>

                        <Text style={styles.requirement}>
                            • At least 6 characters
                        </Text>

                        <Text style={styles.requirement}>
                            • Must be different from your current password
                        </Text>

                        <Text style={styles.requirement}>
                            • New password and confirmation must match
                        </Text>

                    </View>


                    {/* =====================================
                        Submit
                    ===================================== */}

                    <TouchableOpacity
                        style={[
                            styles.button,
                            loading &&
                                styles.buttonDisabled,
                        ]}
                        onPress={handleChangePassword}
                        disabled={loading}
                    >

                        {loading ? (

                            <ActivityIndicator
                                size="small"
                                color="#ffffff"
                            />

                        ) : (

                            <Text style={styles.buttonText}>
                                Change Password
                            </Text>

                        )}

                    </TouchableOpacity>

                </View>

            </ScrollView>

        </KeyboardAvoidingView>
    );
};


const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#f4f6f8",
    },

    scrollContent: {
        flexGrow: 1,
        justifyContent: "center",
        padding: 20,
    },

    card: {
        backgroundColor: "#ffffff",
        borderRadius: 16,
        padding: 24,
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 6,
    },

    header: {
        marginBottom: 20,
    },

    title: {
        fontSize: 28,
        fontWeight: "700",
        color: "#0f2a5f",
        marginBottom: 8,
    },

    subtitle: {
        fontSize: 15,
        color: "#666666",
        lineHeight: 22,
    },

    notice: {
        backgroundColor: "#eef3ff",
        borderRadius: 10,
        padding: 14,
        marginBottom: 20,
    },

    noticeTitle: {
        fontSize: 15,
        fontWeight: "700",
        color: "#0f2a5f",
        marginBottom: 4,
    },

    noticeText: {
        fontSize: 14,
        color: "#445",
        lineHeight: 20,
    },

    errorBox: {
        backgroundColor: "#fdecec",
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
    },

    errorText: {
        color: "#b42318",
        fontSize: 14,
        lineHeight: 20,
    },

    successBox: {
        backgroundColor: "#ecfdf3",
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
    },

    successText: {
        color: "#027a48",
        fontSize: 14,
        lineHeight: 20,
    },

    inputGroup: {
        marginBottom: 18,
    },

    label: {
        fontSize: 14,
        fontWeight: "600",
        color: "#333333",
        marginBottom: 7,
    },

    passwordContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#d0d5dd",
        borderRadius: 10,
        backgroundColor: "#ffffff",
    },

    passwordInput: {
        flex: 1,
        height: 52,
        paddingHorizontal: 14,
        fontSize: 16,
        color: "#222222",
    },

    showButton: {
        paddingHorizontal: 14,
        paddingVertical: 10,
    },

    showText: {
        color: "#0f2a5f",
        fontSize: 14,
        fontWeight: "600",
    },

    requirements: {
        backgroundColor: "#f8f9fa",
        borderRadius: 10,
        padding: 14,
        marginBottom: 20,
    },

    requirementsTitle: {
        fontSize: 14,
        fontWeight: "700",
        color: "#333333",
        marginBottom: 7,
    },

    requirement: {
        fontSize: 13,
        color: "#666666",
        marginBottom: 4,
        lineHeight: 19,
    },

    button: {
        height: 52,
        backgroundColor: "#0f2a5f",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },

    buttonDisabled: {
        opacity: 0.7,
    },

    buttonText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "700",
    },

});


export default ChangePassword;