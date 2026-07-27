const Notification = require("../models/Notification");



// ==========================================
// Create Notification
// POST /api/notifications
// ==========================================

const createNotification = async(req,res)=>{

try{


const{

recipient,

title,

message,

type,

relatedId

}=req.body;



const notification =
await Notification.create({

recipient,

title,

message,

type,

relatedId

});



res.status(201).json({

success:true,

message:"Notification created successfully",

notification

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
// Get My Notifications
// GET /api/notifications
// ==========================================

const getNotifications = async(req,res)=>{


try{


const notifications =
await Notification.find({

recipient:req.user._id

})

.sort({

createdAt:-1

});



const unreadCount =
await Notification.countDocuments({

recipient:req.user._id,

isRead:false

});



res.json({

success:true,

count:notifications.length,

unreadCount,

notifications

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
// Get Unread Notifications
// GET /api/notifications/unread
// ==========================================

const getUnreadNotifications = async(req,res)=>{


try{


const notifications =
await Notification.find({

recipient:req.user._id,

isRead:false

})

.sort({

createdAt:-1

});



res.json({

success:true,

count:notifications.length,

notifications

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
// Mark Notification As Read
// PATCH /api/notifications/:id/read
// ==========================================

const markAsRead = async(req,res)=>{


try{


const notification =
await Notification.findById(
req.params.id
);



if(!notification){

return res.status(404).json({

success:false,

message:"Notification not found"

});

}




if(
notification.recipient.toString() !==
req.user._id.toString()
){

return res.status(403).json({

success:false,

message:"Not authorized"

});

}




notification.isRead=true;

notification.readAt=new Date();

await notification.save();




res.json({

success:true,

message:"Notification marked as read",

notification

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
// Mark All Notifications As Read
// PATCH /api/notifications/read-all
// ==========================================

const markAllAsRead = async(req,res)=>{


try{


await Notification.updateMany(

{

recipient:req.user._id,

isRead:false

},

{

isRead:true,

readAt:new Date()

}

);




res.json({

success:true,

message:"All notifications marked as read"

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
// Delete Notification
// DELETE /api/notifications/:id
// ==========================================

const deleteNotification = async(req,res)=>{


try{


const notification =
await Notification.findById(
req.params.id
);



if(!notification){

return res.status(404).json({

success:false,

message:"Notification not found"

});

}




if(
notification.recipient.toString() !==
req.user._id.toString()
){

return res.status(403).json({

success:false,

message:"Not authorized"

});

}




await notification.deleteOne();




res.json({

success:true,

message:"Notification deleted successfully"

});


}
catch(error){


res.status(500).json({

success:false,

message:error.message

});


}


};







module.exports={

createNotification,

getNotifications,

getUnreadNotifications,

markAsRead,

markAllAsRead,

deleteNotification

};