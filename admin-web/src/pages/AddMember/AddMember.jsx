import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../api/axios";

import styles from "./AddMember.module.css";



const AddMember = () => {


const navigate = useNavigate();



const [loading,setLoading] = useState(false);

const [error,setError] = useState("");





const [formData,setFormData] = useState({



// =========================
// PERSONAL INFORMATION
// =========================

firstName:"",

lastName:"",

email:"",

phone:"",

gender:"",

dateOfBirth:"",

maritalStatus:"Single",

occupation:"",

address:"",





// =========================
// EMERGENCY
// =========================

emergencyContact:"",

emergencyPhone:"",






// =========================
// ACCOUNT
// =========================

hasAccount:false,

password:"",

mustChangePassword:true,







// =========================
// CHURCH INFORMATION
// =========================

membershipType:"Member",

role:"Member",

status:"Active",


branch:"Main Branch",

department:"",

cellGroup:"",

area:"",


baptized:false,







// =========================
// CHILDREN
// =========================

children:[],






// =========================
// NOTIFICATIONS
// =========================

notificationSettings:{


email:true,

push:true,

sms:false


}



});









// =================================
// NORMAL INPUT HANDLER
// =================================


const handleChange=(e)=>{


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










// =================================
// NOTIFICATION HANDLER
// =================================


const handleNotificationChange=(e)=>{


const {

name,

checked

}=e.target;



setFormData(prev=>({


...prev,


notificationSettings:{


...prev.notificationSettings,


[name]:checked


}


}));



};










// =================================
// CHILD MANAGEMENT
// =================================


const addChild = ()=>{


setFormData(prev=>({


...prev,


children:[


...prev.children,


{


firstName:"",

lastName:"",

gender:"",

dateOfBirth:"",

relationship:"Child"


}


]


}));



};









const removeChild=(index)=>{


setFormData(prev=>({


...prev,


children:

prev.children.filter(

(_,i)=>i !== index

)


}));



};









const handleChildChange=(index,e)=>{


const {

name,

value

}=e.target;



const updatedChildren =

[

...formData.children

];



updatedChildren[index][name]=value;




setFormData(prev=>({


...prev,


children:updatedChildren


}));



};












// =================================
// SUBMIT FORM
// =================================


const handleSubmit=async(e)=>{


e.preventDefault();


setError("");






if(

!formData.firstName ||

!formData.lastName ||

!formData.gender

){


setError(

"First name, last name and gender are required"

);


return;


}







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






const payload={



...formData,




email:

formData.email.trim()

||

undefined,





phone:

formData.phone.trim()

||

undefined,





dateOfBirth:

formData.dateOfBirth

||

null,





hasAccount:

Boolean(

formData.hasAccount

),





loginEnabled:

Boolean(

formData.hasAccount

),





children:
formData.children.map(child=>({

    firstName: child.firstName,

    lastName: child.lastName || formData.lastName,

    gender: child.gender,

    dateOfBirth: child.dateOfBirth || null

}))



};









if(!formData.hasAccount){


delete payload.password;


}








const response =

await api.post(

"/members",

payload

);






console.log(response.data);




navigate("/members");



}
catch(error){


console.log(

error.response?.data

);



setError(


error.response?.data?.message

||

"Failed creating member"


);


}
finally{


setLoading(false);


}



};









return (

<div className={styles.page}>


<div className={styles.header}>


<div>

<h1>
Add New Member
</h1>


<p>
Create member profile and family details
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







{/* =========================
PERSONAL INFORMATION
========================= */}


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


<option value="Male">

Male

</option>



<option value="Female">

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









{/* =========================
ACCOUNT ACCESS
========================= */}


<section className={styles.card}>


<h2>
🔐 Account Access
</h2>




<label>


<input

type="checkbox"

name="hasAccount"

checked={formData.hasAccount}

onChange={handleChange}

/>


Create Login Account


</label>







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





<label>


<input

type="checkbox"

name="mustChangePassword"

checked={formData.mustChangePassword}

onChange={handleChange}

/>


Force password change first login


</label>



</div>



}



</section>









{/* =========================
CHURCH INFORMATION
========================= */}


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
Visitor
</option>


<option>
New Convert
</option>


<option>
Member
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








<select

name="status"

value={formData.status}

onChange={handleChange}

>


<option>
Active
</option>


<option>
Inactive
</option>


<option>
Transferred
</option>


<option>
Suspended
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





{/* =========================
CHILDREN INFORMATION
========================= */}


<section className={styles.card}>


<h2>
👨‍👩‍👧 Children
</h2>



<p>
Add children belonging to this member.
</p>





<button

type="button"

className={styles.addBtn}

onClick={addChild}

>

+ Add Child

</button>








{

formData.children.map((child,index)=>(



<div

key={index}

className={styles.childCard}

>




<div className={styles.childHeader}>


<h3>

Child {index + 1}

</h3>




<button

type="button"

className={styles.removeBtn}

onClick={()=>removeChild(index)}

>

Remove

</button>



</div>







<div className={styles.grid}>





<input

name="firstName"

placeholder="Child First Name"

value={child.firstName}

onChange={(e)=>

handleChildChange(index,e)

}

/>







<input

name="lastName"

placeholder="Child Last Name"

value={child.lastName}

onChange={(e)=>

handleChildChange(index,e)

}

/>








<select

name="gender"

value={child.gender}

onChange={(e)=>

handleChildChange(index,e)

}

>


<option value="">

Select Gender

</option>



<option value="Male">

Male

</option>



<option value="Female">

Female

</option>



</select>







<input

type="date"

name="dateOfBirth"

value={child.dateOfBirth}

onChange={(e)=>

handleChildChange(index,e)

}

/>











</div>





</div>



))


}



</section>









{/* =========================
ADDRESS & EMERGENCY
========================= */}



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

placeholder="Emergency Contact Name"

value={formData.emergencyContact}

onChange={handleChange}

/>








<input

name="emergencyPhone"

placeholder="Emergency Contact Phone"

value={formData.emergencyPhone}

onChange={handleChange}

/>






</div>



</section>









{/* =========================
NOTIFICATIONS
========================= */}



<section className={styles.card}>


<h2>
🔔 Notification Settings
</h2>







<div className={styles.checkboxGroup}>






<label>


<input

type="checkbox"

name="email"

checked={

formData.notificationSettings.email

}

onChange={handleNotificationChange}

/>


Email Notifications


</label>









<label>


<input

type="checkbox"

name="push"

checked={

formData.notificationSettings.push

}

onChange={handleNotificationChange}

/>


Push Notifications


</label>









<label>


<input

type="checkbox"

name="sms"

checked={

formData.notificationSettings.sms

}

onChange={handleNotificationChange}

/>


SMS Notifications


</label>







</div>



</section>









{/* =========================
ADDITIONAL INFORMATION
========================= */}



<section className={styles.card}>


<h2>
⚙ Additional Information
</h2>





<label>


<input

type="checkbox"

name="baptized"

checked={formData.baptized}

onChange={handleChange}

/>


Baptized


</label>





</section>









{/* =========================
ACTIONS
========================= */}




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

disabled={loading}

className={styles.saveBtn}

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