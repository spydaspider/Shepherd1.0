const User = require("../models/User");
const Attendance = require("../models/Attendance");
const FollowUp = require("../models/FollowUp");



const generateFollowUps = async(serviceId)=>{

try{


// Get all active members

const members =
await User.find({

    isActive:true,

    role:{
        $in:[
            "Member",
            "Child"
        ]
    }

});



// Get people who attended

const attendance =
await Attendance.find({

    service:serviceId

});



const attendedIds =
attendance.map(
    item => item.user.toString()
);




// Find absentees

const absentees =
members.filter(

member =>

!attendedIds.includes(
member._id.toString()
)

);




// Find Admins and Pastors

const followUpManagers =
await User.find({

    role:{
        $in:[
            "Admin",
            "Pastor"
        ]
    },

    isActive:true

});





let createdFollowUps=[];



for(const absentee of absentees){


for(const manager of followUpManagers){



// Prevent duplicates

const exists =
await FollowUp.findOne({

    member:absentee._id,

    service:serviceId,

    assignedTo:manager._id

});



if(!exists){


const followUp =
await FollowUp.create({

    member:absentee._id,

    service:serviceId,

    assignedTo:manager._id,

    type:"Phone Call",

    status:"Pending",

    createdBy:manager._id

});


createdFollowUps.push(followUp);


}



}



}



return createdFollowUps;



}
catch(error){

throw error;

}


};



module.exports =
generateFollowUps;