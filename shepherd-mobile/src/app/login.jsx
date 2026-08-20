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

import AsyncStorage from "@react-native-async-storage/async-storage";

import {
    useDispatch,
} from "react-redux";

import api from "../api/axios";

import {
    loginSuccess,
} from "../store/authSlice";


// =====================================================
// Login Screen
// =====================================================

export default function LoginScreen() {

    const router = useRouter();

    const dispatch = useDispatch();


    // =================================================
    // Form State
    // =================================================

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");


    // =================================================
    // Handle Login
    // =================================================

    const handleLogin = async () => {

        // Clear previous error
        setError("");


        // ---------------------------------------------
        // Validate Email
        // ---------------------------------------------

        if (!email.trim()) {

            setError(
                "Please enter your email address."
            );

            return;

        }


        // ---------------------------------------------
        // Validate Password
        // ---------------------------------------------

        if (!password) {

            setError(
                "Please enter your password."
            );

            return;

        }


        try {

            setLoading(true);


            // -----------------------------------------
            // Login Request
            // -----------------------------------------

            const response = await api.post(
                "/auth/login",
                {
                    email:
                        email
                            .trim()
                            .toLowerCase(),

                    password,
                }
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
                    "Login failed. The server returned an invalid response."
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
            // Go To Home
            // -----------------------------------------

            router.replace("/");

        }
        catch (error) {

            console.log(
                "MOBILE LOGIN ERROR:",
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
                    "Unable to login. Please check your details."
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

        <View style={styles.container}>

            {/* =========================================
                Header
            ========================================== */}

            <View style={styles.header}>

                <Text style={styles.logo}>
                    Shepherd
                </Text>

                <Text style={styles.subtitle}>
                    Member App
                </Text>

            </View>


            {/* =========================================
                Form
            ========================================== */}

            <View style={styles.form}>

                {/* Email */}

                <Text style={styles.label}>
                    Email Address
                </Text>


                <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
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


                {/* Password */}

                <Text style={styles.label}>
                    Password
                </Text>


                <TextInput
                    style={styles.input}
                    placeholder="Enter your password"
                    value={password}
                    onChangeText={(value) => {

                        setPassword(value);

                        if (error) {
                            setError("");
                        }

                    }}
                    secureTextEntry
                    autoCapitalize="none"
                    editable={!loading}
                />


                {/* =====================================
                    Error Message
                ====================================== */}

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


                {/* =====================================
                    Login Button
                ====================================== */}

                <TouchableOpacity
                    style={[
                        styles.button,
                        loading &&
                        styles.buttonDisabled,
                    ]}
                    onPress={handleLogin}
                    disabled={loading}
                >

                    {loading ? (

                        <ActivityIndicator
                            color="#fff"
                        />

                    ) : (

                        <Text style={styles.buttonText}>
                            Sign In
                        </Text>

                    )}

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

        marginBottom: 40,

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
    // Button
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

});