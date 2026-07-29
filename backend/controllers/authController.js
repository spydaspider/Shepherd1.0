const User = require("../models/User");

const generateToken = require("../utils/generateToken");





// =====================================================
// Register New User Account
// POST /api/auth/register
// =====================================================


const registerUser = async(req,res)=>{


try{


const {

firstName,

lastName,

email,

phone,

password,

gender,

dateOfBirth


}=req.body;






// Check email


const emailExists =
await User.findOne({
email
});



if(emailExists){

return res.status(400).json({

success:false,

message:"Email already exists"

});

}





// Check phone


const phoneExists =
await User.findOne({
phone
});



if(phoneExists){

return res.status(400).json({

success:false,

message:"Phone already exists"

});

}







const user =
await User.create({


firstName,

lastName,

email,

phone,

password,

gender,

dateOfBirth,




// Account

hasAccount:true,

loginEnabled:true,

mustChangePassword:false,

accountCreatedAt:new Date(),





// Church defaults

role:"Member",

membershipType:"Member",

status:"Active",

isActive:true,


registrationSource:"Online"



});







res.status(201).json({


success:true,


message:
"Account created successfully",



token:
generateToken(user),




user:{


id:user._id,

firstName:user.firstName,

lastName:user.lastName,

email:user.email,

role:user.role,


mustChangePassword:
user.mustChangePassword


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









// =====================================================
// Create Login Account For Existing Member
// Admin Only
// POST /api/auth/create-account/:id
// =====================================================


const createMemberAccount =
async(req,res)=>{


try{


const member =
await User.findById(
req.params.id
);




if(!member){


return res.status(404).json({

success:false,

message:"Member not found"

});


}







if(member.hasAccount){


return res.status(400).json({

success:false,

message:"Member already has an account"

});


}







let generatedPassword =
req.body.password;






// Generate password

if(!generatedPassword){


generatedPassword =

Math.random()
.toString(36)
.slice(2,8)

+

Math.floor(
Math.random()*100
);


}








member.password =
generatedPassword;



member.hasAccount =
true;



member.loginEnabled =
true;



member.mustChangePassword =
true;



member.accountCreatedAt =
new Date();



member.accountCreatedBy =
req.user._id;



member.registrationSource =
"Admin";



member.isVerified =
false;



member.phoneVerified =
false;



await member.save();







res.status(200).json({


success:true,


message:
"Login account created successfully",




temporaryPassword:
generatedPassword,




member:{


id:member._id,


name:
`${member.firstName} ${member.lastName}`,


email:member.email,


loginEnabled:
member.loginEnabled


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









// =====================================================
// Login
// POST /api/auth/login
// =====================================================


const loginUser =
async(req,res)=>{


try{


const {

email,

password


}=req.body;







const user =
await User.findOne({

email,

hasAccount:true,

loginEnabled:true


})
.select("+password");








if(!user){


return res.status(401).json({

success:false,

message:
"Invalid email or password"

});


}








const match =
await user.matchPassword(
password
);







if(!match){


return res.status(401).json({

success:false,

message:
"Invalid email or password"

});


}







user.lastLogin =
new Date();



await user.save();








res.json({


success:true,



message:
"Login successful",



token:
generateToken(user),




user:{



id:user._id,


firstName:user.firstName,


lastName:user.lastName,


email:user.email,


role:user.role,



mustChangePassword:
user.mustChangePassword



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


registerUser,


loginUser,


createMemberAccount


};