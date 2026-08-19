import {
    useState,
} from "react";

import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
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
    // State
    // =================================================

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);


    // =================================================
    // Handle Login
    // =================================================

    const handleLogin = async () => {

        // ---------------------------------------------
        // Validate Input
        // ---------------------------------------------

        if (!email.trim() || !password) {

            Alert.alert(
                "Missing Information",
                "Please enter your email and password."
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
                    email: email.trim().toLowerCase(),
                    password,
                }
            );


            // -----------------------------------------
            // Get Response Data
            // -----------------------------------------

            const {
                token,
                user,
            } = response.data;


            // -----------------------------------------
            // Make Sure Login Returned Required Data
            // -----------------------------------------

            if (!token || !user) {

                throw new Error(
                    "Invalid login response from server."
                );

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
                error.response?.data || error.message
            );


            Alert.alert(
                "Login Failed",
                error.response?.data?.message ||
                "Unable to login. Please check your email and password."
            );

        }
        finally {

            setLoading(false);

        }

    };


    // =================================================
    // UI
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
                Login Form
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
                    onChangeText={setEmail}
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
                    onChangeText={setPassword}
                    secureTextEntry
                    autoCapitalize="none"
                    editable={!loading}
                />


                {/* Login Button */}

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


    button: {

        backgroundColor: "#0f2a5f",

        paddingVertical: 16,

        borderRadius: 12,

        marginTop: 30,

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