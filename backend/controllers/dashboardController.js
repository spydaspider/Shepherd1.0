const User = require("../models/User");
const Service = require("../models/Service");


// ==========================================
// Church Overview
// GET /api/dashboard/overview
// ==========================================

const getOverview = async (req,res)=>{

try{


const totalMembers =
await User.countDocuments({
    isActive:true
});


const adults =
await User.countDocuments({

    isActive:true,

    isChild:false

});


const children =
await User.countDocuments({

    isActive:true,

    isChild:true

});


const male =
await User.countDocuments({

    gender:"Male",

    isActive:true

});


const female =
await User.countDocuments({

    gender:"Female",

    isActive:true

});



res.json({

    success:true,

    overview:{

        totalMembers,

        adults,

        children,

        male,

        female

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




// ==========================================
// Service Dashboard
// GET /api/dashboard/service/:serviceId
// ==========================================

const getServiceDashboard = async(req,res)=>{

try{


const service =
await Service.findById(
    req.params.serviceId
);



if(!service){

return res.status(404).json({

    success:false,

    message:"Service not found"

});

}



res.json({

    success:true,


    service:{


        id:service._id,

        name:service.name,

        serviceType:service.serviceType,

        serviceDate:service.serviceDate,

        attendanceCode:service.attendanceCode


    },


    attendanceSummary:
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



module.exports = {

    getOverview,

    getServiceDashboard

};