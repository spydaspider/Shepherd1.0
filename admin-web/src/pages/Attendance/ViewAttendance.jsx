import {
    useEffect,
    useState
} from "react";

import {
    useParams
} from "react-router-dom";

import api from "../../api/axios";

import styles from "./ViewAttendance.module.css";





const ViewAttendance = () => {


    const { serviceId } = useParams();


    const [service, setService] = useState(null);

    const [summary, setSummary] = useState({});

    const [attendance, setAttendance] = useState([]);


    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");








    useEffect(() => {

        fetchAttendance();

    }, [serviceId]);










    const fetchAttendance = async () => {


        try {


            setLoading(true);


            const response = await api.get(

                `/attendance/service/${serviceId}`

            );



            console.log(
                "Attendance Report:",
                response.data
            );



            setService(
                response.data.service
            );


            setSummary(
                response.data.summary || {}
            );


            setAttendance(
                response.data.attendance || []
            );



        }
        catch(error) {


            console.log(
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









    const formatDate = (date) => {


        if(!date){

            return "-";

        }


        return new Date(date)
        .toLocaleDateString(
            "en-GB",
            {
                day:"2-digit",
                month:"short",
                year:"numeric"
            }
        );


    };









    const formatTime = (time)=>{


        if(!time){

            return "-";

        }


        return new Date(time)
        .toLocaleTimeString();


    };









    if(loading){


        return (

            <h2>
                Loading Attendance Report...
            </h2>

        );

    }









    return (

        <div className={styles.container}>


            <div className={styles.header}>


                <h1>
                    Attendance Report
                </h1>


                <p>
                    {service?.name}
                </p>


            </div>









            {
                error &&

                <div className={styles.error}>

                    {error}

                </div>

            }









            <div className={styles.serviceCard}>


                <h2>
                    {service?.name}
                </h2>





                <p>

                    Date:

                    {" "}

                    {
                        formatDate(
                            service?.serviceDate ||
                            service?.date
                        )
                    }

                </p>






                <p>

                    Service Type:

                    <strong>

                    {" "}

                    {service?.serviceType || "-"}

                    </strong>

                </p>






                <p>

                    Status:

                    <strong>

                    {" "}

                    {service?.status || "-"}

                    </strong>

                </p>



            </div>









            <div className={styles.cards}>


                <div className={styles.card}>

                    <h3>
                        Present
                    </h3>

                    <h2>
                        {summary.totalPresent || 0}
                    </h2>

                </div>







                <div className={styles.card}>

                    <h3>
                        Absent
                    </h3>

                    <h2>
                        {summary.totalAbsent || 0}
                    </h2>

                </div>







                <div className={styles.card}>

                    <h3>
                        Attendance %
                    </h3>

                    <h2>
                        {summary.attendanceRate || 0}%
                    </h2>

                </div>







                <div className={styles.card}>

                    <h3>
                        Men
                    </h3>

                    <h2>
                        {summary.men || 0}
                    </h2>

                </div>







                <div className={styles.card}>

                    <h3>
                        Women
                    </h3>

                    <h2>
                        {summary.women || 0}
                    </h2>

                </div>







                <div className={styles.card}>

                    <h3>
                        Children
                    </h3>

                    <h2>
                        {summary.children || 0}
                    </h2>

                </div>



            </div>









            <div className={styles.tableContainer}>


                <table>


                    <thead>

                        <tr>

                            <th>
                                Member
                            </th>


                            <th>
                                Gender
                            </th>


                            <th>
                                Type
                            </th>


                            <th>
                                Status
                            </th>


                            <th>
                                Method
                            </th>


                            <th>
                                Marked By
                            </th>


                            <th>
                                Checked In
                            </th>


                        </tr>

                    </thead>







                    <tbody>


                    {

                        attendance.length === 0 ?

                        (

                            <tr>

                                <td colSpan="7">

                                    No attendance records found

                                </td>

                            </tr>

                        )


                        :


                        attendance.map(item=>(


                            <tr key={item._id}>


                                <td>

                                    {item.user?.firstName}

                                    {" "}

                                    {item.user?.lastName}

                                </td>





                                <td>

                                    {item.user?.gender || "-"}

                                </td>







                                <td>

                                    {

                                    item.user?.isChild

                                    ?

                                    "Child"

                                    :

                                    "Adult"

                                    }

                                </td>







                                <td>


                                    <span

                                    className={

                                    item.status === "Present"

                                    ?

                                    styles.present

                                    :

                                    styles.absent

                                    }

                                    >

                                    {item.status}

                                    </span>


                                </td>







                                <td>

                                    {
                                    item.attendanceMethod ||
                                    "Self"
                                    }

                                </td>







                                <td>

                                    {

                                    item.markedBy

                                    ?

                                    `${item.markedBy.firstName}
                                    ${item.markedBy.lastName}`

                                    :

                                    "Self"

                                    }

                                </td>







                                <td>

                                    {
                                    formatTime(
                                        item.checkedInAt
                                    )
                                    }

                                </td>






                            </tr>


                        ))

                    }


                    </tbody>


                </table>


            </div>





        </div>

    );


};





export default ViewAttendance;