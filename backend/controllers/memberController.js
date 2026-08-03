const User = require("../models/User");
const Attendance = require("../models/Attendance");




// =====================================================
// Generate Membership Number
// =====================================================

const generateMembershipNumber = async()=>{

    let exists = true;
    let number;


    while(exists){

        const year = new Date().getFullYear();

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
// Generate Family ID
// =====================================================

const generateFamilyId = async () => {

    let exists = true;
    let familyId;

    while (exists) {

        const year = new Date().getFullYear();

        const random = Math.floor(
            1000 + Math.random() * 9000
        );

        familyId = `FAM-${year}-${random}`;

        const family = await User.findOne({
            familyId
        });

        if (!family) {
            exists = false;
        }
    }

    return familyId;

};





// =====================================================
// GET ALL MEMBERS
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
isChild === "true";







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
phone:{
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
total / Number(limit)
),

total,

count:
members.length,

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
// GET SINGLE MEMBER
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

summary:{


totalServices:
attendance.length,


attended:
attendance.filter(
a=>a.present
).length,


absent:
attendance.filter(
a=>!a.present
).length,


rate:

attendance.length

?

Math.round(
(
attendance.filter(
a=>a.present
).length
/
attendance.length
)
*
100
)

:

0


},


lastAttendance:

attendance[0] || null,


history:attendance


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
// GET AVAILABLE PARENTS
// GET /api/members/parents
// =====================================================

// =====================================================
// GET AVAILABLE PARENTS
// GET /api/members/parents
// =====================================================

const getParents = async(req,res)=>{

try{


const parents = await User.find({

deleted:false,

isChild:false,

status:"Active",

role:{
    $in:[
        "Member",
        "Leader",
        "Pastor"
    ]
}

})

.select(
"firstName lastName phone membershipNumber role"
)

.sort({

firstName:1

});





res.json({

success:true,

parents

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
// CREATE MEMBER
// POST /api/members
// =====================================================

// =====================================================
// CREATE MEMBER WITH CHILDREN
// POST /api/members
// =====================================================

const createMember = async(req,res)=>{

try{


const data = req.body;



const {

firstName,

lastName,

email,

phone,

gender,


children=[],

hasAccount=false,

password


}=data;





// ===============================
// VALIDATION
// ===============================


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





if(
hasAccount &&
!password
){

return res.status(400).json({

success:false,

message:
"Password required when creating account"

});

}





// ===============================
// CHECK DUPLICATES
// ===============================


if(email){

const exists =
await User.findOne({
email
});


if(exists){

return res.status(400).json({

success:false,

message:
"Email already exists"

});

}

}





if(phone){

const exists =
await User.findOne({
phone
});


if(exists){

return res.status(400).json({

success:false,

message:
"Phone already exists"

});

}

}







// ===============================
// CREATE PARENT
// ===============================


const membershipNumber =
await generateMembershipNumber();
const familyId =
await generateFamilyId();




const parent = await User.create({

...data,


familyId,


children:[],

membershipNumber,



isChild:false,


parent:null,


guardian:null,



role:
data.role || "Member",



hasAccount:Boolean(hasAccount),



loginEnabled:Boolean(hasAccount),



mustChangePassword:
hasAccount
?
true
:
false,



accountCreatedAt:
hasAccount
?
new Date()
:
null,



accountCreatedBy:
hasAccount
?
req.user?._id
:
null,



registrationSource:"Admin",


createdBy:
req.user?._id || null


});







// ===============================
// CREATE CHILDREN
// ===============================


let createdChildren=[];



if(
Array.isArray(children)
&&
children.length > 0
){


for(
const child of children
){



const childMember = await User.create({

    firstName: child.firstName,

    lastName: child.lastName || lastName,

    gender: child.gender,

    dateOfBirth: child.dateOfBirth || null,

    isChild: true,

    parent: parent._id,

    guardian: parent._id,

    role: "Child",

    membershipType: "Member",

    status: "Active",

    registrationSource: "Parent",

    createdBy: req.user?._id || null

});




createdChildren.push(
childMember._id
);



}





// update parent children array


parent.children =
createdChildren;



await parent.save();



}









// ===============================
// RESPONSE
// ===============================


const result =
await User.findById(parent._id)

.populate(
"children",
"firstName lastName gender dateOfBirth"
);







res.status(201).json({

success:true,

message:
"Member and children created successfully",

familyId,

member:result

});




}
catch(error){


console.log(error);


res.status(500).json({

success:false,

message:error.message

});


}


};









// =====================================================
// UPDATE MEMBER
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

message:
"Member not found"

});


}








Object.keys(req.body).forEach(field=>{


if(field !== "password"){

member[field]=req.body[field];

}


});







member.updatedBy =
req.user?._id || null;






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
// CHANGE STATUS
// PATCH /api/members/:id/status
// =====================================================


const changeMemberStatus = async(req,res)=>{


try{


const {

status

}=req.body;





if(!status){


return res.status(400).json({

success:false,

message:
"Status required"

});


}






const member =

await User.findById(
req.params.id
);





if(!member){


return res.status(404).json({

success:false,

message:
"Member not found"

});


}






member.status=status;


member.isActive =
status==="Active";



member.updatedBy =
req.user?._id || null;



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

changeMemberStatus,

getParents

};