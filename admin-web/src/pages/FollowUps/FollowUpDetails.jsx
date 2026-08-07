import { useEffect, useState } from "react";

import {
    useParams,
    useNavigate
} from "react-router-dom";


import api from "../../api/axios";

import styles from "./FollowUpDetails.module.css";



const FollowUpDetails = () => {


    const { id } = useParams();

    const navigate = useNavigate();


    const [followUp, setFollowUp] = useState(null);

    const [loading, setLoading] = useState(true);





    const fetchFollowUp = async()=>{


        try{


            const response =
                await api.get(
                    `/followups/${id}`
                );


            setFollowUp(
                response.data.followUp
            );


        }
        catch(error){


            console.log(
                error.response?.data ||
                error.message
            );


        }
        finally{


            setLoading(false);


        }


    };





    useEffect(()=>{


        fetchFollowUp();


    },[id]);







    const updateStatus = async(status)=>{


        try{


            const response =
                await api.patch(
                    `/followups/${id}`,
                    {
                        status
                    }
                );


            setFollowUp(
                response.data.followUp
            );


        }
        catch(error){


            console.log(
                error.response?.data ||
                error.message
            );


        }


    };









    if(loading){


        return (

            <div className={styles.loading}>

                Loading follow up...

            </div>

        );

    }







    if(!followUp){


        return (

            <div>

                Follow up not found

            </div>

        );

    }








    return (


        <div className={styles.container}>


            <button

                className={styles.back}

                onClick={()=>navigate("/followups")}

            >

                ← Back

            </button>





            <h1>
                Follow Up Details
            </h1>







            <div className={styles.card}>


                <h2>
                    Member
                </h2>


                <p>

                    {
                    followUp.member?.firstName
                    }

                    {" "}

                    {
                    followUp.member?.lastName
                    }

                </p>


                <p>

                    Phone:

                    {" "}

                    {
                    followUp.member?.phone
                    }

                </p>


            </div>









            <div className={styles.card}>


                <h2>
                    Missed Service
                </h2>


                <p>

                    {
                    followUp.service?.name
                    }

                </p>


                <p>

                    {

                    new Date(
                        followUp.service?.serviceDate
                    )
                    .toLocaleDateString()

                    }

                </p>


            </div>









            <div className={styles.card}>


                <h2>
                    Follow Up Information
                </h2>



                <p>

                    Method:

                    {" "}

                    {followUp.type}

                </p>



                <p>

                    Priority:

                    {" "}

                    {followUp.priority}

                </p>



                <p>

                    Assigned To:

                    {" "}

                    {
                    followUp.assignedTo?.firstName
                    }

                    {" "}

                    {
                    followUp.assignedTo?.lastName
                    }

                </p>



                <p>

                    Status:

                    {" "}

                    {followUp.status}

                </p>


            </div>









            <div className={styles.card}>


                <h2>
                    Notes
                </h2>


                <p>

                    {
                    followUp.notes ||
                    "No notes added"
                    }

                </p>


            </div>









            <div className={styles.actions}>


                <button

                    onClick={()=>
                        updateStatus("Contacted")
                    }

                >

                    Mark Contacted

                </button>





                <button

                    onClick={()=>
                        updateStatus("Completed")
                    }

                >

                    Complete Follow Up

                </button>



            </div>





        </div>


    );


};




export default FollowUpDetails;