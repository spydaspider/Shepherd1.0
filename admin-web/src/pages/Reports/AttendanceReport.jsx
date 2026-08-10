import { useEffect, useState } from "react";

import {
    useParams,
    useNavigate
} from "react-router-dom";

import api from "../../api/axios";

import styles from "./AttendanceReport.module.css";


const AttendanceReport = () => {

    const { serviceId } = useParams();

    const navigate = useNavigate();

    const [report, setReport] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    useEffect(() => {

        const fetchReport = async () => {

            try {

                console.log(
                    "FETCHING ATTENDANCE REPORT:",
                    serviceId
                );

                const response = await api.get(
                    `/reports/attendance/${serviceId}`
                );

                console.log(
                    "ATTENDANCE REPORT RESPONSE:",
                    response.data
                );

                setReport(
                    response.data.report
                );

            }
            catch (error) {

                console.log(
                    "ATTENDANCE REPORT ERROR:",
                    error.response?.data ||
                    error.message
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load attendance report"
                );

            }
            finally {

                setLoading(false);

            }

        };


        fetchReport();

    }, [serviceId]);


    if (loading) {

        return (
            <div className={styles.loading}>
                Loading attendance report...
            </div>
        );

    }


    if (error) {

        return (
            <div className={styles.container}>

                <button
                    className={styles.backButton}
                    onClick={() => navigate("/reports")}
                >
                    ← Back to Reports
                </button>

                <div className={styles.error}>
                    {error}
                </div>

            </div>
        );

    }


    if (!report) {

        return (
            <div className={styles.container}>

                <button
                    className={styles.backButton}
                    onClick={() => navigate("/reports")}
                >
                    ← Back to Reports
                </button>

                <div className={styles.error}>
                    Attendance report not found
                </div>

            </div>
        );

    }


    const {
        service,
        summary,
        presentMembers,
        absentMembers
    } = report;


    return (

        <div className={styles.container}>

            <button
                className={styles.backButton}
                onClick={() => navigate("/reports")}
            >
                ← Back to Reports
            </button>


            <div className={styles.header}>

                <div>

                    <h1>
                        {service.name}
                    </h1>

                    <p>
                        {service.serviceType}
                    </p>

                </div>


                <div className={styles.date}>

                    {new Date(
                        service.date
                    ).toLocaleDateString()}

                </div>

            </div>


            <div className={styles.cards}>

                <div className={styles.card}>

                    <span>
                        Total Members
                    </span>

                    <strong>
                        {summary.totalMembers}
                    </strong>

                </div>


                <div className={styles.card}>

                    <span>
                        Present
                    </span>

                    <strong>
                        {summary.present}
                    </strong>

                </div>


                <div className={styles.card}>

                    <span>
                        Absent
                    </span>

                    <strong>
                        {summary.absent}
                    </strong>

                </div>


                <div className={styles.card}>

                    <span>
                        Attendance Rate
                    </span>

                    <strong>
                        {summary.rate}%
                    </strong>

                </div>

            </div>


            <div className={styles.cards}>

                <div className={styles.card}>

                    <span>
                        Adults
                    </span>

                    <strong>
                        {summary.adults}
                    </strong>

                </div>


                <div className={styles.card}>

                    <span>
                        Children
                    </span>

                    <strong>
                        {summary.children}
                    </strong>

                </div>


                <div className={styles.card}>

                    <span>
                        Male
                    </span>

                    <strong>
                        {summary.male}
                    </strong>

                </div>


                <div className={styles.card}>

                    <span>
                        Female
                    </span>

                    <strong>
                        {summary.female}
                    </strong>

                </div>

            </div>


            <section className={styles.panel}>

                <h2>
                    Present Members
                </h2>

                <p>
                    Members who attended this service
                </p>


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
                                    Gender
                                </th>

                                <th>
                                    Type
                                </th>

                                <th>
                                    Attendance Method
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {presentMembers.length > 0 ? (

                                presentMembers.map(member => (

                                    <tr key={member.id}>

                                        <td>
                                            {member.name}
                                        </td>

                                        <td>
                                            {member.phone || "N/A"}
                                        </td>

                                        <td>
                                            {member.gender || "N/A"}
                                        </td>

                                        <td>
                                            {member.isChild
                                                ? "Child"
                                                : "Adult"}
                                        </td>

                                        <td>
                                            {member.attendanceMethod || "N/A"}
                                        </td>

                                    </tr>

                                ))

                            ) : (

                                <tr>

                                    <td colSpan="5">
                                        No members were present
                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>

            </section>


            <section className={styles.panel}>

                <h2>
                    Absent Members
                </h2>

                <p>
                    Members who did not attend this service
                </p>


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
                                    Gender
                                </th>

                                <th>
                                    Type
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {absentMembers.length > 0 ? (

                                absentMembers.map(member => (

                                    <tr key={member.id}>

                                        <td>
                                            {member.name}
                                        </td>

                                        <td>
                                            {member.phone || "N/A"}
                                        </td>

                                        <td>
                                            {member.gender || "N/A"}
                                        </td>

                                        <td>
                                            {member.isChild
                                                ? "Child"
                                                : "Adult"}
                                        </td>

                                    </tr>

                                ))

                            ) : (

                                <tr>

                                    <td colSpan="4">
                                        No absent members
                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>

            </section>

        </div>

    );

};


export default AttendanceReport;