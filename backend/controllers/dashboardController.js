const User = require("../models/User");
const Service = require("../models/Service");
const Attendance = require("../models/Attendance");
const FollowUp = require("../models/FollowUp");




// ==========================================
// Main Dashboard
// GET /api/dashboard
// ==========================================

const getDashboard = async (req, res) => {

try{


// =================================
// MEMBER STATISTICS
// =================================


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





// =================================
// ACTIVE SERVICE
// =================================


let service =
await Service.findOne({

    active:true

});


// If no active service,
// get latest service

if(!service){

    service =
    await Service.findOne()
    .sort({
        serviceDate:-1
    });

}






// =================================
// ATTENDANCE DATA
// =================================


let attendance = {

    present:0,

    absent:totalMembers,

    rate:0

};



if(service){


const present =
await Attendance.countDocuments({

    service:service._id,

    status:"Present"

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



attendance={

    present,

    absent,

    rate

};


}







// =================================
// FOLLOW UP DATA
// =================================


const pendingFollowUps =
await FollowUp.countDocuments({

    status:"Pending"

});



const completedFollowUps =
await FollowUp.countDocuments({

    status:"Completed"

});







// =================================
// RECENT MEMBERS
// =================================


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






// =================================
// RESPONSE
// =================================


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




service:

service

?

{

id:service._id,

name:service.name,

serviceType:service.serviceType,

serviceDate:service.serviceDate,

attendanceCode:service.attendanceCode,

attendanceSummary:
service.attendanceSummary


}

:

null,





attendance,





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

isActive:true,

gender:"Male"

});



const female =
await User.countDocuments({

isActive:true,

gender:"Female"

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