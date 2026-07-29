import { useState } from "react";

import { useNavigate } from "react-router-dom";

import api from "../../api/axios";

import styles from "./AddMember.module.css";



const AddMember = () => {


const navigate = useNavigate();



const [loading,setLoading] = useState(false);

const [error,setError] = useState("");



const [formData,setFormData] = useState({

    firstName:"",
    lastName:"",

    email:"",
    phone:"",

    hasAccount:false,
    password:"",

    gender:"",
    dateOfBirth:"",

    maritalStatus:"Single",

    occupation:"",

    address:"",

    emergencyContact:"",
    emergencyPhone:"",


    branch:"Main Branch",

    department:"",

    cellGroup:"",

    area:"",


    membershipType:"Member",

    role:"Member",


    isChild:false,

    baptized:false

});





const handleChange = (e)=>{


const {
    name,
    value,
    type,
    checked
}=e.target;



setFormData(prev=>({

    ...prev,

    [name]:

    type==="checkbox"

    ?

    checked

    :

    value

}));



};







const handleSubmit = async(e)=>{


e.preventDefault();


setError("");



if(
formData.hasAccount &&
!formData.password
){

setError(
"Password is required when creating an account"
);

return;

}




try{


setLoading(true);



const response = await api.post(

"/members",

formData

);



console.log(
response.data
);



navigate("/members");



}
catch(error){


setError(

error.response?.data?.message ||

"Failed to create member"

);


}
finally{


setLoading(false);


}


};








return (


<div className={styles.page}>


{/* HEADER */}


<div className={styles.header}>


<div>


<h1>
Add New Member
</h1>


<p>
Create a church member profile
</p>


</div>




<button

type="button"

className={styles.backBtn}

onClick={()=>navigate("/members")}

>

← Back

</button>



</div>









<form

className={styles.form}

onSubmit={handleSubmit}

>





{
error &&

<div className={styles.error}>

{error}

</div>

}








{/* PERSONAL INFORMATION */}



<section className={styles.card}>


<h2>
👤 Personal Information
</h2>



<div className={styles.grid}>


<input

name="firstName"

placeholder="First Name"

value={formData.firstName}

onChange={handleChange}

/>




<input

name="lastName"

placeholder="Last Name"

value={formData.lastName}

onChange={handleChange}

/>






<input

name="email"

type="email"

placeholder="Email Address"

value={formData.email}

onChange={handleChange}

/>






<input

name="phone"

placeholder="Phone Number"

value={formData.phone}

onChange={handleChange}

/>








<select

name="gender"

value={formData.gender}

onChange={handleChange}

>


<option value="">
Gender
</option>


<option>
Male
</option>


<option>
Female
</option>


</select>







<input

type="date"

name="dateOfBirth"

value={formData.dateOfBirth}

onChange={handleChange}

/>






<select

name="maritalStatus"

value={formData.maritalStatus}

onChange={handleChange}

>


<option>
Single
</option>


<option>
Married
</option>


<option>
Divorced
</option>


<option>
Widowed
</option>



</select>








<input

name="occupation"

placeholder="Occupation"

value={formData.occupation}

onChange={handleChange}

/>



</div>


</section>









{/* ACCOUNT */}



<section className={styles.card}>


<h2>
🔐 Account Access
</h2>




<div className={styles.toggle}>


<label>


<input

type="checkbox"

name="hasAccount"

checked={formData.hasAccount}

onChange={handleChange}

/>


Create login account


</label>



<p>

Enable this if the member should login and mark attendance personally.

</p>


</div>





{

formData.hasAccount &&


<div className={styles.grid}>


<input

type="password"

name="password"

placeholder="Temporary Password"

value={formData.password}

onChange={handleChange}

/>


</div>


}





</section>









{/* CHURCH INFORMATION */}



<section className={styles.card}>


<h2>
⛪ Church Information
</h2>




<div className={styles.grid}>




<select

name="membershipType"

value={formData.membershipType}

onChange={handleChange}

>


<option>
Member
</option>


<option>
Visitor
</option>


<option>
New Convert
</option>


<option>
Worker
</option>


<option>
Leader
</option>


<option>
Pastor
</option>


</select>







<select

name="role"

value={formData.role}

onChange={handleChange}

>


<option>
Member
</option>


<option>
Leader
</option>


<option>
Pastor
</option>


<option>
Admin
</option>



</select>







<input

name="branch"

placeholder="Branch"

value={formData.branch}

onChange={handleChange}

/>







<input

name="department"

placeholder="Department"

value={formData.department}

onChange={handleChange}

/>








<input

name="cellGroup"

placeholder="Cell Group"

value={formData.cellGroup}

onChange={handleChange}

/>







<input

name="area"

placeholder="Area"

value={formData.area}

onChange={handleChange}

/>



</div>



</section>









{/* ADDRESS */}



<section className={styles.card}>


<h2>
📍 Address & Emergency
</h2>



<div className={styles.grid}>


<input

className={styles.full}

name="address"

placeholder="Home Address"

value={formData.address}

onChange={handleChange}

/>







<input

name="emergencyContact"

placeholder="Emergency Contact"

value={formData.emergencyContact}

onChange={handleChange}

/>








<input

name="emergencyPhone"

placeholder="Emergency Phone"

value={formData.emergencyPhone}

onChange={handleChange}

/>



</div>


</section>









{/* OPTIONS */}



<section className={styles.card}>


<h2>
⚙ Additional Information
</h2>




<div className={styles.checkbox}>


<label>

<input

type="checkbox"

name="isChild"

checked={formData.isChild}

onChange={handleChange}

/>


Child Member

</label>







<label>


<input

type="checkbox"

name="baptized"

checked={formData.baptized}

onChange={handleChange}

/>


Baptized

</label>



</div>


</section>









{/* BUTTONS */}



<div className={styles.actions}>


<button

type="button"

className={styles.cancelBtn}

onClick={()=>navigate("/members")}

>

Cancel

</button>





<button

type="submit"

className={styles.saveBtn}

disabled={loading}

>


{

loading

?

"Creating..."

:

"Create Member"

}


</button>



</div>







</form>



</div>


);


};



export default AddMember;