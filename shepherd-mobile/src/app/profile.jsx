import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ScrollView,
} from "react-native";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    useRouter,
} from "expo-router";

import AsyncStorage from "@react-native-async-storage/async-storage";

import {
    logout,
} from "../store/authSlice";


// =====================================================
// PROFILE SCREEN
// =====================================================

export default function ProfileScreen() {

    const dispatch = useDispatch();

    const router = useRouter();


    // =================================================
    // Redux User
    // =================================================

    const user = useSelector(
        state => state.auth.user
    );


    // =================================================
    // User Information
    // =================================================

    const firstName =
        user?.firstName || "";

    const lastName =
        user?.lastName || "";

    const fullName =
        `${firstName} ${lastName}`.trim() ||
        "Member";

    const email =
        user?.email ||
        "No email available";


    // =================================================
    // USER ROLE
    // =================================================

    const userRole =
        String(
            user?.role ||
            user?.userType ||
            user?.membershipRole ||
            ""
        ).toLowerCase();


    // =================================================
    // MANAGEMENT ACCESS
    // =================================================

    const canViewManagement =
        userRole === "admin" ||
        userRole === "pastor" ||
        userRole === "leader" ||
        userRole === "secretary";


    // =================================================
    // Handle My Children
    // =================================================

    const handleMyChildren = () => {

        router.push("/my-children");

    };


    // =================================================
    // Handle Attendance Reports
    // =================================================

    const handleAttendanceReports = () => {

        /*
         * IMPORTANT:
         *
         * Replace "/attendance-report" below with the
         * EXACT route used by your attendance report screen
         * if it has a different filename.
         */

        router.push("/secretary/attendance-report");

    };


    // =================================================
    // Handle Follow-Ups
    // =================================================

    const handleFollowUps = () => {

        router.push("/followups");

    };


    // =================================================
    // Handle Logout
    // =================================================

    const handleLogout = () => {

        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },

                {
                    text: "Logout",
                    style: "destructive",

                    onPress: async () => {

                        try {

                            // ---------------------------------
                            // Remove stored authentication
                            // ---------------------------------

                            await AsyncStorage.multiRemove([
                                "token",
                                "user",
                            ]);


                            // ---------------------------------
                            // Clear Redux authentication
                            // ---------------------------------

                            dispatch(
                                logout()
                            );

                        }
                        catch (error) {

                            console.log(
                                "LOGOUT ERROR:",
                                error
                            );

                            Alert.alert(
                                "Logout Failed",
                                "Unable to logout. Please try again."
                            );

                        }

                    },
                },
            ]
        );

    };


    // =================================================
    // Render
    // =================================================

    return (

        <ScrollView
            style={styles.container}
            contentContainerStyle={
                styles.contentContainer
            }
            showsVerticalScrollIndicator={false}
        >

            {/* =========================================
                Header
            ========================================== */}

            <View style={styles.header}>

                <Text style={styles.title}>
                    Profile
                </Text>

                <Text style={styles.subtitle}>
                    Manage your account
                </Text>

            </View>


            {/* =========================================
                Profile Card
            ========================================== */}

            <View style={styles.profileCard}>

                <View style={styles.avatar}>

                    <Text style={styles.avatarText}>
                        {firstName
                            ? firstName
                                .charAt(0)
                                .toUpperCase()
                            : "M"}
                    </Text>

                </View>


                <View style={styles.userInfo}>

                    <Text style={styles.name}>
                        {fullName}
                    </Text>

                    <Text style={styles.email}>
                        {email}
                    </Text>

                    {userRole !== "" && (
                        <Text style={styles.role}>
                            {userRole.charAt(0).toUpperCase() +
                                userRole.slice(1)}
                        </Text>
                    )}

                </View>

            </View>


            {/* =========================================
                Account Section
            ========================================== */}

            <View style={styles.section}>

                <Text style={styles.sectionTitle}>
                    Account
                </Text>


                {/* =====================================
                    MY PROFILE
                ====================================== */}

                <TouchableOpacity
                    style={styles.option}
                    onPress={() =>
                        router.push("/my-profile")
                    }
                    activeOpacity={0.7}
                >

                    <View>

                        <Text style={styles.optionTitle}>
                            My Profile
                        </Text>

                        <Text style={styles.optionDescription}>
                            View your member information
                        </Text>

                    </View>

                    <Text style={styles.arrow}>
                        →
                    </Text>

                </TouchableOpacity>


                {/* =====================================
                    MY CHILDREN
                ====================================== */}

                <TouchableOpacity
                    style={styles.option}
                    onPress={handleMyChildren}
                    activeOpacity={0.7}
                >

                    <View>

                        <Text style={styles.optionTitle}>
                            My Children
                        </Text>

                        <Text style={styles.optionDescription}>
                            Manage your children
                        </Text>

                    </View>

                    <Text style={styles.arrow}>
                        →
                    </Text>

                </TouchableOpacity>

            </View>


            {/* =========================================
                MANAGEMENT SECTION
            ========================================== */}

            {canViewManagement && (

                <View style={styles.section}>

                    <Text style={styles.sectionTitle}>
                        Management
                    </Text>


                    {/* =================================
                        ATTENDANCE REPORTS
                    ================================== */}

                    <TouchableOpacity
                        style={styles.option}
                        onPress={
                            handleAttendanceReports
                        }
                        activeOpacity={0.7}
                    >

                        <View>

                            <Text style={styles.optionTitle}>
                                Attendance Reports
                            </Text>

                            <Text style={styles.optionDescription}>
                                View attendance reports and statistics
                            </Text>

                        </View>

                        <Text style={styles.arrow}>
                            →
                        </Text>

                    </TouchableOpacity>


                    {/* =================================
                        FOLLOW-UPS
                    ================================== */}

                    <TouchableOpacity
                        style={styles.option}
                        onPress={handleFollowUps}
                        activeOpacity={0.7}
                    >

                        <View>

                            <Text style={styles.optionTitle}>
                                Follow-Ups
                            </Text>

                            <Text style={styles.optionDescription}>
                                View and manage member follow-ups
                            </Text>

                        </View>

                        <Text style={styles.arrow}>
                            →
                        </Text>

                    </TouchableOpacity>

                </View>

            )}


            {/* =========================================
                LOGOUT
            ========================================== */}

            <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
                activeOpacity={0.8}
            >

                <Text style={styles.logoutText}>
                    Logout
                </Text>

            </TouchableOpacity>

        </ScrollView>

    );

}


