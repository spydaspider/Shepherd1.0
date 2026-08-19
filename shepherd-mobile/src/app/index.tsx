import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from "react-native";

import {
    useRouter,
} from "expo-router";

import {
    useSelector,
} from "react-redux";


export default function HomeScreen() {

    const router = useRouter();

    const user = useSelector(
        state => state.auth.user
    );


    const firstName =
        user?.firstName || "Member";


    return (

        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
        >

            <View style={styles.header}>

                <View>

                    <Text style={styles.welcome}>
                        Welcome back 👋
                    </Text>

                    <Text style={styles.name}>
                        {firstName}
                    </Text>

                </View>

            </View>


            <View style={styles.serviceCard}>

                <Text style={styles.smallText}>
                    TODAY'S SERVICE
                </Text>

                <Text style={styles.serviceTitle}>
                    Sunday Worship
                </Text>

                <Text style={styles.serviceTime}>
                    10:00 AM
                </Text>


                <TouchableOpacity
                    style={styles.attendanceButton}
                    onPress={() =>
                        router.push("/attendance")
                    }
                >

                    <Text style={styles.attendanceButtonText}>
                        Mark Attendance
                    </Text>

                </TouchableOpacity>

            </View>


            <Text style={styles.sectionTitle}>
                Your Overview
            </Text>


            <View style={styles.statsRow}>

                <View style={styles.statCard}>

                    <Text style={styles.statNumber}>
                        3
                    </Text>

                    <Text style={styles.statLabel}>
                        Attended
                    </Text>

                </View>


                <View style={styles.statCard}>

                    <Text style={styles.statNumber}>
                        1
                    </Text>

                    <Text style={styles.statLabel}>
                        Missed
                    </Text>

                </View>

            </View>


            <View style={styles.infoCard}>

                <Text style={styles.infoTitle}>
                    Attendance this month
                </Text>

                <Text style={styles.infoText}>
                    You have attended 3 of 4 services this month.
                </Text>

            </View>


        </ScrollView>

    );
}


const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#f4f6fb",
    },

    content: {
        padding: 20,
        paddingBottom: 40,
    },

    header: {
        marginBottom: 25,
    },

    welcome: {
        fontSize: 15,
        color: "#666",
    },

    name: {
        fontSize: 30,
        fontWeight: "800",
        color: "#0f2a5f",
        marginTop: 3,
    },

    serviceCard: {
        backgroundColor: "#0f2a5f",
        borderRadius: 18,
        padding: 22,
        marginBottom: 28,
    },

    smallText: {
        color: "#cbd5e1",
        fontSize: 12,
        fontWeight: "700",
        letterSpacing: 1,
    },

    serviceTitle: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "800",
        marginTop: 8,
    },

    serviceTime: {
        color: "#dbe4f5",
        fontSize: 15,
        marginTop: 5,
    },

    attendanceButton: {
        backgroundColor: "#fff",
        paddingVertical: 13,
        borderRadius: 10,
        marginTop: 20,
        alignItems: "center",
    },

    attendanceButtonText: {
        color: "#0f2a5f",
        fontWeight: "700",
        fontSize: 15,
    },

    sectionTitle: {
        fontSize: 20,
        fontWeight: "800",
        color: "#222",
        marginBottom: 12,
    },

    statsRow: {
        flexDirection: "row",
        gap: 12,
    },

    statCard: {
        flex: 1,
        backgroundColor: "#fff",
        borderRadius: 15,
        padding: 20,
    },

    statNumber: {
        fontSize: 30,
        fontWeight: "800",
        color: "#0f2a5f",
    },

    statLabel: {
        color: "#666",
        marginTop: 5,
    },

    infoCard: {
        backgroundColor: "#fff",
        borderRadius: 15,
        padding: 20,
        marginTop: 15,
    },

    infoTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: "#222",
    },

    infoText: {
        color: "#666",
        marginTop: 7,
        lineHeight: 21,
    },

});