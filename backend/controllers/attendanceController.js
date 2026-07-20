/* const AttendanceCode = require("../models/AttendanceCode");
 */const Attendance = require("../models/Attendance");
 const Service = require("../models/Service");
const User = require("../models/User");


// =======================================
// Generate Attendance Code
// POST /api/attendance/generate
// =======================================

const generateAttendanceCode = async (req, res) => {

    try {

        // Generate random 2 digit code
        const code = Math.floor(
            10 + Math.random() * 90
        ).toString();


        // Today's service date

        const serviceDate = new Date();


        // Expire at midnight

        const expiresAt = new Date();

        expiresAt.setHours(
            23,
            59,
            59,
            999
        );


        // Disable previous codes

        await AttendanceCode.updateMany(
            {
                active:true
            },
            {
                active:false
            }
        );


        // Create new code

        const attendanceCode =
        await AttendanceCode.create({

            code,

            generatedBy:req.user._id,

            serviceDate,

            expiresAt

        });



        res.status(201).json({

            success:true,

            message:"Attendance code generated successfully",

            attendanceCode

        });



    } catch(error){

        res.status(500).json({

            success:false,

            message:error.message

        });

    }

};




// =======================================
// Mark Attendance
// POST /api/attendance/mark
// =======================================

const markAttendance = async(req,res)=>{

try{


let {
    code,
    members=[]
}=req.body;



// Automatically include logged in user

if(!members.includes(req.user._id.toString())){

    members.push(
        req.user._id.toString()
    );

}



// Find active service

const service =
await Service.findOne({

    attendanceCode:code,

    active:true

});



if(!service){

    return res.status(400).json({

        success:false,

        message:"Invalid or expired attendance code"

    });

}



// Check family members

const familyMembers =
await User.find({

    _id:{
        $in:members
    },

    $or:[

        {
            _id:req.user._id
        },

        {
            parent:req.user._id
        }

    ]

});



if(
familyMembers.length !== members.length
){

return res.status(403).json({

    success:false,

    message:"You can only mark attendance for your family"

});

}



let attendanceCreated=[];

let alreadyMarked=[];



for(const member of familyMembers){


const exists =
await Attendance.findOne({

    user:member._id,

    service:service._id

});



if(exists){

    alreadyMarked.push(member);

}

else{


const attendance =
await Attendance.create({

    user:member._id,

    service:service._id,

    attendanceMethod:
    member._id.toString() === req.user._id.toString()
    ?
    "Self"
    :
    "Parent",


    markedBy:req.user._id

});


attendanceCreated.push(attendance);


}



}



res.status(201).json({

success:true,

message:"Attendance processed",

service:service.name,

newAttendance:attendanceCreated.length,

alreadyMarked:alreadyMarked.length,

attendance:attendanceCreated

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

    generateAttendanceCode,

    markAttendance

};