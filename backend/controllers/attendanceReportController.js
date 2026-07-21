const Attendance = require("../models/Attendance");
const Service = require("../models/Service");
const User = require("../models/User");


// =======================================
// Get Attendance Report For A Service
// GET /api/attendance/report/:serviceId
// =======================================

const getAttendanceReport = async (req, res) => {

    try {


        const { serviceId } = req.params;



        // Find service

        const service =
        await Service.findById(serviceId);



        if(!service){

            return res.status(404).json({

                success:false,

                message:"Service not found"

            });

        }



        // Get attendance records

        const attendance =
        await Attendance.find({

            service:serviceId

        })
        .populate(
            "user",
            "firstName lastName gender dateOfBirth isChild"
        )
        .populate(
            "markedBy",
            "firstName lastName"
        );




        // Get all active members

        const members =
        await User.find({

            isActive:true

        })
        .select(
            "firstName lastName gender isChild"
        );




        // Extract present user IDs

        const presentIds =
        attendance.map(
            item => item.user._id.toString()
        );




        // Find absentees

        const absentees =
        members.filter(
            member =>
            !presentIds.includes(
                member._id.toString()
            )
        );




        // Statistics

        const adultsPresent =
        attendance.filter(
            item => !item.user.isChild
        ).length;



        const childrenPresent =
        attendance.filter(
            item => item.user.isChild
        ).length;



        const malePresent =
        attendance.filter(
            item => item.user.gender === "Male"
        ).length;



        const femalePresent =
        attendance.filter(
            item => item.user.gender === "Female"
        ).length;




        res.json({

            success:true,


            service:{
                id:service._id,
                name:service.name,
                date:service.serviceDate
            },


            statistics:{

                totalMembers:members.length,

                totalPresent:
                attendance.length,

                totalAbsent:
                absentees.length,

                adultsPresent,

                childrenPresent,

                malePresent,

                femalePresent

            },


            presentMembers:
            attendance,


            absentees

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

    getAttendanceReport

};