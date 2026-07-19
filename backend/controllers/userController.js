const User = require("../models/User");


// =====================================
// Get Family Members
// GET /api/users/family
// =====================================

const getFamily = async (req, res) => {

    try {

        // Get logged-in parent
        const parent = await User.findById(req.user._id)
            .select("-password")
            .populate("children");


        if(!parent){

            return res.status(404).json({

                success:false,
                message:"User not found"

            });

        }


        res.status(200).json({

            success:true,

            family:{

                parent:{

                    _id:parent._id,

                    firstName:parent.firstName,

                    lastName:parent.lastName,

                    gender:parent.gender,

                    role:parent.role

                },


                children:parent.children

            }

        });



    } catch(error){

        res.status(500).json({

            success:false,

            message:error.message

        });

    }

};



module.exports = {

    getFamily

};