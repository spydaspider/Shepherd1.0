const User = require("../models/User");
const generateToken = require("../utils/generateToken");


// ===============================
// Register Adult Member
// ===============================

const registerUser = async (req, res) => {

  try {

    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      gender,
      dateOfBirth,
      maritalStatus,
      occupation,
      address,
      emergencyContact,
      emergencyPhone
    } = req.body;



    // Check existing email

    const emailExists = await User.findOne({
      email
    });


    if(emailExists){

      return res.status(400).json({

        success:false,

        message:"Email already exists"

      });

    }




    // Check existing phone

    const phoneExists = await User.findOne({
      phone
    });


    if(phoneExists){

      return res.status(400).json({

        success:false,

        message:"Phone number already exists"

      });

    }




    // Create user

    const user = await User.create({

      firstName,

      lastName,

      email,

      phone,

      password,

      gender,

      dateOfBirth,

      maritalStatus,

      occupation,

      address,

      emergencyContact,

      emergencyPhone,


      // Controlled fields

      isChild:false,

      role:"Member",

      membershipType:"Member",

      status:"Active"

    });





    res.status(201).json({

      success:true,

      message:"Registration successful",


      token:generateToken(user),


      user:{

        id:user._id,

        firstName:user.firstName,

        lastName:user.lastName,

        email:user.email,

        role:user.role

      }


    });



  }
  catch(error){


    console.log(error);


    res.status(500).json({

      success:false,

      message:error.message

    });


  }


};








// ===============================
// Login User
// ===============================

const loginUser = async(req,res)=>{


try{


const {

email,

password

}=req.body;





const user = await User
.findOne({
  email
})
.select("+password");





if(!user){

return res.status(401).json({

success:false,

message:"Invalid email or password"

});

}






const isMatch =
await user.matchPassword(password);





if(!isMatch){

return res.status(401).json({

success:false,

message:"Invalid email or password"

});

}






// Update login time

user.lastLogin = new Date();

await user.save();






res.status(200).json({

success:true,

message:"Login successful",



token:generateToken(user),



user:{


id:user._id,


firstName:user.firstName,


lastName:user.lastName,


email:user.email,


role:user.role


}



});




}
catch(error){


console.log(error);



res.status(500).json({

success:false,

message:error.message

});


}


};





module.exports = {

registerUser,

loginUser

};