import { useEffect, useState } from "react";

import api from "../../api/axios";

import styles from "./Dashboard.module.css";


const Dashboard = () => {


const [dashboard, setDashboard] = useState(null);

const [loading, setLoading] = useState(true);



useEffect(()=>{


const fetchDashboard = async()=>{


try{


const response =
await api.get("/dashboard");


console.log(
"Dashboard data:",
response.data
);



setDashboard(
response.data.dashboard
);



}
catch(error){


console.log(
"Dashboard error:",
error.response?.data || error.message
);


}
finally{


setLoading(false);


}


};



fetchDashboard();



},[]);






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





<div className={styles.cards}>



<div className={styles.card}>

<h3>
Total Members
</h3>

<h2>
{dashboard.members.totalMembers}
</h2>

</div>





<div className={styles.card}>

<h3>
Adults
</h3>

<h2>
{dashboard.members.adults}
</h2>

</div>





<div className={styles.card}>

<h3>
Children
</h3>

<h2>
{dashboard.members.children}
</h2>

</div>





<div className={styles.card}>

<h3>
Pending Follow Ups
</h3>

<h2>
{dashboard.followUps.pending}
</h2>

</div>



</div>





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
{dashboard.service.serviceType}
</p>


<p>
Attendance Code:
{dashboard.service.attendanceCode}
</p>


</div>


:

<p>
No active service
</p>

}



</div>






<div className={styles.section}>


<h2>
Attendance
</h2>


<div>

<p>
Present:
<strong>
 {dashboard.attendance.present}
</strong>
</p>


<p>
Absent:
<strong>
 {dashboard.attendance.absent}
</strong>
</p>


<p>
Rate:
<strong>
 {dashboard.attendance.rate}%
</strong>
</p>

</div>

<p>
Absent:
{dashboard.attendance.absent}
</p>


<p>
Rate:
{dashboard.attendance.rate}%
</p>


</div>





</div>

);


};


export default Dashboard;