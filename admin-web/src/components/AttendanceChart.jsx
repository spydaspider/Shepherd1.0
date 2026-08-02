import {

    LineChart,

    Line,

    XAxis,

    YAxis,

    CartesianGrid,

    Tooltip,

    ResponsiveContainer

} from "recharts";


import styles from "./AttendanceChart.module.css";





const AttendanceChart = ({data})=>{


return (

<div className={styles.card}>


<h2>
Attendance Trend
</h2>





{

data?.length ?



<ResponsiveContainer
width="100%"
height={280}
>


<LineChart
data={data}
>


<CartesianGrid />


<XAxis
dataKey="name"
/>



<YAxis />



<Tooltip />



<Line

type="monotone"

dataKey="present"

strokeWidth={3}

/>



</LineChart>


</ResponsiveContainer>



:



<p>
No attendance data available
</p>


}



</div>


);


};


export default AttendanceChart;