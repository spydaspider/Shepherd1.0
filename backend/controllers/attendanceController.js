const AttendanceCode = require("../models/AttendanceCode");
const Attendance = require("../models/Attendance");
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

    try {

        let {
    code,
    members
} = req.body;


// Make sure members is always an array

if(!Array.isArray(members)){

    members = [];

}


// Automatically include logged-in user

const userId = req.user._id.toString();


if(!members.includes(userId)){

    members.push(userId);

}

        // Validate members

        if(!members || members.length === 0){

            return res.status(400).json({

                success:false,
                message:"Please select members attending"

            });

        }



        // Check attendance code

        const attendanceCode =
        await AttendanceCode.findOne({

            code,

            active:true

        });



        if(!attendanceCode){

            return res.status(400).json({

                success:false,
                message:"Invalid attendance code"

            });

        }



        // Check expiry

        if(
            new Date() >
            attendanceCode.expiresAt
        ){

            return res.status(400).json({

                success:false,
                message:"Attendance code expired"

            });

        }



        // Verify selected members belong to parent

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



        let attendanceRecords=[];
        let alreadyMarked=[];



        for(const member of familyMembers){


            // Prevent duplicate attendance

            const exists =
            await Attendance.findOne({

                user:member._id,

                serviceDate:
                attendanceCode.serviceDate

            });


if(exists){

    alreadyMarked.push(member._id);

}
else{


   const attendance =
await Attendance.create({

    user:member._id,

    code,

    serviceDate:
    attendanceCode.serviceDate,

    status:"Present",

    attendanceMethod:
    member._id.toString() === req.user._id.toString()
    ? "Self"
    : "Parent"

});


    attendanceRecords.push(attendance);


}
        }



       res.status(201).json({

    success:true,

    message:"Family attendance processed",

    newlyMarked:
    attendanceRecords.length,

    alreadyMarked:
    alreadyMarked.length,

    attendance:attendanceRecords

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