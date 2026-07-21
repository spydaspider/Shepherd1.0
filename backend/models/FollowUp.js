const mongoose = require("mongoose");


const followUpSchema = new mongoose.Schema(

{

    // Member being followed up

    member:{

        type:mongoose.Schema.Types.ObjectId,

        ref:"User",

        required:true

    },


    // Service they missed

    service:{

        type:mongoose.Schema.Types.ObjectId,

        ref:"Service",

        required:true

    },



    // Person assigned to follow up

    assignedTo:{

        type:mongoose.Schema.Types.ObjectId,

        ref:"User",

        required:true

    },



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



    notes:{

        type:String,

        default:""

    },



    contactedDate:{

        type:Date,

        default:null

    },


    createdBy:{

        type:mongoose.Schema.Types.ObjectId,

        ref:"User",

        required:true

    }


},

{

    timestamps:true

}

);


module.exports =
mongoose.model(
"FollowUp",
followUpSchema
);