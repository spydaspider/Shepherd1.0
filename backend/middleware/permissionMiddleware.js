const permissions =
require("../config/permissions");


const checkPermission = (permission)=>{


return (req,res,next)=>{


console.log("========================");
console.log("USER FROM REQUEST:");
console.log(req.user);

console.log("USER ROLE:");
console.log(req.user?.role);

console.log("REQUIRED PERMISSION:");
console.log(permission);

console.log("AVAILABLE PERMISSIONS:");
console.log(
    permissions[req.user?.role]
);

console.log("========================");



const userRole = req.user.role;


const allowedPermissions =
permissions[userRole];



if(!allowedPermissions){

return res.status(403).json({

success:false,

message:"Role has no permissions"

});

}



if(!allowedPermissions.includes(permission)){


return res.status(403).json({

success:false,

message:"You do not have permission to perform this action"

});


}



next();


};


};


module.exports = checkPermission;