import { useEffect, useState } from "react";

import api from "../../api/axios";

import styles from "./Dashboard.module.css";


const Dashboard = () => {


const [stats, setStats] = useState({

    members:0,

    services:0,

    followUps:0,

    notifications:0

});


const [loading, setLoading] = useState(true);



useEffect(()=>{


const fetchDashboardData = async()=>{


try{


const [
members,
services,
notifications
] = await Promise.all([


api.get("/users"),


api.get("/services"),


api.get("/notifications")


]);



setStats({

members:
members.data.count || 0,


services:
services.data.count || 0,


followUps:0,


notifications:

notifications.data.notifications

?
notifications.data.notifications.filter(
item=>!item.isRead
).length

:

0

});



}
catch(error){


console.log(
"Dashboard loading error:",
error
);


}
finally{


setLoading(false);


}



};



fetchDashboardData();



},[]);






if(loading){

return (

<h2>
Loading Dashboard...
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
{stats.members}
</h2>

</div>




<div className={styles.card}>

<h3>
Services
</h3>

<h2>
{stats.services}
</h2>

</div>




<div className={styles.card}>

<h3>
Pending Follow Ups
</h3>

<h2>
{stats.followUps}
</h2>

</div>




<div className={styles.card}>

<h3>
Unread Notifications
</h3>

<h2>
{stats.notifications}
</h2>

</div>




</div>



</div>

);


};


export default Dashboard;