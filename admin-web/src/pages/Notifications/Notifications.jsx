import { useEffect, useState } from "react";

import api from "../../api/axios";

import styles from "./Notifications.module.css";


const Notifications = () => {


    const [notifications, setNotifications] =
        useState([]);


    const [unreadCount, setUnreadCount] =
        useState(0);


    const [loading, setLoading] =
        useState(true);


    const [error, setError] =
        useState("");


    // ==========================================
    // Fetch Notifications
    // ==========================================

    const fetchNotifications = async () => {

        try {

            setLoading(true);

            setError("");


            const response =
                await api.get(
                    "/notifications"
                );


            console.log(
                "NOTIFICATIONS:",
                response.data
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
                "NOTIFICATIONS ERROR:",
                error.response?.data ||
                error.message
            );


            setError(
                error.response?.data?.message ||
                "Unable to load notifications"
            );

        }
        finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        fetchNotifications();

    }, []);


    // ==========================================
    // Notify Navbar
    // ==========================================

    const notifyNavbar = () => {

        window.dispatchEvent(
            new Event("notificationsUpdated")
        );

    };


    // ==========================================
    // Mark Single Notification As Read
    // ==========================================

    const handleMarkAsRead = async (notification) => {

        try {

            const wasUnread =
                !notification.isRead;


            // ----------------------------------
            // Mark as read in backend
            // ----------------------------------

            if (wasUnread) {

                await api.patch(
                    `/notifications/${notification._id}/read`
                );

            }


            // ----------------------------------
            // Update local notification state
            // ----------------------------------

            setNotifications(
                previous =>
                    previous.map(item =>
                        item._id === notification._id
                            ? {
                                ...item,
                                isRead: true
                            }
                            : item
                    )
            );


            // ----------------------------------
            // Update local unread count
            // ----------------------------------

            if (wasUnread) {

                setUnreadCount(
                    previous =>
                        Math.max(
                            previous - 1,
                            0
                        )
                );

            }


            // ----------------------------------
            // Update Navbar
            // ----------------------------------

            if (wasUnread) {

                notifyNavbar();

            }


            // ----------------------------------
            // Navigate if action URL exists
            // ----------------------------------

            if (notification.actionUrl) {

                window.location.href =
                    notification.actionUrl;

            }


        }
        catch (error) {

            console.log(
                "MARK NOTIFICATION ERROR:",
                error.response?.data ||
                error.message
            );

        }

    };


    // ==========================================
    // Mark All As Read
    // ==========================================

    const handleMarkAllAsRead = async () => {

        try {

            await api.patch(
                "/notifications/read-all"
            );


            // ----------------------------------
            // Update local notifications
            // ----------------------------------

            setNotifications(
                previous =>
                    previous.map(
                        notification => ({
                            ...notification,
                            isRead: true
                        })
                    )
            );


            // ----------------------------------
            // Update local count
            // ----------------------------------

            setUnreadCount(0);


            // ----------------------------------
            // Update Navbar
            // ----------------------------------

            notifyNavbar();


        }
        catch (error) {

            console.log(
                "MARK ALL NOTIFICATIONS ERROR:",
                error.response?.data ||
                error.message
            );

        }

    };


    // ==========================================
    // Delete Notification
    // ==========================================

    const handleDelete = async (
        notification
    ) => {

        try {

            await api.delete(
                `/notifications/${notification._id}`
            );


            // ----------------------------------
            // Remove notification
            // ----------------------------------

            setNotifications(
                previous =>
                    previous.filter(
                        item =>
                            item._id !==
                            notification._id
                    )
            );


            // ----------------------------------
            // Update unread count if necessary
            // ----------------------------------

            if (!notification.isRead) {

                setUnreadCount(
                    previous =>
                        Math.max(
                            previous - 1,
                            0
                        )
                );


                notifyNavbar();

            }

        }
        catch (error) {

            console.log(
                "DELETE NOTIFICATION ERROR:",
                error.response?.data ||
                error.message
            );

        }

    };


    // ==========================================
    // Format Date
    // ==========================================

    const formatDate = (date) => {

        if (!date) {

            return "-";

        }


        return new Date(date).toLocaleString(
            "en-GB",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        );

    };


    // ==========================================
    // Loading
    // ==========================================

    if (loading) {

        return (

            <div className={styles.loading}>

                Loading notifications...

            </div>

        );

    }


    // ==========================================
    // Error
    // ==========================================

    if (error) {

        return (

            <div className={styles.container}>

                <div className={styles.header}>

                    <div>

                        <h1>
                            Notifications
                        </h1>

                        <p>
                            Stay updated with church
                            activities
                        </p>

                    </div>

                </div>


                <div className={styles.error}>

                    {error}

                </div>

            </div>

        );

    }


    return (

        <div className={styles.container}>


            {/* ==================================
                Header
            ================================== */}

            <div className={styles.header}>

                <div>

                    <h1>
                        Notifications
                    </h1>

                    <p>
                        Stay updated with church
                        activities
                    </p>

                </div>


                {unreadCount > 0 && (

                    <button
                        className={
                            styles.markAllButton
                        }
                        onClick={
                            handleMarkAllAsRead
                        }
                    >

                        Mark all as read

                    </button>

                )}

            </div>


            {/* ==================================
                Notification List
            ================================== */}

            <section className={styles.panel}>


                {notifications.length === 0 ? (

                    <div className={styles.empty}>

                        <div
                            className={
                                styles.emptyIcon
                            }
                        >
                            🔔
                        </div>


                        <h2>
                            No notifications
                        </h2>


                        <p>
                            You're all caught up.
                        </p>

                    </div>

                ) : (

                    <div
                        className={
                            styles.notificationList
                        }
                    >

                        {notifications.map(
                            notification => (

                                <div
                                    key={
                                        notification._id
                                    }
                                    className={
                                        `${styles.notification} ${
                                            !notification.isRead
                                                ? styles.unread
                                                : ""
                                        }`
                                    }
                                    onClick={() =>
                                        handleMarkAsRead(
                                            notification
                                        )
                                    }
                                >


                                    {/* Unread Indicator */}

                                    <div
                                        className={
                                            styles.indicator
                                        }
                                    >

                                        {!notification.isRead
                                            ? "●"
                                            : ""}

                                    </div>


                                    {/* Notification Content */}

                                    <div
                                        className={
                                            styles.content
                                        }
                                    >

                                        <div
                                            className={
                                                styles.titleRow
                                            }
                                        >

                                            <h3>

                                                {
                                                    notification.title
                                                }

                                            </h3>


                                            {notification.priority ===
                                                "High" && (

                                                <span
                                                    className={
                                                        styles.highPriority
                                                    }
                                                >

                                                    High

                                                </span>

                                            )}

                                        </div>


                                        <p>

                                            {
                                                notification.message
                                            }

                                        </p>


                                        <div
                                            className={
                                                styles.meta
                                            }
                                        >

                                            <span>

                                                {
                                                    notification.type
                                                }

                                            </span>


                                            <span>
                                                •
                                            </span>


                                            <span>

                                                {
                                                    formatDate(
                                                        notification.createdAt
                                                    )
                                                }

                                            </span>

                                        </div>

                                    </div>


                                    {/* Delete */}

                                    <button
                                        className={
                                            styles.deleteButton
                                        }
                                        onClick={(event) => {

                                            event.stopPropagation();

                                            handleDelete(
                                                notification
                                            );

                                        }}
                                        title="Delete notification"
                                    >

                                        ×

                                    </button>


                                </div>

                            )
                        )}

                    </div>

                )}

            </section>

        </div>

    );

};


export default Notifications;