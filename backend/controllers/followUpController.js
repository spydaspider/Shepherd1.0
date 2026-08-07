const FollowUp = require("../models/FollowUp");





// =====================================================
// Permission Filter
// =====================================================

const getFollowUpAccessQuery = (user)=>{


    if(
        user.role === "Admin" ||
        user.role === "Pastor"
    ){

        return {};

    }


    return {

        assignedTo:user._id

    };


};







// =====================================================
// GET ALL FOLLOW UPS
// =====================================================

const getFollowUps = async(req,res)=>{


try{


const followUps =
await FollowUp.find(
    getFollowUpAccessQuery(req.user)
)

.populate(
    "member",
    "firstName lastName phone email gender"
)

.populate(
    "assignedTo",
    "firstName lastName role"
)

.populate(
    "service",
    "name serviceDate"
)

.sort({
    createdAt:-1
});




res.json({

    success:true,

    count:followUps.length,

    followUps

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
// GET SINGLE FOLLOW UP
// =====================================================

const getFollowUp = async(req,res)=>{


try{


const followUp =
await FollowUp.findById(
    req.params.id
)

.populate("member")

.populate(
    "assignedTo",
    "firstName lastName role"
)

.populate("service")

.populate(
    "createdBy",
    "firstName lastName"
);





if(!followUp){

return res.status(404).json({

success:false,

message:"Follow up not found"

});

}



res.json({

success:true,

followUp

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
// CREATE FOLLOW UP
// =====================================================

const createFollowUp = async(req,res)=>{


try{


const {

member,

assignedTo,

service,

type,

notes,

followUpDate,

priority


}=req.body;





const followUp =
await FollowUp.create({

member,

assignedTo,

service,

type,

notes,

followUpDate,

priority,

createdBy:req.user._id,

status:"Pending"

});





res.status(201).json({

success:true,

message:"Follow up created successfully",

followUp

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
// UPDATE FOLLOW UP
// =====================================================

const updateFollowUp = async(req,res)=>{


try{


const followUp =
await FollowUp.findById(
    req.params.id
);





if(!followUp){

return res.status(404).json({

success:false,

message:"Follow up not found"

});

}




Object.keys(req.body).forEach(key=>{

    followUp[key] = req.body[key];

});





if(
req.body.status === "Contacted"
&&
!followUp.contactedDate
){

followUp.contactedDate =
new Date();

}




if(
req.body.status === "Completed"
){

followUp.completedDate =
new Date();

}





followUp.updatedBy =
req.user._id;




await followUp.save();





res.json({

success:true,

message:"Follow up updated successfully",

followUp

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
// FOLLOW UP STATS
// =====================================================

const getFollowUpStats = async(req,res)=>{


try{


const query =
getFollowUpAccessQuery(req.user);




const pending =
await FollowUp.countDocuments({

...query,

status:"Pending"

});





const completed =
await FollowUp.countDocuments({

...query,

status:"Completed"

});





const overdue =
await FollowUp.countDocuments({

...query,

status:"Pending",

followUpDate:{
    $lt:new Date()
}

});





res.json({

success:true,

stats:{

pending,

completed,

overdue

}

});


}
catch(error){

res.status(500).json({

success:false,

message:error.message

});

}


};







module.exports = {


getFollowUps,

getFollowUp,

createFollowUp,

updateFollowUp,

getFollowUpStats

};