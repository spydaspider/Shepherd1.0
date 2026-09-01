import React, {
    useEffect,
    useState,
} from "react";

import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView,
    Alert,
} from "react-native";

import {
    useRouter,
} from "expo-router";

import {
    Ionicons,
} from "@expo/vector-icons";

import api from "../api/axios";


// =====================================================
// MY PROFILE SCREEN
// =====================================================

export default function MyProfileScreen() {

    const router = useRouter();


    // =================================================
    // STATE
    // =================================================

    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // =================================================
    // LOAD PROFILE
    // =================================================

    const fetchProfile = async () => {

        try {

            setLoading(true);

            setError("");


            const response = await api.get(
                "/users/profile"
            );


            console.log(
                "PROFILE RESPONSE:",
                response?.data
            );


            if (response?.data?.success) {

                setUser(
                    response.data.user
                );

            }
            else {

                setError(
                    response?.data?.message ||
                    "Unable to load your profile."
                );

            }

        }
        catch (error) {

            console.log(
                "FETCH PROFILE ERROR:",
                error?.response?.data ||
                error?.message
            );


            setError(
                error?.response?.data?.message ||
                "Unable to load your profile. Please try again."
            );

        }
        finally {

            setLoading(false);

        }

    };


    // =================================================
    // LOAD PROFILE WHEN SCREEN OPENS
    // =================================================

    useEffect(() => {

        fetchProfile();

    }, []);


    // =================================================
    // BACK
    // =================================================

    const handleBack = () => {

        if (router.canGoBack()) {

            router.back();

        }
        else {

            router.replace("/profile");

        }

    };


    // =================================================
    // FORMAT DATE
    // =================================================

    const formatDate = (date) => {

        if (!date) {

            return "Not provided";

        }


        try {

            return new Date(
                date
            ).toLocaleDateString(
                "en-GB",
                {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                }
            );

        }
        catch (error) {

            return "Not provided";

        }

    };


    // =================================================
    // LOADING
    // =================================================

    if (loading) {

        return (

            <View
                style={
                    styles.loadingContainer
                }
            >

                <ActivityIndicator
                    size="large"
                    color="#0f2a5f"
                />

                <Text
                    style={
                        styles.loadingText
                    }
                >
                    Loading your profile...
                </Text>

            </View>

        );

    }


    // =================================================
    // ERROR
    // =================================================

    if (error && !user) {

        return (

            <View
                style={
                    styles.loadingContainer
                }
            >

                <Ionicons
                    name="alert-circle-outline"
                    size={48}
                    color="#dc2626"
                />


                <Text
                    style={
                        styles.errorTitle
                    }
                >
                    Unable to Load Profile
                </Text>


                <Text
                    style={
                        styles.errorMessage
                    }
                >
                    {error}
                </Text>


                <TouchableOpacity
                    style={
                        styles.retryButton
                    }
                    onPress={
                        fetchProfile
                    }
                    activeOpacity={0.8}
                >

                    <Text
                        style={
                            styles.retryText
                        }
                    >
                        Try Again
                    </Text>

                </TouchableOpacity>


                <TouchableOpacity
                    style={
                        styles.backTextButton
                    }
                    onPress={
                        handleBack
                    }
                >

                    <Text
                        style={
                            styles.backText
                        }
                    >
                        Go Back
                    </Text>

                </TouchableOpacity>

            </View>

        );

    }


    // =================================================
    // USER INFORMATION
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
        "Not provided";


    const phone =
        user?.phone ||
        "Not provided";


    const gender =
        user?.gender ||
        "Not provided";


    const membershipNumber =
        user?.membershipNumber ||
        "Not provided";


    const membershipType =
        user?.membershipType ||
        "Not provided";


    const status =
        user?.status ||
        "Active";


    const dateOfBirth =
        formatDate(
            user?.dateOfBirth
        );


    const joinedDate =
        formatDate(
            user?.createdAt
        );


    // =================================================
    // SCREEN
    // =================================================

    return (

        <View
            style={
                styles.container
            }
        >

            {/* =========================================
                HEADER
            ========================================== */}

            <View
                style={
                    styles.header
                }
            >

                <TouchableOpacity
                    style={
                        styles.backButton
                    }
                    onPress={
                        handleBack
                    }
                    activeOpacity={0.7}
                >

                    <Ionicons
                        name="arrow-back"
                        size={24}
                        color="#0f2a5f"
                    />

                </TouchableOpacity>


                <View
                    style={
                        styles.headerText
                    }
                >

                    <Text
                        style={
                            styles.title
                        }
                    >
                        My Profile
                    </Text>


                    <Text
                        style={
                            styles.subtitle
                        }
                    >
                        Your member information
                    </Text>

                </View>

            </View>


            {/* =========================================
                CONTENT
            ========================================== */}

            <ScrollView
                contentContainerStyle={
                    styles.scrollContent
                }
                showsVerticalScrollIndicator={
                    false
                }
            >

                {/* =====================================
                    PROFILE HEADER
                ====================================== */}

                <View
                    style={
                        styles.profileCard
                    }
                >

                    <View
                        style={
                            styles.avatar
                        }
                    >

                        <Text
                            style={
                                styles.avatarText
                            }
                        >
                            {firstName
                                ? firstName
                                    .charAt(0)
                                    .toUpperCase()
                                : "M"}
                        </Text>

                    </View>


                    <Text
                        style={
                            styles.profileName
                        }
                    >
                        {fullName}
                    </Text>


                    <Text
                        style={
                            styles.profileType
                        }
                    >
                        {membershipType}
                    </Text>


                    <View
                        style={
                            styles.statusBadge
                        }
                    >

                        <View
                            style={
                                styles.statusDot
                            }
                        />

                        <Text
                            style={
                                styles.statusText
                            }
                        >
                            {status}
                        </Text>

                    </View>

                </View>


                {/* =====================================
                    PERSONAL INFORMATION
                ====================================== */}

                <View
                    style={
                        styles.card
                    }
                >

                    <Text
                        style={
                            styles.sectionTitle
                        }
                    >
                        Personal Information
                    </Text>


                    {/* FULL NAME */}

                    <View
                        style={
                            styles.infoRow
                        }
                    >

                        <View
                            style={
                                styles.infoIcon
                            }
                        >

                            <Ionicons
                                name="person-outline"
                                size={20}
                                color="#0f2a5f"
                            />

                        </View>


                        <View
                            style={
                                styles.infoContent
                            }
                        >

                            <Text
                                style={
                                    styles.infoLabel
                                }
                            >
                                Full Name
                            </Text>


                            <Text
                                style={
                                    styles.infoValue
                                }
                            >
                                {fullName}
                            </Text>

                        </View>

                    </View>


                    {/* GENDER */}

                    <View
                        style={
                            styles.infoRow
                        }
                    >

                        <View
                            style={
                                styles.infoIcon
                            }
                        >

                            <Ionicons
                                name={
                                    gender === "Female"
                                        ? "female-outline"
                                        : "male-outline"
                                }
                                size={20}
                                color="#0f2a5f"
                            />

                        </View>


                        <View
                            style={
                                styles.infoContent
                            }
                        >

                            <Text
                                style={
                                    styles.infoLabel
                                }
                            >
                                Gender
                            </Text>


                            <Text
                                style={
                                    styles.infoValue
                                }
                            >
                                {gender}
                            </Text>

                        </View>

                    </View>


                    {/* DATE OF BIRTH */}

                    <View
                        style={
                            styles.infoRow
                        }
                    >

                        <View
                            style={
                                styles.infoIcon
                            }
                        >

                            <Ionicons
                                name="calendar-outline"
                                size={20}
                                color="#0f2a5f"
                            />

                        </View>


                        <View
                            style={
                                styles.infoContent
                            }
                        >

                            <Text
                                style={
                                    styles.infoLabel
                                }
                            >
                                Date of Birth
                            </Text>


                            <Text
                                style={
                                    styles.infoValue
                                }
                            >
                                {dateOfBirth}
                            </Text>

                        </View>

                    </View>

                </View>


                {/* =====================================
                    CONTACT INFORMATION
                ====================================== */}

                <View
                    style={
                        styles.card
                    }
                >

                    <Text
                        style={
                            styles.sectionTitle
                        }
                    >
                        Contact Information
                    </Text>


                    {/* EMAIL */}

                    <View
                        style={
                            styles.infoRow
                        }
                    >

                        <View
                            style={
                                styles.infoIcon
                            }
                        >

                            <Ionicons
                                name="mail-outline"
                                size={20}
                                color="#0f2a5f"
                            />

                        </View>


                        <View
                            style={
                                styles.infoContent
                            }
                        >

                            <Text
                                style={
                                    styles.infoLabel
                                }
                            >
                                Email Address
                            </Text>


                            <Text
                                style={
                                    styles.infoValue
                                }
                            >
                                {email}
                            </Text>

                        </View>

                    </View>


                    {/* PHONE */}

                    <View
                        style={
                            styles.infoRow
                        }
                    >

                        <View
                            style={
                                styles.infoIcon
                            }
                        >

                            <Ionicons
                                name="call-outline"
                                size={20}
                                color="#0f2a5f"
                            />

                        </View>


                        <View
                            style={
                                styles.infoContent
                            }
                        >

                            <Text
                                style={
                                    styles.infoLabel
                                }
                            >
                                Phone Number
                            </Text>


                            <Text
                                style={
                                    styles.infoValue
                                }
                            >
                                {phone}
                            </Text>

                        </View>

                    </View>

                </View>


                {/* =====================================
                    MEMBERSHIP INFORMATION
                ====================================== */}

                <View
                    style={
                        styles.card
                    }
                >

                    <Text
                        style={
                            styles.sectionTitle
                        }
                    >
                        Membership Information
                    </Text>


                    {/* MEMBERSHIP NUMBER */}

                    <View
                        style={
                            styles.infoRow
                        }
                    >

                        <View
                            style={
                                styles.infoIcon
                            }
                        >

                            <Ionicons
                                name="card-outline"
                                size={20}
                                color="#0f2a5f"
                            />

                        </View>


                        <View
                            style={
                                styles.infoContent
                            }
                        >

                            <Text
                                style={
                                    styles.infoLabel
                                }
                            >
                                Membership Number
                            </Text>


                            <Text
                                style={
                                    styles.infoValue
                                }
                            >
                                {membershipNumber}
                            </Text>

                        </View>

                    </View>


                    {/* MEMBERSHIP TYPE */}

                    <View
                        style={
                            styles.infoRow
                        }
                    >

                        <View
                            style={
                                styles.infoIcon
                            }
                        >

                            <Ionicons
                                name="people-outline"
                                size={20}
                                color="#0f2a5f"
                            />

                        </View>


                        <View
                            style={
                                styles.infoContent
                            }
                        >

                            <Text
                                style={
                                    styles.infoLabel
                                }
                            >
                                Membership Type
                            </Text>


                            <Text
                                style={
                                    styles.infoValue
                                }
                            >
                                {membershipType}
                            </Text>

                        </View>

                    </View>


                    {/* JOINED DATE */}

                    <View
                        style={
                            styles.infoRow
                        }
                    >

                        <View
                            style={
                                styles.infoIcon
                            }
                        >

                            <Ionicons
                                name="time-outline"
                                size={20}
                                color="#0f2a5f"
                            />

                        </View>


                        <View
                            style={
                                styles.infoContent
                            }
                        >

                            <Text
                                style={
                                    styles.infoLabel
                                }
                            >
                                Member Since
                            </Text>


                            <Text
                                style={
                                    styles.infoValue
                                }
                            >
                                {joinedDate}
                            </Text>

                        </View>

                    </View>

                </View>


                {/* =====================================
                    REFRESH
                ====================================== */}

                <TouchableOpacity
                    style={
                        styles.refreshButton
                    }
                    onPress={
                        fetchProfile
                    }
                    activeOpacity={0.8}
                >

                    <Ionicons
                        name="refresh-outline"
                        size={20}
                        color="#0f2a5f"
                    />


                    <Text
                        style={
                            styles.refreshText
                        }
                    >
                        Refresh Profile
                    </Text>

                </TouchableOpacity>


            </ScrollView>

        </View>

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


    // =================================================
    // LOADING
    // =================================================

    loadingContainer: {

        flex: 1,

        backgroundColor: "#f4f6fb",

        justifyContent: "center",

        alignItems: "center",

        padding: 30,

    },


    loadingText: {

        marginTop: 12,

        fontSize: 14,

        color: "#777777",

    },


    // =================================================
    // HEADER
    // =================================================

    header: {

        flexDirection: "row",

        alignItems: "center",

        backgroundColor: "#ffffff",

        paddingHorizontal: 20,

        paddingTop: 55,

        paddingBottom: 20,

        borderBottomWidth: 1,

        borderBottomColor: "#eeeeee",

    },


    backButton: {

        width: 42,

        height: 42,

        borderRadius: 21,

        backgroundColor: "#f4f6fb",

        justifyContent: "center",

        alignItems: "center",

    },


    headerText: {

        flex: 1,

        marginLeft: 14,

    },


    title: {

        fontSize: 26,

        fontWeight: "800",

        color: "#0f2a5f",

    },


    subtitle: {

        marginTop: 3,

        fontSize: 13,

        color: "#777777",

    },


    // =================================================
    // CONTENT
    // =================================================

    scrollContent: {

        padding: 20,

        paddingBottom: 45,

    },


    // =================================================
    // PROFILE CARD
    // =================================================

    profileCard: {

        backgroundColor: "#ffffff",

        borderRadius: 16,

        padding: 25,

        alignItems: "center",

        marginBottom: 20,

    },


    avatar: {

        width: 85,

        height: 85,

        borderRadius: 43,

        backgroundColor: "#0f2a5f",

        justifyContent: "center",

        alignItems: "center",

        marginBottom: 13,

    },


    avatarText: {

        color: "#ffffff",

        fontSize: 32,

        fontWeight: "800",

    },


    profileName: {

        fontSize: 22,

        fontWeight: "800",

        color: "#222222",

        textAlign: "center",

    },


    profileType: {

        marginTop: 5,

        fontSize: 13,

        color: "#777777",

    },


    statusBadge: {

        flexDirection: "row",

        alignItems: "center",

        backgroundColor: "#ecfdf5",

        paddingHorizontal: 12,

        paddingVertical: 6,

        borderRadius: 20,

        marginTop: 12,

    },


    statusDot: {

        width: 8,

        height: 8,

        borderRadius: 4,

        backgroundColor: "#16a34a",

        marginRight: 7,

    },


    statusText: {

        fontSize: 12,

        fontWeight: "700",

        color: "#15803d",

    },


    // =================================================
    // INFORMATION CARD
    // =================================================

    card: {

        backgroundColor: "#ffffff",

        borderRadius: 16,

        padding: 20,

        marginBottom: 15,

    },


    sectionTitle: {

        fontSize: 18,

        fontWeight: "800",

        color: "#222222",

        marginBottom: 5,

    },


    // =================================================
    // INFORMATION ROW
    // =================================================

    infoRow: {

        flexDirection: "row",

        alignItems: "center",

        paddingVertical: 14,

        borderBottomWidth: 1,

        borderBottomColor: "#f0f0f0",

    },


    infoIcon: {

        width: 42,

        height: 42,

        borderRadius: 21,

        backgroundColor: "#eef3ff",

        justifyContent: "center",

        alignItems: "center",

    },


    infoContent: {

        flex: 1,

        marginLeft: 13,

    },


    infoLabel: {

        fontSize: 11,

        color: "#999999",

        marginBottom: 3,

    },


    infoValue: {

        fontSize: 14,

        fontWeight: "700",

        color: "#222222",

    },


    // =================================================
    // REFRESH
    // =================================================

    refreshButton: {

        height: 52,

        borderRadius: 12,

        backgroundColor: "#ffffff",

        borderWidth: 1,

        borderColor: "#d9e1f2",

        flexDirection: "row",

        alignItems: "center",

        justifyContent: "center",

        marginTop: 5,

    },


    refreshText: {

        marginLeft: 8,

        fontSize: 14,

        fontWeight: "700",

        color: "#0f2a5f",

    },


    // =================================================
    // ERROR
    // =================================================

    errorTitle: {

        marginTop: 15,

        fontSize: 18,

        fontWeight: "800",

        color: "#222222",

        textAlign: "center",

    },


    errorMessage: {

        marginTop: 8,

        fontSize: 13,

        color: "#777777",

        textAlign: "center",

        lineHeight: 19,

    },


    retryButton: {

        backgroundColor: "#0f2a5f",

        borderRadius: 10,

        paddingHorizontal: 25,

        paddingVertical: 12,

        marginTop: 20,

    },


    retryText: {

        color: "#ffffff",

        fontSize: 14,

        fontWeight: "700",

    },


    backTextButton: {

        marginTop: 15,

        padding: 10,

    },


    backText: {

        color: "#0f2a5f",

        fontSize: 14,

        fontWeight: "700",

    },

});