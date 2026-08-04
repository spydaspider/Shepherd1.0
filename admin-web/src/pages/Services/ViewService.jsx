import {
    useEffect,
    useState
} from "react";

import {
    useParams,
    useNavigate
} from "react-router-dom";


import api from "../../api/axios";

import styles from "./Services.module.css";



const ViewService = () => {


    const {
        id
    } = useParams();


    const navigate = useNavigate();


    const [
        service,
        setService
    ] = useState(null);


    const [
        loading,
        setLoading
    ] = useState(true);





    useEffect(()=>{


        const fetchService = async()=>{


            try{


                const response =
                await api.get(
                    `/services/${id}`
                );


                console.log(
                    "Service:",
                    response.data
                );


                setService(
                    response.data.service
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



        fetchService();



    },[id]);







    const handleEndService = async()=>{


        const confirm =
        window.confirm(
            "End this service?"
        );


        if(!confirm)
        return;



        try{


            await api.patch(
                `/services/${id}/end`
            );


            alert(
                "Service completed"
            );


            navigate("/services");


        }
        catch(error){


            alert(
                error.response?.data?.message ||
                "Failed to end service"
            );


        }


    };








    if(loading)
    return <h2>Loading Service...</h2>;





    if(!service)
    return <h2>Service not found</h2>;







    const summary =
    service.attendanceSummary || {};






    return (


<div className={styles.services}>


<div className={styles.header}>


<div>

<h1>
{service.name}
</h1>


<p>
Service Details
</p>


</div>



<button
onClick={()=>navigate("/services")}
>
Back
</button>


</div>









<div className={styles.detailsCard}>


<h2>
Information
</h2>



<p>
<strong>
Type:
</strong>

{" "}

{service.serviceType}

</p>



<p>
<strong>
Date:
</strong>

{" "}

{
new Date(
service.serviceDate
)
.toLocaleDateString()
}

</p>



<p>
<strong>
Time:
</strong>

{" "}

{service.startTime}

-

{service.endTime}

</p>




<p>
<strong>
Attendance Code:
</strong>

{" "}

<span className={styles.code}>
{service.attendanceCode}
</span>

</p>





<p>

<strong>
Status:
</strong>

{" "}


<span
className={
service.status==="Active"
?
styles.active
:
styles.completed
}
>

{service.status}

</span>


</p>





</div>









<div className={styles.summaryGrid}>


<div className={styles.summaryCard}>

<h3>
Present
</h3>

<h2>
{summary.totalPresent || 0}
</h2>

</div>




<div className={styles.summaryCard}>

<h3>
Absent
</h3>

<h2>
{summary.totalAbsent || 0}
</h2>

</div>





<div className={styles.summaryCard}>

<h3>
Adults
</h3>

<h2>
{summary.adultsPresent || 0}
</h2>

</div>





<div className={styles.summaryCard}>

<h3>
Children
</h3>

<h2>
{summary.childrenPresent || 0}
</h2>

</div>




<div className={styles.summaryCard}>

<h3>
Male
</h3>

<h2>
{summary.malePresent || 0}
</h2>

</div>




<div className={styles.summaryCard}>

<h3>
Female
</h3>

<h2>
{summary.femalePresent || 0}
</h2>

</div>



</div>








<div className={styles.attendanceRate}>


<h2>

Attendance Rate

</h2>


<h1>

{summary.attendanceRate || 0}%

</h1>


</div>









{

service.status==="Active"

&&

<button

className={styles.endBtn}

onClick={handleEndService}

>

End Service

</button>


}



</div>


    );


};



export default ViewService;