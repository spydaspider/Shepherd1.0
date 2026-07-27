const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
{
    recipient:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    title:{
        type:String,
        required:true,
        trim:true
    },

    message:{
        type:String,
        required:true,
        trim:true
    },

    type:{
        type:String,
        enum:[
            "FollowUp",
            "Service",
            "Attendance",
            "Announcement",
            "Reminder",
            "System"
        ],
        default:"System"
    },

    relatedId:{
        type:mongoose.Schema.Types.ObjectId,
        default:null
    },

    isRead:{
        type:Boolean,
        default:false
    },

    readAt:{
        type:Date,
        default:null
    }

},
{
    timestamps:true
});

module.exports =
mongoose.model(
    "Notification",
    notificationSchema
);