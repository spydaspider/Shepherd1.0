const User = require("../models/User");
const Attendance = require("../models/Attendance");
const FollowUp = require("../models/FollowUp");
const Notification = require("../models/Notification");



const generateFollowUps = async(serviceId)=>{

try{


// ==========================================
// Get all active members
// ==========================================

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




// ==========================================
// Get attendance records
// ==========================================

const attendance =
await Attendance.find({

    service:serviceId

});



const attendedIds =
attendance.map(
    item => item.user.toString()
);




// ==========================================
// Find absentees
// ==========================================

const absentees =
members.filter(

member =>

!attendedIds.includes(
member._id.toString()
)

);




// ==========================================
// Get Admins and Pastors
// ==========================================

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





// ==========================================
// Create Follow Ups
// ==========================================

for(const absentee of absentees){


for(const manager of followUpManagers){



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





// ==========================================
// Create Notification
// ==========================================

await Notification.create({

    recipient:manager._id,

    title:"New Follow-up Assigned",

    message:
    `You have been assigned a follow-up task for ${absentee.firstName} ${absentee.lastName}`,

    type:"FollowUp",

    relatedId:followUp._id

});





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