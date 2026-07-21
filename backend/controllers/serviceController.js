const Service = require("../models/Service");
const User = require("../models/User");
const Attendance = require("../models/Attendance");
const FollowUp = require("../models/FollowUp");


// ==========================================
// Generate Random Attendance Code
// ==========================================

const generateAttendanceCode = () => {

    return Math.floor(
        1000 + Math.random() * 9000
    ).toString();

};



// ==========================================
// Create Service
// POST /api/services
// ==========================================

const createService = async (req, res) => {

    try {

        const {
            name,
            serviceType,
            serviceDate,
            startTime,
            endTime,
            description,
        } = req.body;



        // Deactivate previous service

        await Service.updateMany(
            { active:true },
            {
                active:false
            }
        );



        const attendanceCode =
        generateAttendanceCode();



        const service =
        await Service.create({

            name,

            serviceType,

            serviceDate,

            startTime,

            endTime,

            description,

            attendanceCode,

            generatedBy:req.user._id,

            active:true

        });



        res.status(201).json({

            success:true,

            message:"Service created successfully",

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

    active:true

});



if(!service){

return res.status(404).json({

    success:false,

    message:"No active service found"

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
// Close Service + Generate Follow Ups
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

    message:"Service not found"

});

}



if(!service.active){

return res.status(400).json({

    success:false,

    message:"Service already closed"

});

}




// Get all active members

const members =
await User.find({

    isActive:true

});




// Get attendance records

const attendance =
await Attendance.find({

    service:service._id

});




// Extract present users

const presentIds =
attendance.map(
    item => item.user.toString()
);




// Find absentees

const absentees =
members.filter(

member =>

!presentIds.includes(
    member._id.toString()
)

);




// Create follow-up tasks

const followUps =
absentees.map(member=>({


    member:member._id,


    service:service._id,


    assignedTo:req.user._id,


    type:"Phone Call",


    status:"Pending",


    createdBy:req.user._id


}));





if(followUps.length > 0){

    await FollowUp.insertMany(
        followUps
    );

}




// Close service

service.active=false;

service.closed=true;

service.closedAt=new Date();




await service.save();




res.json({

success:true,

message:"Service closed successfully",

absentMembers:
absentees.length,

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




module.exports = {

    createService,

    getActiveService,

    endService,

    getServices

};