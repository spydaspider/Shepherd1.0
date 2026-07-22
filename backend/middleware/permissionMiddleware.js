const permissions =
require("../config/permissions");



const checkPermission = (permission)=>{


return (req,res,next)=>{


const userRole =
req.user.role;



const allowedPermissions =
permissions[userRole];



if(!allowedPermissions){

return res.status(403).json({

success:false,

message:"Role has no permissions"

});

}



if(
!allowedPermissions.includes(permission)
){

return res.status(403).json({

success:false,

message:
"You do not have permission to perform this action"

});

}



next();


};


};



module.exports =
checkPermission;