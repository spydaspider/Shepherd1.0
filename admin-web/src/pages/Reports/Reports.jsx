import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../../api/axios";
import styles from "./Reports.module.css";

const Reports = () => {

    const [reportData, setReportData] = useState({
        summary: {
            totalServices: 0,
            averageAttendanceRate: 0,
            highestAttendance: null,
            lowestAttendance: null
        },
        services: []
    });

    const [followUpData, setFollowUpData] = useState({
        summary: {
            pending: 0,
            contacted: 0,
            completed: 0,
            unable: 0
        },
        recentFollowUps: []
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const fetchReports = async () => {

            try {

                console.log("FETCHING REPORTS...");

                const serviceResponse = await api.get(
                    "/reports/services"
                );

                console.log(
                    "SERVICE REPORT RESPONSE:",
                    serviceResponse.data
                );

                const followUpResponse = await api.get(
                    "/reports/followups"
                );

                console.log(
                    "FOLLOW-UP REPORT RESPONSE:",
                    followUpResponse.data
                );

                setReportData({
                    summary: serviceResponse.data.summary || {
                        totalServices: 0,
                        averageAttendanceRate: 0,
                        highestAttendance: null,
                        lowestAttendance: null
                    },
                    services: serviceResponse.data.services || []
                });

                setFollowUpData({
                    summary: followUpResponse.data.summary || {
                        pending: 0,
                        contacted: 0,
                        completed: 0,
                        unable: 0
                    },
                    recentFollowUps:
                        followUpResponse.data.recentFollowUps || []
                });

            } catch (error) {

                console.log(
                    "REPORTS ERROR:",
                    error.response?.data || error.message
                );

                setError(
                    error.response?.data?.message ||
                    "Unable to load reports"
                );

            } finally {

                setLoading(false);

            }

        };

        fetchReports();

    }, []);

    if (loading) {

        return (
            <div className={styles.loading}>
                Loading reports...
            </div>
        );

    }

    if (error) {

        return (
            <div className={styles.container}>

                <div className={styles.header}>

                    <h1>
                        Reports
                    </h1>

                    <p>
                        View church attendance and service reports
                    </p>

                </div>

                <div className={styles.error}>
                    {error}
                </div>

            </div>
        );

    }

    return (
        <div className={styles.container}>

            <div className={styles.header}>

                <h1>
                    Reports
                </h1>

                <p>
                    View church attendance and service reports
                </p>

            </div>

            <div className={styles.cards}>

                <div className={styles.card}>

                    <h3>
                        Total Services
                    </h3>

                    <strong>
                        {reportData.summary.totalServices}
                    </strong>

                    <span>
                        Services recorded
                    </span>

                </div>

                <div className={styles.card}>

                    <h3>
                        Average Attendance
                    </h3>

                    <strong>
                        {reportData.summary.averageAttendanceRate}%
                    </strong>

                    <span>
                        Across all services
                    </span>

                </div>

                <div className={styles.card}>

                    <h3>
                        Highest Attendance
                    </h3>

                    <strong>
                        {
                            reportData.summary.highestAttendance
                                ?.attendance || 0
                        }
                    </strong>

                    <span>
                        {
                            reportData.summary.highestAttendance
                                ?.service || "No data"
                        }
                    </span>

                </div>

                <div className={styles.card}>

                    <h3>
                        Lowest Attendance
                    </h3>

                    <strong>
                        {
                            reportData.summary.lowestAttendance
                                ?.attendance || 0
                        }
                    </strong>

                    <span>
                        {
                            reportData.summary.lowestAttendance
                                ?.service || "No data"
                        }
                    </span>

                </div>

            </div>

            <section className={styles.panel}>

                <h2>
                    Service Attendance Reports
                </h2>

                <p>
                    Attendance performance across church services
                </p>

                {
                    reportData.services.length === 0 ? (

                        <div className={styles.empty}>
                            No service reports available.
                        </div>

                    ) : (

                        <div className={styles.tableWrapper}>

                            <table>

                                <thead>

                                    <tr>

                                        <th>
                                            Service
                                        </th>

                                        <th>
                                            Type
                                        </th>

                                        <th>
                                            Date
                                        </th>

                                        <th>
                                            Present
                                        </th>

                                        <th>
                                            Absent
                                        </th>

                                        <th>
                                            Attendance Rate
                                        </th>

                                        <th>
                                            Action
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {
                                        reportData.services.map(
                                            service => (

                                                <tr
                                                    key={service.id}
                                                >

                                                    <td>
                                                        {service.name}
                                                    </td>

                                                    <td>
                                                        {service.serviceType}
                                                    </td>

                                                    <td>

                                                        {
                                                            service.date
                                                                ? new Date(
                                                                    service.date
                                                                ).toLocaleDateString(
                                                                    "en-GB",
                                                                    {
                                                                        day: "2-digit",
                                                                        month: "short",
                                                                        year: "numeric"
                                                                    }
                                                                )
                                                                : "-"
                                                        }

                                                    </td>

                                                    <td>
                                                        {
                                                            service.attendance
                                                                ?.present || 0
                                                        }
                                                    </td>

                                                    <td>
                                                        {
                                                            service.attendance
                                                                ?.absent || 0
                                                        }
                                                    </td>

                                                    <td>

                                                        <span
                                                            className={
                                                                styles.rate
                                                            }
                                                        >
                                                            {
                                                                service.attendance
                                                                    ?.rate || 0
                                                            }%
                                                        </span>

                                                    </td>

                                                    <td>

                                                        <Link
                                                            className={
                                                                styles.viewButton
                                                            }
                                                            to={
                                                                `/reports/attendance/${service.id}`
                                                            }
                                                        >
                                                            View Report
                                                        </Link>

                                                    </td>

                                                </tr>

                                            )
                                        )
                                    }

                                </tbody>

                            </table>

                        </div>

                    )
                }

            </section>

            <section className={styles.panel}>

                <h2>
                    Follow-Up Reports
                </h2>

                <p>
                    Overview of member follow-up activity
                </p>

                <div className={styles.cards}>

                    <div className={styles.card}>

                        <h3>
                            Pending
                        </h3>

                        <strong>
                            {followUpData.summary.pending}
                        </strong>

                        <span>
                            Awaiting follow-up
                        </span>

                    </div>

                    <div className={styles.card}>

                        <h3>
                            Contacted
                        </h3>

                        <strong>
                            {followUpData.summary.contacted}
                        </strong>

                        <span>
                            Members contacted
                        </span>

                    </div>

                    <div className={styles.card}>

                        <h3>
                            Completed
                        </h3>

                        <strong>
                            {followUpData.summary.completed}
                        </strong>

                        <span>
                            Follow-ups completed
                        </span>

                    </div>

                    <div className={styles.card}>

                        <h3>
                            Unable To Reach
                        </h3>

                        <strong>
                            {followUpData.summary.unable}
                        </strong>

                        <span>
                            Contact unsuccessful
                        </span>

                    </div>

                </div>

                <h2>
                    Recent Follow-Ups
                </h2>

                {
                    followUpData.recentFollowUps.length === 0 ? (

                        <div className={styles.empty}>
                            No follow-up records available.
                        </div>

                    ) : (

                        <div className={styles.tableWrapper}>

                            <table>

                                <thead>

                                    <tr>

                                        <th>
                                            Member
                                        </th>

                                        <th>
                                            Phone
                                        </th>

                                        <th>
                                            Status
                                        </th>

                                        <th>
                                            Assigned To
                                        </th>

                                        <th>
                                            Date
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {
                                        followUpData.recentFollowUps.map(
                                            followUp => (

                                                <tr
                                                    key={followUp._id}
                                                >

                                                    <td>

                                                        {
                                                            followUp.member
                                                                ? `${followUp.member.firstName} ${followUp.member.lastName}`
                                                                : "Unknown Member"
                                                        }

                                                    </td>

                                                    <td>

                                                        {
                                                            followUp.member
                                                                ?.phone || "-"
                                                        }

                                                    </td>

                                                    <td>

                                                        <span
                                                            className={
                                                                styles.status
                                                            }
                                                        >
                                                            {
                                                                followUp.status || "-"
                                                            }
                                                        </span>

                                                    </td>

                                                    <td>

                                                        {
                                                            followUp.assignedTo
                                                                ? `${followUp.assignedTo.firstName} ${followUp.assignedTo.lastName}`
                                                                : "Unassigned"
                                                        }

                                                    </td>

                                                    <td>

                                                        {
                                                            followUp.createdAt
                                                                ? new Date(
                                                                    followUp.createdAt
                                                                ).toLocaleDateString(
                                                                    "en-GB",
                                                                    {
                                                                        day: "2-digit",
                                                                        month: "short",
                                                                        year: "numeric"
                                                                    }
                                                                )
                                                                : "-"
                                                        }

                                                    </td>

                                                </tr>

                                            )
                                        )
                                    }

                                </tbody>

                            </table>

                        </div>

                    )
                }

            </section>

        </div>
    );

};

export default Reports;