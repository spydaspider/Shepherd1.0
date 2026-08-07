import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid
} from "recharts";


import styles from "./AttendanceDashboard.module.css";



const AttendanceHistogram = ({data}) => {


return (

<div className={styles.chartBox}>


<h2>
    Attendance By Service
</h2>



<ResponsiveContainer
    width="100%"
    height={300}
>


<BarChart
    data={data}
>


<CartesianGrid
    strokeDasharray="3 3"
/>


<XAxis

dataKey="name"

/>


<YAxis />



<Tooltip />



<Bar

dataKey="attendance"

fill="#0f2a5f"

radius={[8,8,0,0]}

/>



</BarChart>


</ResponsiveContainer>


</div>

);


};


export default AttendanceHistogram;