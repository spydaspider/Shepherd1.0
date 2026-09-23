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
} from "react-native";

import {
    useRouter,
} from "expo-router";

import api from "../api/axios";


// =====================================================
// Forgot Password Screen
// =====================================================

export default function ForgotPasswordScreen() {

    const router = useRouter();


    // =================================================
    // Form State
    // =================================================

    const [email, setEmail] = useState("");

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [successMessage, setSuccessMessage] = useState("");


    // =================================================
    // Handle Forgot Password
    // =================================================

    const handleForgotPassword = async () => {

        setError("");

        setSuccessMessage("");


        // ---------------------------------------------
        // Validate Email
        // ---------------------------------------------

        const cleanEmail = email.trim().toLowerCase();

        if (!cleanEmail) {

            setError(
                "Please enter your email address."
            );

            return;
        }


        // Basic email validation

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(cleanEmail)) {

            setError(
                "Please enter a valid email address."
            );

            return;
        }


        try {

            setLoading(true);


            // -----------------------------------------
            // Request Password Reset
            // -----------------------------------------

            const response = await api.post(
                "/auth/forgot-password",
                {
                    identifier: cleanEmail,
                }
            );


            const data = response?.data;


            console.log(
                "FORGOT PASSWORD RESPONSE:",
                data
            );


            // -----------------------------------------
            // Check Response
            // -----------------------------------------

            if (!data?.success) {

                setError(
                    data?.message ||
                    "Unable to request password reset."
                );

                return;
            }


            // -----------------------------------------
            // Show Success Message
            // -----------------------------------------

            setSuccessMessage(
                "A 6-digit reset code has been sent to your email."
            );


            // -----------------------------------------
            // Navigate To Verification Screen
            // -----------------------------------------

            setTimeout(() => {

                router.replace({
                    pathname: "/verify-reset-code",

                    params: {
                        identifier: cleanEmail,
                    },
                });

            }, 700);

        }

        catch (error) {

            console.log(
                "FORGOT PASSWORD ERROR:",
                error?.response?.data ||
                error?.message ||
                error
            );


            if (error?.response?.data) {

                setError(
                    error.response.data.message ||
                    "Unable to request password reset."
                );

            }

            else if (error?.request) {

                setError(
                    "Unable to connect to Shepherd. Please check your internet connection and try again."
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
    // Go Back To Login
    // =================================================

    const handleBackToLogin = () => {

        if (loading) {
            return;
        }

        router.replace("/login");

    };


    // =================================================
    // Render
    // =================================================

    return (

        <View style={styles.container}>

            <View style={styles.header}>

                <Text style={styles.logo}>
                    Shepherd
                </Text>

                <Text style={styles.title}>
                    Forgot Password
                </Text>

                <Text style={styles.subtitle}>
                    Enter the email address associated
                    with your Shepherd account.
                </Text>

            </View>


            <View style={styles.form}>

                <Text style={styles.label}>
                    Email Address
                </Text>


                <TextInput
                    style={[
                        styles.input,
                        error && styles.inputError,
                    ]}

                    placeholder="Enter your email address"

                    value={email}

                    onChangeText={(value) => {

                        setEmail(value);

                        if (error) {
                            setError("");
                        }

                        if (successMessage) {
                            setSuccessMessage("");
                        }

                    }}

                    keyboardType="email-address"

                    autoCapitalize="none"

                    autoCorrect={false}

                    autoComplete="email"

                    editable={!loading}
                />


                {error ? (

                    <View style={styles.errorContainer}>

                        <Text style={styles.errorIcon}>
                            !
                        </Text>

                        <Text style={styles.errorText}>
                            {error}
                        </Text>

                    </View>

                ) : null}


                {successMessage ? (

                    <View style={styles.successContainer}>

                        <Text style={styles.successText}>
                            {successMessage}
                        </Text>

                    </View>

                ) : null}


                <TouchableOpacity
                    style={[
                        styles.button,
                        loading &&
                        styles.buttonDisabled,
                    ]}

                    onPress={handleForgotPassword}

                    disabled={loading}
                >

                    {loading ? (

                        <ActivityIndicator
                            color="#fff"
                        />

                    ) : (

                        <Text style={styles.buttonText}>
                            Send Reset Code
                        </Text>

                    )}

                </TouchableOpacity>


                <TouchableOpacity
                    style={styles.backButton}

                    onPress={handleBackToLogin}

                    disabled={loading}
                >

                    <Text style={styles.backButtonText}>
                        Back to Login
                    </Text>

                </TouchableOpacity>

            </View>

        </View>

    );

}


// =====================================================
// Styles
// =====================================================

const styles = StyleSheet.create({

    container: {

        flex: 1,

        backgroundColor: "#f4f6fb",

        justifyContent: "center",

        paddingHorizontal: 25,

    },


    header: {

        alignItems: "center",

        marginBottom: 35,

    },


    logo: {

        fontSize: 36,

        fontWeight: "800",

        color: "#0f2a5f",

        marginBottom: 20,

    },


    title: {

        fontSize: 25,

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

        paddingHorizontal: 10,

    },


    form: {

        width: "100%",

    },


    label: {

        fontSize: 14,

        fontWeight: "600",

        color: "#333",

        marginBottom: 8,

    },


    input: {

        backgroundColor: "#fff",

        borderWidth: 1,

        borderColor: "#ddd",

        borderRadius: 12,

        paddingHorizontal: 15,

        paddingVertical: 14,

        fontSize: 16,

    },


    inputError: {

        borderColor: "#d32f2f",

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

        marginTop: 15,

    },


    errorIcon: {

        width: 22,

        height: 22,

        borderRadius: 11,

        backgroundColor: "#d32f2f",

        color: "#fff",

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

        marginTop: 15,

    },


    successText: {

        color: "#267238",

        fontSize: 14,

        lineHeight: 20,

    },


    button: {

        backgroundColor: "#0f2a5f",

        paddingVertical: 16,

        borderRadius: 12,

        marginTop: 25,

        alignItems: "center",

    },


    buttonDisabled: {

        opacity: 0.7,

    },


    buttonText: {

        color: "#fff",

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