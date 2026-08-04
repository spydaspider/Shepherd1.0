const Service = require("../models/Service");
const User = require("../models/User");
const Attendance = require("../models/Attendance");
const Notification = require("../models/Notification");

const generateFollowUps = require("../utils/generateFollowUps");




// ==========================================
// Generate Attendance Code
// ==========================================

const generateAttendanceCode = () => {

    return Math.floor(
        1000 + Math.random() * 9000
    ).toString();

};





// ==========================================
// Generate Unique Code
// ==========================================

const generateUniqueCode = async()=>{


    let code;

    let exists = true;



    while(exists){


        code = generateAttendanceCode();



        const service =
        await Service.findOne({
            attendanceCode:code
        });



        if(!service){

            exists=false;

        }

    }



    return code;

};







// ==========================================
// Update Attendance Summary
// ==========================================

const updateAttendanceSummary = async(serviceId)=>{


const service =
await Service.findById(serviceId);



if(!service){

return;

}




const totalMembers =
await User.countDocuments({

isActive:true

});





const attendance =
await Attendance.find({

service:serviceId,

status:"Present"

})
.populate("user");





const users =
attendance.map(
item=>item.user
);





service.attendanceSummary = {


totalPresent:
users.length,


totalAbsent:
Math.max(
totalMembers - users.length,
0
),



adultsPresent:

users.filter(
user=>!user.isChild
).length,



childrenPresent:

users.filter(
user=>user.isChild
).length,



malePresent:

users.filter(
user=>user.gender==="Male"
).length,



femalePresent:

users.filter(
user=>user.gender==="Female"
).length,



attendanceRate:

totalMembers > 0

?

Number(
(
users.length /
totalMembers *
100
)
.toFixed(2)
)

:

0


};



await service.save();



};









// ==========================================
// Create Service
// POST /api/services
// ==========================================


const createService = async(req,res)=>{


try{


const {

name,

serviceType,

serviceDate,

startTime,

endTime,

description


}=req.body;





if(
!name ||
!serviceType ||
!serviceDate
){


return res.status(400).json({

success:false,

message:
"Name, service type and date are required"

});

}





// Check duplicate service


const start =
new Date(serviceDate);

start.setHours(
0,0,0,0
);



const end =
new Date(serviceDate);

end.setHours(
23,59,59,999
);





const existing =
await Service.findOne({

serviceType,

serviceDate:{
$gte:start,
$lte:end
}

});





if(existing){


return res.status(400).json({

success:false,

message:
"Service already exists for this date"

});

}





// Close previous active service


await Service.updateMany({

status:"Active",

attendanceOpen:true

},{

status:"Completed",

attendanceOpen:false,

closedAt:new Date()

});







const attendanceCode =
await generateUniqueCode();





const expiry =
new Date(serviceDate);


expiry.setHours(
23,
59,
59,
999
);






const service =
await Service.create({

name,

serviceType,

serviceDate,

startTime,

endTime,

description:description || "",


attendanceCode,


codeExpiresAt:expiry,


status:"Active",


attendanceOpen:true,


generatedBy:req.user._id


});








// Notify Admin and Pastors


const managers =
await User.find({

role:{
$in:[
"Admin",
"Pastor"
]
},

isActive:true

});





if(managers.length){


await Notification.insertMany(

managers.map(manager=>({

recipient:manager._id,

title:"New Service Created",

message:
`${name} scheduled for ${new Date(serviceDate).toDateString()}`,

type:"Service",

relatedId:service._id

}))

);


}







res.status(201).json({

success:true,

message:
"Service created successfully",

service

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
// Get Active Service
// GET /api/services/active
// ==========================================


const getActiveService = async(req,res)=>{


try{


const service =
await Service.findOne({

status:"Active",

attendanceOpen:true

});





if(!service){


return res.status(404).json({

success:false,

message:
"No active service found"

});

}





// Expire attendance code


if(

service.codeExpiresAt &&
new Date() > service.codeExpiresAt

){


service.status="Completed";

service.attendanceOpen=false;

service.closedAt=new Date();


await service.save();





return res.status(400).json({

success:false,

message:
"Attendance code expired"

});


}





res.json({

success:true,

service

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
// End Service
// PATCH /api/services/:id/end
// ==========================================


const endService = async(req,res)=>{


try{


const service =
await Service.findById(
req.params.id
);





if(!service){


return res.status(404).json({

success:false,

message:
"Service not found"

});

}




if(service.status==="Completed"){


return res.status(400).json({

success:false,

message:
"Service already completed"

});

}





// Update attendance first

await updateAttendanceSummary(
service._id
);





// Generate follow ups

const followUps =
await generateFollowUps(
service._id
);






service.status="Completed";

service.attendanceOpen=false;

service.closedAt=new Date();


await service.save();








// Notify leaders


const leaders =
await User.find({

role:{
$in:[
"Admin",
"Pastor",
"Leader"
]
},

isActive:true

});





if(leaders.length){


await Notification.insertMany(

leaders.map(user=>({


recipient:user._id,

title:"Service Completed",

message:
`${service.name} completed. ${followUps.length} follow ups created.`,

type:"Service",

relatedId:service._id


}))

);


}








res.json({

success:true,

message:
"Service completed successfully",

followUpsCreated:
followUps.length,

service


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
// Get All Services
// GET /api/services
// ==========================================


const getServices = async(req,res)=>{


try{


const services =
await Service.find()

.populate(

"generatedBy",

"firstName lastName"

)

.sort({

serviceDate:-1

});





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
// Get Service By ID
// GET /api/services/:id
// ==========================================


// ==========================================
// Get Service By ID
// GET /api/services/:id
// ==========================================

const getServiceById = async (req, res) => {

    try {


        let service = await Service.findById(
            req.params.id
        )
        .populate(
            "generatedBy",
            "firstName lastName"
        );



        if (!service) {

            return res.status(404).json({

                success:false,

                message:"Service not found"

            });

        }





        // Update summary for active services
        if(service.status === "Active"){

            await updateAttendanceSummary(
                service._id
            );


            // fetch fresh updated service
            service = await Service.findById(
                req.params.id
            )
            .populate(
                "generatedBy",
                "firstName lastName"
            );

        }







        const attendance = await Attendance.find({

            service: service._id

        })
        .populate(

            "user",

            "firstName lastName gender isChild membershipNumber"

        )
        .sort({

            createdAt:-1

        });






        res.json({

            success:true,

            service,

            attendanceSummary:
            service.attendanceSummary,


            attendanceCount:
            attendance.length,


            attendance


        });



    }
    catch(error){


        console.log(error);


        res.status(500).json({

            success:false,

            message:error.message

        });


    }

};





module.exports = {


createService,

getActiveService,

endService,

getServices,

getServiceById


};