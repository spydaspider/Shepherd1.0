import { useEffect, useState } from "react";
import api from "../../api/axios";
import styles from "./FollowUpReports.module.css";

const FollowUpReports = () => {
    const [report, setReport] = useState({
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
        const fetchFollowUpReport = async () => {
            try {
                setLoading(true);

                const response = await api.get(
                    "/reports/followups"
                );

                console.log(
                    "FOLLOW-UP REPORT:",
                    response.data
                );

                setReport({
                    summary: response.data.summary || {
                        pending: 0,
                        contacted: 0,
                        completed: 0,
                        unable: 0
                    },
                    recentFollowUps:
                        response.data.recentFollowUps || []
                });
            } catch (error) {
                console.log(
                    "FOLLOW-UP REPORT ERROR:",
                    error.response?.data ||
                    error.message
                );

                setError(
                    error.response?.data?.message ||
                    "Unable to load follow-up report"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchFollowUpReport();
    }, []);

    const formatDate = (date) => {
        if (!date) {
            return "-";
        }

        return new Date(date).toLocaleDateString(
            "en-GB",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );
    };

    const getMemberName = (followUp) => {
        if (!followUp.member) {
            return "Unknown Member";
        }

        return `${followUp.member.firstName || ""} ${
            followUp.member.lastName || ""
        }`.trim();
    };

    const getAssignedName = (followUp) => {
        if (!followUp.assignedTo) {
            return "Unassigned";
        }

        return `${followUp.assignedTo.firstName || ""} ${
            followUp.assignedTo.lastName || ""
        }`.trim();
    };

    const getStatusClass = (status) => {
        if (!status) {
            return styles.status;
        }

        const statusClass = status
            .toLowerCase()
            .replace(/\s+/g, "-");

        return `${styles.status} ${styles[statusClass] || ""}`;
    };

    if (loading) {
        return (
            <div className={styles.loading}>
                Loading Follow-Up Report...
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1>Follow-Up Reports</h1>

                    <p>
                        Follow-up activity and performance
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
                <h1>Follow-Up Reports</h1>

                <p>
                    Follow-up activity and performance
                </p>
            </div>

            <div className={styles.cards}>
                <div className={styles.card}>
                    <h3>Pending</h3>

                    <strong>
                        {report.summary.pending || 0}
                    </strong>

                    <span>
                        Awaiting follow-up
                    </span>
                </div>

                <div className={styles.card}>
                    <h3>Contacted</h3>

                    <strong>
                        {report.summary.contacted || 0}
                    </strong>

                    <span>
                        Members contacted
                    </span>
                </div>

                <div className={styles.card}>
                    <h3>Completed</h3>

                    <strong>
                        {report.summary.completed || 0}
                    </strong>

                    <span>
                        Successfully completed
                    </span>
                </div>

                <div className={styles.card}>
                    <h3>Unable To Reach</h3>

                    <strong>
                        {report.summary.unable || 0}
                    </strong>

                    <span>
                        Contact unsuccessful
                    </span>
                </div>
            </div>

            <section className={styles.panel}>
                <h2>Recent Follow-Ups</h2>

                <p>
                    The most recent follow-up activities
                </p>

                {report.recentFollowUps.length === 0 ? (
                    <div className={styles.empty}>
                        No follow-up records found.
                    </div>
                ) : (
                    <div className={styles.tableWrapper}>
                        <table>
                            <thead>
                                <tr>
                                    <th>Member</th>
                                    <th>Phone</th>
                                    <th>Status</th>
                                    <th>Assigned To</th>
                                    <th>Date</th>
                                </tr>
                            </thead>

                            <tbody>
                                {report.recentFollowUps.map(
                                    (followUp) => (
                                        <tr key={followUp._id}>
                                            <td>
                                                {getMemberName(
                                                    followUp
                                                )}
                                            </td>

                                            <td>
                                                {followUp.member?.phone ||
                                                    "-"}
                                            </td>

                                            <td>
                                                <span
                                                    className={getStatusClass(
                                                        followUp.status
                                                    )}
                                                >
                                                    {followUp.status ||
                                                        "-"}
                                                </span>
                                            </td>

                                            <td>
                                                {getAssignedName(
                                                    followUp
                                                )}
                                            </td>

                                            <td>
                                                {formatDate(
                                                    followUp.createdAt
                                                )}
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </div>
    );
};

export default FollowUpReports;