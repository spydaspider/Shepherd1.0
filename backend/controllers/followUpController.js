const FollowUp = require("../models/FollowUp");

const User = require("../models/User");

const Service = require("../models/Service");



// =====================================
// Create Follow Up Task
// POST /api/followup
// =====================================

const createFollowUp = async(req,res)=>{


try{


const {

member,

service,

assignedTo,

type,

notes

}=req.body;



const followUp =
await FollowUp.create({


member,

service,

assignedTo,

type,

notes,

createdBy:req.user._id


});



res.status(201).json({

success:true,

message:"Follow up created",

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




// =====================================
// Get Pending Follow Ups
// GET /api/followup
// =====================================

const getFollowUps = async(req,res)=>{


try{


const followUps =
await FollowUp.find()

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
);



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




// =====================================
// Update Follow Up
// PUT /api/followup/:id
// =====================================

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



followUp.status =
req.body.status ??
followUp.status;



followUp.notes =
req.body.notes ??
followUp.notes;



if(req.body.status==="Completed"){

followUp.contactedDate =
new Date();

}



await followUp.save();



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



module.exports={

createFollowUp,

getFollowUps,

updateFollowUp

};