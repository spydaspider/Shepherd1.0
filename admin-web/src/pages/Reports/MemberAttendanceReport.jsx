import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import api from "../../api/axios";

import styles from "./MemberAttendanceReport.module.css";


const MemberAttendanceReport = () => {

    const { memberId } = useParams();

    const [member, setMember] = useState(null);

    const [summary, setSummary] = useState({
        totalServices: 0,
        attended: 0,
        absent: 0,
        rate: 0
    });

    const [lastAttendance, setLastAttendance] = useState(null);

    const [history, setHistory] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    useEffect(() => {

        const fetchMemberReport = async () => {

            try {

                setLoading(true);

                console.log("FETCHING MEMBER ATTENDANCE REPORT");

                console.log("MEMBER ID:", memberId);


                const response = await api.get(
                    `/reports/member/${memberId}`
                );


                console.log(
                    "MEMBER ATTENDANCE REPORT:",
                    response.data
                );


                setMember(
                    response.data.member || null
                );


                setSummary(
                    response.data.summary || {
                        totalServices: 0,
                        attended: 0,
                        absent: 0,
                        rate: 0
                    }
                );


                setLastAttendance(
                    response.data.lastAttendance || null
                );


                setHistory(
                    response.data.history || []
                );


            } catch (error) {

                console.log(
                    "MEMBER ATTENDANCE REPORT ERROR:",
                    error.response?.data ||
                    error.message
                );


                setError(
                    error.response?.data?.message ||
                    "Failed to load member attendance report"
                );


            } finally {

                setLoading(false);

            }

        };


        fetchMemberReport();

    }, [memberId]);


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
                Loading member attendance report...
            </div>
        );

    }


    if (error) {

        return (
            <div className={styles.container}>

                <div className={styles.error}>
                    {error}
                </div>

                <Link
                    to="/reports"
                    className={styles.backButton}
                >
                    Back to Reports
                </Link>

            </div>
        );

    }


    return (

        <div className={styles.container}>

            <div className={styles.header}>

                <div>

                    <h1>
                        Member Attendance Report
                    </h1>

                    <p>
                        Attendance history and performance
                    </p>

                </div>


                <Link
                    to="/reports"
                    className={styles.backButton}
                >
                    Back to Reports
                </Link>

            </div>


            <div className={styles.memberCard}>

                <div className={styles.memberInfo}>

                    <h2>
                        {member?.name || "Unknown Member"}
                    </h2>

                    <p>
                        Phone: {member?.phone || "-"}
                    </p>

                    <p>
                        Membership Type:{" "}
                        {member?.membershipType || "-"}
                    </p>

                    <p>
                        Joined Church:{" "}
                        {formatDate(member?.joinedChurchDate)}
                    </p>

                </div>


                <div className={styles.lastAttendance}>

                    <span>
                        Last Attendance
                    </span>

                    <strong>
                        {lastAttendance?.name || "No attendance"}
                    </strong>

                    <small>
                        {formatDate(
                            lastAttendance?.serviceDate
                        )}
                    </small>

                </div>

            </div>


            <div className={styles.cards}>

                <div className={styles.card}>

                    <h3>
                        Total Services
                    </h3>

                    <strong>
                        {summary.totalServices || 0}
                    </strong>

                </div>


                <div className={styles.card}>

                    <h3>
                        Attended
                    </h3>

                    <strong>
                        {summary.attended || 0}
                    </strong>

                </div>


                <div className={styles.card}>

                    <h3>
                        Absent
                    </h3>

                    <strong>
                        {summary.absent || 0}
                    </strong>

                </div>


                <div className={styles.card}>

                    <h3>
                        Attendance Rate
                    </h3>

                    <strong>
                        {summary.rate || 0}%
                    </strong>

                </div>

            </div>


            <section className={styles.panel}>

                <h2>
                    Attendance History
                </h2>

                <p>
                    Service attendance history for this member
                </p>


                <div className={styles.tableWrapper}>

                    <table>

                        <thead>

                            <tr>

                                <th>
                                    Service
                                </th>

                                <th>
                                    Date
                                </th>

                                <th>
                                    Status
                                </th>

                                <th>
                                    Attendance Method
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {history.length === 0 ? (

                                <tr>

                                    <td colSpan="4">

                                        No attendance history found

                                    </td>

                                </tr>

                            ) : (

                                history.map(record => (

                                    <tr
                                        key={record._id}
                                    >

                                        <td>
                                            {record.service?.name || "-"}
                                        </td>


                                        <td>
                                            {formatDate(
                                                record.service?.serviceDate
                                            )}
                                        </td>


                                        <td>

                                            <span
                                                className={
                                                    record.status === "Present"
                                                        ? styles.present
                                                        : styles.absent
                                                }
                                            >
                                                {record.status || "Absent"}
                                            </span>

                                        </td>


                                        <td>
                                            {record.attendanceMethod || "-"}
                                        </td>

                                    </tr>

                                ))

                            )}

                        </tbody>

                    </table>

                </div>

            </section>

        </div>

    );

};


export default MemberAttendanceReport;