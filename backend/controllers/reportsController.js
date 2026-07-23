const Service = require("../models/Service");
const Attendance = require("../models/Attendance");
const User = require("../models/User");
const FollowUp = require("../models/FollowUp");




// ==========================================
// Attendance Report
// GET /api/reports/attendance/:serviceId
// ==========================================

const getAttendanceReport = async(req,res)=>{

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





const totalMembers =
await User.countDocuments({

isActive:true

});




const attendance =
await Attendance.find({

service:service._id

})
.populate(
"user",
"firstName lastName gender isChild"
);




const present =
attendance.length;



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





let adults = 0;

let children = 0;

let male = 0;

let female = 0;





attendance.forEach(record=>{


const member =
record.user;



if(member.isChild){

children++;

}
else{

adults++;

}




if(member.gender==="Male"){

male++;

}



if(member.gender==="Female"){

female++;

}



});





res.json({

success:true,


report:{


service:{


id:service._id,

name:service.name,

serviceDate:service.serviceDate


},



attendance:{


totalMembers,

present,

absent,

rate,

adults,

children,

male,

female


}


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
// Service History Report
// GET /api/reports/services
// ==========================================

const getServiceReports = async(req,res)=>{


try{


const services =
await Service.find()

.sort({

serviceDate:-1

})

.select(

"name serviceType serviceDate attendanceSummary"

);





res.json({

success:true,

count:services.length,

services

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
// Member Attendance Report
// GET /api/reports/member/:memberId
// ==========================================

const getMemberAttendanceReport = async(req,res)=>{


try{


const member =
await User.findById(
req.params.memberId
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
);





const totalServices =
await Service.countDocuments();



const attended =
attendance.length;



const absent =
totalServices - attended;



const rate =
totalServices > 0

?

Number(
(
attended /
totalServices *
100
).toFixed(2)
)

:

0;





res.json({

success:true,


member:{


id:member._id,

name:
`${member.firstName} ${member.lastName}`


},



attendance:{


totalServices,

attended,

absent,

rate


},



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







// ==========================================
// Follow Up Report
// GET /api/reports/followups
// ==========================================

const getFollowUpReport = async(req,res)=>{


try{


const pending =
await FollowUp.countDocuments({

status:"Pending"

});



const contacted =
await FollowUp.countDocuments({

status:"Contacted"

});



const completed =
await FollowUp.countDocuments({

status:"Completed"

});



const unable =
await FollowUp.countDocuments({

status:"Unable To Reach"

});






res.json({

success:true,


followUps:{


pending,

contacted,

completed,

unable


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


getAttendanceReport,

getServiceReports,

getMemberAttendanceReport,

getFollowUpReport


};