const User = require("../models/User");
const Attendance = require("../models/Attendance");




// =====================================================
// Generate Unique Membership Number
// =====================================================

const generateMembershipNumber = async()=>{


let number;

let exists=true;



while(exists){


const year =
new Date().getFullYear();


const random =
Math.floor(
10000 + Math.random()*90000
);



number =
`CH-${year}-${random}`;



const member =
await User.findOne({

membershipNumber:number

});



if(!member){

exists=false;

}


}



return number;


};









// =====================================================
// Get All Members
// GET /api/members
// =====================================================

const getMembers = async(req,res)=>{


try{


const {

search,

gender,

membershipType,

status,

role,

isChild,

hasAccount,

page=1,

limit=20


}=req.query;





const filter={


deleted:false


};





if(gender)
filter.gender=gender;



if(membershipType)
filter.membershipType=membershipType;



if(status)
filter.status=status;



if(role)
filter.role=role;



if(isChild !== undefined)
filter.isChild =
isChild==="true";



if(hasAccount !== undefined)
filter.hasAccount =
hasAccount==="true";







if(search){


filter.$or=[


{
firstName:{
$regex:search,
$options:"i"
}
},


{
lastName:{
$regex:search,
$options:"i"
}
},


{
email:{
$regex:search,
$options:"i"
}
},


{
phone:{
$regex:search,
$options:"i"
}
},


{
membershipNumber:{
$regex:search,
$options:"i"
}
}


];


}







const skip =
(Number(page)-1)
*
Number(limit);






const members =
await User.find(filter)

.populate(
"parent",
"firstName lastName phone"
)

.populate(
"children",
"firstName lastName"
)

.sort({

createdAt:-1

})

.skip(skip)

.limit(Number(limit));







const total =
await User.countDocuments(filter);







res.json({

success:true,

page:Number(page),

pages:
Math.ceil(
total / limit
),

count:members.length,

total,

members

});





}
catch(error){


res.status(500).json({

success:false,

message:error.message

});


}


};











// =====================================================
// Get Single Member
// GET /api/members/:id
// =====================================================

const getMemberById = async(req,res)=>{


try{


const member =

await User.findOne({

_id:req.params.id,

deleted:false

})


.populate(
"parent",
"firstName lastName phone"
)

.populate(
"children",
"firstName lastName gender dateOfBirth"
);





if(!member){


return res.status(404).json({

success:false,

message:"Member not found"

});


}








const attendance =

await Attendance.find({

user:member._id

})

.populate(
"service",
"name serviceDate"
)

.sort({

createdAt:-1

});







res.json({

success:true,

member,

attendance

});



}
catch(error){


res.status(500).json({

success:false,

message:error.message

});


}


};











// =====================================================
// Create Member
// POST /api/members
// =====================================================

const createMember = async(req,res)=>{


try{


const {

firstName,

lastName,

email,

phone,

gender,

dateOfBirth,

isChild,

parent,

role,

...otherData


}=req.body;






if(
!firstName ||
!lastName ||
!gender

){


return res.status(400).json({

success:false,

message:
"First name, last name and gender are required"

});


}






const memberRole =

isChild

?

"Child"

:

(role || "Member");







const member =

await User.create({



firstName,

lastName,


email:
email || undefined,


phone:
phone || undefined,


gender,


dateOfBirth,



...otherData,



role:memberRole,


isChild:
isChild || false,


parent:
parent || null,



membershipNumber:
await generateMembershipNumber(),



registrationSource:"Admin",



createdBy:req.user._id


});









// Add child to parent

if(
parent
){


await User.findByIdAndUpdate(

parent,

{

$addToSet:{

children:member._id

}

}

);


}








res.status(201).json({

success:true,

message:
"Member created successfully",

member

});



}
catch(error){


res.status(500).json({

success:false,

message:error.message

});


}


};









// =====================================================
// Update Member
// PATCH /api/members/:id
// =====================================================

const updateMember = async(req,res)=>{


try{


const member =

await User.findOne({

_id:req.params.id,

deleted:false

});





if(!member){


return res.status(404).json({

success:false,

message:"Member not found"

});


}






const allowedFields=[


"firstName",

"lastName",

"phone",

"email",

"gender",

"dateOfBirth",

"maritalStatus",

"occupation",

"address",

"emergencyContact",

"emergencyPhone",

"baptized",

"branch",

"department",

"cellGroup",

"area",

"membershipType"


];







allowedFields.forEach(field=>{


if(
req.body[field] !== undefined
){

member[field]=req.body[field];

}


});







member.updatedBy =
req.user._id;



await member.save();







res.json({

success:true,

message:
"Member updated successfully",

member

});



}
catch(error){


res.status(500).json({

success:false,

message:error.message

});


}


};









// =====================================================
// Change Member Status
// PATCH /api/members/:id/status
// =====================================================

const changeMemberStatus = async(req,res)=>{


try{


const {

status

}=req.body;





const member =

await User.findById(
req.params.id
);






if(!member){


return res.status(404).json({

success:false,

message:"Member not found"

});


}







member.status=status;


member.isActive =
status==="Active";



member.updatedBy =
req.user._id;



await member.save();







res.json({

success:true,

message:
"Member status updated",

member

});




}
catch(error){


res.status(500).json({

success:false,

message:error.message

});


}


};









module.exports={


getMembers,

getMemberById,

createMember,

updateMember,

changeMemberStatus


};