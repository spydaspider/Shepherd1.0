const User = require("../models/User");
const Attendance = require("../models/Attendance");
const FollowUp = require("../models/FollowUp");
const Notification = require("../models/Notification");




// =====================================================
// Generate Follow Ups After Service Completion
// =====================================================

const generateFollowUps = async(serviceId, createdBy)=>{


try{


// ==========================================
// Get Active Members
// ==========================================

const members = await User.find({

    isActive:true,

    deleted:false,

    role:{
        $in:[
            "Member",
            "Child"
        ]
    }

});





// ==========================================
// Get Present Members
// ==========================================


const attendance =
await Attendance.find({

    service:serviceId,

    status:"Present",

    isDeleted:false

});





const attendedIds =
attendance.map(
    record =>
    record.user.toString()
);






// ==========================================
// Find Absentees
// ==========================================


const absentees =
members.filter(member=>

    !attendedIds.includes(
        member._id.toString()
    )

);





if(absentees.length === 0){

    return [];

}







// ==========================================
// Get Leaders
// ==========================================


const leaders =
await User.find({

    role:{
        $in:[
            "Leader",
            "Pastor",
            "Admin"
        ]
    },

    isActive:true

});





if(leaders.length === 0){

    return [];

}








let followUps = [];

let notifications = [];

let leaderIndex = 0;







// ==========================================
// Create Follow Ups
// ==========================================


for(const absentee of absentees){



let memberToFollow = absentee;





// If child, follow up parent instead

if(
    absentee.isChild &&
    absentee.parent
){

    const parent =
    await User.findById(
        absentee.parent
    );


    if(parent){

        memberToFollow = parent;

    }

}






// Check duplicate

const exists =
await FollowUp.findOne({

    member:memberToFollow._id,

    service:serviceId

});





if(exists){

    continue;

}







const assignedLeader =

leaders[
    leaderIndex %
    leaders.length
];


leaderIndex++;








const followUp = {


    member:
    memberToFollow._id,


    service:
    serviceId,


    assignedTo:
    assignedLeader._id,


    type:
    "Phone Call",


    status:
    "Pending",


    priority:
    "Medium",


    followUpDate:
    new Date(
        Date.now()
        +
        24*60*60*1000
    ),


    createdBy:
    createdBy || assignedLeader._id


};






followUps.push(
    followUp
);






notifications.push({


    recipient:
    assignedLeader._id,


    title:
    "New Follow Up Assigned",


    message:
    `${memberToFollow.firstName} ${memberToFollow.lastName} missed the service and requires follow up`,


    type:
    "FollowUp"



});




}







// ==========================================
// Save Follow Ups
// ==========================================


const createdFollowUps =

await FollowUp.insertMany(
    followUps
);







// Add notification references

notifications =
notifications.map(
(notification,index)=>({

    ...notification,

    relatedId:
    createdFollowUps[index]._id

})
);








if(notifications.length){

await Notification.insertMany(
    notifications
);

}







return createdFollowUps;




}
catch(error){

throw error;

}


};








module.exports =
generateFollowUps;