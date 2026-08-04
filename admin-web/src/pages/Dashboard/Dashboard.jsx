import { 
    useEffect, 
    useState 
} from "react";


import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid
} from "recharts";


import api from "../../api/axios";

import styles from "./Dashboard.module.css";





const Dashboard = () => {


    const [
        dashboard,
        setDashboard
    ] = useState(null);



    const [
        loading,
        setLoading
    ] = useState(true);





    useEffect(()=>{


        const fetchDashboard = async()=>{


            try{


                const response =
                await api.get("/dashboard");



                setDashboard(
                    response.data.dashboard
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



        fetchDashboard();



    },[]);







    if(loading)
    return <h2>Loading Dashboard...</h2>;




    if(!dashboard)
    return <h2>Unable to load dashboard</h2>;








    const attendanceData = [


        {
            name:"Present",
            value:
            dashboard.attendance?.present || 0
        },


        {
            name:"Absent",
            value:
            dashboard.attendance?.absent || 0
        }


    ];







    const genderData = [


        {

            name:"Male",

            value:
            dashboard.members?.male || 0

        },


        {

            name:"Female",

            value:
            dashboard.members?.female || 0

        }


    ];









    return (

<div className={styles.dashboard}>


{/* HEADER */}

<div className={styles.header}>


<h1>
Dashboard
</h1>


<p>
Welcome to Shepherd Church Management System
</p>


</div>









{/* STAT CARDS */}


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
Present
</h3>

<h2>
{dashboard.attendance?.present || 0}
</h2>

</div>









<div className={styles.card}>

<h3>
Attendance Rate
</h3>

<h2>
{dashboard.attendance?.rate || 0}%
</h2>

</div>









<div className={styles.card}>

<h3>
Follow Ups
</h3>

<h2>
{dashboard.followUps?.pending || 0}
</h2>

</div>



</div>









{/* SERVICE + PIE CHART */}


<div className={styles.topGrid}>




<div className={styles.section}>


<h2>
Current Service
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
Status:
<strong>
{" "}
{dashboard.service.status}
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








<div className={styles.chartContainer}>


<h2>
Attendance
</h2>


<ResponsiveContainer
width="100%"
height={250}
>


<PieChart>


<Pie

data={attendanceData}

dataKey="value"

nameKey="name"

outerRadius={90}

label


>


{
attendanceData.map(
(item,index)=>(

<Cell
key={index}
/>

)

)
}


</Pie>


<Tooltip/>


</PieChart>


</ResponsiveContainer>



</div>





</div>












{/* CHARTS */}



<div className={styles.bottomGrid}>


<div className={styles.chartContainer}>


<h2>
Gender Distribution
</h2>



<ResponsiveContainer
width="100%"
height={250}
>


<PieChart>


<Pie

data={genderData}

dataKey="value"

nameKey="name"

outerRadius={90}

label

>


{
genderData.map(
(item,index)=>(

<Cell
key={index}
/>

)

)
}


</Pie>



<Tooltip/>


</PieChart>


</ResponsiveContainer>



</div>








<div className={styles.chartContainer}>


<h2>
Attendance Trend
</h2>



<ResponsiveContainer
width="100%"
height={250}
>


<LineChart

data={
dashboard.attendanceTrend || []
}


>


<CartesianGrid/>


<XAxis
dataKey="name"
/>


<YAxis/>


<Tooltip/>


<Line

type="monotone"

dataKey="present"

/>



</LineChart>


</ResponsiveContainer>




</div>




</div>













{/* MEMBERS TABLE */}



<div className={styles.section}>


<h2>
Recent Members
</h2>




<table className={styles.memberTable}>


<thead>

<tr>

<th>
Name
</th>

<th>
Gender
</th>


<th>
Role
</th>


<th>
Joined
</th>


</tr>


</thead>





<tbody>


{

dashboard.recentMembers?.map(member=>(


<tr key={member._id}>


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
member.role
}

</td>




<td>

{
new Date(
member.createdAt
)
.toLocaleDateString()
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



export default Dashboard;