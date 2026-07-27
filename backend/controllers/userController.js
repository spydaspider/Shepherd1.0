const User = require("../models/User");


// =====================================
// Get All Members
// GET /api/users
// =====================================

const getUsers = async (req, res) => {

    try {


        const users = await User.find()

            .select("-password")

            .sort({
                createdAt:-1
            });



        res.status(200).json({

            success:true,

            count:users.length,

            users

        });



    } catch(error){


        res.status(500).json({

            success:false,

            message:error.message

        });


    }

};




// =====================================
// Get Family Members
// GET /api/users/family
// =====================================

const getFamily = async (req, res) => {

    try {


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

    getUsers,

    getFamily

};