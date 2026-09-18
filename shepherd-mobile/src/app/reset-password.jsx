import {
    useState,
} from "react";

import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from "react-native";

import {
    useLocalSearchParams,
    useRouter,
} from "expo-router";

import {
    useDispatch,
} from "react-redux";

import AsyncStorage from "@react-native-async-storage/async-storage";

import api from "../api/axios";

import {
    loginSuccess,
} from "../store/authSlice";


// =====================================================
// Reset Password Screen
// =====================================================

export default function ResetPasswordScreen() {

    const router = useRouter();

    const dispatch = useDispatch();

    const params = useLocalSearchParams();

    const identifier =
        params?.identifier
            ? String(params.identifier)
            : "";


    // =================================================
    // Form State
    // =================================================

    const [newPassword, setNewPassword] =
        useState("");

    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [showPassword, setShowPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [successMessage, setSuccessMessage] =
        useState("");


    // =================================================
    // Reset Password
    // =================================================

    const handleResetPassword = async () => {

        setError("");

        setSuccessMessage("");


        // ---------------------------------------------
        // Validate Identifier
        // ---------------------------------------------

        if (!identifier.trim()) {

            setError(
                "Your account information is missing. Please restart the password reset process."
            );

            return;
        }


        // ---------------------------------------------
        // Validate Password
        // ---------------------------------------------

        if (!newPassword) {

            setError(
                "Please enter your new password."
            );

            return;
        }


        if (!confirmPassword) {

            setError(
                "Please confirm your new password."
            );

            return;
        }


        if (newPassword.length < 6) {

            setError(
                "Password must contain at least 6 characters."
            );

            return;
        }


        if (newPassword !== confirmPassword) {

            setError(
                "Passwords do not match."
            );

            return;
        }


        try {

            setLoading(true);


            console.log(
                "RESET PASSWORD REQUEST:",
                {
                    identifier,
                }
            );


            // -----------------------------------------
            // Send Reset Password Request
            // -----------------------------------------

            const response = await api.post(
                "/auth/reset-password",
                {
                    identifier:
                        identifier.trim(),

                    newPassword,

                    confirmPassword,
                }
            );


            const data =
                response?.data;


            console.log(
                "RESET PASSWORD RESPONSE:",
                data
            );


            // -----------------------------------------
            // Check Response
            // -----------------------------------------

            if (!data?.success) {

                setError(
                    data?.message ||
                    "Unable to reset your password."
                );

                return;
            }


            // -----------------------------------------
            // Save New Session
            // -----------------------------------------

            if (
                data?.token &&
                data?.user
            ) {

                await AsyncStorage.setItem(
                    "token",
                    data.token
                );


                await AsyncStorage.setItem(
                    "user",
                    JSON.stringify(data.user)
                );


                dispatch(
                    loginSuccess({
                        token: data.token,

                        user: data.user,
                    })
                );

            }


            // -----------------------------------------
            // Success
            // -----------------------------------------

            setSuccessMessage(
                "Your password has been reset successfully."
            );


            // -----------------------------------------
            // Go To Dashboard
            // -----------------------------------------

            setTimeout(() => {

                router.replace("/");

            }, 1000);

        }
        catch (error) {

            console.log(
                "RESET PASSWORD ERROR:",
                error?.response?.data ||
                error?.message ||
                error
            );


            if (
                error?.response?.data
            ) {

                setError(
                    error.response.data.message ||
                    "Unable to reset your password."
                );

            }
            else if (
                error?.request
            ) {

                setError(
                    "Unable to connect to Shepherd. Please check your connection and try again."
                );

            }
            else {

                setError(
                    "Something went wrong. Please try again."
                );

            }

        }
        finally {

            setLoading(false);

        }

    };


    // =================================================
    // Back
    // =================================================

    const handleBack = () => {

        if (loading) {
            return;
        }


        router.back();

    };


    // =================================================
    // Render
    // =================================================

    return (

        <KeyboardAvoidingView
            style={styles.keyboardContainer}

            behavior={
                Platform.OS === "ios"
                    ? "padding"
                    : undefined
            }
        >

            <ScrollView
                contentContainerStyle={
                    styles.scrollContainer
                }

                keyboardShouldPersistTaps="handled"
            >

                <View style={styles.container}>


                    {/* =================================
                        Header
                    ================================= */}

                    <View style={styles.header}>

                        <Text style={styles.logo}>
                            Shepherd
                        </Text>


                        <Text style={styles.title}>
                            Create New Password
                        </Text>


                        <Text style={styles.subtitle}>
                            Enter a new password for your
                            Shepherd account.
                        </Text>

                    </View>


                    {/* =================================
                        Account
                    ================================= */}

                    <View style={styles.accountBox}>

                        <Text style={styles.accountLabel}>
                            Account
                        </Text>


                        <Text
                            style={styles.accountIdentifier}
                        >
                            {identifier}
                        </Text>

                    </View>


                    {/* =================================
                        New Password
                    ================================= */}

                    <Text style={styles.label}>
                        New Password
                    </Text>


                    <View
                        style={
                            styles.passwordContainer
                        }
                    >

                        <TextInput
                            style={styles.passwordInput}

                            placeholder="Enter new password"

                            placeholderTextColor="#888"

                            value={newPassword}

                            onChangeText={(value) => {

                                setNewPassword(value);

                                if (error) {
                                    setError("");
                                }

                            }}

                            secureTextEntry={
                                !showPassword
                            }

                            autoCapitalize="none"

                            autoCorrect={false}

                            editable={!loading}
                        />


                        <TouchableOpacity
                            onPress={() =>
                                setShowPassword(
                                    !showPassword
                                )
                            }

                            disabled={loading}
                        >

                            <Text
                                style={styles.showText}
                            >
                                {showPassword
                                    ? "Hide"
                                    : "Show"}
                            </Text>

                        </TouchableOpacity>

                    </View>


                    {/* =================================
                        Confirm Password
                    ================================= */}

                    <Text style={styles.label}>
                        Confirm New Password
                    </Text>


                    <View
                        style={
                            styles.passwordContainer
                        }
                    >

                        <TextInput
                            style={styles.passwordInput}

                            placeholder="Confirm new password"

                            placeholderTextColor="#888"

                            value={confirmPassword}

                            onChangeText={(value) => {

                                setConfirmPassword(value);

                                if (error) {
                                    setError("");
                                }

                            }}

                            secureTextEntry={
                                !showConfirmPassword
                            }

                            autoCapitalize="none"

                            autoCorrect={false}

                            editable={!loading}
                        />


                        <TouchableOpacity
                            onPress={() =>
                                setShowConfirmPassword(
                                    !showConfirmPassword
                                )
                            }

                            disabled={loading}
                        >

                            <Text
                                style={styles.showText}
                            >
                                {showConfirmPassword
                                    ? "Hide"
                                    : "Show"}
                            </Text>

                        </TouchableOpacity>

                    </View>


                    {/* =================================
                        Password Requirement
                    ================================= */}

                    <Text style={styles.passwordHint}>
                        Password must contain at least
                        6 characters.
                    </Text>


                    {/* =================================
                        Error
                    ================================= */}

                    {error ? (

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
                                    styles.errorText
                                }
                            >
                                {error}
                            </Text>

                        </View>

                    ) : null}


                    {/* =================================
                        Success
                    ================================= */}

                    {successMessage ? (

                        <View
                            style={
                                styles.successContainer
                            }
                        >

                            <Text
                                style={
                                    styles.successText
                                }
                            >
                                {successMessage}
                            </Text>

                        </View>

                    ) : null}


                    {/* =================================
                        Reset Button
                    ================================= */}

                    <TouchableOpacity
                        style={[
                            styles.button,

                            loading &&
                            styles.buttonDisabled,
                        ]}

                        onPress={
                            handleResetPassword
                        }

                        disabled={loading}
                    >

                        {loading ? (

                            <ActivityIndicator
                                color="#ffffff"
                            />

                        ) : (

                            <Text
                                style={
                                    styles.buttonText
                                }
                            >
                                Reset Password
                            </Text>

                        )}

                    </TouchableOpacity>


                    {/* =================================
                        Back Button
                    ================================= */}

                    <TouchableOpacity
                        style={styles.backButton}

                        onPress={handleBack}

                        disabled={loading}
                    >

                        <Text
                            style={
                                styles.backButtonText
                            }
                        >
                            Back
                        </Text>

                    </TouchableOpacity>

                </View>

            </ScrollView>

        </KeyboardAvoidingView>

    );

}


