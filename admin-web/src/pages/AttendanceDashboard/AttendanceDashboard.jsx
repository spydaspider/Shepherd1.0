import { useEffect, useState } from "react";

import api from "../../api/axios";

import styles from "./AttendanceDashboard.module.css";

import AttendanceHistogram from "./AttendanceHistogram";



const AttendanceDashboard = () => {


    const [dashboard, setDashboard] = useState(null);

    const [loading, setLoading] = useState(true);



    useEffect(() => {


        const fetchDashboard = async () => {


            try {


                const response = await api.get(
                    "/attendance/dashboard"
                );


                setDashboard(response.data);


            }
            catch (error) {


                console.log(
                    error.response?.data ||
                    error.message
                );


            }
            finally {


                setLoading(false);


            }


        };


        fetchDashboard();


    }, []);








    if (loading) {


        return (

            <div className={styles.loading}>

                Loading attendance dashboard...

            </div>

        );

    }








    if (!dashboard) {


        return (

            <div className={styles.loading}>

                Unable to load dashboard

            </div>

        );

    }







    const {

        overview,

        activeService,

        recentServices,

        recentAttendance,

        attendanceTrend


    } = dashboard;







    return (


        <div className={styles.dashboard}>


            <h1>
                Attendance Dashboard
            </h1>


            <p>
                Monitor church attendance and member participation
            </p>









            {/* ============================
                STATISTICS CARDS
            ============================= */}


            <div className={styles.cards}>


                <Card
                    title="Present Today"
                    value={overview.presentToday}
                />


                <Card
                    title="Absent Today"
                    value={overview.absentToday}
                />


                <Card
                    title="Attendance Rate"
                    value={`${overview.attendanceRate}%`}
                />


                <Card
                    title="Men"
                    value={overview.men}
                />


                <Card
                    title="Women"
                    value={overview.women}
                />


                <Card
                    title="Children"
                    value={overview.children}
                />


            </div>









            {/* ============================
                CURRENT SERVICE + LATEST ATTENDANCE
            ============================= */}



            <div className={styles.grid}>





                {/* CURRENT SERVICE */}


                <section className={styles.panel}>


                    <h2>
                        Current Service
                    </h2>



                    {


                    activeService ?


                    <>


                        <h3>
                            {activeService.name}
                        </h3>



                        <p>

                            Type:
                            {" "}
                            {activeService.serviceType}

                        </p>




                        <p>

                            Date:
                            {" "}

                            {
                                new Date(
                                    activeService.serviceDate
                                )
                                .toLocaleDateString()
                            }

                        </p>



                        <span className={styles.active}>

                            Active

                        </span>



                    </>


                    :


                    <p>
                        No active service
                    </p>


                    }



                </section>









                {/* LATEST ATTENDANCE */}


                <section className={styles.panel}>


                    <h2>
                        Latest Attendance
                    </h2>




                    {


                    recentAttendance &&
                    recentAttendance.length > 0 ?



                    recentAttendance.map(item => (


                        <div

                            key={item._id}

                            className={styles.activity}

                        >



                            <span>
                                ✓
                            </span>




                            <p>

                                {
                                    item.user?.firstName
                                }

                                {" "}

                                {
                                    item.user?.lastName
                                }


                            </p>



                        </div>



                    ))



                    :



                    <p>
                        No attendance records yet
                    </p>



                    }



                </section>



            </div>









            {/* ============================
                ATTENDANCE HISTOGRAM
            ============================= */}



            <AttendanceHistogram

                data={attendanceTrend || []}

            />









            {/* ============================
                RECENT SERVICES
            ============================= */}



            <section className={styles.panel}>


                <h2>
                    Recent Services
                </h2>





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


                        </tr>


                    </thead>







                    <tbody>



                    {


                    recentServices &&
                    recentServices.length > 0 ?



                    recentServices.map(service => (



                        <tr

                            key={service._id}

                        >



                            <td>

                                {service.name}

                            </td>




                            <td>


                                {

                                new Date(
                                    service.date
                                )
                                .toLocaleDateString()


                                }


                            </td>





                            <td>

                                {service.status}

                            </td>




                        </tr>



                    ))



                    :



                    <tr>


                        <td colSpan="3">


                            No services found


                        </td>


                    </tr>



                    }



                    </tbody>



                </table>



            </section>







        </div>


    );


};









const Card = ({ title, value }) => {


    return (


        <div className={styles.card}>


            <h3>
                {title}
            </h3>


            <strong>
                {value}
            </strong>


        </div>


    );


};








export default AttendanceDashboard;