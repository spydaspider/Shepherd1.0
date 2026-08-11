import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import styles from "./ViewAttendance.module.css";

const ViewAttendance = () => {
    const { serviceId } = useParams();

    const [service, setService] = useState(null);
    const [summary, setSummary] = useState({});
    const [presentMembers, setPresentMembers] = useState([]);
    const [absentMembers, setAbsentMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                setLoading(true);
                setError("");

                console.log("FETCHING ATTENDANCE REPORT");
                console.log("SERVICE ID:", serviceId);

                const response = await api.get(
                    `/attendance/report/${serviceId}`
                );

                console.log(
                    "ATTENDANCE REPORT RESPONSE:",
                    response.data
                );

                const report = response.data?.report;

                if (!report) {
                    throw new Error(
                        "Attendance report was not returned by the server"
                    );
                }

                setService(report.service || null);
                setSummary(report.summary || {});
                setPresentMembers(
                    report.presentMembers || []
                );
                setAbsentMembers(
                    report.absentMembers || []
                );
            } catch (error) {
                console.error(
                    "ATTENDANCE REPORT ERROR:",
                    error.response?.data || error.message
                );

                setError(
                    error.response?.data?.message ||
                    error.message ||
                    "Failed to load attendance report"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchAttendance();
    }, [serviceId]);

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

    if (loading) {
        return (
            <div className={styles.loading}>
                Loading Attendance Report...
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.container}>
                <div className={styles.error}>
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>

            <div className={styles.header}>
                <h1>Attendance Report</h1>

                <p>
                    {service?.name || "Attendance Report"}
                </p>
            </div>

            <div className={styles.serviceCard}>

                <h2>
                    {service?.name || "-"}
                </h2>

                <p>
                    Date:{" "}
                    {formatDate(service?.serviceDate)}
                </p>

                <p>
                    Service Type:{" "}
                    <strong>
                        {service?.serviceType || "-"}
                    </strong>
                </p>

            </div>

            <div className={styles.cards}>

                <div className={styles.card}>
                    <h3>Total Members</h3>
                    <h2>
                        {summary.totalMembers || 0}
                    </h2>
                </div>

                <div className={styles.card}>
                    <h3>Present</h3>
                    <h2>
                        {summary.present || 0}
                    </h2>
                </div>

                <div className={styles.card}>
                    <h3>Absent</h3>
                    <h2>
                        {summary.absent || 0}
                    </h2>
                </div>

                <div className={styles.card}>
                    <h3>Attendance %</h3>
                    <h2>
                        {summary.attendanceRate || 0}%
                    </h2>
                </div>

                <div className={styles.card}>
                    <h3>Adults</h3>
                    <h2>
                        {summary.adults || 0}
                    </h2>
                </div>

                <div className={styles.card}>
                    <h3>Children</h3>
                    <h2>
                        {summary.children || 0}
                    </h2>
                </div>

                <div className={styles.card}>
                    <h3>Male</h3>
                    <h2>
                        {summary.male || 0}
                    </h2>
                </div>

                <div className={styles.card}>
                    <h3>Female</h3>
                    <h2>
                        {summary.female || 0}
                    </h2>
                </div>

            </div>

            <div className={styles.tableContainer}>

                <h2>Present Members</h2>

                <table>

                    <thead>
                        <tr>
                            <th>Member</th>
                            <th>Gender</th>
                            <th>Type</th>
                            <th>Status</th>
                            <th>Method</th>
                        </tr>
                    </thead>

                    <tbody>

                        {presentMembers.length === 0 ? (
                            <tr>
                                <td colSpan="5">
                                    No present members found
                                </td>
                            </tr>
                        ) : (
                            presentMembers.map((member) => (
                                <tr key={member.id}>

                                    <td>
                                        {member.firstName}{" "}
                                        {member.lastName}
                                    </td>

                                    <td>
                                        {member.gender || "-"}
                                    </td>

                                    <td>
                                        {member.isChild
                                            ? "Child"
                                            : "Adult"}
                                    </td>

                                    <td>
                                        <span
                                            className={
                                                styles.present
                                            }
                                        >
                                            {member.status ||
                                                "Present"}
                                        </span>
                                    </td>

                                    <td>
                                        {member.attendanceMethod ||
                                            "-"}
                                    </td>

                                </tr>
                            ))
                        )}

                    </tbody>

                </table>

            </div>

            <div className={styles.tableContainer}>

                <h2>Absent Members</h2>

                <table>

                    <thead>
                        <tr>
                            <th>Member</th>
                            <th>Phone</th>
                            <th>Gender</th>
                            <th>Type</th>
                        </tr>
                    </thead>

                    <tbody>

                        {absentMembers.length === 0 ? (
                            <tr>
                                <td colSpan="4">
                                    No absent members found
                                </td>
                            </tr>
                        ) : (
                            absentMembers.map((member) => (
                                <tr key={member.id}>

                                    <td>
                                        {member.firstName}{" "}
                                        {member.lastName}
                                    </td>

                                    <td>
                                        {member.phone || "-"}
                                    </td>

                                    <td>
                                        {member.gender || "-"}
                                    </td>

                                    <td>
                                        {member.isChild
                                            ? "Child"
                                            : "Adult"}
                                    </td>

                                </tr>
                            ))
                        )}

                    </tbody>

                </table>

            </div>

        </div>
    );
};

export default ViewAttendance;