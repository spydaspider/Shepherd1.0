import styles from "./ServiceCard.module.css";


const ServiceCard=({service})=>{


return (

<div className={styles.card}>


<h2>
Latest Service
</h2>



{
service ?


<>

<h3>
{service.name}
</h3>


<p>
Type:
{" "}
{service.serviceType}
</p>



<p>
Status:
{" "}
{service.status}
</p>


<p>
Attendance:
{" "}
{
service.attendanceSummary.totalPresent
}
/
{
service.attendanceSummary.totalAbsent +
service.attendanceSummary.totalPresent
}

</p>



</>



:

<p>
No service available
</p>

}



</div>


);


};


export default ServiceCard;