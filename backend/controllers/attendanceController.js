const Attendance = require("../models/Attendance");
const Service = require("../models/Service");
const User = require("../models/User");




// =====================================================
// Update Attendance Summary
// =====================================================


const updateAttendanceSummary = async(serviceId)=>{


    const service =
    await Service.findById(serviceId);



    if(!service){

        return;

    }





    const totalMembers =

    await User.countDocuments({

        isActive:true,

        role:{
            $in:[
                "Member",
                "Child",
                "Leader",
                "Pastor"
            ]
        }

    });







    const presentRecords =

    await Attendance.find({

        service:serviceId,

        status:"Present"

    })
    .populate(
        "user"
    );








    const users =

    presentRecords

    .map(
        record=>record.user
    )

    .filter(Boolean);







    const totalPresent =
    users.length;





    const totalAbsent =

    totalMembers - totalPresent;








    service.attendanceSummary = {


        totalPresent,


        totalAbsent:

        totalAbsent > 0
        ?
        totalAbsent
        :
        0,



        adultsPresent:

        users.filter(
            user=>!user.isChild
        ).length,




        childrenPresent:

        users.filter(
            user=>user.isChild
        ).length,




        malePresent:

        users.filter(
            user=>user.gender==="Male"
        ).length,




        femalePresent:

        users.filter(
            user=>user.gender==="Female"
        ).length,




        attendanceRate:


        totalMembers > 0

        ?

        Number(

            (
                totalPresent /
                totalMembers *
                100

            )
            .toFixed(2)

        )

        :

        0


    };





    await service.save();


};









// =====================================================
// Update User Attendance Statistics
// =====================================================


const updateUserAttendance = async(userId)=>{


    const user =

    await User.findById(userId);



    if(!user){

        return;

    }






    user.totalAttendance =

    await Attendance.countDocuments({

        user:userId,

        status:"Present"

    });







    user.lastAttendance =

    new Date();






    await user.save();


};











// =====================================================
// Member / Parent Mark Attendance
// POST /api/attendance/mark
// =====================================================


const markAttendance = async(req,res)=>{


try{


const {

    code,

    members=[]

}=req.body;







const service =

await Service.findOne({

    attendanceCode:code,

    status:"Active",

    attendanceOpen:true

});







if(!service){


return res.status(400).json({

success:false,

message:
"Invalid or expired attendance code"

});


}








let selectedMembers = [

    ...members

];







// Add logged in user automatically

if(

!selectedMembers.includes(

req.user._id.toString()

)

){


selectedMembers.push(

req.user._id.toString()

);


}









// Validate parent permissions


const allowedMembers =

await User.find({

_id:{

    $in:selectedMembers

},


$or:[

{

_id:req.user._id

},


{

parent:req.user._id

}

]


});









if(

allowedMembers.length !== selectedMembers.length

){


return res.status(403).json({

success:false,

message:
"You can only mark yourself and your children"

});


}








let created=[];

let alreadyPresent=[];







for(const member of allowedMembers){





const existing =

await Attendance.findOne({

user:member._id,

service:service._id

});








if(existing){


if(existing.status==="Present"){

alreadyPresent.push(member);

continue;

}


existing.status="Present";

existing.markedBy=req.user._id;

existing.attendanceDate=new Date();


await existing.save();


created.push(existing);


continue;


}









const attendance =

await Attendance.create({

user:member._id,

service:service._id,

status:"Present",


attendanceMethod:

member._id.toString()
===
req.user._id.toString()

?

"Self"

:

"Parent",



markedBy:req.user._id,


attendanceDate:new Date()


});







created.push(attendance);







await updateUserAttendance(
member._id
);



}









await updateAttendanceSummary(

service._id

);










const updatedService =

await Service.findById(

service._id

);







const populatedAttendance =

await Attendance.find({

_id:{

$in:

created.map(
item=>item._id
)

}

})

.populate(

"user",

"firstName lastName gender isChild"

);









res.status(201).json({

success:true,


message:
"Attendance marked successfully",



newAttendance:
created.length,



alreadyPresent:
alreadyPresent.length,



attendance:
populatedAttendance,



summary:
updatedService.attendanceSummary


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
// Admin Mark Attendance
// POST /api/attendance/admin-mark
// =====================================================


const adminMarkAttendance = async(req,res)=>{


try{


const {

serviceId,

members=[]

}=req.body;







const service =

await Service.findOne({

_id:serviceId,

status:"Active",

attendanceOpen:true

});








if(!service){


return res.status(404).json({

success:false,

message:
"Active service not found"

});


}









let created=[];

let alreadyPresent=[];








for(const memberId of members){



const member =

await User.findById(memberId);





if(!member){

continue;

}








const existing =

await Attendance.findOne({

user:member._id,

service:service._id

});







if(existing){


alreadyPresent.push(member);


continue;


}








const attendance =

await Attendance.create({

user:member._id,

service:service._id,

status:"Present",

attendanceMethod:"Admin",

markedBy:req.user._id,

attendanceDate:new Date()


});








created.push(attendance);





await updateUserAttendance(

member._id

);



}








await updateAttendanceSummary(

service._id

);







res.status(201).json({

success:true,


message:
"Admin attendance recorded",



created:
created.length,



alreadyPresent:
alreadyPresent.length,


summary:
service.attendanceSummary


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
// Get Service Attendance
// GET /api/attendance/service/:serviceId
// =====================================================


const getServiceAttendance = async(req,res)=>{


try{


const attendance =

await Attendance.find({

service:req.params.serviceId

})


.populate(

"user",

"firstName lastName gender phone isChild"

)


.populate(

"markedBy",

"firstName lastName"

)


.sort({

createdAt:-1

});







res.json({

success:true,

count:attendance.length,

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











// =====================================================
// Update Attendance Status
// PATCH /api/attendance/:id
// =====================================================


const updateAttendanceStatus = async(req,res)=>{


try{


const attendance =

await Attendance.findById(

req.params.id

);







if(!attendance){


return res.status(404).json({

success:false,

message:
"Attendance record not found"

});


}







attendance.status =

req.body.status;



attendance.markedBy =

req.user._id;



await attendance.save();








await updateAttendanceSummary(

attendance.service

);








res.json({

success:true,

message:
"Attendance updated successfully",

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
const markAdminAttendance = async(req,res)=>{

try{

const {
serviceId,
userId
}=req.body;


const service =
await Service.findById(serviceId);


if(!service){

return res.status(404).json({

success:false,
message:"Service not found"

});

}



const existing =
await Attendance.findOne({

service:serviceId,

user:userId

});



if(existing){

return res.status(400).json({

success:false,
message:"Attendance already marked"

});

}




const attendance =
await Attendance.create({

service:serviceId,

user:userId,

status:"Present",

attendanceMethod:"Admin",

markedBy:req.user._id,

attendanceDate:new Date(),

checkedInAt:new Date()

});





await updateAttendanceSummary(serviceId);





res.json({

success:true,

message:"Attendance marked",

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









module.exports = {


markAttendance,

adminMarkAttendance,

getServiceAttendance,

updateAttendanceStatus


};