const Attendance = require("../models/Attendance");
const Service = require("../models/Service");
const User = require("../models/User");


// =======================================
// Mark Attendance
// POST /api/attendance/mark
// =======================================

const markAttendance = async (req, res) => {

    try {


        let {
            code,
            members = []
        } = req.body;



        // The person entering the code is always present

        if (!members.includes(req.user._id.toString())) {

            members.push(
                req.user._id.toString()
            );

        }



        // Find active service using attendance code

        const service =
        await Service.findOne({

            attendanceCode: code,

            active: true

        });



        if (!service) {

            return res.status(400).json({

                success:false,

                message:"Invalid or expired attendance code"

            });

        }




        // Check that members belong to this user

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




        let attendanceCreated = [];

        let alreadyMarked = [];




        for(const member of familyMembers){



            // Prevent duplicate attendance

            const exists =
            await Attendance.findOne({

                user:member._id,

                service:service._id

            });




            if(exists){

                alreadyMarked.push(member);

                continue;

            }




            // Create attendance record

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




            // ==========================
            // Update Service Summary
            // ==========================


            service.attendanceSummary.totalPresent += 1;



            if(member.isChild){

                service.attendanceSummary.childrenPresent += 1;

            }
            else{

                service.attendanceSummary.adultsPresent += 1;

            }




            if(member.gender === "Male"){

                service.attendanceSummary.malePresent += 1;

            }
            else if(member.gender === "Female"){

                service.attendanceSummary.femalePresent += 1;

            }




            attendanceCreated.push(attendance);


        }




        // ==========================
        // Calculate Absentees
        // ==========================


        const totalMembers =
        await User.countDocuments({

            isActive:true

        });



        service.attendanceSummary.totalAbsent =

        totalMembers -

        service.attendanceSummary.totalPresent;




        // Attendance percentage


        if(totalMembers > 0){

            service.attendanceSummary.attendanceRate =

            Number(

                (

                service.attendanceSummary.totalPresent /

                totalMembers

                * 100

                ).toFixed(2)

            );

        }




        await service.save();





        res.status(201).json({

            success:true,

            message:"Attendance processed successfully",


            service:{

                id:service._id,

                name:service.name

            },


            newAttendance:
            attendanceCreated.length,


            alreadyMarked:
            alreadyMarked.length,


            attendanceSummary:
            service.attendanceSummary,


            attendance:
            attendanceCreated


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

    markAttendance

};