const FollowUp = require("../models/FollowUp");
const User = require("../models/User");





// =====================================================
// Helper: Role Access Filter
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
// Get All Follow Ups
// GET /api/followups
// =====================================================


const getFollowUps = async(req,res)=>{


try{


const query =
getFollowUpAccessQuery(
    req.user
);



const followUps =

await FollowUp.find(query)

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
// Get Single Follow Up
// GET /api/followups/:id
// =====================================================


const getFollowUp = async(req,res)=>{


try{


const followUp =

await FollowUp.findById(
req.params.id
)

.populate(
"member"
)

.populate(
"assignedTo",
"firstName lastName role"
)

.populate(
"service"
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
// Get Pending Follow Ups
// GET /api/followups/pending
// =====================================================


const getPendingFollowUps = async(req,res)=>{


try{


const query = {

status:"Pending",

...getFollowUpAccessQuery(req.user)

};




const followUps =

await FollowUp.find(query)

.populate(
"member",
"firstName lastName phone"
)

.populate(
"assignedTo",
"firstName lastName"
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
// Get Completed Follow Ups
// GET /api/followups/completed
// =====================================================


const getCompletedFollowUps = async(req,res)=>{


try{


const query = {


status:"Completed",

...getFollowUpAccessQuery(req.user)


};





const followUps =

await FollowUp.find(query)

.populate(
"member",
"firstName lastName phone"
)

.populate(
"assignedTo",
"firstName lastName"
)

.populate(
"service",
"name serviceDate"
)

.sort({

completedDate:-1

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
// Get Overdue Follow Ups
// GET /api/followups/overdue
// =====================================================


const getOverdueFollowUps = async(req,res)=>{


try{


const query = {


status:"Pending",


followUpDate:{
    $lt:new Date()
},


...getFollowUpAccessQuery(req.user)



};





const followUps =

await FollowUp.find(query)

.populate(
"member",
"firstName lastName phone"
)

.populate(
"assignedTo",
"firstName lastName"
)

.sort({

followUpDate:1

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
// Create Follow Up
// POST /api/followups
// =====================================================


const createFollowUp = async(req,res)=>{


try{


const {


member,

assignedTo,

service,

type,

notes,

followUpDate


}=req.body;







const followUp =

await FollowUp.create({


member,


assignedTo,


service,


type,


notes,


followUpDate,


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
// Update Follow Up
// PATCH /api/followups/:id
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







if(req.body.status){

followUp.status =
req.body.status;


}






if(req.body.notes){

followUp.notes =
req.body.notes;


}






if(req.body.assignedTo){

followUp.assignedTo =
req.body.assignedTo;


}






if(
req.body.status==="Contacted"
&&
!followUp.contactedDate

){

followUp.contactedDate =
new Date();

}






if(
req.body.status==="Completed"
){

followUp.completedDate =
new Date();

}







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
// Dashboard Statistics
// GET /api/followups/stats
// =====================================================


const getFollowUpStats = async(req,res)=>{


try{


const pending =

await FollowUp.countDocuments({

status:"Pending"

});




const completed =

await FollowUp.countDocuments({

status:"Completed"

});





const overdue =

await FollowUp.countDocuments({

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









module.exports={


getFollowUps,

getFollowUp,

getPendingFollowUps,

getCompletedFollowUps,

getOverdueFollowUps,

createFollowUp,

updateFollowUp,

getFollowUpStats


};