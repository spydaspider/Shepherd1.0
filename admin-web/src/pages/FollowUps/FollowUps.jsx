import { 
    useEffect, 
    useState 
} from "react";


import {
    useNavigate
} from "react-router-dom";


import api from "../../api/axios";

import styles from "./FollowUps.module.css";





const FollowUps = () => {


    console.log("FOLLOWUPS PAGE LOADED");


    const navigate = useNavigate();



    const [followUps, setFollowUps] = useState([]);


    const [stats, setStats] = useState({

        pending:0,

        completed:0,

        overdue:0

    });


    const [loading, setLoading] = useState(true);









    const fetchFollowUps = async()=>{


        try{


            console.log(
                "FETCHING FOLLOW UPS..."
            );


            const response = await api.get(
                "/followups"
            );



            console.log(
                "FOLLOW UPS RESPONSE:",
                response.data
            );



            setFollowUps(
                response.data.followUps || []
            );



        }
        catch(error){


            console.log(
                "FOLLOW UPS ERROR:",
                error.response?.data ||
                error.message
            );


        }


    };









    const fetchStats = async()=>{


        try{


            console.log(
                "FETCHING FOLLOW UP STATS..."
            );



            const response = await api.get(
                "/followups/stats"
            );



            console.log(
                "FOLLOW UP STATS RESPONSE:",
                response.data
            );



            setStats(
                response.data.stats
            );


        }
        catch(error){


            console.log(
                "FOLLOW UP STATS ERROR:",
                error.response?.data ||
                error.message
            );


        }


    };









    useEffect(()=>{


        console.log(
            "FOLLOW UPS USE EFFECT RUNNING"
        );



        const loadData = async()=>{


            await Promise.all([

                fetchFollowUps(),

                fetchStats()

            ]);



            setLoading(false);


        };



        loadData();



    },[]);









    if(loading){


        return (

            <div className={styles.loading}>

                Loading follow ups...

            </div>

        );

    }









    const openFollowUp = (id)=>{


        console.log(
            "OPENING FOLLOW UP:",
            id
        );



        navigate(
            `/followups/${id}`
        );


    };









    return (


        <div className={styles.container}>


            <h1>
                Follow Up Management
            </h1>



            <p>
                Track and manage members requiring follow-up
            </p>









            <div className={styles.cards}>


                <StatCard

                    title="Pending"

                    value={stats.pending}

                />



                <StatCard

                    title="Completed"

                    value={stats.completed}

                />



                <StatCard

                    title="Overdue"

                    value={stats.overdue}

                />


            </div>









            <section className={styles.panel}>


                <h2>
                    Follow Ups
                </h2>







                <table>


                    <thead>


                        <tr>

                            <th>
                                Member
                            </th>


                            <th>
                                Service
                            </th>


                            <th>
                                Priority
                            </th>


                            <th>
                                Status
                            </th>


                            <th>
                                Assigned To
                            </th>


                            <th>
                                Action
                            </th>


                        </tr>


                    </thead>







                    <tbody>


                    {


                    followUps.length > 0 ?



                    followUps.map(item=>(


                        <tr key={item._id}>


                            <td>


                                {item.member?.firstName}

                                {" "}

                                {item.member?.lastName}


                            </td>






                            <td>


                                {item.service?.name}


                            </td>






                            <td>


                                <span

                                className={
                                    styles[item.priority]
                                }

                                >

                                    {item.priority}

                                </span>


                            </td>







                            <td>


                                {item.status}


                            </td>








                            <td>


                                {item.assignedTo?.firstName}

                                {" "}

                                {item.assignedTo?.lastName}


                            </td>








                            <td>


                                <button

                                className={
                                    styles.viewButton
                                }


                                onClick={()=>{

                                    openFollowUp(
                                        item._id
                                    );

                                }}

                                >

                                    View

                                </button>



                            </td>





                        </tr>


                    ))



                    :



                    <tr>


                        <td colSpan="6">


                            No follow ups found


                        </td>


                    </tr>



                    }



                    </tbody>


                </table>




            </section>



        </div>


    );


};









const StatCard = ({
    title,
    value
})=>{


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






export default FollowUps;