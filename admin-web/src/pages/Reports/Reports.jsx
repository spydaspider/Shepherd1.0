import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import api from "../../api/axios";

import styles from "./Reports.module.css";


const Reports = () => {

    console.log("REPORTS PAGE LOADED");


    const [reportData, setReportData] = useState({
        summary: {
            totalServices: 0,
            averageAttendanceRate: 0,
            highestAttendance: null,
            lowestAttendance: null
        },
        services: []
    });


    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    useEffect(() => {

        const fetchReports = async () => {

            try {

                console.log("FETCHING SERVICE REPORTS...");


                const response = await api.get(
                    "/reports/services"
                );


                console.log(
                    "SERVICE REPORT RESPONSE:",
                    response.data
                );


                setReportData({

                    summary: response.data.summary || {
                        totalServices: 0,
                        averageAttendanceRate: 0,
                        highestAttendance: null,
                        lowestAttendance: null
                    },

                    services: response.data.services || []

                });

            }
            catch (error) {

                console.log(
                    "REPORTS ERROR:",
                    error.response?.data ||
                    error.message
                );


                setError(
                    error.response?.data?.message ||
                    "Unable to load reports"
                );

            }
            finally {

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
                                                                ).toLocaleDateString()
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

        </div>

    );

};


export default Reports;