// =====================================================
// Styles
// =====================================================

const styles = StyleSheet.create({

    container: {

        flex: 1,

        backgroundColor: "#f4f6fb",

    },


    contentContainer: {

        padding: 20,

        paddingBottom: 40,

    },


    // =================================================
    // Header
    // =================================================

    header: {

        marginBottom: 25,

    },


    title: {

        fontSize: 30,

        fontWeight: "800",

        color: "#0f2a5f",

    },


    subtitle: {

        marginTop: 5,

        color: "#777",

        fontSize: 14,

    },


    // =================================================
    // Profile Card
    // =================================================

    profileCard: {

        backgroundColor: "#fff",

        borderRadius: 16,

        padding: 20,

        flexDirection: "row",

        alignItems: "center",

    },


    avatar: {

        width: 60,

        height: 60,

        borderRadius: 30,

        backgroundColor: "#0f2a5f",

        justifyContent: "center",

        alignItems: "center",

    },


    avatarText: {

        color: "#fff",

        fontSize: 24,

        fontWeight: "800",

    },


    userInfo: {

        marginLeft: 15,

        flex: 1,

    },


    name: {

        fontSize: 18,

        fontWeight: "800",

        color: "#222",

    },


    email: {

        marginTop: 5,

        color: "#777",

        fontSize: 14,

    },


    role: {

        marginTop: 5,

        color: "#0f2a5f",

        fontSize: 13,

        fontWeight: "700",

    },


    // =================================================
    // Sections
    // =================================================

    section: {

        marginTop: 25,

    },


    sectionTitle: {

        fontSize: 18,

        fontWeight: "800",

        color: "#222",

        marginBottom: 10,

    },


    // =================================================
    // Options
    // =================================================

    option: {

        backgroundColor: "#fff",

        borderRadius: 14,

        padding: 18,

        marginBottom: 10,

        flexDirection: "row",

        alignItems: "center",

        justifyContent: "space-between",

    },


    optionTitle: {

        fontSize: 15,

        fontWeight: "700",

        color: "#222",

    },


    optionDescription: {

        marginTop: 5,

        color: "#777",

        fontSize: 13,

    },


    arrow: {

        fontSize: 22,

        color: "#0f2a5f",

        fontWeight: "600",

    },


    // =================================================
    // Logout
    // =================================================

    logoutButton: {

        backgroundColor: "#fff",

        borderWidth: 1,

        borderColor: "#dc2626",

        borderRadius: 12,

        paddingVertical: 15,

        alignItems: "center",

        marginTop: 25,

    },


    logoutText: {

        color: "#dc2626",

        fontSize: 16,

        fontWeight: "800",

    },

});