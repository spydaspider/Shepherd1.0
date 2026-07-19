const mongoose = require("mongoose");


const attendanceSchema = new mongoose.Schema(
{
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    code:{
        type:String,
        required:true
    },

    serviceDate:{
        type:Date,
        required:true
    },

    status:{
        type:String,
        enum:[
            "Present",
            "Absent"
        ],
        default:"Present"
    },
    attendanceMethod:{
    type:String,
    enum:[
        "Self",
        "Parent",
        "Admin"
    ],
    default:"Self"
},

    markedAt:{
        type:Date,
        default:Date.now
    }

},
{
    timestamps:true
});
attendanceSchema.index(
    {
        user:1,
        serviceDate:1
    },
    {
        unique:true
    }
);

module.exports =
mongoose.model(
    "Attendance",
    attendanceSchema
);