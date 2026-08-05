import {
    useEffect,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";


import api from "../../api/axios";

import styles from "./AttendanceHistory.module.css";




const AttendanceHistory =()=>{


const [services,setServices] =
useState([]);


const [loading,setLoading] =
useState(true);


const navigate = useNavigate();





useEffect(()=>{


fetchServices();


},[]);






const fetchServices = async()=>{


try{


const response =
await api.get("/services");



setServices(
response.data.services || []
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








if(loading){


return <h2>
Loading Attendance History...
</h2>


}







return (

<div className={styles.history}>


<div className={styles.header}>


<h1>
Attendance History
</h1>


<p>
View previous service attendance reports
</p>


</div>







<div className={styles.tableContainer}>


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
Type
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

services.map(service=>(


<tr key={service._id}>


<td>

{
service.name
}

</td>



<td>

{
new Date(
service.serviceDate
)
.toLocaleDateString()
}

</td>




<td>

{
service.serviceType
}

</td>




<td>


<span

className={
service.status==="Completed"
?
styles.completed
:
styles.active
}

>

{
service.status
}

</span>


</td>





<td>


<button

className={styles.viewBtn}

onClick={()=>navigate(
`/attendance/${service._id}`
)}

>

View Report

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



export default AttendanceHistory;