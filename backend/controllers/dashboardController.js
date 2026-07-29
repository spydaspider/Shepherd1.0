const User = require("../models/User");
const Service = require("../models/Service");
const FollowUp = require("../models/FollowUp");
const Attendance = require("../models/Attendance");





// =====================================================
// Main Dashboard
// GET /api/dashboard
// =====================================================


const getDashboard = async(req,res)=>{


try{


const today = new Date();



// ==========================================
// MEMBER STATISTICS
// ==========================================


const [

totalMembers,

adults,

children,

male,

female


] = await Promise.all([


User.countDocuments({

isActive:true

}),



User.countDocuments({

isActive:true,

isChild:false

}),



User.countDocuments({

isActive:true,

isChild:true

}),



User.countDocuments({

isActive:true,

gender:"Male"

}),



User.countDocuments({

isActive:true,

gender:"Female"

})


]);







// New members this month


const startMonth =
new Date();


startMonth.setDate(1);

startMonth.setHours(
0,
0,
0,
0
);





const newMembers =

await User.countDocuments({

isActive:true,

createdAt:{
$gte:startMonth
}

});









// ==========================================
// ACTIVE SERVICE
// ==========================================


let service =

await Service.findOne({

status:"Active",

attendanceOpen:true

});





if(!service){


service =

await Service.findOne({

serviceDate:{
$lte:today
}

})

.sort({

serviceDate:-1

});


}










// ==========================================
// ATTENDANCE
// ==========================================


let attendance = {


present:0,

absent:totalMembers,

rate:0,

adults:0,

children:0,

male:0,

female:0


};







if(service){


const summary =
service.attendanceSummary || {};



attendance={


present:
summary.totalPresent || 0,


absent:
summary.totalAbsent || 0,


rate:
summary.attendanceRate || 0,


adults:
summary.adultsPresent || 0,


children:
summary.childrenPresent || 0,


male:
summary.malePresent || 0,


female:
summary.femalePresent || 0



};


}









// ==========================================
// FOLLOW UPS
// ==========================================


const [

pendingFollowUps,

completedFollowUps,

overdueFollowUps


] = await Promise.all([



FollowUp.countDocuments({

status:"Pending"

}),



FollowUp.countDocuments({

status:"Completed"

}),



FollowUp.countDocuments({

status:{
$in:[
"Pending",
"Unable To Reach"
]
},

followUpDate:{
$lt:today
}


})


]);









// ==========================================
// RECENT MEMBERS
// ==========================================


const recentMembers =

await User.find({

isActive:true

})

.sort({

createdAt:-1

})

.limit(5)

.select(

`
firstName
lastName
email
phone
gender
membershipType
membershipNumber
role
createdAt
`

);









// ==========================================
// RECENT SERVICES
// ==========================================


const recentServices =

await Service.find({

serviceDate:{
$lte:today
}

})

.sort({

serviceDate:-1

})

.limit(5)

.select(

`
name
serviceType
serviceDate
attendanceSummary
status
`

);









// ==========================================
// RESPONSE
// ==========================================


res.json({

success:true,


dashboard:{


members:{


totalMembers,

adults,

children,

male,

female,

newMembers


},







service:


service

?

{


id:service._id,

name:service.name,

serviceType:service.serviceType,

serviceDate:service.serviceDate,

attendanceCode:
service.attendanceCode,

status:
service.status,

attendanceOpen:
service.attendanceOpen,


attendanceSummary:
service.attendanceSummary



}


:

null,










attendance,










followUps:{


pending:
pendingFollowUps,


completed:
completedFollowUps,


overdue:
overdueFollowUps


},







recentMembers,







attendanceTrend:


recentServices.map(item=>({


name:item.name,


date:item.serviceDate,


status:item.status,


present:
item.attendanceSummary?.totalPresent || 0,


rate:
item.attendanceSummary?.attendanceRate || 0



}))





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









// =====================================================
// Church Overview
// GET /api/dashboard/overview
// =====================================================


const getOverview = async(req,res)=>{


try{


const [

totalMembers,

adults,

children,

male,

female


]=await Promise.all([


User.countDocuments({

isActive:true

}),



User.countDocuments({

isActive:true,

isChild:false

}),



User.countDocuments({

isActive:true,

isChild:true

}),



User.countDocuments({

isActive:true,

gender:"Male"

}),



User.countDocuments({

isActive:true,

gender:"Female"

})



]);






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









// =====================================================
// Service Dashboard
// GET /api/dashboard/service/:serviceId
// =====================================================


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






const attendanceRecords =

await Attendance.find({

service:service._id

})


.populate(

"user",

`
firstName
lastName
gender
phone
isChild
`

)


.populate(

"markedBy",

`
firstName
lastName
`

)


.sort({

createdAt:-1

});







res.json({


success:true,



service:{


id:service._id,


name:service.name,


serviceType:service.serviceType,


serviceDate:service.serviceDate,


status:service.status,


attendanceOpen:
service.attendanceOpen,


attendanceCode:
service.attendanceCode



},





attendanceSummary:
service.attendanceSummary,





attendanceRecords,



attendanceCount:
attendanceRecords.length



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