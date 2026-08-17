import { useEffect, useState } from "react";

import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

import { logout } from "../../features/auth/authSlice";

import { useNavigate } from "react-router-dom";

import api from "../../api/axios";

import styles from "./Navbar.module.css";


const Navbar = () => {


    const user =
        useSelector(
            state => state.auth.user
        );


    console.log(
        "Navbar user:",
        user
    );


    const dispatch = useDispatch();

    const navigate = useNavigate();


    const [
        unreadCount,
        setUnreadCount
    ] = useState(0);


    const [
        notifications,
        setNotifications
    ] = useState([]);


    const [
        showNotifications,
        setShowNotifications
    ] = useState(false);


    // ==========================================
    // Fetch Notification Count
    // ==========================================

    const fetchUnreadNotifications = async () => {

        try {

            const response =
                await api.get(
                    "/notifications"
                );


            setUnreadCount(
                response.data.unreadCount || 0
            );


        }
        catch (error) {

            console.log(
                "NOTIFICATION COUNT ERROR:",
                error.response?.data ||
                error.message
            );

        }

    };


    // ==========================================
    // Fetch Recent Notifications
    // ==========================================

    const fetchRecentNotifications = async () => {

        try {

            const response =
                await api.get(
                    "/notifications?limit=5"
                );


            setNotifications(
                response.data.notifications || []
            );


            setUnreadCount(
                response.data.unreadCount || 0
            );


        }
        catch (error) {

            console.log(
                "RECENT NOTIFICATIONS ERROR:",
                error.response?.data ||
                error.message
            );

        }

    };


    // ==========================================
    // Initial Notification Count
    // ==========================================

    useEffect(() => {

        if (!user) {
            return;
        }


        fetchUnreadNotifications();

    }, [user]);


    // ==========================================
    // Listen For Notification Updates
    // ==========================================

    useEffect(() => {

        const handleNotificationsUpdated =
            () => {

                fetchUnreadNotifications();

                if (showNotifications) {

                    fetchRecentNotifications();

                }

            };


        window.addEventListener(
            "notificationsUpdated",
            handleNotificationsUpdated
        );


        return () => {

            window.removeEventListener(
                "notificationsUpdated",
                handleNotificationsUpdated
            );

        };

    }, [user, showNotifications]);


    // ==========================================
    // Toggle Notification Dropdown
    // ==========================================

    const handleNotifications = () => {

        const newState =
            !showNotifications;


        setShowNotifications(
            newState
        );


        if (newState) {

            fetchRecentNotifications();

        }

    };


    // ==========================================
    // Handle Notification Click
    // ==========================================

    const handleNotificationClick =
        async (notification) => {

            try {

                if (!notification.isRead) {

                    await api.patch(
                        `/notifications/${notification._id}/read`
                    );


                    setNotifications(
                        previous =>
                            previous.map(
                                item =>
                                    item._id ===
                                    notification._id
                                        ? {
                                            ...item,
                                            isRead: true
                                        }
                                        : item
                            )
                    );


                    setUnreadCount(
                        previous =>
                            Math.max(
                                previous - 1,
                                0
                            )
                    );


                    window.dispatchEvent(
                        new Event(
                            "notificationsUpdated"
                        )
                    );

                }


                setShowNotifications(
                    false
                );


                if (notification.actionUrl) {

                    navigate(
                        notification.actionUrl
                    );

                    return;

                }


                navigate(
                    "/notifications"
                );

            }
            catch (error) {

                console.log(
                    "NAVBAR NOTIFICATION ERROR:",
                    error.response?.data ||
                    error.message
                );

            }

        };


    // ==========================================
    // View All Notifications
    // ==========================================

    const handleViewAll =
        () => {

            setShowNotifications(
                false
            );

            navigate(
                "/notifications"
            );

        };


    // ==========================================
    // Logout
    // ==========================================

    const handleLogout = () => {

        dispatch(logout());

        navigate("/");

    };


    // ==========================================
    // Format Notification Date
    // ==========================================

    const formatDate = (date) => {

        if (!date) {
            return "";
        }


        return new Date(
            date
        ).toLocaleString(
            "en-GB",
            {
                day: "2-digit",
                month: "short",
                hour: "2-digit",
                minute: "2-digit"
            }
        );

    };


    return (

        <header
            className={
                styles.navbar
            }
        >


            <div
                className={
                    styles.userInfo
                }
            >

                <h3>
                    Welcome, {user?.firstName}
                </h3>

                <p>
                    {user?.role}
                </p>

            </div>


            <div
                className={
                    styles.actions
                }
            >


                {/* ==================================
                    Notification Area
                ================================== */}

                <div
                    className={
                        styles.notificationWrapper
                    }
                >


                    <button
                        className={
                            styles.notificationButton
                        }
                        onClick={
                            handleNotifications
                        }
                        title="Notifications"
                    >

                        <span
                            className={
                                styles.bell
                            }
                        >
                            🔔
                        </span>


                        {unreadCount > 0 && (

                            <span
                                className={
                                    styles.notificationBadge
                                }
                            >

                                {unreadCount > 99
                                    ? "99+"
                                    : unreadCount}

                            </span>

                        )}

                    </button>


                    {/* ==================================
                        Notification Dropdown
                    ================================== */}

                    {showNotifications && (

                        <div
                            className={
                                styles.notificationDropdown
                            }
                        >


                            <div
                                className={
                                    styles.dropdownHeader
                                }
                            >

                                <div>

                                    <h3>
                                        Notifications
                                    </h3>

                                    {unreadCount > 0 && (

                                        <span>
                                            {unreadCount} unread
                                        </span>

                                    )}

                                </div>


                                <button
                                    className={
                                        styles.viewAllButton
                                    }
                                    onClick={
                                        handleViewAll
                                    }
                                >
                                    View all
                                </button>

                            </div>


                            {notifications.length === 0 ? (

                                <div
                                    className={
                                        styles.dropdownEmpty
                                    }
                                >

                                    <div>
                                        🔔
                                    </div>

                                    <p>
                                        No notifications
                                    </p>

                                </div>

                            ) : (

                                <div
                                    className={
                                        styles.dropdownList
                                    }
                                >

                                    {notifications.map(
                                        notification => (

                                            <div
                                                key={
                                                    notification._id
                                                }
                                                className={
                                                    `${styles.dropdownNotification} ${
                                                        !notification.isRead
                                                            ? styles.dropdownUnread
                                                            : ""
                                                    }`
                                                }
                                                onClick={() =>
                                                    handleNotificationClick(
                                                        notification
                                                    )
                                                }
                                            >


                                                <div
                                                    className={
                                                        styles.dropdownIndicator
                                                    }
                                                >

                                                    {!notification.isRead
                                                        ? "●"
                                                        : ""}

                                                </div>


                                                <div
                                                    className={
                                                        styles.dropdownContent
                                                    }
                                                >

                                                    <h4>
                                                        {
                                                            notification.title
                                                        }
                                                    </h4>


                                                    <p>
                                                        {
                                                            notification.message
                                                        }
                                                    </p>


                                                    <span>
                                                        {
                                                            notification.type
                                                        }
                                                        {" • "}
                                                        {
                                                            formatDate(
                                                                notification.createdAt
                                                            )
                                                        }
                                                    </span>

                                                </div>


                                            </div>

                                        )
                                    )}

                                </div>

                            )}


                            <button
                                className={
                                    styles.dropdownFooter
                                }
                                onClick={
                                    handleViewAll
                                }
                            >

                                View all notifications

                            </button>


                        </div>

                    )}

                </div>


                {/* ==================================
                    Logout
                ================================== */}

                <button
                    className={
                        styles.logoutButton
                    }
                    onClick={
                        handleLogout
                    }
                >

                    Logout

                </button>


            </div>


        </header>

    );

};


export default Navbar;