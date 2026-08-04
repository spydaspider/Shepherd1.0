import {
    useEffect,
    useState
} from "react";


import api from "../../api/axios";

import styles from "./Attendance.module.css";



const Attendance = () => {


    const [service,setService] = useState(null);

    const [members,setMembers] = useState([]);

    const [selectedMembers,setSelectedMembers] = useState([]);

    const [search,setSearch] = useState("");

    const [loading,setLoading] = useState(true);

    const [message,setMessage] = useState("");

    const [error,setError] = useState("");






    useEffect(()=>{


        fetchData();


    },[]);









    const fetchData = async()=>{


        try{


            setLoading(true);


            const serviceResponse =
            await api.get("/services/active");



            console.log(
                "Active Service:",
                serviceResponse.data
            );



            setService(
                serviceResponse.data.service
            );







            const membersResponse =
            await api.get("/members");



            console.log(
                "Members:",
                membersResponse.data
            );



            setMembers(
                membersResponse.data.members || []
            );



        }
        catch(error){


            console.log(
                error.response?.data ||
                error.message
            );


            setError(
                error.response?.data?.message ||
                "Failed to load attendance data"
            );


        }
        finally{


            setLoading(false);


        }


    };









    const toggleMember = (id)=>{


        setSelectedMembers(previous=>{


            if(previous.includes(id)){


                return previous.filter(
                    memberId =>
                    memberId !== id
                );


            }



            return [
                ...previous,
                id
            ];


        });


    };









    const selectAll = ()=>{


        const ids = filteredMembers.map(
            member=>member._id
        );



        if(
            selectedMembers.length === ids.length
        ){


            setSelectedMembers([]);


        }
        else{


            setSelectedMembers(ids);


        }


    };









    const markAttendance = async()=>{


        console.log(
            "Selected members:",
            selectedMembers
        );


        console.log(
            "Service:",
            service
        );





        if(!service){


            alert(
                "No active service available"
            );

            return;

        }







        if(selectedMembers.length === 0){


            alert(
                "Please select members first"
            );

            return;

        }







        try{


            const response =
            await api.post(
                "/attendance/admin-mark",
                {

                    serviceId:
                    service._id,


                    members:
                    selectedMembers

                }
            );





            console.log(
                "Attendance Response:",
                response.data
            );





            setMessage(
                response.data.message
            );



            setSelectedMembers([]);





        }
        catch(error){


            console.log(
                "Attendance Error:",
                error.response?.data ||
                error.message
            );



            alert(

                error.response?.data?.message ||
                "Failed to mark attendance"

            );


        }


    };









    const filteredMembers =

    members.filter(member=>{


        if(member.deleted){

            return false;

        }



        const name =

        `${member.firstName}
        ${member.lastName}`
        .toLowerCase();




        return name.includes(
            search.toLowerCase()
        );


    });









    if(loading){


        return (

            <h2>
                Loading Attendance...
            </h2>

        );


    }









    return (

<div className={styles.attendance}>





<div className={styles.header}>


<div>

<h1>
Attendance Management
</h1>


<p>
Admin can manually mark members present
</p>


</div>


</div>









{
error &&

<div className={styles.error}>

{error}

</div>

}








{
message &&

<div className={styles.success}>

{message}

</div>

}









<div className={styles.serviceBox}>


<h2>
Active Service
</h2>




{

service ?

<>

<h3>

{service.name}

</h3>



<p>

Date:

{" "}

{

new Date(
service.serviceDate
)
.toLocaleDateString()

}

</p>




<p>

Attendance Code:

<strong>

{" "}

{service.attendanceCode}

</strong>


</p>


</>


:


<p>
No active service available
</p>


}



</div>









<div className={styles.searchBox}>


<input

type="text"

placeholder="Search members..."

value={search}

onChange={
e=>setSearch(e.target.value)
}

/>


</div>









<div className={styles.memberContainer}>


<table>


<thead>


<tr>


<th>


<input

type="checkbox"

checked={
filteredMembers.length > 0 &&
selectedMembers.length === filteredMembers.length
}

onChange={selectAll}

/>


</th>



<th>
Member
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


{

filteredMembers.map(member=>(


<tr key={member._id}>


<td>


<input

type="checkbox"

checked={
selectedMembers.includes(
member._id
)
}

onChange={()=>
toggleMember(member._id)
}

/>


</td>







<td>


<div className={styles.memberInfo}>


<div className={styles.avatar}>


{
member.firstName?.charAt(0)
}


{
member.lastName?.charAt(0)
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






</tr>


))


}



</tbody>


</table>


</div>









<div className={styles.actions}>


<button

className={styles.markBtn}

onClick={markAttendance}

>


Mark Attendance

(

{selectedMembers.length}

)


</button>


</div>







</div>


    );


};


export default Attendance;