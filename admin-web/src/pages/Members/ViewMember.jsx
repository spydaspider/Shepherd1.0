import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import api from "../../api/axios";

import styles from "./ViewMember.module.css";


const ViewMember = () => {


    const { id } = useParams();

    const navigate = useNavigate();


    const [member,setMember] = useState(null);

    const [summary,setSummary] = useState(null);

    const [history,setHistory] = useState([]);

    const [loading,setLoading] = useState(true);



    useEffect(()=>{


        const fetchMember = async()=>{


            try{


                const response =
                await api.get(`/members/${id}`);


                console.log(
                    "Member Profile:",
                    response.data
                );


                setMember(
                    response.data.member
                );


                setSummary(
                    response.data.summary
                );


                setHistory(
                    response.data.history || []
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


        fetchMember();


    },[id]);







    if(loading){

        return <h2>Loading Member...</h2>;

    }



    if(!member){

        return <h2>Member not found</h2>;

    }





    return (

        <div className={styles.container}>


          <div className={styles.actions}>

<button
className={styles.back}
onClick={()=>navigate("/members")}
>
    ← Back to Members
</button>


<button
className={styles.back}
onClick={()=>navigate("/dashboard")}
>
    Dashboard
</button>

</div>




            {/* PROFILE HEADER */}

            <div className={styles.profileHeader}>


                <div className={styles.avatar}>

                    {
                        member.firstName
                        ?.charAt(0)
                    }

                    {
                        member.lastName
                        ?.charAt(0)
                    }


                </div>



                <div>

                    <h1>
                        {member.firstName}
                        {" "}
                        {member.lastName}
                    </h1>


                    <p>

                        {member.role}
                        {" • "}
                        {member.status}

                    </p>


                </div>



            </div>









            <div className={styles.grid}>


                {/* PERSONAL */}

                <div className={styles.card}>


                    <h2>
                        Personal Information
                    </h2>


                    <p>
                        <strong>Email:</strong>
                        {" "}
                        {member.email || "-"}
                    </p>


                    <p>
                        <strong>Phone:</strong>
                        {" "}
                        {member.phone || "-"}
                    </p>


                    <p>
                        <strong>Gender:</strong>
                        {" "}
                        {member.gender}
                    </p>


                    <p>
                        <strong>Date of Birth:</strong>
                        {" "}

                        {
                        member.dateOfBirth
                        ?
                        new Date(
                        member.dateOfBirth
                        )
                        .toLocaleDateString()
                        :
                        "-"
                        }

                    </p>


                    <p>
                        <strong>Address:</strong>
                        {" "}
                        {member.address || "-"}
                    </p>


                </div>










                {/* MEMBERSHIP */}

                <div className={styles.card}>


                    <h2>
                        Membership
                    </h2>


                    <p>
                        <strong>Number:</strong>
                        {" "}
                        {member.membershipNumber}
                    </p>


                    <p>
                        <strong>Department:</strong>
                        {" "}
                        {member.department || "-"}
                    </p>


                    <p>
                        <strong>Cell Group:</strong>
                        {" "}
                        {member.cellGroup || "-"}
                    </p>


                    <p>
                        <strong>Baptized:</strong>
                        {" "}
                        {
                            member.baptized
                            ?
                            "Yes"
                            :
                            "No"
                        }
                    </p>


                    <p>
                        <strong>Joined:</strong>
                        {" "}

                        {
                        new Date(
                        member.joinedChurchDate
                        )
                        .toLocaleDateString()
                        }

                    </p>


                </div>


            </div>









            {/* FAMILY */}


            <div className={styles.card}>


                <h2>
                    Family
                </h2>




                {
                    member.children &&
                    member.children.length > 0

                    ?

                    member.children.map(child=>(


                        <div

                        className={styles.familyItem}

                        key={child._id}

                        >


                            <div>

                                <strong>
                                    {child.firstName}
                                    {" "}
                                    {child.lastName}
                                </strong>


                                <p>
                                    {child.gender}
                                </p>


                            </div>


                            <p>

                            {
                            child.dateOfBirth
                            ?
                            new Date(
                            child.dateOfBirth
                            )
                            .toLocaleDateString()
                            :
                            "-"
                            }

                            </p>


                        </div>


                    ))

                    :


                    <p>
                        No children registered
                    </p>


                }





                {
                    member.parent &&


                    <p>

                        Parent:

                        {" "}

                        <strong>

                        {member.parent.firstName}
                        {" "}
                        {member.parent.lastName}

                        </strong>

                    </p>


                }



            </div>









            {/* ATTENDANCE SUMMARY */}


            <div className={styles.grid}>


                <div className={styles.card}>


                    <h2>
                        Attendance Summary
                    </h2>


                    <p>
                        Total Services:
                        {" "}
                        {summary?.totalServices || 0}
                    </p>


                    <p>
                        Present:
                        {" "}
                        {summary?.attended || 0}
                    </p>


                    <p>
                        Absent:
                        {" "}
                        {summary?.absent || 0}
                    </p>


                    <p>
                        Attendance Rate:
                        {" "}
                        {summary?.rate || 0}%
                    </p>


                </div>



            </div>









            {/* HISTORY */}


            <div className={styles.card}>


                <h2>
                    Attendance History
                </h2>



                {
                    history.length > 0

                    ?

                    history.map(item=>(


                        <div

                        className={styles.history}

                        key={item._id}

                        >

                            <span>

                            {
                                item.service?.name ||
                                "Service"
                            }

                            </span>


                            <span>

                            {
                            item.present
                            ?
                            "Present"
                            :
                            "Absent"
                            }

                            </span>


                        </div>


                    ))

                    :

                    <p>
                        No attendance records yet
                    </p>


                }



            </div>




        </div>

    );


};


export default ViewMember;