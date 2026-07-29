const {
    hasPermission
} = require("../config/permissions");







const checkPermission = (permission)=>{


    return (req,res,next)=>{


        try{


            // ==========================================
            // Check Authentication
            // ==========================================

            if(!req.user){


                return res.status(401).json({

                    success:false,

                    message:
                    "Authentication required"

                });


            }








            // ==========================================
            // Check User Role
            // ==========================================


            const userRole =
            req.user.role;



            if(!userRole){


                return res.status(403).json({

                    success:false,

                    message:
                    "User role not assigned"

                });


            }









            // ==========================================
            // Permission Check
            // ==========================================


            const allowed =

            hasPermission(

                userRole,

                permission

            );









            if(!allowed){


                return res.status(403).json({

                    success:false,

                    message:

                    `Access denied. Missing permission: ${permission}`

                });


            }








            next();




        }

        catch(error){


            console.error(
                "Permission Middleware Error:",
                error
            );



            res.status(500).json({

                success:false,

                message:
                "Permission check failed"

            });


        }


    };


};








module.exports =
checkPermission;