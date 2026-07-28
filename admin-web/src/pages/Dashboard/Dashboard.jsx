import { useEffect, useState } from "react";

import api from "../../api/axios";

import styles from "./Dashboard.module.css";


const Dashboard = () => {


    const [dashboard, setDashboard] = useState(null);

    const [loading, setLoading] = useState(true);





    useEffect(() => {


        const fetchDashboard = async () => {


            try {


                const response = await api.get("/dashboard");


                console.log(
                    "Dashboard data:",
                    response.data
                );


                setDashboard(
                    response.data.dashboard
                );



            } catch(error) {


                console.log(
                    "Dashboard error:",
                    error.response?.data || error.message
                );


            } finally {


                setLoading(false);


            }


        };



        fetchDashboard();



    }, []);








    if(loading){


        return (

            <h2>
                Loading Dashboard...
            </h2>

        );


    }








    if(!dashboard){


        return (

            <h2>
                Unable to load dashboard
            </h2>

        );


    }









    return (


        <div className={styles.dashboard}>


            <h1>
                Dashboard
            </h1>



            <p>
                Welcome to Shepherd Admin Panel
            </p>









            {/* Statistics Cards */}


            <div className={styles.cards}>


                <div className={styles.card}>


                    <h3>
                        Total Members
                    </h3>


                    <h2>
                        {dashboard.members?.totalMembers || 0}
                    </h2>


                </div>







                <div className={styles.card}>


                    <h3>
                        Adults
                    </h3>


                    <h2>
                        {dashboard.members?.adults || 0}
                    </h2>


                </div>







                <div className={styles.card}>


                    <h3>
                        Children
                    </h3>


                    <h2>
                        {dashboard.members?.children || 0}
                    </h2>


                </div>








                <div className={styles.card}>


                    <h3>
                        Pending Follow Ups
                    </h3>


                    <h2>
                        {dashboard.followUps?.pending || 0}
                    </h2>


                </div>



            </div>









            {/* Active Service */}


            <div className={styles.section}>


                <h2>
                    Active Service
                </h2>





                {
                    dashboard.service ?


                    <div className={styles.serviceCard}>


                        <h3>
                            {dashboard.service.name}
                        </h3>





                        <p>
                            Type:
                            <strong>
                                {" "}
                                {dashboard.service.serviceType}
                            </strong>
                        </p>





                        <p>
                            Attendance Code:
                            <strong>
                                {" "}
                                {dashboard.service.attendanceCode}
                            </strong>
                        </p>



                    </div>



                    :


                    <p>
                        No active service
                    </p>


                }



            </div>









            {/* Attendance */}


            <div className={styles.section}>


                <h2>
                    Attendance
                </h2>




                <p>
                    Present:
                    <strong>
                        {" "}
                        {dashboard.attendance?.present || 0}
                    </strong>
                </p>





                <p>
                    Absent:
                    <strong>
                        {" "}
                        {dashboard.attendance?.absent || 0}
                    </strong>
                </p>





                <p>
                    Rate:
                    <strong>
                        {" "}
                        {dashboard.attendance?.rate || 0}%
                    </strong>
                </p>



            </div>









            {/* Recent Members */}


            <div className={styles.section}>


                <h2>
                    Recent Members
                </h2>





                {

                    dashboard.recentMembers &&
                    dashboard.recentMembers.length > 0 ?



                    <div className={styles.memberList}>


                        {
                            dashboard.recentMembers.map((member)=> (


                                <div
                                    key={member._id}
                                    className={styles.memberCard}
                                >


                                    <h3>
                                        {member.firstName} {member.lastName}
                                    </h3>




                                    <p>
                                        Gender:
                                        <strong>
                                            {" "}
                                            {member.gender}
                                        </strong>
                                    </p>





                                    <p>
                                        Type:
                                        <strong>
                                            {" "}
                                            {member.membershipType}
                                        </strong>
                                    </p>




                                </div>


                            ))
                        }



                    </div>



                    :



                    <p>
                        No recent members found
                    </p>


                }



            </div>







        </div>


    );


};


export default Dashboard;