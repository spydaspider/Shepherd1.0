const User = require("../models/User");
const Service = require("../models/Service");
const Attendance = require("../models/Attendance");
const FollowUp = require("../models/FollowUp");



// ==========================================
// Main Dashboard
// GET /api/dashboard
// ==========================================

const getDashboard = async(req,res)=>{

try{


// ===============================
// Member Statistics
// ===============================


const totalMembers =
await User.countDocuments({
    isActive:true
});


const adults =
await User.countDocuments({

    isActive:true,

    isChild:false

});


const children =
await User.countDocuments({

    isActive:true,

    isChild:true

});


const male =
await User.countDocuments({

    isActive:true,

    gender:"Male"

});


const female =
await User.countDocuments({

    isActive:true,

    gender:"Female"

});




// ===============================
// Active Service
// ===============================


let activeService =
await Service.findOne({
    active:true
});


if(!activeService){

    activeService =
    await Service.findOne()
    .sort({
        serviceDate:-1
    });

}



let attendanceData = {

    present:0,

    absent:totalMembers,

    rate:0

};




// ===============================
// Attendance Statistics
// ===============================


if(activeService){


const present =
await Attendance.countDocuments({

    service:activeService._id

});



const absent =
totalMembers - present;



const rate =
totalMembers > 0
?
Number(
(
present /
totalMembers *
100
).toFixed(2)
)
:
0;



attendanceData={

    present,

    absent,

    rate

};



}



// ===============================
// Follow Up Statistics
// ===============================


const pendingFollowUps =
await FollowUp.countDocuments({

    status:"Pending"

});



const completedFollowUps =
await FollowUp.countDocuments({

    status:"Completed"

});





// ===============================
// Recent Members
// ===============================


const recentMembers =
await User.find({

    isActive:true

})

.sort({

    createdAt:-1

})

.limit(5)

.select(
"firstName lastName email createdAt"
);






// ===============================
// Response
// ===============================


res.json({

success:true,


dashboard:{


members:{


    totalMembers,

    adults,

    children,

    male,

    female


},



service:activeService
?
{

    id:activeService._id,

    name:activeService.name,

    serviceType:activeService.serviceType,

    date:activeService.serviceDate,

    attendanceCode:
    activeService.attendanceCode

}
:
null,





attendance:attendanceData,





followUps:{


    pending:pendingFollowUps,

    completed:completedFollowUps


},





recentMembers



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





// ==========================================
// Church Overview
// GET /api/dashboard/overview
// ==========================================

const getOverview = async(req,res)=>{

try{


const totalMembers =
await User.countDocuments({

    isActive:true

});



const adults =
await User.countDocuments({

    isActive:true,

    isChild:false

});



const children =
await User.countDocuments({

    isActive:true,

    isChild:true

});



const male =
await User.countDocuments({

    gender:"Male",

    isActive:true

});



const female =
await User.countDocuments({

    gender:"Female",

    isActive:true

});



res.json({

success:true,


overview:{


totalMembers,

adults,

children,

male,

female


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





// ==========================================
// Service Dashboard
// GET /api/dashboard/service/:serviceId
// ==========================================

const getServiceDashboard = async(req,res)=>{


try{


const service =
await Service.findById(
req.params.serviceId
);



if(!service){

return res.status(404).json({

success:false,

message:"Service not found"

});

}



res.json({

success:true,


service:{


id:service._id,

name:service.name,

serviceType:service.serviceType,

serviceDate:service.serviceDate,

attendanceCode:service.attendanceCode


},



attendanceSummary:

service.attendanceSummary



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


getDashboard,

getOverview,

getServiceDashboard


};