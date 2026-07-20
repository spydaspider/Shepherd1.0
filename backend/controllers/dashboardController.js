const User = require("../models/User");
const Attendance = require("../models/Attendance");
const Service = require("../models/Service");


// ==========================================
// Church Dashboard Statistics
// GET /api/dashboard
// ==========================================

const getDashboardStats = async (req, res) => {

    try {


        // Total active members

        const totalMembers =
        await User.countDocuments({
            isActive:true
        });



        // Adults

        const totalAdults =
        await User.countDocuments({

            isChild:false,

            isActive:true

        });



        // Children

        const totalChildren =
        await User.countDocuments({

            isChild:true,

            isActive:true

        });



        // Gender statistics

        const totalMale =
        await User.countDocuments({

            gender:"Male",

            isActive:true

        });



        const totalFemale =
        await User.countDocuments({

            gender:"Female",

            isActive:true

        });



        // Find today's service

        const today = new Date();

        today.setHours(
            0,
            0,
            0,
            0
        );


        const service =
        await Service.findOne({

            serviceDate:{
                $gte:today
            },

            active:true

        });



        let presentToday = 0;


        if(service){

            presentToday =
            await Attendance.countDocuments({

                service:service._id,

                status:"Present"

            });

        }



        const absentToday =
        totalMembers - presentToday;



        res.json({

            success:true,

            statistics:{

                totalMembers,

                totalAdults,

                totalChildren,

                totalMale,

                totalFemale,

                presentToday,

                absentToday

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

    getDashboardStats

};