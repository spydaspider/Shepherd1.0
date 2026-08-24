import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from "react-native";

import {
    useRouter,
} from "expo-router";


export default function AttendanceScreen() {

  


    return (

        <View style={styles.container}>

            {/* =====================================================
                Back Button
            ===================================================== */}

            


            {/* =====================================================
                Attendance Content
            ===================================================== */}

            <View style={styles.content}>

                <Text style={styles.title}>
                    Attendance
                </Text>


                <Text style={styles.subtitle}>
                    Your attendance will appear here.
                </Text>

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
        padding: 20,
    },


    // =====================================================
    // Back Button
    // =====================================================

    backButton: {
        alignSelf: "flex-start",
        paddingVertical: 10,
        paddingHorizontal: 4,
    },


    backText: {
        color: "#0f2a5f",
        fontSize: 16,
        fontWeight: "700",
    },


    // =====================================================
    // Content
    // =====================================================

    content: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },


    title: {
        fontSize: 28,
        fontWeight: "800",
        color: "#0f2a5f",
    },


    subtitle: {
        color: "#666",
        marginTop: 8,
    },

});