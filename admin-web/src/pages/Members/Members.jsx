import { useEffect, useState } from "react";

import api from "../../api/axios";

import styles from "./Members.module.css";
import { useNavigate } from "react-router-dom";


const Members = () => {


    const [members, setMembers] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const navigate = useNavigate();




    useEffect(()=>{


        const fetchMembers = async()=>{


            try{


                const response = await api.get("/members");


                console.log(
                    "Members:",
                    response.data
                );


                setMembers(
                    response.data.members || []
                );


            }
            catch(error){


                console.log(
                    error.response?.data || error.message
                );


            }
            finally{


                setLoading(false);


            }


        };


        fetchMembers();


    },[]);






    const filteredMembers =
    members.filter((member)=>{


        const name =
        `${member.firstName} ${member.lastName}`
        .toLowerCase();



        return name.includes(
            search.toLowerCase()
        );


    });







    if(loading){


        return <h2>Loading Members...</h2>


    }







    return (


        <div className={styles.members}>


            <div className={styles.header}>


                <div>

                    <h1>
                        Members
                    </h1>


                    <p>
                        Manage church members
                    </p>


                </div>



               <button
onClick={()=>navigate("/members/add")}
>
+ Add Member
</button>


            </div>









            <div className={styles.searchBox}>


                <input

                    type="text"

                    placeholder="Search members..."

                    value={search}

                    onChange={
                        (e)=>setSearch(e.target.value)
                    }

                />


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
                            Role
                        </th>


                        <th>
                            Status
                        </th>


                        <th>
                            Action
                        </th>


                    </tr>


                </thead>






                <tbody>


                {
                    filteredMembers.map((member)=>(


                        <tr key={member._id}>


                            <td>


                                <div className={styles.memberInfo}>


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



                                    <span>

                                    {
                                        member.firstName
                                    }

                                    {" "}

                                    {
                                        member.lastName
                                    }

                                    </span>


                                </div>


                            </td>






                            <td>

                                {
                                    member.gender
                                }

                            </td>






                            <td>

                                {
                                    member.isChild
                                    ?
                                    "Child"
                                    :
                                    "Adult"
                                }

                            </td>







                            <td>

                                {
                                    member.role
                                }

                            </td>






                            <td>


                                <span className={styles.status}>

                                {
                                    member.status
                                }

                                </span>


                            </td>







                            <td>


                                <button className={styles.viewBtn}>
                                    View
                                </button>


                                <button className={styles.editBtn}>
                                    Edit
                                </button>


                                <button className={styles.deleteBtn}>
                                    Delete
                                </button>


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


export default Members;