import {
    useEffect,
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
    useLocalSearchParams,
    useRouter,
} from "expo-router";

import api from "../api/axios";


// =====================================================
// Verify Reset Code Screen
// =====================================================

export default function VerifyResetCodeScreen() {

    const router = useRouter();

    const params = useLocalSearchParams();

    const identifier =
        params?.identifier || "";


    // =================================================
    // Form State
    // =================================================

    const [code, setCode] = useState("");

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [successMessage, setSuccessMessage] = useState("");


    // =================================================
    // Development Code
    // =================================================

    useEffect(() => {

        if (params?.resetCode) {

            console.log(
                "DEVELOPMENT RESET CODE:",
                params.resetCode
            );

        }

    }, [params?.resetCode]);


    // =================================================
    // Handle Code Input
    // =================================================

    const handleCodeChange = (value) => {

        // Only allow numbers

        const numericValue =
            value.replace(
                /[^0-9]/g,
                ""
            );


        // Maximum 6 digits

        const limitedValue =
            numericValue.slice(
                0,
                6
            );


        setCode(
            limitedValue
        );


        if (error) {

            setError("");

        }


        if (successMessage) {

            setSuccessMessage("");

        }

    };


    // =================================================
    // Verify Reset Code
    // =================================================

    const handleVerifyCode = async () => {

        setError("");

        setSuccessMessage("");


        // ---------------------------------------------
        // Validate identifier
        // ---------------------------------------------

        if (!identifier) {

            setError(
                "Your reset request is missing the email or phone number."
            );

            return;

        }


        // ---------------------------------------------
        // Validate code
        // ---------------------------------------------

        if (!code) {

            setError(
                "Please enter the reset code."
            );

            return;

        }


        if (code.length !== 6) {

            setError(
                "Please enter the complete 6-digit reset code."
            );

            return;

        }


        try {

            setLoading(true);


            console.log(
                "VERIFYING RESET CODE..."
            );


            console.log(
                "IDENTIFIER:",
                identifier
            );


            console.log(
                "CODE:",
                code
            );


            // -----------------------------------------
            // Verify code
            // -----------------------------------------

            const response =
                await api.post(
                    "/auth/verify-reset-code",
                    {
                        identifier:
                            String(identifier),

                        code:
                            code,
                    }
                );


            const data =
                response?.data;


            console.log(
                "VERIFY RESET CODE RESPONSE:",
                data
            );


            // -----------------------------------------
            // Check response
            // -----------------------------------------

            if (!data?.success) {

                setError(
                    data?.message ||
                    "Unable to verify the reset code."
                );

                return;

            }


            // -----------------------------------------
            // Verification successful
            // -----------------------------------------

            setSuccessMessage(
                "Code verified successfully."
            );


            // -----------------------------------------
            // Go to reset password
            // -----------------------------------------

            setTimeout(() => {

                router.replace({

                    pathname:
                        "/reset-password",

                    params: {

                        identifier:
                            String(identifier),

                    },

                });

            }, 500);

        }
        catch (error) {

            console.log(
                "VERIFY RESET CODE ERROR:",
                error?.response?.data ||
                error?.message ||
                error
            );


            // -----------------------------------------
            // Backend error
            // -----------------------------------------

            if (
                error?.response?.data
            ) {

                setError(
                    error.response.data.message ||
                    "Unable to verify the reset code."
                );

            }

            // -----------------------------------------
            // Server unavailable
            // -----------------------------------------

            else if (
                error?.request
            ) {

                setError(
                    "Unable to connect to Shepherd. Please check your internet connection and try again."
                );

            }

            // -----------------------------------------
            // Other error
            // -----------------------------------------

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
    // Go Back
    // =================================================

    const handleBack = () => {

        if (loading) {

            return;

        }


        router.replace(
            "/forgot-password"
        );

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
                    Verify Reset Code
                </Text>


                <Text style={styles.subtitle}>
                    Enter the 6-digit code sent to your
                    email address or phone number.
                </Text>


                {identifier ? (

                    <Text
                        style={
                            styles.identifier
                        }
                    >
                        {String(identifier)}
                    </Text>

                ) : null}

            </View>


            <View style={styles.form}>

                <Text style={styles.label}>
                    Reset Code
                </Text>


                <TextInput
                    style={[
                        styles.codeInput,
                        error &&
                        styles.inputError,
                    ]}
                    placeholder="000000"
                    value={code}
                    onChangeText={
                        handleCodeChange
                    }
                    keyboardType="number-pad"
                    maxLength={6}
                    editable={!loading}
                    autoFocus
                    textAlign="center"
                />


                <Text style={styles.codeHint}>
                    Enter the 6-digit code.
                </Text>


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


                <TouchableOpacity
                    style={[
                        styles.button,
                        loading &&
                        styles.buttonDisabled,
                    ]}
                    onPress={
                        handleVerifyCode
                    }
                    disabled={loading}
                >

                    {loading ? (

                        <ActivityIndicator
                            color="#fff"
                        />

                    ) : (

                        <Text
                            style={
                                styles.buttonText
                            }
                        >
                            Verify Code
                        </Text>

                    )}

                </TouchableOpacity>


                <TouchableOpacity
                    style={
                        styles.backButton
                    }
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


    identifier: {

        fontSize: 14,

        fontWeight: "600",

        color: "#0f2a5f",

        marginTop: 10,

        textAlign: "center",

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


    codeInput: {

        backgroundColor: "#fff",

        borderWidth: 1,

        borderColor: "#ddd",

        borderRadius: 12,

        paddingHorizontal: 15,

        paddingVertical: 15,

        fontSize: 28,

        fontWeight: "700",

        letterSpacing: 8,

        color: "#222",

    },


    inputError: {

        borderColor: "#d32f2f",

    },


    codeHint: {

        fontSize: 13,

        color: "#777",

        marginTop: 8,

        textAlign: "center",

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