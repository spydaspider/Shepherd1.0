const mongoose = require("mongoose");


const followUpSchema = new mongoose.Schema(

{

    // ==========================================
    // Member Being Followed Up
    // ==========================================

    member:{

        type:mongoose.Schema.Types.ObjectId,

        ref:"User",

        required:true

    },






    // ==========================================
    // Service Missed
    // ==========================================

    service:{

        type:mongoose.Schema.Types.ObjectId,

        ref:"Service",

        required:true

    },







    // ==========================================
    // Assigned Leader
    // ==========================================

    assignedTo:{

        type:mongoose.Schema.Types.ObjectId,

        ref:"User",

        required:true

    },







    // ==========================================
    // Follow Up Method
    // ==========================================

    type:{

        type:String,

        enum:[

            "Phone Call",

            "Home Visit",

            "Message",

            "General Check"

        ],

        default:"Phone Call"

    },








    // ==========================================
    // Follow Up Status
    // ==========================================

    status:{

        type:String,

        enum:[

            "Pending",

            "Contacted",

            "Completed",

            "Unable To Reach"

        ],

        default:"Pending"

    },








    // ==========================================
    // Priority
    // ==========================================

    priority:{

        type:String,

        enum:[

            "Low",

            "Medium",

            "High"

        ],

        default:"Medium"

    },








    // ==========================================
    // Scheduled Date
    // ==========================================

    followUpDate:{

        type:Date,

        default:Date.now

    },








    // ==========================================
    // Follow Up Result
    // ==========================================

    outcome:{

        type:String,

        enum:[

            "No Response",

            "Will Return",

            "Moved Away",

            "Sick",

            "Busy",

            "Transferred",

            "Other"

        ],

        default:"Other"

    },








    // ==========================================
    // Notes
    // ==========================================

    notes:{

        type:String,

        default:""

    },








    // ==========================================
    // Contact Tracking
    // ==========================================

    contactedDate:{

        type:Date,

        default:null

    },





    completedDate:{

        type:Date,

        default:null

    },








    // ==========================================
    // Audit
    // ==========================================

    createdBy:{

        type:mongoose.Schema.Types.ObjectId,

        ref:"User",

        required:true

    },




    updatedBy:{

        type:mongoose.Schema.Types.ObjectId,

        ref:"User",

        default:null

    }



},


{

    timestamps:true

}

);









// ==========================================
// Indexes
// ==========================================


// Prevent duplicate follow-up generation

followUpSchema.index(

{

member:1,

service:1

},

{

unique:true

}

);





// Pending tasks lookup

followUpSchema.index({

status:1,

followUpDate:1

});





// Leader dashboard lookup

followUpSchema.index({

assignedTo:1,

status:1

});





// Member history

followUpSchema.index({

member:1

});







module.exports =
mongoose.model(
"FollowUp",
followUpSchema
);