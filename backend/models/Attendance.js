const mongoose = require("mongoose");


const attendanceSchema = new mongoose.Schema(
{
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },


    service:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Service",
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


    markedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        default:null
    }

},
{
    timestamps:true
});



// Prevent duplicate attendance

attendanceSchema.index(
{
    user:1,
    service:1
},
{
    unique:true
});


module.exports =
mongoose.model(
    "Attendance",
    attendanceSchema
);