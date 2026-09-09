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
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from "react-native";

import {
    useRouter,
} from "expo-router";

import AsyncStorage from "@react-native-async-storage/async-storage";

import {
    useDispatch,
} from "react-redux";

import api from "../api/axios";

import {
    loginSuccess,
} from "../store/authSlice";


// =====================================================
// Register Screen
// =====================================================

export default function RegisterScreen() {

    const router = useRouter();

    const dispatch = useDispatch();


    // =================================================
    // Form State
    // =================================================

    const [firstName, setFirstName] = useState("");

    const [lastName, setLastName] = useState("");

    const [email, setEmail] = useState("");

    const [phone, setPhone] = useState("");

    const [password, setPassword] = useState("");

    const [confirmPassword, setConfirmPassword] = useState("");

    const [gender, setGender] = useState("");

    const [dateOfBirth, setDateOfBirth] = useState("");

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");


    // =================================================
    // Handle Registration
    // =================================================

    const handleRegister = async () => {

        // Clear previous messages
        setError("");
        setSuccess("");


        // ---------------------------------------------
        // Validate First Name
        // ---------------------------------------------

        if (!firstName.trim()) {

            setError(
                "Please enter your first name."
            );

            return;

        }


        // ---------------------------------------------
        // Validate Last Name
        // ---------------------------------------------

        if (!lastName.trim()) {

            setError(
                "Please enter your last name."
            );

            return;

        }


        // ---------------------------------------------
        // Validate Email or Phone
        // ---------------------------------------------

        if (
            !email.trim() &&
            !phone.trim()
        ) {

            setError(
                "Please enter either an email address or phone number."
            );

            return;

        }


        // ---------------------------------------------
        // Validate Password
        // ---------------------------------------------

        if (!password) {

            setError(
                "Please enter a password."
            );

            return;

        }


        if (password.length < 6) {

            setError(
                "Password must be at least 6 characters."
            );

            return;

        }


        // ---------------------------------------------
        // Confirm Password
        // ---------------------------------------------

        if (!confirmPassword) {

            setError(
                "Please confirm your password."
            );

            return;

        }


        if (password !== confirmPassword) {

            setError(
                "Passwords do not match."
            );

            return;

        }


        // ---------------------------------------------
        // Validate Gender
        // ---------------------------------------------

        if (!gender) {

            setError(
                "Please select your gender."
            );

            return;

        }


        try {

            setLoading(true);


            // -----------------------------------------
            // Prepare Registration Data
            // -----------------------------------------

            const registrationData = {

                firstName:
                    firstName.trim(),

                lastName:
                    lastName.trim(),

                email:
                    email.trim()
                        ? email.trim().toLowerCase()
                        : undefined,

                phone:
                    phone.trim()
                        ? phone.trim()
                        : undefined,

                password,

                gender,

                dateOfBirth:
                    dateOfBirth.trim()
                        ? dateOfBirth.trim()
                        : null,
            };


            // -----------------------------------------
            // Registration Request
            // -----------------------------------------

            const response = await api.post(
                "/auth/register",
                registrationData
            );


            // -----------------------------------------
            // Get Response
            // -----------------------------------------

            const {
                token,
                user,
            } = response.data;


            // -----------------------------------------
            // Validate Response
            // -----------------------------------------

            if (!token || !user) {

                setError(
                    "Registration failed. The server returned an invalid response."
                );

                return;

            }


            // -----------------------------------------
            // Save Token
            // -----------------------------------------

            await AsyncStorage.setItem(
                "token",
                token
            );


            // -----------------------------------------
            // Save User
            // -----------------------------------------

            await AsyncStorage.setItem(
                "user",
                JSON.stringify(user)
            );


            // -----------------------------------------
            // Update Redux
            // -----------------------------------------

            dispatch(
                loginSuccess({
                    token,
                    user,
                })
            );


            // -----------------------------------------
            // Success
            // -----------------------------------------

            setSuccess(
                "Account created successfully."
            );


            // -----------------------------------------
            // Go To Home
            // -----------------------------------------

            router.replace("/");

        }
        catch (error) {

            console.log(
                "MOBILE REGISTRATION ERROR:",
                error.response?.data ||
                error.message
            );


            // -----------------------------------------
            // Backend Error
            // -----------------------------------------

            if (
                error.response &&
                error.response.data
            ) {

                setError(
                    error.response.data.message ||
                    "Unable to create your account."
                );

            }

            // -----------------------------------------
            // Server Unreachable
            // -----------------------------------------

            else if (
                error.request
            ) {

                setError(
                    "Unable to connect to Shepherd. Please check your internet connection and try again."
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
                showsVerticalScrollIndicator={false}
            >

                <View style={styles.container}>

                    {/* =================================
                        Header
                    ================================== */}

                    <View style={styles.header}>

                        <Text style={styles.logo}>
                            Shepherd
                        </Text>

                        <Text style={styles.subtitle}>
                            Create your member account
                        </Text>

                    </View>


                    {/* =================================
                        Form
                    ================================== */}

                    <View style={styles.form}>


                        {/* First Name */}

                        <Text style={styles.label}>
                            First Name *
                        </Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Enter your first name"
                            value={firstName}
                            onChangeText={(value) => {

                                setFirstName(value);

                                if (error) {
                                    setError("");
                                }

                            }}
                            autoCapitalize="words"
                            autoCorrect={false}
                            editable={!loading}
                        />


                        {/* Last Name */}

                        <Text style={styles.label}>
                            Last Name *
                        </Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Enter your last name"
                            value={lastName}
                            onChangeText={(value) => {

                                setLastName(value);

                                if (error) {
                                    setError("");
                                }

                            }}
                            autoCapitalize="words"
                            autoCorrect={false}
                            editable={!loading}
                        />


                        {/* Email */}

                        <Text style={styles.label}>
                            Email Address
                        </Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Enter your email (optional)"
                            value={email}
                            onChangeText={(value) => {

                                setEmail(value);

                                if (error) {
                                    setError("");
                                }

                            }}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                            editable={!loading}
                        />


                        {/* Phone */}

                        <Text style={styles.label}>
                            Phone Number
                        </Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Enter your phone number (optional)"
                            value={phone}
                            onChangeText={(value) => {

                                setPhone(value);

                                if (error) {
                                    setError("");
                                }

                            }}
                            keyboardType="phone-pad"
                            autoCorrect={false}
                            editable={!loading}
                        />


                        <Text style={styles.helperText}>
                            Enter at least an email address or phone number.
                        </Text>


                        {/* Password */}

                        <Text style={styles.label}>
                            Password *
                        </Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Create a password"
                            value={password}
                            onChangeText={(value) => {

                                setPassword(value);

                                if (error) {
                                    setError("");
                                }

                            }}
                            secureTextEntry
                            autoCapitalize="none"
                            autoCorrect={false}
                            editable={!loading}
                        />


                        {/* Confirm Password */}

                        <Text style={styles.label}>
                            Confirm Password *
                        </Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Enter your password again"
                            value={confirmPassword}
                            onChangeText={(value) => {

                                setConfirmPassword(value);

                                if (error) {
                                    setError("");
                                }

                            }}
                            secureTextEntry
                            autoCapitalize="none"
                            autoCorrect={false}
                            editable={!loading}
                        />


                        {/* Gender */}

                        <Text style={styles.label}>
                            Gender *
                        </Text>

                        <View style={styles.genderContainer}>

                            <TouchableOpacity
                                style={[
                                    styles.genderButton,
                                    gender === "Male" &&
                                        styles.genderButtonSelected,
                                ]}
                                onPress={() => {

                                    setGender("Male");

                                    if (error) {
                                        setError("");
                                    }

                                }}
                                disabled={loading}
                            >

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
                                onPress={() => {

                                    setGender("Female");

                                    if (error) {
                                        setError("");
                                    }

                                }}
                                disabled={loading}
                            >

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


                        {/* Date of Birth */}

                        <Text style={styles.label}>
                            Date of Birth
                        </Text>

                        <TextInput
                            style={styles.input}
                            placeholder="YYYY-MM-DD (optional)"
                            value={dateOfBirth}
                            onChangeText={(value) => {

                                setDateOfBirth(value);

                                if (error) {
                                    setError("");
                                }

                            }}
                            keyboardType="numbers-and-punctuation"
                            editable={!loading}
                        />


                        {/* =================================
                            Error Message
                        ================================== */}

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


                        {/* =================================
                            Success Message
                        ================================== */}

                        {success ? (

                            <View style={styles.successContainer}>

                                <Text style={styles.successIcon}>
                                    ✓
                                </Text>

                                <Text style={styles.successText}>
                                    {success}
                                </Text>

                            </View>

                        ) : null}


                        {/* =================================
                            Register Button
                        ================================== */}

                        <TouchableOpacity
                            style={[
                                styles.button,
                                loading &&
                                    styles.buttonDisabled,
                            ]}
                            onPress={handleRegister}
                            disabled={loading}
                        >

                            {loading ? (

                                <ActivityIndicator
                                    color="#fff"
                                />

                            ) : (

                                <Text style={styles.buttonText}>
                                    Create Account
                                </Text>

                            )}

                        </TouchableOpacity>


                        {/* =================================
                            Back To Login
                        ================================== */}

                        <TouchableOpacity
                            style={styles.loginLink}
                            onPress={() => {
                                router.replace("/login");
                            }}
                            disabled={loading}
                        >

                            <Text style={styles.loginLinkText}>
                                Already have an account?{" "}
                                <Text style={styles.loginLinkBold}>
                                    Sign In
                                </Text>
                            </Text>

                        </TouchableOpacity>

                    </View>

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

    },


    scrollContainer: {

        flexGrow: 1,

    },


    container: {

        flex: 1,

        backgroundColor: "#f4f6fb",

        paddingHorizontal: 25,

        paddingVertical: 45,

    },


    header: {

        alignItems: "center",

        marginBottom: 25,

    },


    logo: {

        fontSize: 38,

        fontWeight: "800",

        color: "#0f2a5f",

    },


    subtitle: {

        marginTop: 5,

        fontSize: 16,

        color: "#666",

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

        marginTop: 15,

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


    helperText: {

        marginTop: 7,

        fontSize: 12,

        color: "#777",

    },


    // =================================================
    // Gender
    // =================================================

    genderContainer: {

        flexDirection: "row",

        gap: 12,

    },


    genderButton: {

        flex: 1,

        backgroundColor: "#fff",

        borderWidth: 1,

        borderColor: "#ddd",

        borderRadius: 12,

        paddingVertical: 14,

        alignItems: "center",

    },


    genderButtonSelected: {

        backgroundColor: "#0f2a5f",

        borderColor: "#0f2a5f",

    },


    genderText: {

        fontSize: 16,

        fontWeight: "600",

        color: "#555",

    },


    genderTextSelected: {

        color: "#fff",

    },


    // =================================================
    // Error
    // =================================================

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


    // =================================================
    // Success
    // =================================================

    successContainer: {

        flexDirection: "row",

        alignItems: "center",

        backgroundColor: "#edfdf3",

        borderWidth: 1,

        borderColor: "#a6e9bd",

        borderRadius: 10,

        paddingHorizontal: 12,

        paddingVertical: 11,

        marginTop: 15,

    },


    successIcon: {

        width: 22,

        height: 22,

        borderRadius: 11,

        backgroundColor: "#18864b",

        color: "#fff",

        textAlign: "center",

        lineHeight: 22,

        fontWeight: "800",

        marginRight: 10,

    },


    successText: {

        flex: 1,

        color: "#176b3a",

        fontSize: 14,

        lineHeight: 20,

    },


    // =================================================
    // Register Button
    // =================================================

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


    // =================================================
    // Login Link
    // =================================================

    loginLink: {

        alignItems: "center",

        marginTop: 20,

        paddingVertical: 10,

    },


    loginLinkText: {

        fontSize: 14,

        color: "#666",

    },


    loginLinkBold: {

        color: "#0f2a5f",

        fontWeight: "700",

    },

});