// =====================================================
// Styles
// =====================================================

const styles = StyleSheet.create({

    keyboardContainer: {

        flex: 1,

        backgroundColor: "#f4f6fb",

    },


    scrollContainer: {

        flexGrow: 1,

        justifyContent: "center",

        padding: 24,

    },


    container: {

        width: "100%",

        maxWidth: 500,

        alignSelf: "center",

        backgroundColor: "#ffffff",

        borderRadius: 16,

        padding: 24,

        elevation: 4,

        shadowColor: "#000",

        shadowOffset: {

            width: 0,

            height: 2,

        },

        shadowOpacity: 0.08,

        shadowRadius: 5,

    },


    header: {

        alignItems: "center",

        marginBottom: 25,

    },


    logo: {

        fontSize: 34,

        fontWeight: "800",

        color: "#0f2a5f",

        marginBottom: 18,

    },


    title: {

        fontSize: 24,

        fontWeight: "700",

        color: "#222",

        textAlign: "center",

    },


    subtitle: {

        fontSize: 14,

        color: "#666",

        textAlign: "center",

        lineHeight: 21,

        marginTop: 10,

        paddingHorizontal: 8,

    },


    accountBox: {

        backgroundColor: "#f4f6fb",

        borderRadius: 10,

        padding: 13,

        marginBottom: 22,

    },


    accountLabel: {

        fontSize: 12,

        color: "#666",

        marginBottom: 4,

        fontWeight: "600",

    },


    accountIdentifier: {

        fontSize: 14,

        color: "#0f2a5f",

        fontWeight: "600",

    },


    label: {

        fontSize: 14,

        fontWeight: "600",

        color: "#333",

        marginBottom: 8,

    },


    passwordContainer: {

        flexDirection: "row",

        alignItems: "center",

        backgroundColor: "#ffffff",

        borderWidth: 1,

        borderColor: "#ddd",

        borderRadius: 12,

        paddingHorizontal: 14,

        marginBottom: 18,

    },


    passwordInput: {

        flex: 1,

        height: 52,

        fontSize: 16,

        color: "#222",

    },


    showText: {

        color: "#0f2a5f",

        fontSize: 13,

        fontWeight: "700",

        paddingLeft: 8,

    },


    passwordHint: {

        fontSize: 12,

        color: "#777",

        marginBottom: 18,

    },


    errorContainer: {

        flexDirection: "row",

        alignItems: "center",

        backgroundColor: "#fff1f1",

        borderWidth: 1,

        borderColor: "#f3b5b5",

        borderRadius: 10,

        paddingHorizontal: 12,

        paddingVertical: 11,

        marginBottom: 15,

    },


    errorIcon: {

        width: 22,

        height: 22,

        borderRadius: 11,

        backgroundColor: "#d32f2f",

        color: "#ffffff",

        textAlign: "center",

        lineHeight: 22,

        fontWeight: "800",

        marginRight: 10,

    },


    errorText: {

        flex: 1,

        color: "#b42318",

        fontSize: 14,

        lineHeight: 20,

    },


    successContainer: {

        backgroundColor: "#edf8ef",

        borderWidth: 1,

        borderColor: "#a8d5ad",

        borderRadius: 10,

        paddingHorizontal: 12,

        paddingVertical: 11,

        marginBottom: 15,

    },


    successText: {

        color: "#267238",

        fontSize: 14,

        lineHeight: 20,

        textAlign: "center",

    },


    button: {

        backgroundColor: "#0f2a5f",

        paddingVertical: 16,

        borderRadius: 12,

        marginTop: 5,

        alignItems: "center",

        justifyContent: "center",

    },


    buttonDisabled: {

        opacity: 0.7,

    },


    buttonText: {

        color: "#ffffff",

        fontSize: 16,

        fontWeight: "700",

    },


    backButton: {

        alignItems: "center",

        marginTop: 18,

        paddingVertical: 10,

    },


    backButtonText: {

        color: "#0f2a5f",

        fontSize: 14,

        fontWeight: "600",

    },

});