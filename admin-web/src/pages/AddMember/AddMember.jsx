import { useState } from "react";

import { useNavigate } from "react-router-dom";

import api from "../../api/axios";

import styles from "./AddMember.module.css";


const AddMember = () => {


const navigate = useNavigate();



const [formData,setFormData] = useState({

    firstName:"",
    lastName:"",
    email:"",
    phone:"",

    gender:"",

    dateOfBirth:"",

    maritalStatus:"",

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




const [loading,setLoading] = useState(false);





const handleChange = (e)=>{


const {name,value,type,checked}=e.target;



setFormData({

    ...formData,

    [name]:

    type==="checkbox"

    ?

    checked

    :

    value

});


};







const handleSubmit = async(e)=>{


e.preventDefault();


try{


setLoading(true);



const response = await api.post(

"/members",

formData

);



console.log(response.data);



navigate("/members");



}

catch(error){


console.log(

error.response?.data || error.message

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


<div className={styles.titleArea}>


<div className={styles.icon}>

+

</div>



<div>

<h1>
Add New Member
</h1>


<p>
Create a new church member profile
</p>


</div>


</div>





<button

type="button"

className={styles.backBtn}

onClick={()=>navigate("/members")}

>

← Back To Members

</button>


</div>









<form

className={styles.form}

onSubmit={handleSubmit}

>





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


<option value="">
Marital Status
</option>


<option>
Single
</option>


<option>
Married
</option>


<option>
Divorced
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









{/* CHURCH INFORMATION */}


<section className={styles.card}>


<h2>
⛪ Church Information
</h2>



<div className={styles.grid}>


<select

name="role"

value={formData.role}

onChange={handleChange}

>


<option>
Member
</option>

<option>
Admin
</option>

<option>
Pastor
</option>

<option>
Leader
</option>


</select>






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
Child
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

name="baptized"

checked={formData.baptized}

onChange={handleChange}

/>

Baptized

</label>







<label>


<input

type="checkbox"

name="isChild"

checked={formData.isChild}

onChange={handleChange}

/>

Child Member


</label>



</div>


</section>









{/* ACTION BUTTONS */}


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

"Saving..."

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