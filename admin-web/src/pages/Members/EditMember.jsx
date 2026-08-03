import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import api from "../../api/axios";

import styles from "./EditMember.module.css";


const EditMember = () => {


const {id}=useParams();

const navigate=useNavigate();


const [form,setForm]=useState({

firstName:"",
lastName:"",
email:"",
phone:"",
gender:"",
address:"",
department:"",
cellGroup:"",
baptized:false

});


const [loading,setLoading]=useState(true);



useEffect(()=>{


const fetchMember=async()=>{


try{


const response =
await api.get(`/members/${id}`);


const member=response.data.member;


setForm({

firstName:member.firstName || "",

lastName:member.lastName || "",

email:member.email || "",

phone:member.phone || "",

gender:member.gender || "",

address:member.address || "",

department:member.department || "",

cellGroup:member.cellGroup || "",

baptized:member.baptized || false


});


}
catch(error){

console.log(error);

}
finally{

setLoading(false);

}


};


fetchMember();


},[id]);







const handleChange=(e)=>{


const {name,value,type,checked}=e.target;


setForm({

...form,

[name]:
type==="checkbox"
?
checked
:
value

});


};






const handleSubmit=async(e)=>{


e.preventDefault();


try{


await api.patch(
`/members/${id}`,
form
);


navigate(`/members/${id}`);


}
catch(error){


console.log(
error.response?.data || error.message
);


}


};






if(loading){

return <h2>Loading...</h2>;

}





return (

<div className={styles.container}>


<h1>
Edit Member
</h1>



<form
onSubmit={handleSubmit}
className={styles.form}
>



<input
name="firstName"
value={form.firstName}
onChange={handleChange}
placeholder="First Name"
/>



<input
name="lastName"
value={form.lastName}
onChange={handleChange}
placeholder="Last Name"
/>



<input
name="email"
value={form.email}
onChange={handleChange}
placeholder="Email"
/>



<input
name="phone"
value={form.phone}
onChange={handleChange}
placeholder="Phone"
/>



<select
name="gender"
value={form.gender}
onChange={handleChange}
>

<option value="">
Select Gender
</option>

<option>
Male
</option>

<option>
Female
</option>

</select>





<input
name="address"
value={form.address}
onChange={handleChange}
placeholder="Address"
/>




<input
name="department"
value={form.department}
onChange={handleChange}
placeholder="Department"
/>



<input
name="cellGroup"
value={form.cellGroup}
onChange={handleChange}
placeholder="Cell Group"
/>





<label>

<input

type="checkbox"

name="baptized"

checked={form.baptized}

onChange={handleChange}

/>

Baptized

</label>





<button type="submit">

Save Changes

</button>



</form>


</div>

);


};


export default EditMember;