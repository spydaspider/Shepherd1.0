import {
    useState,
} from "react";

import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from "react-native";

import {
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

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    // =================================================
    // Handle Attendance
    // =================================================

    const handleMarkAttendance = async () => {

        setError("");

        setSuccess("");


        // ---------------------------------------------
        // Validate Code
        // ---------------------------------------------

        if (!code.trim()) {

            setError(
                "Please enter the attendance code."
            );

            return;

        }


        // ---------------------------------------------
        // Clean Code
        // ---------------------------------------------

        const attendanceCode =
            code.trim();


        try {

            setLoading(true);


            // -----------------------------------------
            // Mark Attendance
            // -----------------------------------------

            const response =
                await api.post(
                    "/attendance/mark",
                    {
                        code: attendanceCode,
                        members: [],
                    }
                );


            // -----------------------------------------
            // Success
            // -----------------------------------------

            if (
                response.data?.success
            ) {

                setSuccess(
                    response.data.message ||
                    "Attendance marked successfully."
                );


                setCode("");


                // -------------------------------------
                // Return to Dashboard
                // -------------------------------------

                setTimeout(() => {

                    router.replace("/");

                }, 1500);

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
                "MOBILE MARK ATTENDANCE ERROR:",
                error.response?.data ||
                error.message
            );


            // -----------------------------------------
            // Backend Error
            // -----------------------------------------

            if (
                error.response?.data
            ) {

                setError(
                    error.response.data.message ||
                    "Unable to mark attendance."
                );

            }

            // -----------------------------------------
            // Network Error
            // -----------------------------------------

            else if (
                error.request
            ) {

                setError(
                    "Unable to connect to Shepherd. Please check your connection and try again."
                );

            }

            // -----------------------------------------
            // Other Error
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
    // Render
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

            <ScrollView
                contentContainerStyle={
                    styles.content
                }
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >

                {/* =====================================
                    Header
                ====================================== */}

                <View
                    style={styles.header}
                >

                    <Text
                        style={styles.title}
                    >
                        Mark Attendance
                    </Text>


                    <Text
                        style={styles.subtitle}
                    >
                        Enter today's attendance code
                        to record your presence.
                    </Text>

                </View>


                {/* =====================================
                    Attendance Card
                ====================================== */}

                <View
                    style={styles.card}
                >

                    <View
                        style={styles.iconCircle}
                    >

                        <Text
                            style={styles.icon}
                        >
                            ✓
                        </Text>

                    </View>


                    <Text
                        style={styles.cardTitle}
                    >
                        Attendance Code
                    </Text>


                    <Text
                        style={styles.cardDescription}
                    >
                        Enter the code displayed by
                        your church administrator.
                    </Text>


                    {/* =================================
                        Code Input
                    ================================== */}

                    <TextInput
                        style={styles.codeInput}
                        value={code}
                        onChangeText={(value) => {

                            setCode(
                                value.replace(
                                    /[^0-9]/g,
                                    ""
                                )
                            );

                            if (error) {
                                setError("");
                            }

                            if (success) {
                                setSuccess("");
                            }

                        }}
                        placeholder="Enter code"
                        placeholderTextColor="#999"
                        keyboardType="number-pad"
                        maxLength={10}
                        editable={!loading}
                        textAlign="center"
                    />


                    {/* =================================
                        Error
                    ================================== */}

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
                    ================================== */}

                    {success ? (

                        <View
                            style={
                                styles.successContainer
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
                                {success}
                            </Text>

                        </View>

                    ) : null}


                    {/* =================================
                        Submit
                    ================================== */}

                    <TouchableOpacity
                        style={[
                            styles.button,
                            loading &&
                            styles.buttonDisabled,
                        ]}
                        onPress={
                            handleMarkAttendance
                        }
                        disabled={loading}
                        activeOpacity={0.8}
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
                                Mark Attendance
                            </Text>

                        )}

                    </TouchableOpacity>

                </View>


                {/* =====================================
                    Information
                ====================================== */}

                <View
                    style={styles.infoCard}
                >

                    <Text
                        style={styles.infoTitle}
                    >
                        How it works
                    </Text>


                    <View
                        style={styles.infoRow}
                    >

                        <View
                            style={styles.numberCircle}
                        >

                            <Text
                                style={
                                    styles.numberText
                                }
                            >
                                1
                            </Text>

                        </View>


                        <Text
                            style={styles.infoText}
                        >
                            Get the attendance code
                            from the church service.
                        </Text>

                    </View>


                    <View
                        style={styles.infoRow}
                    >

                        <View
                            style={styles.numberCircle}
                        >

                            <Text
                                style={
                                    styles.numberText
                                }
                            >
                                2
                            </Text>

                        </View>


                        <Text
                            style={styles.infoText}
                        >
                            Enter the code above.
                        </Text>

                    </View>


                    <View
                        style={styles.infoRow}
                    >

                        <View
                            style={styles.numberCircle}
                        >

                            <Text
                                style={
                                    styles.numberText
                                }
                            >
                                3
                            </Text>

                        </View>


                        <Text
                            style={styles.infoText}
                        >
                            Tap Mark Attendance to
                            record your presence.
                        </Text>

                    </View>

                </View>


                {/* =====================================
                    Back Button
                ====================================== */}

                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() =>
                        router.replace("/")
                    }
                    disabled={loading}
                >

                    <Text
                        style={styles.backText}
                    >
                        ← Back to Dashboard
                    </Text>

                </TouchableOpacity>


                <View
                    style={styles.bottomSpacing}
                />

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


    content: {

        padding: 20,

        paddingTop: 35,

        paddingBottom: 40,

    },


    // =================================================
    // Header
    // =================================================

    header: {

        marginBottom: 25,

    },


    title: {

        fontSize: 29,

        fontWeight: "800",

        color: "#0f2a5f",

    },


    subtitle: {

        color: "#777",

        fontSize: 14,

        lineHeight: 21,

        marginTop: 7,

    },


    // =================================================
    // Main Card
    // =================================================

    card: {

        backgroundColor: "#fff",

        borderRadius: 18,

        padding: 24,

        alignItems: "center",

    },


    iconCircle: {

        width: 64,

        height: 64,

        borderRadius: 32,

        backgroundColor: "#eef2ff",

        justifyContent: "center",

        alignItems: "center",

        marginBottom: 15,

    },


    icon: {

        fontSize: 30,

        fontWeight: "800",

        color: "#0f2a5f",

    },


    cardTitle: {

        fontSize: 20,

        fontWeight: "800",

        color: "#222",

    },


    cardDescription: {

        color: "#777",

        fontSize: 14,

        lineHeight: 21,

        textAlign: "center",

        marginTop: 7,

        marginBottom: 20,

    },


    // =================================================
    // Code Input
    // =================================================

    codeInput: {

        width: "100%",

        height: 60,

        borderWidth: 1,

        borderColor: "#d5d9e2",

        borderRadius: 13,

        backgroundColor: "#f9fafc",

        fontSize: 28,

        fontWeight: "800",

        color: "#0f2a5f",

        letterSpacing: 5,

    },


    // =================================================
    // Button
    // =================================================

    button: {

        width: "100%",

        backgroundColor: "#0f2a5f",

        paddingVertical: 16,

        borderRadius: 12,

        marginTop: 20,

        alignItems: "center",

    },


    buttonDisabled: {

        opacity: 0.7,

    },


    buttonText: {

        color: "#fff",

        fontSize: 16,

        fontWeight: "800",

    },


    // =================================================
    // Error
    // =================================================

    errorContainer: {

        width: "100%",

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


    // =================================================
    // Success
    // =================================================

    successContainer: {

        width: "100%",

        flexDirection: "row",

        alignItems: "center",

        backgroundColor: "#ecfdf3",

        borderWidth: 1,

        borderColor: "#a7e3bd",

        borderRadius: 10,

        paddingHorizontal: 12,

        paddingVertical: 11,

        marginTop: 15,

    },


    successIcon: {

        width: 22,

        height: 22,

        borderRadius: 11,

        backgroundColor: "#16a34a",

        color: "#fff",

        textAlign: "center",

        lineHeight: 22,

        fontWeight: "800",

        marginRight: 10,

    },


    successText: {

        flex: 1,

        color: "#166534",

        fontSize: 14,

        lineHeight: 20,

        fontWeight: "600",

    },


    // =================================================
    // Information
    // =================================================

    infoCard: {

        backgroundColor: "#fff",

        borderRadius: 15,

        padding: 20,

        marginTop: 15,

    },


    infoTitle: {

        fontSize: 17,

        fontWeight: "800",

        color: "#222",

        marginBottom: 15,

    },


    infoRow: {

        flexDirection: "row",

        alignItems: "center",

        marginBottom: 15,

    },


    numberCircle: {

        width: 30,

        height: 30,

        borderRadius: 15,

        backgroundColor: "#eef2ff",

        justifyContent: "center",

        alignItems: "center",

        marginRight: 12,

    },


    numberText: {

        color: "#0f2a5f",

        fontSize: 13,

        fontWeight: "800",

    },


    infoText: {

        flex: 1,

        color: "#666",

        fontSize: 13,

        lineHeight: 19,

    },


    // =================================================
    // Back
    // =================================================

    backButton: {

        alignItems: "center",

        paddingVertical: 18,

        marginTop: 8,

    },


    backText: {

        color: "#0f2a5f",

        fontSize: 14,

        fontWeight: "700",

    },


    bottomSpacing: {

        height: 20,

    },

});