import {
    View,
    Text,
    StyleSheet,
} from "react-native";


export default function ProfileScreen() {

    return (

        <View style={styles.container}>

            <Text style={styles.title}>
                Profile
            </Text>

            <Text style={styles.subtitle}>
                Your profile will appear here.
            </Text>

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
        alignItems: "center",
        padding: 20,
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