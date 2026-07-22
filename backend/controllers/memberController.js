const User = require("../models/User");
const Attendance = require("../models/Attendance");



// ==========================================
// Get All Members
// GET /api/members
// ==========================================

const getMembers = async (req, res) => {

    try {


        const {
            search,
            gender,
            membershipType,
            status,
            isChild
        } = req.query;



        let filter = {
            isActive:true
        };



        // Search by name/email/phone

        if(search){

            filter.$or = [

                {
                    firstName:{
                        $regex:search,
                        $options:"i"
                    }
                },

                {
                    lastName:{
                        $regex:search,
                        $options:"i"
                    }
                },

                {
                    email:{
                        $regex:search,
                        $options:"i"
                    }
                },

                {
                    phone:{
                        $regex:search,
                        $options:"i"
                    }
                }

            ];

        }



        if(gender){

            filter.gender = gender;

        }



        if(membershipType){

            filter.membershipType =
            membershipType;

        }



        if(status){

            filter.status =
            status;

        }



        if(isChild !== undefined){

            filter.isChild =
            isChild === "true";

        }



        const members =
        await User.find(filter)
        .sort({
            createdAt:-1
        });



        res.json({

            success:true,

            count:members.length,

            members

        });



    }
    catch(error){


        res.status(500).json({

            success:false,

            message:error.message

        });


    }

};





// ==========================================
// Get Single Member Profile
// GET /api/members/:id
// ==========================================

const getMemberById = async(req,res)=>{


try{


const member =
await User.findById(
    req.params.id
)
.populate(
    "children",
    "firstName lastName gender dateOfBirth"
)
.populate(
    "parent",
    "firstName lastName phone"
);



if(!member){

return res.status(404).json({

    success:false,

    message:"Member not found"

});

}




// Attendance history

const attendance =
await Attendance.find({

    user:member._id

})
.populate(
    "service",
    "name serviceDate"
)
.sort({
    createdAt:-1
});




res.json({

success:true,

member,

attendance


});



}
catch(error){


res.status(500).json({

success:false,

message:error.message

});


}



};







// ==========================================
// Update Member
// PATCH /api/members/:id
// ==========================================

const updateMember = async(req,res)=>{


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




const allowedFields = [

    "firstName",
    "lastName",
    "phone",
    "email",
    "gender",
    "dateOfBirth",
    "address",
    "occupation",
    "department",
    "cellGroup",
    "area",
    "membershipType"

];



allowedFields.forEach(field=>{


    if(req.body[field] !== undefined){

        member[field] =
        req.body[field];

    }


});



await member.save();



res.json({

success:true,

message:"Member updated successfully",

member


});



}
catch(error){


res.status(500).json({

success:false,

message:error.message

});


}


};






// ==========================================
// Change Member Status
// PATCH /api/members/:id/status
// ==========================================

const changeMemberStatus = async(req,res)=>{


try{


const {
    status
}=req.body;



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



member.status = status;



if(status === "Inactive"){

    member.isActive = false;

}
else{

    member.isActive = true;

}



await member.save();



res.json({

success:true,

message:"Member status updated",

member


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


getMembers,

getMemberById,

updateMember,

changeMemberStatus


};